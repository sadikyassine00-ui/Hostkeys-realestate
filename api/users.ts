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
          const adminAgents = (allUsers || []).filter(u => u && (u.isAgent || u.role === 'superadmin'));
          return res.status(200).json({ agents: adminAgents, isLiveDb: true });
        } catch (dbErr) {
          console.warn('DB error on public agents fetch, using empty agents array:', dbErr);
          return res.status(200).json({ agents: [], isLiveDb: false });
        }
      }

      const requestorEmail = (req.headers['x-user-email'] as string) || (req.query.requestorEmail as string);
      if (!requestorEmail) {
        return res.status(200).json({ users: [], isLiveDb: false, error: 'Unauthorized' });
      }

      if (requestorEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
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
          return res.status(200).json({ users: [], isLiveDb: false, error: 'Forbidden' });
        }

        const users = await getAllUsers();
        return res.status(200).json({ users: users || [], isLiveDb: true });
      } catch (err) {
        return res.status(200).json({ users: [], isLiveDb: false });
      }
    }

    // PATCH /api/users — update user role, agent status, or languages
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { userId, newRole, isAgent, languages } = body;
      const requestorEmail = (req.headers['x-user-email'] as string) || body.requestorEmail;

      if (!requestorEmail || requestorEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
        return res.status(200).json({ success: true, isLiveDb: false, message: 'Local role update active' });
      }

      if (!userId) {
        return res.status(200).json({ success: false, error: 'Invalid userId payload' });
      }

      try {
        if (newRole && ['owner', 'admin'].includes(newRole)) {
          await updateUserRole(userId, newRole, requestorEmail);
        }

        if (typeof isAgent === 'boolean' || Array.isArray(languages)) {
          await updateUserAgentStatus(userId, Boolean(isAgent), Array.isArray(languages) ? languages : ['FR', 'EN'], requestorEmail);
        }

        return res.status(200).json({ success: true, message: 'User updated successfully', isLiveDb: true });
      } catch (err: any) {
        console.warn('PATCH /api/users DB error:', err);
        return res.status(200).json({ success: true, isLiveDb: false, message: err?.message || 'Updated locally' });
      }
    }

    return res.status(200).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Users API error:', err);
    return res.status(200).json({ agents: [], users: [], isLiveDb: false, error: err?.message || String(err) });
  }
}
