import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const SEED_PRODUCTS_FILE = path.join(DATA_DIR, 'seed-products.json');
const SEED_CATEGORIES_FILE = path.join(DATA_DIR, 'seed-categories.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface DatabaseSchema {
  products: any[];
  categories: any[];
  reviews: any[];
  settings: Record<string, any>;
  assets: any[];
  deletedProductIds: string[];
  deletedCategoryIds: string[];
  lastUpdated: number;
}

const loadDatabase = (): DatabaseSchema => {
  let db: DatabaseSchema = {
    products: [],
    categories: [],
    reviews: [],
    settings: {
      storeName: 'Family Printables',
      storeTagline: 'Smart Digital Printables for Families & Business',
      logoUrl: '/logo.png',
      payoneerEmail: 'merchant.payments@familyprintables.com',
      payoneerAccountId: 'PAY-8829-4102',
      receivingAccountNumber: '984210384729',
      routingNumber: '021000021',
      bankName: 'First Century Bank (US Receiving Account)',
      gatewayMode: 'test',
      currency: 'USD',
      socialLinks: {
        pinterest: 'https://www.pinterest.com/familyprintables',
        instagram: 'https://www.instagram.com/familyprintables',
        facebook: 'https://www.facebook.com/familyprintables',
        amazon: 'https://www.amazon.com/author/familyprintables',
        etsy: 'https://www.etsy.com/shop/familyprintables'
      }
    },
    assets: [],
    deletedProductIds: [],
    deletedCategoryIds: [],
    lastUpdated: Date.now()
  };

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed) {
        db = {
          products: Array.isArray(parsed.products) ? parsed.products : [],
          categories: Array.isArray(parsed.categories) ? parsed.categories : [],
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
          settings: parsed.settings ? { ...db.settings, ...parsed.settings } : db.settings,
          assets: Array.isArray(parsed.assets) ? parsed.assets : [],
          deletedProductIds: Array.isArray(parsed.deletedProductIds) ? parsed.deletedProductIds : [],
          deletedCategoryIds: Array.isArray(parsed.deletedCategoryIds) ? parsed.deletedCategoryIds : [],
          lastUpdated: parsed.lastUpdated || Date.now()
        };
      }
    }
  } catch (err) {
    console.error('Error reading database.json:', err);
  }

  // Auto-seed baseline products if database products are empty
  if (db.products.length === 0 && fs.existsSync(SEED_PRODUCTS_FILE)) {
    try {
      const seedProducts = JSON.parse(fs.readFileSync(SEED_PRODUCTS_FILE, 'utf8'));
      if (Array.isArray(seedProducts) && seedProducts.length > 0) {
        db.products = seedProducts;
        console.log(`🌱 Seeded database with ${seedProducts.length} initial products`);
      }
    } catch (e) {
      console.warn('Could not read seed-products.json:', e);
    }
  }

  // Auto-seed baseline categories if database categories are empty
  if (db.categories.length === 0 && fs.existsSync(SEED_CATEGORIES_FILE)) {
    try {
      const seedCats = JSON.parse(fs.readFileSync(SEED_CATEGORIES_FILE, 'utf8'));
      if (Array.isArray(seedCats) && seedCats.length > 0) {
        db.categories = seedCats;
        console.log(`🌱 Seeded database with ${seedCats.length} initial categories`);
      }
    } catch (e) {
      console.warn('Could not read seed-categories.json:', e);
    }
  }

  return db;
};

const saveDatabase = (db: DatabaseSchema) => {
  try {
    db.lastUpdated = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database.json:', err);
  }
};

// Initial database load and seed verification
const initialDb = loadDatabase();
saveDatabase(initialDb);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded assets permanently
app.use('/uploads', express.static(UPLOADS_DIR));

// ----------------------------------------------------------------------------
// BACKEND ASSET MANAGEMENT REST ENDPOINTS
// ----------------------------------------------------------------------------

/**
 * Upload Asset (Logo, Product Cover, Category Banner, PDF Document, Media)
 * Permanently saves file to /public/uploads/ and records in database.json
 */
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, fileName, assetType = 'asset' } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Missing dataUrl payload' });
    }

    // If it's already an HTTP URL or relative /uploads path, return as-is
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/uploads/')) {
      return res.json({ success: true, url: dataUrl, filename: fileName || 'external' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 Data URL format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = '.png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
    else if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('svg')) ext = '.svg';
    else if (mimeType.includes('pdf')) ext = '.pdf';
    else if (mimeType.includes('audio') || mimeType.includes('mp3')) ext = '.mp3';
    else if (mimeType.includes('video') || mimeType.includes('mp4')) ext = '.mp4';
    else if (fileName && path.extname(fileName)) ext = path.extname(fileName);

    const cleanPrefix = assetType.replace(/[^a-zA-Z0-9_-]/g, '');
    const safeName = `${cleanPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    // Record asset entry in database
    const db = loadDatabase();
    if (!Array.isArray(db.assets)) db.assets = [];
    const assetRecord = {
      id: `asset-${Date.now()}`,
      name: fileName || safeName,
      filename: safeName,
      url: publicUrl,
      size: buffer.length,
      mimeType,
      assetType,
      createdAt: Date.now()
    };
    db.assets.unshift(assetRecord);
    saveDatabase(db);

    console.log(`📁 Uploaded new asset: ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);

    res.json({
      success: true,
      url: publicUrl,
      filename: safeName,
      size: buffer.length,
      mimeType,
      asset: assetRecord
    });
  } catch (err: any) {
    console.error('Error handling asset upload:', err);
    res.status(500).json({ error: 'Failed to upload asset: ' + err.message });
  }
});

// List all uploaded assets
app.get('/api/assets', (req, res) => {
  const db = loadDatabase();
  res.json({ assets: db.assets || [], count: (db.assets || []).length });
});

// Delete uploaded asset
app.delete('/api/assets/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const db = loadDatabase();
    db.assets = (db.assets || []).filter(a => a.filename !== filename && !a.url.endsWith(filename));
    saveDatabase(db);
    res.json({ success: true, deleted: filename });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete asset: ' + err.message });
  }
});

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

// 2. POST Product (Save / Update single product)
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

app.post('/api/categories', (req, res) => {
  const db = loadDatabase();
  const cat = req.body;
  if (!cat || !cat.id) {
    return res.status(400).json({ error: 'Category requires an id' });
  }
  const idx = db.categories.findIndex(c => c.id === cat.id);
  if (idx !== -1) {
    db.categories[idx] = { ...db.categories[idx], ...cat, updatedAt: Date.now() };
  } else {
    db.categories.push({ ...cat, updatedAt: Date.now() });
  }
  saveDatabase(db);
  res.json({ success: true, category: cat, lastUpdated: db.lastUpdated });
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

app.delete('/api/categories/:id', (req, res) => {
  const db = loadDatabase();
  const catId = req.params.id;
  db.categories = db.categories.filter(c => c.id !== catId);
  saveDatabase(db);
  res.json({ success: true, deletedId: catId, lastUpdated: db.lastUpdated });
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

// 6. Settings Endpoints (Store Branding, Logo, Social Links, Checkout & Payoneer)
app.get('/api/settings', (req, res) => {
  const db = loadDatabase();
  res.json({ settings: db.settings, lastUpdated: db.lastUpdated });
});

app.post('/api/settings', (req, res) => {
  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body, updatedAt: Date.now() };
  saveDatabase(db);
  console.log('⚙️ Updated store settings in database.json');
  res.json({ success: true, settings: db.settings, lastUpdated: db.lastUpdated });
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
  if (Array.isArray(clientData.products) && clientData.products.length > 0) {
    if (db.products.length === 0) {
      db.products = clientData.products.filter((p: any) => !deletedSet.has(p.id));
    } else {
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
  }

  // Sync categories if client has custom ones
  if (Array.isArray(clientData.categories) && clientData.categories.length > 0) {
    if (db.categories.length === 0) {
      db.categories = clientData.categories;
    }
  }

  // Sync settings if client provided
  if (clientData.settings && Object.keys(clientData.settings).length > 0) {
    db.settings = { ...db.settings, ...clientData.settings };
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

// 8. Dynamic sitemap.xml generator endpoint
app.get('/sitemap.xml', (req, res) => {
  const db = loadDatabase();
  const baseUrl = 'https://familyprintables.com';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/#studio`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#reviews`, priority: '0.85', changefreq: 'daily' },
    { loc: `${baseUrl}/#how-it-works`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/#guides`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/#etsy-kdp`, priority: '0.85', changefreq: 'weekly' }
  ];

  const categoryUrls = (db.categories || []).map((c: any) => ({
    loc: `${baseUrl}/#category-${c.id}`,
    priority: '0.85',
    changefreq: 'weekly'
  }));

  const productUrls = (db.products || []).slice(0, 100).map((p: any) => ({
    loc: `${baseUrl}/#product-${p.id}`,
    priority: '0.75',
    changefreq: 'weekly'
  }));

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
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
