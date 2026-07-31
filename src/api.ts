import { Listing, User } from './types';

export async function uploadImageApi(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      return { url: URL.createObjectURL(file) };
    }

    return await res.json();
  } catch (e) {
    return { url: URL.createObjectURL(file) };
  }
}

export async function checkApiHealth(): Promise<{ status: string; dbConnected: boolean; message?: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { status: 'error', dbConnected: false };
    }
    return await res.json();
  } catch (e) {
    return { status: 'offline', dbConnected: false };
  }
}

export async function initDbApi(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/init-db', { method: 'POST' });
    if (!res.ok) {
      return { success: false, message: 'Failed to trigger database init.' };
    }
    return await res.json();
  } catch (e: any) {
    return { success: false, message: e?.message || 'Network error triggering database init.' };
  }
}

export async function fetchProperties(filters?: {
  type?: string;
  status?: string;
  location?: string;
  search?: string;
  ownerId?: string;
}): Promise<{ listings: Listing[]; isLiveDb: boolean }> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.location && filters.location !== 'All') params.append('location', filters.location);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.ownerId) params.append('ownerId', filters.ownerId);

  const queryString = params.toString();
  const url = queryString ? `/api/properties?${queryString}` : '/api/properties';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { listings: [], isLiveDb: false };
    }
    const data = await res.json();
    return { listings: data.listings || [], isLiveDb: !!data.isLiveDb };
  } catch (err) {
    return { listings: [], isLiveDb: false };
  }
}

export async function createPropertyApi(listing: Listing): Promise<{ success: boolean; listing?: Listing; isLiveDb?: boolean }> {
  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });

    if (!res.ok) {
      return { success: true, listing, isLiveDb: false };
    }

    return await res.json();
  } catch (err) {
    return { success: true, listing, isLiveDb: false };
  }
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
  try {
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (!res.ok) {
      return { success: true, user, isLiveDb: false };
    }

    return await res.json();
  } catch (err) {
    return { success: true, user, isLiveDb: false };
  }
}

export async function fetchExchangeRate(): Promise<{ EUR: number; MAD: number }> {
  try {
    const res = await fetch('/api/exchange-rate');
    if (!res.ok) return { EUR: 0.895, MAD: 1.0 };
    return await res.json();
  } catch (e) {
    return { EUR: 0.895, MAD: 1.0 };
  }
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
    return { users: [], isLiveDb: false };
  }
}

export async function updateUserRoleApi(
  userId: string, 
  newRole: 'owner' | 'admin', 
  requestorEmail: string,
  userEmail?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': requestorEmail 
      },
      body: JSON.stringify({ userId, userEmail: userEmail || userId, newRole })
    });

    if (!res.ok) {
      return { success: false, message: `Server error: ${res.status}` };
    }

    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function updateUserAgentApi(
  userId: string,
  isAgent: boolean,
  languages: string[],
  requestorEmail: string,
  userEmail?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': requestorEmail 
      },
      body: JSON.stringify({ userId, userEmail: userEmail || userId, isAgent, languages })
    });

    if (!res.ok) {
      return { success: false, message: `Server error: ${res.status}` };
    }

    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}
