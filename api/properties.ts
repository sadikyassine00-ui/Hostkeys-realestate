import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.DATABASE_URL;
    if (!url || url.trim() === '') {
      if (req.method === 'POST') {
        return res.status(400).json({ success: false, error: 'DATABASE_URL environment variable is missing.' });
      }
      return res.status(200).json({ listings: [], isLiveDb: false, message: 'DATABASE_URL is missing' });
    }

    const cleanUrl = url.trim().replace(/^["']|["']$/g, '');
    const sql = neon(cleanUrl);

    // Auto-migrate schema on connection to ensure table and all columns exist
    try {
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
      await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';`;
      await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';`;
      await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS beds INT DEFAULT 0;`;
    } catch (e) {
      console.warn('Schema auto-migration warning:', e);
    }

    // POST /api/properties
    if (req.method === 'POST') {
      const listing = req.body;
      if (!listing || !listing.id || !listing.title) {
        return res.status(400).json({ success: false, error: 'Invalid listing payload.' });
      }

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
          ${listing.ownerId}, ${listing.approvedByAdminId || null}, ${listing.image || ''}, 
          ${listing.images || []},
          ${personalInfoJson}::jsonb, ${listing.createdAt || new Date().toISOString()}
        );
      `;
      return res.status(200).json({ success: true, listing, isLiveDb: true });
    }

    // GET /api/properties
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

    let listings = rows.map((r: any) => ({
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

    return res.status(200).json({ listings, isLiveDb: true });
  } catch (err: any) {
    console.error('Properties API error:', err);
    if (req.method === 'POST') {
      return res.status(500).json({ success: false, error: 'Failed to create listing in database.' });
    }
    return res.status(200).json({ listings: [], isLiveDb: false, error: err?.message || String(err) });
  }
}
