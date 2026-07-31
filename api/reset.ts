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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    if (!sql) {
      return res.status(500).json({ success: false, error: 'Database connection string not configured.' });
    }

    // 1. Wipe all listings table
    try {
      await sql`TRUNCATE TABLE listings;`;
    } catch (e) {
      await sql`DELETE FROM listings;`;
    }

    // 2. Wipe all users table except Super Admin
    try {
      await sql`
        DELETE FROM users WHERE LOWER(email) != ${SUPER_ADMIN_EMAIL.toLowerCase()};
      `;
    } catch (e) {
      // Table might not exist yet
    }

    // 3. Re-seed Super Admin
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

    await sql`
      INSERT INTO users (id, name, email, phone, role, is_agent, languages)
      VALUES (
        'superadmin-yassine',
        'Yassine Sadik',
        ${SUPER_ADMIN_EMAIL},
        '+212 661-987654',
        'superadmin',
        true,
        ARRAY['FR', 'EN', 'AR']
      )
      ON CONFLICT (email) DO UPDATE SET
        role = 'superadmin',
        is_agent = true;
    `;

    return res.status(200).json({
      success: true,
      message: 'Database reset successfully! All listings and non-superadmin users have been removed.'
    });
  } catch (err: any) {
    console.error('Reset database error:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}
