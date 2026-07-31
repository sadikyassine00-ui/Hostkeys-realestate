import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllUsers, updateUserRole, updateUserAgentStatus, getUserByEmail } from '../src/db';

const SUPER_ADMIN_EMAIL = 'yassinesadik0@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // GET /api/users
    if (req.method === 'GET') {
      const isPublicRequest = req.query.public === 'true';

      if (isPublicRequest) {
        try {
          const allUsers = await getAllUsers();
          // Filter ONLY users who are explicitly assigned as agents or superadmin!
          const adminAgents = (allUsers || []).filter(u => u && (u.isAgent || u.role === 'superadmin'));
          return res.status(200).json({ agents: adminAgents, isLiveDb: true });
        } catch (dbErr) {
          console.warn('DB error on public agents fetch, using empty agents array:', dbErr);
          return res.status(200).json({ agents: [], isLiveDb: false });
        }
      }

      const requestorEmail = req.headers['x-user-email'] as string;
      if (!requestorEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Super Admin ALWAYS bypasses DB lookup check!
      if (requestorEmail === SUPER_ADMIN_EMAIL) {
        try {
          const users = await getAllUsers();
          return res.status(200).json({ users: users || [], isLiveDb: true });
        } catch (err) {
          return res.status(200).json({ users: [], isLiveDb: false });
        }
      }

      try {
        const requestor = await getUserByEmail(requestorEmail);
        if (!requestor || (requestor.role !== 'admin' && requestor.role !== 'superadmin')) {
          return res.status(403).json({ error: 'Forbidden: admin access required' });
        }

        const users = await getAllUsers();
        return res.status(200).json({ users: users || [], isLiveDb: true });
      } catch (err) {
        return res.status(200).json({ users: [], isLiveDb: false });
      }
    }

    // PATCH /api/users — update a user's role, agent status, or languages (superadmin only)
    if (req.method === 'PATCH') {
      const { userId, newRole, isAgent, languages } = req.body;
      const requestorEmail = req.headers['x-user-email'] as string;

      if (!requestorEmail || requestorEmail !== SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ error: 'Forbidden: only the super admin can update user settings' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'Invalid userId payload' });
      }

      try {
        if (newRole && ['owner', 'admin'].includes(newRole)) {
          await updateUserRole(userId, newRole, requestorEmail);
        }

        if (typeof isAgent === 'boolean' || Array.isArray(languages)) {
          await updateUserAgentStatus(userId, Boolean(isAgent), Array.isArray(languages) ? languages : ['FR', 'EN'], requestorEmail);
        }

        return res.status(200).json({ success: true, message: 'User updated successfully' });
      } catch (err: any) {
        return res.status(200).json({ success: false, message: err?.message || 'Failed to update user' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Users API error:', err);
    return res.status(200).json({ agents: [], users: [], isLiveDb: false, error: err?.message || String(err) });
  }
}
