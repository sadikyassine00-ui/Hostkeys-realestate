import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllUsers, updateUserRole, getUserByEmail } from '../src/db';

const SUPER_ADMIN_EMAIL = 'yassinesadik0@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // GET /api/users
    if (req.method === 'GET') {
      const isPublicRequest = req.query.public === 'true';

      if (isPublicRequest) {
        // Return only admin and superadmin agents for public display
        const allUsers = await getAllUsers();
        const adminAgents = allUsers.filter(u => u.role === 'admin' || u.role === 'superadmin');
        return res.status(200).json({ agents: adminAgents, isLiveDb: true });
      }

      const requestorEmail = req.headers['x-user-email'] as string;
      if (!requestorEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const requestor = await getUserByEmail(requestorEmail);
      if (!requestor || (requestor.role !== 'admin' && requestor.role !== 'superadmin')) {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
      }

      const users = await getAllUsers();
      return res.status(200).json({ users, isLiveDb: true });
    }

    // PATCH /api/users — update a user's role (superadmin only)
    if (req.method === 'PATCH') {
      const { userId, newRole } = req.body;
      const requestorEmail = req.headers['x-user-email'] as string;

      if (!requestorEmail || requestorEmail !== SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ error: 'Forbidden: only the super admin can change roles' });
      }

      if (!userId || !newRole || !['owner', 'admin'].includes(newRole)) {
        return res.status(400).json({ error: 'Invalid userId or newRole (must be "owner" or "admin")' });
      }

      const result = await updateUserRole(userId, newRole, requestorEmail);
      return res.status(result.success ? 200 : 403).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Users API error:', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
