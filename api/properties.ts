import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.DATABASE_URL;
    if (!url || url.trim() === '') {
      return res.status(200).json({ listings: [], isLiveDb: false, message: 'DATABASE_URL is missing' });
    }

    const cleanUrl = url.trim().replace(/^["']|["']$/g, '');
    const sql = neon(cleanUrl);

    // POST /api/properties
    if (req.method === 'POST') {
      const listing = req.body;
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
      return res.status(200).json({ success: true, listing, isLiveDb: true });
    }

    // GET /api/properties
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

    let listings = rows.map((r: any) => ({
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

    return res.status(200).json({ listings, isLiveDb: true });
  } catch (err: any) {
    console.error('Properties API error:', err);
    return res.status(200).json({ listings: [], isLiveDb: false, error: err?.message || String(err) });
  }
}
