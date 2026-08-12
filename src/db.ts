import { neon } from '@neondatabase/serverless';
import { Listing, User } from './types';
import { SUPER_ADMIN_EMAIL, DEFAULT_SUPER_ADMIN } from './mockData';

// Helper to get active Neon SQL function if DATABASE_URL is present
export function getDb() {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString || typeof connectionString !== 'string' || connectionString.trim() === '') {
    return null;
  }
  connectionString = connectionString.trim().replace(/^["']|["']$/g, '');
  if (!connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
    return null;
  }
  try {
    return neon(connectionString);
  } catch (err) {
    console.error('Failed to initialize Neon database connection:', err);
    return null;
  }
}

// Automatically create tables and seed initial demo data if database is empty
export async function initDatabase(): Promise<{ success: boolean; message: string }> {
  const sql = getDb();
  if (!sql) {
    return {
      success: false,
      message: 'DATABASE_URL environment variable is not configured.'
    };
  }

  try {
    // 1. Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        avatar TEXT,
        role VARCHAR(50) DEFAULT 'owner',
        is_agent BOOLEAN DEFAULT false,
        languages TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create Listings Table
    await sql`
      CREATE TABLE IF NOT EXISTS listings (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        price NUMERIC NOT NULL,
        location VARCHAR(255) NOT NULL,
        address TEXT DEFAULT '',
        bedrooms INT NOT NULL,
        beds INT DEFAULT 0,
        bathrooms NUMERIC NOT NULL,
        square_meters INT NOT NULL,
        amenities TEXT[] DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'pending',
        owner_id VARCHAR(255) NOT NULL,
        approved_by_admin_id VARCHAR(255),
        image TEXT,
        images TEXT[] DEFAULT '{}',
        personal_owner_info JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add new columns if they don't exist (migration for existing tables)
    await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';`;
    await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';`;
    await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS beds INT DEFAULT 0;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_agent BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';`;

    // 3. Seed Super Admin if users table is empty
    const existingUsers = await sql`SELECT COUNT(*)::int as count FROM users;`;
    if (existingUsers[0].count === 0) {
      await upsertUser(DEFAULT_SUPER_ADMIN);
    }

    return { success: true, message: 'Neon Database initialized successfully with table schemas.' };
  } catch (err: any) {
    console.error('Error initializing Neon database:', err);
    return { success: false, message: `Database initialization error: ${err?.message || err}` };
  }
}

// User CRUD
export async function upsertUser(user: User): Promise<User> {
  const sql = getDb();
  if (!sql) return user;

  const finalRole = user.email === SUPER_ADMIN_EMAIL ? 'superadmin' : user.role;

  try {
    const existing = await sql`SELECT id, role, is_agent as "isAgent", languages FROM users WHERE email = ${user.email} LIMIT 1;`;
    if (existing.length > 0) {
      // User exists by email — preserve role if already assigned!
      const existingRole = existing[0].role || finalRole;
      const existingIsAgent = Boolean(existing[0].isAgent || user.email === SUPER_ADMIN_EMAIL);
      const existingLangs = Array.isArray(existing[0].languages) && existing[0].languages.length > 0 ? existing[0].languages : (user.languages || ['FR', 'EN']);
      
      await sql`
        UPDATE users 
        SET name = ${user.name}, phone = ${user.phone || ''}, avatar = ${user.avatar || ''}
        WHERE email = ${user.email};
      `;
      return { ...user, role: existingRole as any, isAgent: existingIsAgent, languages: existingLangs };
    } else {
      await sql`
        INSERT INTO users (id, name, email, phone, avatar, role, is_agent, languages)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.phone || ''}, ${user.avatar || ''}, ${finalRole}, ${user.isAgent || false}, ${user.languages || []});
      `;
      return { ...user, role: finalRole };
    }
  } catch (err) {
    console.warn('Upsert user DB warning:', err);
    return { ...user, role: finalRole };
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT id, name, email, phone, avatar, role, is_agent as "isAgent", languages FROM users WHERE id = ${id} OR email = ${id} LIMIT 1;`;
    if (rows.length === 0) return null;

    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      phone: rows[0].phone || '',
      avatar: rows[0].avatar || '',
      role: rows[0].role as 'owner' | 'admin' | 'superadmin',
      isAgent: Boolean(rows[0].isAgent || rows[0].email === SUPER_ADMIN_EMAIL),
      languages: Array.isArray(rows[0].languages) ? rows[0].languages : []
    };
  } catch (e) {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT id, name, email, phone, avatar, role, is_agent as "isAgent", languages FROM users WHERE email = ${email} LIMIT 1;`;
    if (rows.length === 0) return null;

    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      phone: rows[0].phone || '',
      avatar: rows[0].avatar || '',
      role: rows[0].role as 'owner' | 'admin' | 'superadmin',
      isAgent: Boolean(rows[0].isAgent || rows[0].email === SUPER_ADMIN_EMAIL),
      languages: Array.isArray(rows[0].languages) ? rows[0].languages : []
    };
  } catch (e) {
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  const sql = getDb();
  if (!sql) return [];

  try {
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_agent BOOLEAN DEFAULT false;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';`;
    } catch (e) {}

    const rows = await sql`SELECT id, name, email, phone, avatar, role, is_agent as "isAgent", languages FROM users ORDER BY created_at DESC;`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      avatar: r.avatar || '',
      role: r.role as 'owner' | 'admin' | 'superadmin',
      isAgent: Boolean(r.isAgent || r.email === SUPER_ADMIN_EMAIL),
      languages: Array.isArray(r.languages) && r.languages.length > 0 
        ? r.languages 
        : (r.email === SUPER_ADMIN_EMAIL ? ['FR', 'EN', 'AR'] : [])
    }));
  } catch (err) {
    console.warn('getAllUsers main query failed, trying basic query fallback:', err);
    try {
      const rows = await sql`SELECT id, name, email, phone, avatar, role FROM users ORDER BY created_at DESC;`;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone || '',
        avatar: r.avatar || '',
        role: r.role as 'owner' | 'admin' | 'superadmin',
        isAgent: r.email === SUPER_ADMIN_EMAIL,
        languages: r.email === SUPER_ADMIN_EMAIL ? ['FR', 'EN', 'AR'] : []
      }));
    } catch (e2) {
      console.error('getAllUsers fallback error:', e2);
      return [];
    }
  }
}

export async function updateUserRole(userIdOrEmail: string, newRole: 'owner' | 'admin', requestorEmail: string): Promise<{ success: boolean; message: string }> {
  const sql = getDb();
  if (!sql) return { success: false, message: 'Database not connected' };

  if (requestorEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: 'Unauthorized: only the super admin can change user roles.' };
  }

  try {
    const isOwnerRole = newRole === 'owner';
    await sql`
      UPDATE users 
      SET role = ${newRole}, is_agent = CASE WHEN ${isOwnerRole} THEN false ELSE is_agent END
      WHERE (id = ${userIdOrEmail} OR email = ${userIdOrEmail}) AND email != ${SUPER_ADMIN_EMAIL};
    `;
    return { success: true, message: `User role updated to ${newRole}` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to update role' };
  }
}

export async function updateUserAgentStatus(
  userIdOrEmail: string, 
  isAgent: boolean, 
  languages: string[], 
  requestorEmail: string
): Promise<{ success: boolean; message: string }> {
  const sql = getDb();
  if (!sql) return { success: false, message: 'Database not connected' };

  if (requestorEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: 'Unauthorized: only the super admin can assign agent status.' };
  }

  try {
    await sql`
      UPDATE users 
      SET is_agent = ${isAgent}, languages = ${languages} 
      WHERE id = ${userIdOrEmail} OR email = ${userIdOrEmail};
    `;
    return { success: true, message: 'Agent details updated successfully.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to update agent details' };
  }
}

// Listing CRUD
export async function getDbListings(filters?: {
  type?: string;
  status?: string;
  location?: string;
  search?: string;
  ownerId?: string;
}): Promise<Listing[]> {
  const sql = getDb();
  if (!sql) return [];

  try {
    const rows = await sql`
      SELECT 
        id, title, description, type, price::float, location, address,
        bedrooms, beds, bathrooms::float, square_meters as "squareMeters", 
        amenities, status, owner_id as "ownerId", 
        approved_by_admin_id as "approvedByAdminId", image, images,
        personal_owner_info as "personalOwnerInfo", created_at as "createdAt"
      FROM listings
      ORDER BY created_at DESC;
    `;

    let listings: Listing[] = rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.type,
      price: Number(r.price),
      location: r.location,
      address: r.address || '',
      bedrooms: Number(r.bedrooms),
      beds: Number(r.beds || r.bedrooms || 0),
      bathrooms: Number(r.bathrooms),
      squareMeters: Number(r.squareMeters),
      amenities: Array.isArray(r.amenities) ? r.amenities : [],
      status: r.status,
      ownerId: r.ownerId,
      approvedByAdminId: r.approvedByAdminId || undefined,
      image: r.image || '',
      images: Array.isArray(r.images) ? r.images : [],
      personalOwnerInfo: typeof r.personalOwnerInfo === 'string' ? JSON.parse(r.personalOwnerInfo) : r.personalOwnerInfo,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
    }));

    if (filters) {
      if (filters.status) listings = listings.filter(l => l.status === filters.status);
      if (filters.type) listings = listings.filter(l => l.type === filters.type);
      if (filters.location && filters.location !== 'All') listings = listings.filter(l => l.location === filters.location);
      if (filters.ownerId) listings = listings.filter(l => l.ownerId === filters.ownerId);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        listings = listings.filter(l => 
          l.title.toLowerCase().includes(q) || 
          l.description.toLowerCase().includes(q) || 
          l.location.toLowerCase().includes(q)
        );
      }
    }

    return listings;
  } catch (e) {
    return [];
  }
}

export async function createListing(listing: Listing): Promise<Listing> {
  const sql = getDb();
  if (!sql) return listing;

  try {
    const personalInfoJson = JSON.stringify(listing.personalOwnerInfo || {});

    await sql`
      INSERT INTO listings (
        id, title, description, type, price, location, address,
        bedrooms, beds, bathrooms, square_meters, amenities, status, 
        owner_id, approved_by_admin_id, image, images, personal_owner_info, created_at
      ) VALUES (
        ${listing.id}, ${listing.title}, ${listing.description}, ${listing.type}, 
        ${listing.price}, ${listing.location}, ${listing.address || ''},
        ${listing.bedrooms}, ${listing.beds || listing.bedrooms || 0}, ${listing.bathrooms}, 
        ${listing.squareMeters}, ${listing.amenities || []}, ${listing.status}, 
        ${listing.ownerId}, ${listing.approvedByAdminId || null}, ${listing.image}, 
        ${listing.images || []},
        ${personalInfoJson}::jsonb, ${listing.createdAt || new Date().toISOString()}
      );
    `;

    return listing;
  } catch (e) {
    return listing;
  }
}

export async function updateListingStatus(listingId: string, status: 'approved' | 'rejected', adminId?: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  try {
    await sql`
      UPDATE listings 
      SET status = ${status}, approved_by_admin_id = ${adminId || null}
      WHERE id = ${listingId};
    `;

    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteListing(listingId: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  try {
    await sql`DELETE FROM listings WHERE id = ${listingId};`;
    return true;
  } catch (e) {
    return false;
  }
}
