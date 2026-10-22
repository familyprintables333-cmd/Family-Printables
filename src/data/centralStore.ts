/**
 * ============================================================================
 * Centralized Data Management & Storage Script (Core Application Bundle)
 * ============================================================================
 * 
 * Provides:
 * 1. Persistent state management for Products, Categories, and Settings.
 * 2. Strict non-resurrection: Admin deletions are PERMANENT and never overridden
 *    by hardcoded base items upon reload.
 * 3. Transparent synchronization with Cloud Firestore and Server DB.
 * ============================================================================
 */

import { Product, CategoryInfo, MerchantSettings } from '../types';
import catalogData from './catalog.json';
import { BLOG_ARTICLES } from './blogArticles';
import { TEMPLATES, PRINT_THEMES, TEMPLATE_CATEGORIES, DEFAULT_BUSINESS_HEADER } from './printableTemplates';

export const INITIAL_PRODUCTS: Product[] = catalogData.products as Product[];
export const CATEGORIES: CategoryInfo[] = catalogData.categories as CategoryInfo[];

export const STORAGE_PRODUCTS_KEY = 'fp_custom_products';
export const STORAGE_DELETED_PRODUCTS_KEY = 'fp_deleted_product_ids';
export const STORAGE_DELETED_CATEGORIES_KEY = 'fp_deleted_category_ids';
export const STORAGE_CATEGORIES_KEY = 'fp_custom_categories';
export const STORAGE_SETTINGS_KEY = 'fp_merchant_settings';
export const STORAGE_INIT_KEY = 'fp_store_initialized_v3';

const rawSettings = (catalogData.settings || {}) as Record<string, any>;

export const DEFAULT_STORE_SETTINGS: MerchantSettings = {
  storeName: rawSettings.storeName || 'Family Printables',
  storeTagline: rawSettings.storeTagline || 'Smart Digital Printables for Families & Business',
  logoUrl: rawSettings.logoUrl || '/logo.png',
  defaultGateway: rawSettings.defaultGateway || 'gumroad',
  gatewayMode: rawSettings.gatewayMode || 'test',
  currency: rawSettings.currency || 'USD',
  gumroadBaseUrl: rawSettings.gumroadBaseUrl || 'https://gumroad.com/familyprintables',
  payoneerEmail: rawSettings.payoneerEmail || 'merchant.payments@familyprintables.com',
  payoneerAccountId: rawSettings.payoneerAccountId || 'PAY-8829-4102',
  receivingAccountNumber: rawSettings.receivingAccountNumber || '984210384729',
  routingNumber: rawSettings.routingNumber || '021000021',
  bankName: rawSettings.bankName || 'First Century Bank (US Receiving Account)',
  socialLinks: {
    pinterest: 'https://www.pinterest.com/familyprintables',
    instagram: 'https://www.instagram.com/familyprintables',
    facebook: 'https://www.facebook.com/familyprintables',
    amazon: 'https://www.amazon.com/author/familyprintables',
    etsy: 'https://www.etsy.com/shop/familyprintables',
    ...(rawSettings.socialLinks || {})
  }
};

/**
 * Safe local storage reader
 */
const safeRead = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null && raw !== undefined) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && parsed !== undefined) return parsed;
    }
  } catch (e) {
    console.warn(`[CentralStore] Could not parse ${key}:`, e);
  }
  return fallback;
};

/**
 * Safe local storage writer
 */
const safeWrite = (key: string, value: any): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[CentralStore] Storage write error for ${key}:`, e);
    return false;
  }
};

/**
 * Central Data Manager Class
 */
export class CentralDataStore {
  private products: Product[] = [];
  private categories: CategoryInfo[] = [];
  private settings: MerchantSettings = { ...DEFAULT_STORE_SETTINGS };
  private deletedProductIds: Set<string> = new Set();
  private deletedCategoryIds: Set<string> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize catalog:
   * If already initialized by admin, NEVER resurrect deleted products or categories!
   */
  public init(): void {
    if (typeof window === 'undefined') {
      this.products = [...INITIAL_PRODUCTS];
      this.categories = [...CATEGORIES];
      this.settings = { ...DEFAULT_STORE_SETTINGS };
      return;
    }

    // 1. Load deleted tombstone IDs
    const deletedList = safeRead<string[]>(STORAGE_DELETED_PRODUCTS_KEY, []);
    this.deletedProductIds = new Set(deletedList);

    const deletedCatList = safeRead<string[]>(STORAGE_DELETED_CATEGORIES_KEY, []);
    this.deletedCategoryIds = new Set(deletedCatList);

    const isInitializedInBrowser = localStorage.getItem(STORAGE_INIT_KEY) === 'true';

    // 2. Load products
    const savedProducts = safeRead<Product[] | null>(STORAGE_PRODUCTS_KEY, null);
    if (isInitializedInBrowser && savedProducts !== null && Array.isArray(savedProducts)) {
      // Respect live admin catalog strictly. NEVER re-inject INITIAL_PRODUCTS!
      this.products = savedProducts.filter(p => !this.deletedProductIds.has(p.id));
    } else {
      // First boot ever on pristine client
      this.products = INITIAL_PRODUCTS.filter(p => !this.deletedProductIds.has(p.id));
      safeWrite(STORAGE_PRODUCTS_KEY, this.products);
      localStorage.setItem(STORAGE_INIT_KEY, 'true');
    }

    // 3. Load categories
    const savedCategories = safeRead<CategoryInfo[] | null>(STORAGE_CATEGORIES_KEY, null);
    if (isInitializedInBrowser && savedCategories !== null && Array.isArray(savedCategories)) {
      this.categories = savedCategories.filter(c => !this.deletedCategoryIds.has(c.id));
    } else {
      this.categories = CATEGORIES.filter(c => !this.deletedCategoryIds.has(c.id));
      safeWrite(STORAGE_CATEGORIES_KEY, this.categories);
    }

    // 4. Load merchant settings
    const savedSettings = safeRead<Partial<MerchantSettings>>(STORAGE_SETTINGS_KEY, {});
    this.settings = {
      ...DEFAULT_STORE_SETTINGS,
      ...savedSettings,
      socialLinks: {
        ...DEFAULT_STORE_SETTINGS.socialLinks,
        ...(savedSettings.socialLinks || {})
      }
    };

    this.isInitialized = true;
  }

  // --- GETTERS ---

  public getProducts(): Product[] {
    if (!this.isInitialized) this.init();
    return this.products.filter(p => !this.deletedProductIds.has(p.id));
  }

  public getCategories(): CategoryInfo[] {
    if (!this.isInitialized) this.init();
    return this.categories.filter(c => !this.deletedCategoryIds.has(c.id));
  }

  public getSettings(): MerchantSettings {
    if (!this.isInitialized) this.init();
    return this.settings;
  }

  public getBlogArticles() {
    return BLOG_ARTICLES;
  }

  public getPrintableTemplates() {
    return TEMPLATES;
  }

  public getPrintThemes() {
    return PRINT_THEMES;
  }

  public getTemplateCategories() {
    return TEMPLATE_CATEGORIES;
  }

  public getDefaultBusinessHeader() {
    return DEFAULT_BUSINESS_HEADER;
  }

  public getDeletedProductIds(): string[] {
    return Array.from(this.deletedProductIds);
  }

  public getDeletedCategoryIds(): string[] {
    return Array.from(this.deletedCategoryIds);
  }

  // --- CLOUD / SERVER INCOMING STATE SETTERS ---

  public setProductsFromCloud(cloudProducts: Product[]): void {
    if (!Array.isArray(cloudProducts)) return;
    this.products = cloudProducts.filter(p => !this.deletedProductIds.has(p.id));
    safeWrite(STORAGE_PRODUCTS_KEY, this.products);
    localStorage.setItem(STORAGE_INIT_KEY, 'true');
  }

  public setCategoriesFromCloud(cloudCategories: CategoryInfo[]): void {
    if (!Array.isArray(cloudCategories)) return;
    this.categories = cloudCategories.filter(c => !this.deletedCategoryIds.has(c.id));
    safeWrite(STORAGE_CATEGORIES_KEY, this.categories);
  }

  public setSettingsFromCloud(cloudSettings: Partial<MerchantSettings>): void {
    this.settings = {
      ...this.settings,
      ...cloudSettings,
      socialLinks: {
        ...this.settings.socialLinks,
        ...(cloudSettings.socialLinks || {})
      }
    };
    safeWrite(STORAGE_SETTINGS_KEY, this.settings);
  }

  // --- MUTATIONS ---

  public saveProduct(product: Product): void {
    if (!this.isInitialized) this.init();

    // If previously deleted, un-tombstone it
    if (this.deletedProductIds.has(product.id)) {
      this.deletedProductIds.delete(product.id);
      safeWrite(STORAGE_DELETED_PRODUCTS_KEY, Array.from(this.deletedProductIds));
    }

    const idx = this.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      this.products[idx] = product;
    } else {
      this.products.unshift(product);
    }
    safeWrite(STORAGE_PRODUCTS_KEY, this.products);
    localStorage.setItem(STORAGE_INIT_KEY, 'true');
  }

  public deleteProduct(productId: string): void {
    if (!this.isInitialized) this.init();

    this.deletedProductIds.add(productId);
    safeWrite(STORAGE_DELETED_PRODUCTS_KEY, Array.from(this.deletedProductIds));

    this.products = this.products.filter(p => p.id !== productId);
    safeWrite(STORAGE_PRODUCTS_KEY, this.products);
    localStorage.setItem(STORAGE_INIT_KEY, 'true');
  }

  public saveCategory(category: CategoryInfo): void {
    if (!this.isInitialized) this.init();

    if (this.deletedCategoryIds.has(category.id)) {
      this.deletedCategoryIds.delete(category.id);
      safeWrite(STORAGE_DELETED_CATEGORIES_KEY, Array.from(this.deletedCategoryIds));
    }

    const idx = this.categories.findIndex(c => c.id === category.id);
    if (idx !== -1) {
      this.categories[idx] = category;
    } else {
      this.categories.push(category);
    }
    safeWrite(STORAGE_CATEGORIES_KEY, this.categories);
  }

  public deleteCategory(categoryId: string): void {
    if (!this.isInitialized) this.init();

    this.deletedCategoryIds.add(categoryId);
    safeWrite(STORAGE_DELETED_CATEGORIES_KEY, Array.from(this.deletedCategoryIds));

    this.categories = this.categories.filter(c => c.id !== categoryId);
    safeWrite(STORAGE_CATEGORIES_KEY, this.categories);
  }

  public saveSettings(newSettings: Partial<MerchantSettings>): MerchantSettings {
    if (!this.isInitialized) this.init();

    this.settings = {
      ...this.settings,
      ...newSettings,
      socialLinks: {
        ...this.settings.socialLinks,
        ...(newSettings.socialLinks || {})
      }
    };
    safeWrite(STORAGE_SETTINGS_KEY, this.settings);
    return this.settings;
  }

  public resetToFactoryDefaults(): void {
    this.deletedProductIds.clear();
    this.deletedCategoryIds.clear();
    this.products = [...INITIAL_PRODUCTS];
    this.categories = [...CATEGORIES];
    this.settings = { ...DEFAULT_STORE_SETTINGS };

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_PRODUCTS_KEY);
      localStorage.removeItem(STORAGE_DELETED_PRODUCTS_KEY);
      localStorage.removeItem(STORAGE_DELETED_CATEGORIES_KEY);
      localStorage.removeItem(STORAGE_CATEGORIES_KEY);
      localStorage.removeItem(STORAGE_SETTINGS_KEY);
      localStorage.removeItem(STORAGE_INIT_KEY);
    }
  }
}

// Global Singleton Instance
export const centralStore = new CentralDataStore();
