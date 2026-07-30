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
import { INITIAL_LISTINGS, DEMO_OWNER, DEMO_ADMIN } from "./src/mockData";
import { Listing, User } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());

// Memory fallbacks
let memoryListings: Listing[] = [...INITIAL_LISTINGS];
let memoryUsers: User[] = [DEMO_OWNER, DEMO_ADMIN];

// Health Route Handler
const handleHealth = async (req: express.Request, res: express.Response) => {
  try {
    const sql = getDb();
    const dbConnected = Boolean(sql);
    res.json({
      status: "alive",
      dbConnected,
      message: dbConnected 
        ? "Connected to Neon PostgreSQL Database." 
        : "DATABASE_URL is not set. Running with local fallback data."
    });
  } catch (err: any) {
    res.json({
      status: "alive",
      dbConnected: false,
      message: `Health check fallback: ${err?.message || err}`
    });
  }
};

app.get("/api/health", handleHealth);
app.get("/health", handleHealth);

// Init DB Handler
const handleInitDb = async (req: express.Request, res: express.Response) => {
  const result = await initDatabase();
  res.status(result.success ? 200 : 400).json(result);
};

app.post("/api/init-db", handleInitDb);
app.post("/init-db", handleInitDb);

// GET /properties Handler
const handleGetProperties = async (req: express.Request, res: express.Response) => {
  try {
    const sql = getDb();
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const location = req.query.location as string | undefined;
    const search = req.query.search as string | undefined;
    const ownerId = req.query.ownerId as string | undefined;

    if (sql) {
      const dbListings = await getDbListings({ type, status, location, search, ownerId });
      return res.json({ listings: dbListings, isLiveDb: true });
    }

    let filtered = [...memoryListings];
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

    res.json({ listings: filtered, isLiveDb: false });
  } catch (err: any) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: "Failed to fetch properties", message: err?.message });
  }
};

app.get("/api/properties", handleGetProperties);
app.get("/properties", handleGetProperties);

// POST /properties Handler
const handleCreateProperty = async (req: express.Request, res: express.Response) => {
  try {
    const listingData = req.body as Listing;
    if (!listingData.title || !listingData.price || !listingData.location) {
      return res.status(400).json({ error: "Missing required property fields" });
    }

    const sql = getDb();
    if (sql) {
      const created = await createListing(listingData);
      return res.json({ success: true, listing: created, isLiveDb: true });
    }

    memoryListings.unshift(listingData);
    res.json({ success: true, listing: listingData, isLiveDb: false });
  } catch (err: any) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: "Failed to create property", message: err?.message });
  }
};

app.post("/api/properties", handleCreateProperty);
app.post("/properties", handleCreateProperty);

// PATCH /properties/:id/status Handler
const handleUpdateStatus = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status, adminId } = req.body;

    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const sql = getDb();
    if (sql) {
      await updateListingStatus(id, status, adminId);
      return res.json({ success: true, isLiveDb: true });
    }

    memoryListings = memoryListings.map(l => {
      if (l.id === id) {
        return { ...l, status, approvedByAdminId: adminId };
      }
      return l;
    });

    res.json({ success: true, isLiveDb: false });
  } catch (err: any) {
    console.error("Error updating property status:", err);
    res.status(500).json({ error: "Failed to update property status", message: err?.message });
  }
};

app.patch("/api/properties/:id/status", handleUpdateStatus);
app.patch("/properties/:id/status", handleUpdateStatus);

// DELETE /properties/:id Handler
const handleDeleteProperty = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const sql = getDb();
    if (sql) {
      await deleteListing(id);
      return res.json({ success: true, isLiveDb: true });
    }

    memoryListings = memoryListings.filter(l => l.id !== id);
    res.json({ success: true, isLiveDb: false });
  } catch (err: any) {
    console.error("Error deleting property:", err);
    res.status(500).json({ error: "Failed to delete property", message: err?.message });
  }
};

app.delete("/api/properties/:id", handleDeleteProperty);
app.delete("/properties/:id", handleDeleteProperty);

// POST /auth/sync Handler
const handleSyncUser = async (req: express.Request, res: express.Response) => {
  try {
    const user = req.body as User;
    if (!user.id || !user.email) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const sql = getDb();
    if (sql) {
      await upsertUser(user);
      return res.json({ success: true, user, isLiveDb: true });
    }

    const exists = memoryUsers.find(u => u.id === user.id);
    if (!exists) {
      memoryUsers.push(user);
    } else {
      memoryUsers = memoryUsers.map(u => u.id === user.id ? user : u);
    }

    res.json({ success: true, user, isLiveDb: false });
  } catch (err: any) {
    console.error("Error syncing user:", err);
    res.status(500).json({ error: "Failed to sync user", message: err?.message });
  }
};

app.post("/api/auth/sync", handleSyncUser);
app.post("/auth/sync", handleSyncUser);

// Exchange Rate Handler
const handleExchangeRate = async (req: express.Request, res: express.Response) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Currency external API response not OK");
    }

    const data = (await response.json()) as any;
    if (data && data.rates && typeof data.rates.EUR === 'number') {
      return res.json({
        USD: 1,
        EUR: data.rates.EUR,
        lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
        source: "live"
      });
    }
    throw new Error("External exchange rates schema is invalid");
  } catch (err) {
    res.json({
      USD: 1,
      EUR: 0.895,
      lastUpdated: new Date().toUTCString(),
      source: "fallback"
    });
  }
};

app.get("/api/exchange-rate", handleExchangeRate);
app.get("/exchange-rate", handleExchangeRate);

// Vite Integration for local dev
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  import("vite").then(async ({ createServer: createViteServer }) => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  });
} else if (!process.env.VERCEL) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
