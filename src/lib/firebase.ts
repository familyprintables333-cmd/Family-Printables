/**
 * ============================================================================
 * Live Cloud Firestore Database Client & Real-Time Sync Service
 * ============================================================================
 * 
 * Connected to Firebase Firestore backend:
 * - Real-time listeners (onSnapshot) for instant global sync across all devices
 * - Auto-seeding of master catalog to cloud database on initialization
 * - Cloud-persisted products, categories, merchant branding, and customer reviews
 * ============================================================================
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDocFromServer,
  onSnapshot, 
  writeBatch,
  query,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, CategoryInfo, MerchantSettings, UserReview } from '../types';

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Connection validator as per Firebase Integration Skill guidelines
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('🔥 Cloud Firestore connection verified.');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline; check network or Firebase credentials.');
    }
    return false;
  }
}

// ----------------------------------------------------------------------------
// REAL-TIME SUBSCRIBERS (Zero-Refresh Global Auto-Sync)
// ----------------------------------------------------------------------------

/**
 * Real-time subscription to Products collection.
 * Any admin change on any device instantly fires the callback on all user devices worldwide.
 */
export function subscribeToCloudProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Product;
        items.push({ ...data, id: docSnap.id });
      });
      // Sort to preserve order
      items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      onUpdate(items);
    },
    (err) => {
      console.warn('Real-time Products sync listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time subscription to Categories collection.
 */
export function subscribeToCloudCategories(
  onUpdate: (categories: CategoryInfo[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'categories');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: CategoryInfo[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as CategoryInfo;
        items.push({ ...data, id: (data.id || docSnap.id) as CategoryInfo['id'] });
      });
      onUpdate(items);
    },
    (err) => {
      console.warn('Real-time Categories sync listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time subscription to Store Settings doc.
 */
export function subscribeToCloudSettings(
  onUpdate: (settings: MerchantSettings) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, 'settings', 'global');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MerchantSettings;
        onUpdate(data);
      }
    },
    (err) => {
      console.warn('Real-time Settings sync listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time subscription to Reviews collection.
 */
export function subscribeToCloudReviews(
  onUpdate: (reviews: UserReview[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'reviews');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: UserReview[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as UserReview;
        items.push({ ...data, id: docSnap.id });
      });
      onUpdate(items);
    },
    (err) => {
      console.warn('Real-time Reviews sync listener error:', err);
      if (onError) onError(err);
    }
  );
}

// ----------------------------------------------------------------------------
// CLOUD MUTATION METHODS
// ----------------------------------------------------------------------------

export async function saveProductToCloud(product: Product): Promise<void> {
  const cleanId = product.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const docRef = doc(db, 'products', cleanId);
  const payload = {
    ...product,
    id: cleanId,
    updatedAt: Date.now()
  };
  await setDoc(docRef, payload, { merge: true });

  // Remove from tombstones if re-added
  const tombstoneRef = doc(db, 'tombstones_products', cleanId);
  await deleteDoc(tombstoneRef).catch(() => {});
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  const cleanId = productId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const docRef = doc(db, 'products', cleanId);
  await deleteDoc(docRef);

  // Record permanent tombstone in Firestore
  const tombstoneRef = doc(db, 'tombstones_products', cleanId);
  await setDoc(tombstoneRef, { deletedId: cleanId, deletedAt: Date.now() }, { merge: true }).catch(() => {});
}

export async function saveCategoryToCloud(category: CategoryInfo): Promise<void> {
  const cleanId = category.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const docRef = doc(db, 'categories', cleanId);
  const payload = {
    ...category,
    id: cleanId,
    updatedAt: Date.now()
  };
  await setDoc(docRef, payload, { merge: true });

  const tombstoneRef = doc(db, 'tombstones_categories', cleanId);
  await deleteDoc(tombstoneRef).catch(() => {});
}

export async function deleteCategoryFromCloud(categoryId: string): Promise<void> {
  const cleanId = categoryId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const docRef = doc(db, 'categories', cleanId);
  await deleteDoc(docRef);

  const tombstoneRef = doc(db, 'tombstones_categories', cleanId);
  await setDoc(tombstoneRef, { deletedId: cleanId, deletedAt: Date.now() }, { merge: true }).catch(() => {});
}

export async function saveSettingsToCloud(settings: Partial<MerchantSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'global');
  await setDoc(docRef, { ...settings, updatedAt: Date.now() }, { merge: true });
}

export async function saveReviewToCloud(review: UserReview): Promise<void> {
  const cleanId = review.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const docRef = doc(db, 'reviews', cleanId);
  await setDoc(docRef, { ...review, id: cleanId }, { merge: true });
}

// ----------------------------------------------------------------------------
// CLOUD AUTO-SEEDING (Bootstraps live database strictly once, never overrides admin deletions)
// ----------------------------------------------------------------------------

export async function seedCloudDatabaseIfEmpty(
  initialProducts: Product[],
  initialCategories: CategoryInfo[],
  defaultSettings: MerchantSettings
): Promise<void> {
  try {
    // 1. Check if database was already initialized by an admin. If so, NEVER re-seed!
    const initDoc = await getDocFromServer(doc(db, 'settings', 'system_init')).catch(() => null);
    if (initDoc && initDoc.exists() && initDoc.data()?.isInitialized) {
      return;
    }

    // 2. Check if products collection already has documents
    const productsCheck = await getDocs(query(collection(db, 'products'), limit(1)));
    if (!productsCheck.empty) {
      await setDoc(doc(db, 'settings', 'system_init'), { isInitialized: true, initializedAt: Date.now() }, { merge: true });
      return;
    }

    console.log(`🌱 First-time setup: Seeding Cloud Firestore with ${initialProducts.length} baseline products...`);
    const chunks: Product[][] = [];
    for (let i = 0; i < initialProducts.length; i += 400) {
      chunks.push(initialProducts.slice(i, i + 400));
    }
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const prod of chunk) {
        const docRef = doc(db, 'products', prod.id.replace(/[^a-zA-Z0-9_-]/g, '_'));
        batch.set(docRef, { ...prod, updatedAt: Date.now() });
      }
      await batch.commit();
    }

    const categoriesCheck = await getDocs(query(collection(db, 'categories'), limit(1)));
    if (categoriesCheck.empty && initialCategories.length > 0) {
      const batch = writeBatch(db);
      for (const cat of initialCategories) {
        const docRef = doc(db, 'categories', cat.id.replace(/[^a-zA-Z0-9_-]/g, '_'));
        batch.set(docRef, { ...cat, updatedAt: Date.now() });
      }
      await batch.commit();
    }

    const settingsCheck = await getDocFromServer(doc(db, 'settings', 'global')).catch(() => null);
    if (!settingsCheck || !settingsCheck.exists()) {
      await setDoc(doc(db, 'settings', 'global'), { ...defaultSettings, updatedAt: Date.now() });
    }

    // Mark system as permanently initialized
    await setDoc(doc(db, 'settings', 'system_init'), { isInitialized: true, initializedAt: Date.now() });
    console.log('✅ Cloud Firestore permanently initialized.');
  } catch (err) {
    console.warn('Cloud auto-seed error:', err);
  }
}
