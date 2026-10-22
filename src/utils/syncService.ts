/**
 * Centralized Cross-Device State Management & Synchronization Service
 * 
 * Provides:
 * 1. Persistent cross-device syncing via REST API endpoints (/api/products, /api/sync).
 * 2. Permanent deletion guarantee via tombstone tracking (deletedProductIds).
 * 3. Instant local caching for 0ms render & offline reliability.
 * 4. Real-time multi-tab syncing via BroadcastChannel and window storage events.
 */

import { Product, CategoryInfo, UserReview, MerchantSettings } from '../types';

const STORAGE_PRODUCTS_KEY = 'fp_custom_products';
const STORAGE_DELETED_PRODUCTS_KEY = 'fp_deleted_product_ids';
const STORAGE_CATEGORIES_KEY = 'fp_custom_categories';
const STORAGE_REVIEWS_KEY = 'fp_user_reviews_catalog';
const STORAGE_SETTINGS_KEY = 'fp_merchant_settings';

// Cross-tab broadcast channel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('family_printables_sync') 
  : null;

export interface SyncPayload {
  products: Product[];
  categories: CategoryInfo[];
  reviews: UserReview[];
  settings: MerchantSettings;
  deletedProductIds: string[];
  lastUpdated: number;
}

// ----------------------------------------------------------------------------
// LOCAL STORAGE CACHE HELPERS
// ----------------------------------------------------------------------------

export const getLocalDeletedProductIds = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_DELETED_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

export const recordDeletedProductIdLocally = (productId: string): void => {
  try {
    const deleted = getLocalDeletedProductIds();
    if (!deleted.includes(productId)) {
      deleted.push(productId);
      localStorage.setItem(STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify(deleted));
    }
  } catch {}
};

export const filterDeletedProducts = (products: Product[]): Product[] => {
  const deletedSet = new Set(getLocalDeletedProductIds());
  return products.filter(p => !deletedSet.has(p.id));
};

// ----------------------------------------------------------------------------
// SERVER API SYNC METHODS
// ----------------------------------------------------------------------------

/**
 * Fetch authoritative product catalog from server, respecting permanent deletions.
 */
export const fetchServerProducts = async (fallbackProducts: Product[]): Promise<Product[]> => {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.products)) {
        // Sync server tombstone list locally
        if (Array.isArray(data.deletedProductIds)) {
          const currentDeleted = getLocalDeletedProductIds();
          const mergedDeleted = Array.from(new Set([...currentDeleted, ...data.deletedProductIds]));
          localStorage.setItem(STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify(mergedDeleted));
        }

        const serverProducts = data.products;
        if (serverProducts.length > 0) {
          const cleaned = filterDeletedProducts(serverProducts);
          localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(cleaned));
          return cleaned;
        } else if (fallbackProducts.length > 0) {
          // Initialize server store with baseline catalog (minus any deleted tombstones)
          const initial = filterDeletedProducts(fallbackProducts);
          fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: initial })
          }).catch(() => {});
          localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(initial));
          return initial;
        }
      }
    }
  } catch (err) {
    console.warn('Backend /api/products offline, utilizing local cached state:', err);
  }

  // Fallback to local storage or defaults filtered by deleted list
  try {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return filterDeletedProducts(parsed);
      }
    }
  } catch {}

  return filterDeletedProducts(fallbackProducts);
};

/**
 * Save product to both local cache and backend database.
 */
export const syncSaveProduct = async (product: Product): Promise<void> => {
  // 1. Immediately update local storage
  try {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    let list: Product[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      list[idx] = product;
    } else {
      list.unshift(product);
    }
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
  } catch {}

  // 2. Broadcast to other tabs on same device
  if (syncChannel) {
    syncChannel.postMessage({ type: 'PRODUCT_SAVED', product });
  }

  // 3. Post to backend server for cross-device persistence
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  } catch (err) {
    console.warn('Could not post product to server; queued locally:', err);
  }
};

/**
 * Permanent Product Deletion Guarantee.
 * Purges item from local store, logs tombstone, and calls DELETE /api/products/:id.
 */
export const syncDeleteProduct = async (productId: string): Promise<void> => {
  // 1. Record in local tombstone
  recordDeletedProductIdLocally(productId);

  // 2. Purge from local storage
  try {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (saved) {
      const list: Product[] = JSON.parse(saved);
      const filtered = list.filter(p => p.id !== productId);
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(filtered));
    }
  } catch {}

  // 3. Broadcast to other tabs
  if (syncChannel) {
    syncChannel.postMessage({ type: 'PRODUCT_DELETED', productId });
  }

  // 4. Send DELETE to backend
  try {
    await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Server DELETE failed; tombstone preserved locally:', err);
  }
};

/**
 * Full State Sync: Call periodically or on visibility change to keep laptop & mobile in sync.
 */
export const performFullSync = async (
  currentProducts: Product[],
  onSyncReceived?: (data: { products?: Product[]; reviews?: UserReview[] }) => void
): Promise<void> => {
  try {
    const deletedProductIds = getLocalDeletedProductIds();
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: currentProducts,
        deletedProductIds
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.products)) {
        if (Array.isArray(data.deletedProductIds)) {
          const mergedDeleted = Array.from(new Set([...deletedProductIds, ...data.deletedProductIds]));
          localStorage.setItem(STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify(mergedDeleted));
        }

        const filtered = filterDeletedProducts(data.products);
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(filtered));

        if (onSyncReceived) {
          onSyncReceived({
            products: filtered,
            reviews: data.reviews
          });
        }
      }
    }
  } catch (err) {
    // Offline or network silent
  }
};

/**
 * Hook or helper to subscribe to multi-tab sync events
 */
export const subscribeToSyncEvents = (callback: (event: any) => void): (() => void) => {
  const handler = (e: MessageEvent) => {
    if (e.data) callback(e.data);
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_PRODUCTS_KEY || e.key === STORAGE_DELETED_PRODUCTS_KEY) {
      callback({ type: 'STORAGE_UPDATED', key: e.key });
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handler);
  }
  window.addEventListener('storage', storageHandler);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handler);
    }
    window.removeEventListener('storage', storageHandler);
  };
};

/**
 * Save settings to local cache and server
 */
export const syncSaveSettings = async (settings: Partial<MerchantSettings>): Promise<void> => {
  try {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
    const existing = saved ? JSON.parse(saved) : {};
    const merged = { ...existing, ...settings };
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
  } catch {}

  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch (err) {
    console.warn('Could not post settings to server:', err);
  }
};

/**
 * Fetch settings from server
 */
export const fetchServerSettings = async (): Promise<MerchantSettings | null> => {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.settings) {
        return data.settings;
      }
    }
  } catch {}
  return null;
};

/**
 * Fetch authoritative categories from server
 */
export const fetchServerCategories = async (fallbackCategories: CategoryInfo[]): Promise<CategoryInfo[]> => {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(data.categories));
        return data.categories;
      } else if (fallbackCategories.length > 0) {
        // Seed server categories
        fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categories: fallbackCategories })
        }).catch(() => {});
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(fallbackCategories));
        return fallbackCategories;
      }
    }
  } catch (err) {
    console.warn('Backend /api/categories offline, using local cache:', err);
  }

  try {
    const saved = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return fallbackCategories;
};

/**
 * Bulk save categories to server and local cache
 */
export const syncSaveCategories = async (categories: CategoryInfo[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  } catch {}

  if (syncChannel) {
    syncChannel.postMessage({ type: 'CATEGORIES_SAVED', categories });
  }

  try {
    await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories })
    });
  } catch (err) {
    console.warn('Could not save categories to server:', err);
  }
};

/**
 * Save single category to server and local cache
 */
export const syncSaveCategory = async (category: CategoryInfo): Promise<void> => {
  try {
    const saved = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    let list: CategoryInfo[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(c => c.id === category.id);
    if (idx !== -1) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(list));
  } catch {}

  try {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
  } catch (err) {
    console.warn('Could not post category to server:', err);
  }
};

/**
 * Delete category from server and local cache
 */
export const syncDeleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const saved = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (saved) {
      const list: CategoryInfo[] = JSON.parse(saved);
      const filtered = list.filter(c => c.id !== categoryId);
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(filtered));
    }
  } catch {}

  try {
    await fetch(`/api/categories/${categoryId}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Could not delete category on server:', err);
  }
};

/**
 * Permanent Backend Asset Upload System
 * Uploads logo, product cover, category banner, or document to server and returns public URL
 */
export const uploadAsset = async (
  dataUrl: string, 
  fileName?: string, 
  assetType: 'logo' | 'banner' | 'product' | 'document' | 'media' | 'asset' = 'asset'
): Promise<{ success: boolean; url: string; error?: string }> => {
  // If already an HTTP URL or persistent uploaded path, return immediately
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/uploads/')) {
    return { success: true, url: dataUrl };
  }

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        fileName,
        assetType
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return { success: true, url: data.url };
      }
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, url: dataUrl, error: errData.error || 'Server upload failed' };
  } catch (err: any) {
    console.warn('Asset upload to backend failed, falling back to local dataUrl:', err);
    return { success: false, url: dataUrl, error: err.message };
  }
};

export interface ServerAssetRecord {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  assetType: string;
  createdAt: number;
}

/**
 * Fetch all permanently stored assets from server
 */
export const fetchServerAssets = async (): Promise<ServerAssetRecord[]> => {
  try {
    const res = await fetch('/api/assets');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.assets)) {
        return data.assets;
      }
    }
  } catch (err) {
    console.warn('Could not fetch assets from server:', err);
  }
  return [];
};

/**
 * Delete asset from server storage
 */
export const deleteServerAsset = async (filename: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/assets/${encodeURIComponent(filename)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not delete asset on server:', err);
    return false;
  }
};

