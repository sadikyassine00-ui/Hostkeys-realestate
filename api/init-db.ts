import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initDatabase } from '../src/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await initDatabase();
    res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || String(err) });
  }
}
