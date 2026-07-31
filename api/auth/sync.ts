import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertUser } from '../../src/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(200).json({ error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const user = body;
    if (!user || (!user.id && !user.email)) {
      return res.status(200).json({ success: true, user: body, isLiveDb: false });
    }

    try {
      const updatedUser = await upsertUser(user);
      return res.status(200).json({ success: true, user: updatedUser, isLiveDb: true });
    } catch (dbErr) {
      console.warn('DB error during user sync, using local fallback:', dbErr);
      return res.status(200).json({ success: true, user, isLiveDb: false });
    }
  } catch (err: any) {
    console.error('Auth sync API error:', err);
    const fallbackUser = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    return res.status(200).json({ success: true, user: fallbackUser, isLiveDb: false });
  }
}
