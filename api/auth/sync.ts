import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertUser } from '../../src/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = req.body;
    if (!user || !user.id || !user.email) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    const updatedUser = await upsertUser(user);
    return res.status(200).json({ success: true, user: updatedUser, isLiveDb: true });
  } catch (err: any) {
    console.error('Auth sync API error:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}
