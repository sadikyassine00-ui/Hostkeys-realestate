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

    // 1. Drop existing tables to guarantee clean schema with all UNIQUE constraints
    try {
      await sql`DROP TABLE IF EXISTS listings CASCADE;`;
      await sql`DROP TABLE IF EXISTS users CASCADE;`;
    } catch (e) {}

    // 2. Re-create users table with proper UNIQUE constraint on email
    await sql`
      CREATE TABLE users (
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

    // 3. Re-create listings table
    await sql`
      CREATE TABLE listings (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        price NUMERIC NOT NULL,
        location VARCHAR(255) NOT NULL,
        address TEXT DEFAULT '',
        bedrooms INT NOT NULL,
        beds INT DEFAULT 0,
        bathrooms NUMERIC NOT NULL,
        square_meters INT NOT NULL,
        amenities TEXT[] DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'pending',
        owner_id VARCHAR(255) NOT NULL,
        approved_by_admin_id VARCHAR(255),
        image TEXT,
        images TEXT[] DEFAULT '{}',
        personal_owner_info JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Insert Super Admin
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
      );
    `;

    return res.status(200).json({
      success: true,
      message: 'DATABASE COMPLETELY WIPED AND RECREATED! Tables users & listings are clean. Only Super Admin remains.'
    });
  } catch (err: any) {
    console.error('Reset database error:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}
