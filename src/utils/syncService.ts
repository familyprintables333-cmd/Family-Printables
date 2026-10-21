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
