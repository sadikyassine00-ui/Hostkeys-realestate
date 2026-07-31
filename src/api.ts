import { Listing, User } from './types';

export interface HealthCheckResponse {
  status: string;
  dbConnected: boolean;
  message?: string;
}

export async function checkApiHealth(): Promise<HealthCheckResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'error', dbConnected: false };
    return await res.json();
  } catch (err) {
    return { status: 'error', dbConnected: false, message: 'Server unavailable' };
  }
}

export async function initializeDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/init-db', { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to trigger database init' };
  }
}

export async function fetchProperties(filters?: {
  type?: string;
  status?: string;
  location?: string;
  search?: string;
  ownerId?: string;
}): Promise<{ listings: Listing[]; isLiveDb: boolean }> {
  try {
    const query = new URLSearchParams();
    if (filters?.type) query.set('type', filters.type);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.location && filters?.location !== 'All') query.set('location', filters.location);
    if (filters?.search) query.set('search', filters.search);
    if (filters?.ownerId) query.set('ownerId', filters.ownerId);

    const res = await fetch(`/api/properties?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch properties');
    const data = await res.json();
    return {
      listings: data.listings || [],
      isLiveDb: Boolean(data.isLiveDb)
    };
  } catch (err) {
    console.warn('API error fetching properties, using fallback response:', err);
    return { listings: [], isLiveDb: false };
  }
}

export async function createPropertyApi(listing: Listing): Promise<{ success: boolean; listing: Listing; isLiveDb: boolean }> {
  const res = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to save property listing');
  }

  return await res.json();
}

export async function updatePropertyStatusApi(
  id: string, 
  status: 'approved' | 'rejected', 
  adminId?: string
): Promise<{ success: boolean; isLiveDb: boolean }> {
  try {
    const res = await fetch('/api/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, adminId })
    });

    if (!res.ok) {
      return { success: true, isLiveDb: false };
    }

    return await res.json();
  } catch (err) {
    return { success: true, isLiveDb: false };
  }
}

export async function deletePropertyApi(id: string): Promise<{ success: boolean; isLiveDb: boolean }> {
  try {
    const res = await fetch(`/api/properties?id=${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      return { success: true, isLiveDb: false };
    }

    return await res.json();
  } catch (err) {
    return { success: true, isLiveDb: false };
  }
}

export async function syncUserApi(user: User): Promise<{ success: boolean; user: User; isLiveDb: boolean }> {
  const res = await fetch('/api/auth/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    throw new Error('Failed to sync user details');
  }

  return await res.json();
}

// --- Image Upload ---
export async function uploadImageApi(file: File): Promise<{ url: string; success: boolean }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Image upload failed');
  }

  return await res.json();
}

export async function fetchPublicAgentsApi(): Promise<User[]> {
  try {
    const res = await fetch('/api/users?public=true');
    if (!res.ok) return [];
    const data = await res.json();
    return data.agents || [];
  } catch (err) {
    return [];
  }
}

export async function fetchUsersApi(requestorEmail: string): Promise<{ users: User[]; isLiveDb: boolean }> {
  try {
    const res = await fetch('/api/users', {
      headers: { 'x-user-email': requestorEmail }
    });
    if (!res.ok) return { users: [], isLiveDb: false };
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch users:', err);
    return { users: [], isLiveDb: false };
  }
}

export async function updateUserRoleApi(
  userId: string, 
  newRole: 'owner' | 'admin', 
  requestorEmail: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/users', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-email': requestorEmail 
    },
    body: JSON.stringify({ userId, newRole })
  });

  return await res.json();
}
