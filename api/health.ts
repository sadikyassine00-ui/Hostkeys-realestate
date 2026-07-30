import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../src/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    const dbConnected = Boolean(sql);
    res.status(200).json({
      status: "alive",
      dbConnected,
      message: dbConnected 
        ? "Connected to Neon PostgreSQL Database." 
        : "DATABASE_URL is not set. Running with local fallback data."
    });
  } catch (err: any) {
    res.status(200).json({
      status: "alive",
      dbConnected: false,
      message: err?.message || String(err)
    });
  }
}
