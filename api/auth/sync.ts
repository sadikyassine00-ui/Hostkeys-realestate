import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const SUPER_ADMIN_EMAIL = 'yassinesadik0@gmail.com';

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === '') return null;
  const clean = url.trim().replace(/^["']|["']$/g, '');
  if (!clean.startsWith('postgres://') && !clean.startsWith('postgresql://')) return null;
  try { return neon(clean); } catch { return null; }
}

async function ensureUsersTable(sql: ReturnType<typeof neon>) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(100) DEFAULT '',
        avatar TEXT DEFAULT '',
        role VARCHAR(50) DEFAULT 'owner',
        is_agent BOOLEAN DEFAULT false,
        languages TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_agent BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';`;
  } catch (e) {
    // Ignore schema errors
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(200).json({ error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const user = body;

    const rawEmail = (user?.email || '').trim().toLowerCase();

    if (!user || (!user.id && !rawEmail)) {
      return res.status(200).json({ success: true, user: body || {}, isLiveDb: false });
    }

    const sql = getDb();
    if (!sql) {
      return res.status(200).json({ success: true, user, isLiveDb: false });
    }

    try {
      await ensureUsersTable(sql);

      const isSA = rawEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const finalRole = isSA ? 'superadmin' : (user.role || 'owner');

      // Check if user already exists by email — always preserve DB role
      const existing = await sql`
        SELECT id, role, is_agent AS "isAgent", languages
        FROM users WHERE LOWER(email) = ${rawEmail} LIMIT 1;
      `;

      if (existing.length > 0) {
        // User exists — update name/phone/avatar but NEVER overwrite role
        const dbRole = existing[0].role || finalRole;
        const dbIsAgent = Boolean(existing[0].isAgent) || isSA;
        const dbLangs = Array.isArray(existing[0].languages) && existing[0].languages.length > 0
          ? existing[0].languages
          : (isSA ? ['FR', 'EN', 'AR'] : []);

        await sql`
          UPDATE users
          SET name = ${user.name || ''}, phone = ${user.phone || ''}, avatar = ${user.avatar || ''}
          WHERE LOWER(email) = ${rawEmail};
        `;

        return res.status(200).json({
          success: true,
          isLiveDb: true,
          user: { ...user, email: rawEmail, role: dbRole, isAgent: dbIsAgent, languages: dbLangs }
        });
      } else {
        // New user — insert with default role (UPSERT on email conflict)
        const isAgent = isSA;
        const langs = isSA ? ['FR', 'EN', 'AR'] : [];

        await sql`
          INSERT INTO users (id, name, email, phone, avatar, role, is_agent, languages)
          VALUES (${user.id || rawEmail}, ${user.name || ''}, ${rawEmail},
                  ${user.phone || ''}, ${user.avatar || ''}, ${finalRole}, ${isAgent}, ${langs})
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            avatar = EXCLUDED.avatar;
        `;

        return res.status(200).json({
          success: true,
          isLiveDb: true,
          user: { ...user, email: rawEmail, role: finalRole, isAgent, languages: langs }
        });
      }
    } catch (dbErr: any) {
      console.error('DB error in auth/sync:', dbErr);
      return res.status(200).json({ success: true, user, isLiveDb: false, error: dbErr?.message });
    }
  } catch (err: any) {
    console.error('Auth sync handler crash:', err);
    return res.status(200).json({ success: true, user: req.body || {}, isLiveDb: false });
  }
}
