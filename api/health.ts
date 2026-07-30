import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.DATABASE_URL;
    if (!url || url.trim() === '') {
      return res.status(200).json({
        status: "alive",
        dbConnected: false,
        message: "DATABASE_URL environment variable is not configured."
      });
    }

    const cleanUrl = url.trim().replace(/^["']|["']$/g, '');
    const sql = neon(cleanUrl);
    await sql`SELECT 1;`;

    return res.status(200).json({
      status: "alive",
      dbConnected: true,
      message: "Connected to Neon PostgreSQL Database."
    });
  } catch (err: any) {
    return res.status(200).json({
      status: "alive",
      dbConnected: false,
      message: `Database error: ${err?.message || String(err)}`
    });
  }
}
