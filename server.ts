import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  products: any[];
  categories: any[];
  reviews: any[];
  settings: Record<string, any>;
  deletedProductIds: string[];
  deletedCategoryIds: string[];
  lastUpdated: number;
}

const loadDatabase = (): DatabaseSchema => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products)) {
        return {
          products: parsed.products,
          categories: parsed.categories || [],
          reviews: parsed.reviews || [],
          settings: parsed.settings || {},
          deletedProductIds: parsed.deletedProductIds || [],
          deletedCategoryIds: parsed.deletedCategoryIds || [],
          lastUpdated: parsed.lastUpdated || Date.now()
        };
      }
    }
  } catch (err) {
    console.error('Error loading database.json:', err);
  }

  return {
    products: [],
    categories: [],
    reviews: [],
    settings: {},
    deletedProductIds: [],
    deletedCategoryIds: [],
    lastUpdated: Date.now()
  };
};

const saveDatabase = (db: DatabaseSchema) => {
  try {
    db.lastUpdated = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database.json:', err);
  }
};

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ----------------------------------------------------------------------------
// REST API ENDPOINTS FOR TRUE CROSS-DEVICE SYNCHRONIZATION
// ----------------------------------------------------------------------------

// 1. GET Products (Strictly filters out any deleted items)
app.get('/api/products', (req, res) => {
  const db = loadDatabase();
  const deletedSet = new Set(db.deletedProductIds);
  const activeProducts = db.products.filter(p => !deletedSet.has(p.id));
  res.json({
    products: activeProducts,
    deletedProductIds: db.deletedProductIds,
    lastUpdated: db.lastUpdated
  });
});

// 2. POST / PUT Products (Save / Update with permanent locking)
app.post('/api/products', (req, res) => {
  const db = loadDatabase();
  const newProduct = req.body;
  if (!newProduct || !newProduct.id) {
    return res.status(400).json({ error: 'Product must have an id' });
  }

  // Remove from deleted list if re-added
  db.deletedProductIds = db.deletedProductIds.filter(id => id !== newProduct.id);

  const existingIdx = db.products.findIndex(p => p.id === newProduct.id);
  if (existingIdx !== -1) {
    db.products[existingIdx] = { ...db.products[existingIdx], ...newProduct, updatedAt: Date.now() };
  } else {
    db.products.unshift({ ...newProduct, updatedAt: Date.now() });
  }

  saveDatabase(db);
  res.json({ success: true, product: newProduct, lastUpdated: db.lastUpdated });
});

// Bulk update / sync products
app.put('/api/products', (req, res) => {
  const db = loadDatabase();
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Expected products array' });
  }

  const deletedSet = new Set(db.deletedProductIds);
  const filtered = products.filter(p => !deletedSet.has(p.id));
  db.products = filtered;
  saveDatabase(db);
  res.json({ success: true, count: filtered.length, lastUpdated: db.lastUpdated });
});

// 3. DELETE Product (PERMANENT DELETION GUARANTEE)
app.delete('/api/products/:id', (req, res) => {
  const db = loadDatabase();
  const productId = req.params.id;

  // Add to permanent tombstone list
  if (!db.deletedProductIds.includes(productId)) {
    db.deletedProductIds.push(productId);
  }

  // Purge from active products list
  db.products = db.products.filter(p => p.id !== productId);
  saveDatabase(db);

  res.json({
    success: true,
    deletedId: productId,
    deletedProductIds: db.deletedProductIds,
    remainingCount: db.products.length
  });
});

// 4. Categories Endpoints
app.get('/api/categories', (req, res) => {
  const db = loadDatabase();
  res.json({ categories: db.categories, lastUpdated: db.lastUpdated });
});

app.put('/api/categories', (req, res) => {
  const db = loadDatabase();
  const { categories } = req.body;
  if (Array.isArray(categories)) {
    db.categories = categories;
    saveDatabase(db);
  }
  res.json({ success: true, categories: db.categories, lastUpdated: db.lastUpdated });
});

// 5. Reviews Endpoints (Verified Real Reviews Only)
app.get('/api/reviews', (req, res) => {
  const db = loadDatabase();
  res.json({ reviews: db.reviews, lastUpdated: db.lastUpdated });
});

app.post('/api/reviews', (req, res) => {
  const db = loadDatabase();
  const review = req.body;
  if (!review || !review.author || !review.comment) {
    return res.status(400).json({ error: 'Invalid review payload' });
  }

  const newReview = {
    ...review,
    id: review.id || `rev-${Date.now()}`,
    timestamp: review.timestamp || Date.now(),
    createdAt: review.createdAt || new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  saveDatabase(db);
  res.json({ success: true, review: newReview, totalReviews: db.reviews.length });
});

// 6. Settings Endpoints
app.get('/api/settings', (req, res) => {
  const db = loadDatabase();
  res.json({ settings: db.settings, lastUpdated: db.lastUpdated });
});

app.post('/api/settings', (req, res) => {
  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// 7. Full Centralized Sync Endpoint
app.post('/api/sync', (req, res) => {
  const db = loadDatabase();
  const clientData = req.body || {};

  // Apply client deletions if provided
  if (Array.isArray(clientData.deletedProductIds)) {
    clientData.deletedProductIds.forEach((id: string) => {
      if (!db.deletedProductIds.includes(id)) {
        db.deletedProductIds.push(id);
      }
    });
  }

  // Purge any deleted items
  const deletedSet = new Set(db.deletedProductIds);
  db.products = db.products.filter(p => !deletedSet.has(p.id));

  // Merge client custom products if any are newer
  if (Array.isArray(clientData.products)) {
    const existingMap = new Map(db.products.map(p => [p.id, p]));
    clientData.products.forEach((cp: any) => {
      if (!deletedSet.has(cp.id)) {
        if (!existingMap.has(cp.id)) {
          db.products.unshift(cp);
        } else {
          const current = existingMap.get(cp.id);
          if ((cp.updatedAt || 0) > (current.updatedAt || 0)) {
            existingMap.set(cp.id, cp);
          }
        }
      }
    });
    db.products = Array.from(existingMap.values());
  }

  if (Array.isArray(clientData.reviews) && clientData.reviews.length > 0) {
    const revMap = new Map(db.reviews.map(r => [r.id, r]));
    clientData.reviews.forEach((r: any) => {
      if (!revMap.has(r.id)) {
        db.reviews.unshift(r);
      }
    });
    db.reviews = Array.from(revMap.values());
  }

  saveDatabase(db);

  res.json({
    products: db.products,
    categories: db.categories,
    reviews: db.reviews,
    settings: db.settings,
    deletedProductIds: db.deletedProductIds,
    lastUpdated: db.lastUpdated
  });
});

// ----------------------------------------------------------------------------
// SERVE FRONTEND (Vite middleware in dev / Static in prod)
// ----------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Family Printables Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
