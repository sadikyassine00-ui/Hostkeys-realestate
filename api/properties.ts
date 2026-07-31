import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.DATABASE_URL;
    if (!url || url.trim() === '') {
      if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {
        return res.status(200).json({ success: true, isLiveDb: false, message: 'DATABASE_URL missing, updated locally' });
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

    // POST & PUT /api/properties — create or update existing property (upsert)
    if (req.method === 'POST' || req.method === 'PUT') {
      const listing = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
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
          ${listing.squareMeters}, ${listing.amenities || []}, ${listing.status || 'pending'}, 
          ${listing.ownerId}, ${listing.approvedByAdminId || null}, ${listing.image || ''}, 
          ${listing.images || []},
          ${personalInfoJson}::jsonb, ${listing.createdAt || new Date().toISOString()}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          type = EXCLUDED.type,
          price = EXCLUDED.price,
          location = EXCLUDED.location,
          address = EXCLUDED.address,
          bedrooms = EXCLUDED.bedrooms,
          beds = EXCLUDED.beds,
          bathrooms = EXCLUDED.bathrooms,
          square_meters = EXCLUDED.square_meters,
          amenities = EXCLUDED.amenities,
          image = EXCLUDED.image,
          images = EXCLUDED.images,
          personal_owner_info = EXCLUDED.personal_owner_info;
      `;
      return res.status(200).json({ success: true, listing, isLiveDb: true });
    }

    // PATCH /api/properties — update status (approve / reject)
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { id, status, adminId } = body;
      if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Invalid payload: missing id or status' });
      }

      await sql`
        UPDATE listings 
        SET status = ${status}, approved_by_admin_id = ${adminId || null}
        WHERE id = ${id};
      `;
      return res.status(200).json({ success: true, isLiveDb: true });
    }

    // DELETE /api/properties — delete listing
    if (req.method === 'DELETE') {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing listing id' });
      }

      await sql`DELETE FROM listings WHERE id = ${id};`;
      return res.status(200).json({ success: true, isLiveDb: true });
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
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      return res.status(200).json({ success: true, isLiveDb: false, message: 'Processed locally' });
    }
    return res.status(200).json({ listings: [], isLiveDb: false, error: err?.message || String(err) });
  }
}
