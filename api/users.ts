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

async function ensureSchema(sql: ReturnType<typeof neon>) {
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
    // Ignore schema errors — table may already exist
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();

    // ── GET ──────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const isPublic = req.query.public === 'true';

      if (!sql) {
        if (isPublic) return res.status(200).json({ agents: [], isLiveDb: false });
        return res.status(200).json({ users: [], isLiveDb: false });
      }

      try {
        await ensureSchema(sql);
        const rows = await sql`
          SELECT id, name, email, phone, avatar, role,
                 is_agent AS "isAgent", languages
          FROM users ORDER BY created_at DESC;
        `;

        const users = rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone || '',
          avatar: r.avatar || '',
          role: r.role,
          isAgent: Boolean(r.isAgent) || r.email === SUPER_ADMIN_EMAIL,
          languages: Array.isArray(r.languages) && r.languages.length > 0
            ? r.languages
            : (r.email === SUPER_ADMIN_EMAIL ? ['FR', 'EN', 'AR'] : [])
        }));

        if (isPublic) {
          const agents = users.filter((u: any) => u.isAgent || u.role === 'superadmin');
          return res.status(200).json({ agents, isLiveDb: true });
        }

        const requestorEmail = req.headers['x-user-email'] as string;
        if (!requestorEmail) {
          return res.status(200).json({ users: [], isLiveDb: false, error: 'Unauthorized' });
        }

        const requestor = users.find((u: any) => u.email.toLowerCase() === requestorEmail.toLowerCase());
        if (!requestor || (requestor.role !== 'admin' && requestor.role !== 'superadmin')) {
          return res.status(200).json({ users: [], isLiveDb: false, error: 'Forbidden' });
        }

        return res.status(200).json({ users, isLiveDb: true });
      } catch (err: any) {
        console.error('GET /api/users error:', err);
        if (isPublic) return res.status(200).json({ agents: [], isLiveDb: false, error: err.message });
        return res.status(200).json({ users: [], isLiveDb: false, error: err.message });
      }
    }

    // ── PATCH ─────────────────────────────────────────────────────────────────
    if (req.method === 'PATCH') {
      const requestorEmail = req.headers['x-user-email'] as string;

      if (!requestorEmail || requestorEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
        return res.status(200).json({ success: false, isLiveDb: false, message: 'Forbidden: only super admin can update users' });
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      // Accept both userId and userEmail — email is the reliable key
      const { userId, userEmail, newRole, isAgent, languages } = body;
      const targetId = userId || userEmail;

      if (!targetId) {
        return res.status(200).json({ success: false, error: 'Missing userId or userEmail' });
      }

      if (!sql) {
        return res.status(200).json({ success: false, isLiveDb: false, message: 'Database not connected' });
      }

      try {
        await ensureSchema(sql);

        // First find the user — check by email first, then by id
        const found = await sql`
          SELECT id, email, role FROM users
          WHERE email = ${userEmail || targetId} OR id = ${userId || targetId}
          LIMIT 1;
        `;

        let targetEmail = found.length > 0 ? found[0].email : (userEmail || (targetId.includes('@') ? targetId : null));
        const effectiveRole = newRole && ['owner', 'admin'].includes(newRole) ? newRole : (found.length > 0 ? found[0].role : 'admin');
        const agentVal = typeof isAgent === 'boolean' ? isAgent : false;
        const langsVal = Array.isArray(languages) ? languages : ['FR', 'EN'];
        const displayName = body.userName || body.name || (targetEmail ? targetEmail.split('@')[0] : 'User');

        if (found.length === 0) {
          // User was not in Postgres DB yet (e.g. logged in previously before sync was working). Auto-create them now!
          if (!targetEmail) {
            return res.status(200).json({ success: false, message: `Cannot auto-create user without email for id: ${targetId}` });
          }
          await sql`
            INSERT INTO users (id, name, email, role, is_agent, languages)
            VALUES (${userId || targetId}, ${displayName}, ${targetEmail}, ${effectiveRole}, ${agentVal}, ${langsVal})
            ON CONFLICT (email) DO UPDATE SET
              role = EXCLUDED.role,
              is_agent = EXCLUDED.is_agent,
              languages = EXCLUDED.languages;
          `;
          return res.status(200).json({ success: true, message: `User ${targetEmail} created in DB and promoted to ${effectiveRole}`, isLiveDb: true });
        }

        // User exists — update role and agent status
        if (newRole && ['owner', 'admin'].includes(newRole)) {
          await sql`
            UPDATE users SET role = ${newRole}
            WHERE email = ${targetEmail} AND email != ${SUPER_ADMIN_EMAIL};
          `;
        }

        if (typeof isAgent === 'boolean' || Array.isArray(languages)) {
          await sql`
            UPDATE users SET is_agent = ${agentVal}, languages = ${langsVal}
            WHERE email = ${targetEmail};
          `;
        }

        return res.status(200).json({ success: true, message: `User ${targetEmail} updated successfully`, isLiveDb: true });
      } catch (err: any) {
        console.error('PATCH /api/users error:', err);
        return res.status(200).json({ success: false, message: err.message || 'Database update failed', isLiveDb: false });
      }
    }

    return res.status(200).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Users handler crash:', err);
    return res.status(200).json({ agents: [], users: [], isLiveDb: false, error: err?.message || 'Internal error' });
  }
}
