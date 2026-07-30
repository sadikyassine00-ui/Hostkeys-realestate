import { neon } from '@neondatabase/serverless';
import { Listing, User } from './types';
import { INITIAL_LISTINGS, DEMO_OWNER, DEMO_ADMIN } from './mockData';

// Helper to get active Neon SQL function if DATABASE_URL is present
export function getDb() {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === '') {
    return null;
  }
  connectionString = connectionString.trim().replace(/^["']|["']$/g, '');
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
        bedrooms INT NOT NULL,
        bathrooms NUMERIC NOT NULL,
        square_meters INT NOT NULL,
        amenities TEXT[] DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'pending',
        owner_id VARCHAR(255) NOT NULL,
        approved_by_admin_id VARCHAR(255),
        image TEXT,
        personal_owner_info JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Seed Users if empty
    const existingUsers = await sql`SELECT COUNT(*)::int as count FROM users;`;
    if (existingUsers[0].count === 0) {
      await upsertUser(DEMO_OWNER);
      await upsertUser(DEMO_ADMIN);
    }

    // 4. Seed Listings if empty
    const existingListings = await sql`SELECT COUNT(*)::int as count FROM listings;`;
    if (existingListings[0].count === 0) {
      for (const listing of INITIAL_LISTINGS) {
        await createListing(listing);
      }
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
  if (!sql) throw new Error('Database not connected');

  await sql`
    INSERT INTO users (id, name, email, phone, avatar, role)
    VALUES (${user.id}, ${user.name}, ${user.email}, ${user.phone || ''}, ${user.avatar || ''}, ${user.role})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      avatar = EXCLUDED.avatar,
      role = EXCLUDED.role;
  `;
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const sql = getDb();
  if (!sql) return null;

  const rows = await sql`SELECT id, name, email, phone, avatar, role FROM users WHERE id = ${id} LIMIT 1;`;
  if (rows.length === 0) return null;

  return {
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
    phone: rows[0].phone || '',
    avatar: rows[0].avatar || '',
    role: rows[0].role as 'owner' | 'admin'
  };
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

  const rows = await sql`
    SELECT 
      id, title, description, type, price::float, location, 
      bedrooms, bathrooms::float, square_meters as "squareMeters", 
      amenities, status, owner_id as "ownerId", 
      approved_by_admin_id as "approvedByAdminId", image, 
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
    bedrooms: Number(r.bedrooms),
    bathrooms: Number(r.bathrooms),
    squareMeters: Number(r.squareMeters),
    amenities: Array.isArray(r.amenities) ? r.amenities : [],
    status: r.status,
    ownerId: r.ownerId,
    approvedByAdminId: r.approvedByAdminId || undefined,
    image: r.image || '',
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
}

export async function createListing(listing: Listing): Promise<Listing> {
  const sql = getDb();
  if (!sql) throw new Error('Database not connected');

  const personalInfoJson = JSON.stringify(listing.personalOwnerInfo || {});

  await sql`
    INSERT INTO listings (
      id, title, description, type, price, location, 
      bedrooms, bathrooms, square_meters, amenities, status, 
      owner_id, approved_by_admin_id, image, personal_owner_info, created_at
    ) VALUES (
      ${listing.id}, ${listing.title}, ${listing.description}, ${listing.type}, 
      ${listing.price}, ${listing.location}, ${listing.bedrooms}, ${listing.bathrooms}, 
      ${listing.squareMeters}, ${listing.amenities || []}, ${listing.status}, 
      ${listing.ownerId}, ${listing.approvedByAdminId || null}, ${listing.image}, 
      ${personalInfoJson}::jsonb, ${listing.createdAt || new Date().toISOString()}
    );
  `;

  return listing;
}

export async function updateListingStatus(listingId: string, status: 'approved' | 'rejected', adminId?: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await sql`
    UPDATE listings 
    SET status = ${status}, approved_by_admin_id = ${adminId || null}
    WHERE id = ${listingId};
  `;

  return true;
}

export async function deleteListing(listingId: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await sql`DELETE FROM listings WHERE id = ${listingId};`;
  return true;
}
