import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, getDbListings, createListing } from '../src/db';
import { INITIAL_LISTINGS } from '../src/mockData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    if (req.method === 'POST') {
      const listingData = req.body;
      if (sql) {
        const created = await createListing(listingData);
        return res.status(200).json({ success: true, listing: created, isLiveDb: true });
      }
      return res.status(200).json({ success: true, listing: listingData, isLiveDb: false });
    }

    // GET /api/properties
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const location = req.query.location as string | undefined;
    const search = req.query.search as string | undefined;
    const ownerId = req.query.ownerId as string | undefined;

    if (sql) {
      const listings = await getDbListings({ type, status, location, search, ownerId });
      return res.status(200).json({ listings, isLiveDb: true });
    }

    let filtered = [...INITIAL_LISTINGS];
    if (status) filtered = filtered.filter(l => l.status === status);
    if (type) filtered = filtered.filter(l => l.type === type);
    if (location && location !== 'All') filtered = filtered.filter(l => l.location === location);
    if (ownerId) filtered = filtered.filter(l => l.ownerId === ownerId);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) || 
        l.location.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ listings: filtered, isLiveDb: false });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process properties request', message: err?.message });
  }
}
