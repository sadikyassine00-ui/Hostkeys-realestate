import express from "express";
import path from "path";
import dotenv from "dotenv";
import { 
  getDb, 
  initDatabase, 
  getDbListings, 
  createListing, 
  updateListingStatus, 
  deleteListing, 
  upsertUser 
} from "./src/db";
import { DEFAULT_SUPER_ADMIN } from "./src/mockData";
import { Listing, User } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());

// Memory fallbacks (production mode — real data only)
let memoryListings: Listing[] = [];
let memoryUsers: User[] = [DEFAULT_SUPER_ADMIN];

// Health Route Handler
app.get("/api/health", async (req, res) => {
  const sql = getDb();
  if (!sql) {
    return res.json({ 
      status: "ok", 
      dbConnected: false, 
      message: "Running with local memory fallback (DATABASE_URL missing)." 
    });
  }

  try {
    await sql`SELECT 1;`;
    return res.json({ status: "ok", dbConnected: true, message: "Connected to Neon PostgreSQL DB." });
  } catch (err: any) {
    return res.json({ status: "error", dbConnected: false, message: err?.message || String(err) });
  }
});

// Initialize Database Route Handler
app.post("/api/init-db", async (req, res) => {
  const result = await initDatabase();
  return res.json(result);
});

// Properties Routes Handler
app.get("/api/properties", async (req, res) => {
  const { type, status, location, search, ownerId } = req.query;

  const sql = getDb();
  if (sql) {
    try {
      const listings = await getDbListings({
        type: type as string,
        status: status as string,
        location: location as string,
        search: search as string,
        ownerId: ownerId as string
      });
      return res.json({ listings, isLiveDb: true });
    } catch (err) {
      console.warn("DB properties fetch failed, returning local memory:", err);
    }
  }

  // Local Memory Fallback
  let filtered = [...memoryListings];
  if (status) filtered = filtered.filter(l => l.status === status);
  if (type) filtered = filtered.filter(l => l.type === type);
  if (location && location !== 'All') filtered = filtered.filter(l => l.location === location);
  if (ownerId) filtered = filtered.filter(l => l.ownerId === ownerId);
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(l => 
      l.title.toLowerCase().includes(q) || 
      l.description.toLowerCase().includes(q) || 
      l.location.toLowerCase().includes(q)
    );
  }

  return res.json({ listings: filtered, isLiveDb: false });
});

app.post("/api/properties", async (req, res) => {
  const listing: Listing = req.body;
  if (!listing || !listing.id || !listing.title) {
    return res.status(400).json({ error: "Invalid property data" });
  }

  const sql = getDb();
  if (sql) {
    try {
      const created = await createListing(listing);
      return res.json({ success: true, listing: created, isLiveDb: true });
    } catch (err) {
      console.warn("DB property creation failed, adding to memory:", err);
    }
  }

  // Memory fallback
  memoryListings.unshift(listing);
  return res.json({ success: true, listing, isLiveDb: false });
});

app.patch("/api/properties", async (req, res) => {
  const { id, status, adminId } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: "Missing id or status" });
  }

  const sql = getDb();
  if (sql) {
    try {
      await updateListingStatus(id, status, adminId);
      return res.json({ success: true, isLiveDb: true });
    } catch (err) {}
  }

  memoryListings = memoryListings.map(l => l.id === id ? { ...l, status, approvedByAdminId: adminId } : l);
  return res.json({ success: true, isLiveDb: false });
});

app.delete("/api/properties", async (req, res) => {
  const id = (req.query.id as string) || req.body?.id;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const sql = getDb();
  if (sql) {
    try {
      await deleteListing(id);
      return res.json({ success: true, isLiveDb: true });
    } catch (err) {}
  }

  memoryListings = memoryListings.filter(l => l.id !== id);
  return res.json({ success: true, isLiveDb: false });
});

// Users Routes Handler
app.get("/api/users", async (req, res) => {
  const isPublicRequest = req.query.public === "true";
  if (isPublicRequest) {
    return res.json({ agents: memoryUsers.filter(u => u.role === "admin" || u.role === "superadmin"), isLiveDb: false });
  }

  return res.json({ users: memoryUsers, isLiveDb: false });
});

app.post("/api/auth/sync", async (req, res) => {
  const user: User = req.body;
  if (!user || !user.id || !user.email) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  const sql = getDb();
  if (sql) {
    try {
      const synced = await upsertUser(user);
      return res.json({ success: true, user: synced, isLiveDb: true });
    } catch (err) {}
  }

  const idx = memoryUsers.findIndex(u => u.email === user.email);
  if (idx >= 0) {
    memoryUsers[idx] = { ...memoryUsers[idx], ...user };
  } else {
    memoryUsers.push(user);
  }

  return res.json({ success: true, user, isLiveDb: false });
});

// Exchange rate endpoint
app.get("/api/exchange-rate", (req, res) => {
  res.json({ EUR: 0.895, MAD: 1.0 });
});

// Vite / Static Files Production Handler
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

if (isProd) {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
