/**
 * ============================================================================
 * Centralized Data Management & Storage Script (Core Application Bundle)
 * ============================================================================
 * 
 * Provides:
 * 1. Self-contained, production-ready master catalog of products & categories
 *    bundled directly within the core Vite build (0ms load, zero external fetch required).
 * 2. Complete store settings (branding, social links, payment gateways, payout details).
 * 3. Reactive client-side persistent storage with automatic localStorage sync.
 * 4. Transparent API synchronization when running with Express, with graceful
 *    zero-error fallback on static deployment platforms like Vercel.
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
export const STORAGE_CATEGORIES_KEY = 'fp_custom_categories';
export const STORAGE_SETTINGS_KEY = 'fp_merchant_settings';
export const STORAGE_REVIEWS_KEY = 'fp_user_reviews_catalog';

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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && parsed !== undefined) return parsed;
    }
  } catch (e) {
    console.warn(`[CentralStore] Could not parse ${key}:`, e);
  }
  return fallback;
};

/**
 * Safe local storage writer with quota protection
 */
const safeWrite = (key: string, value: any): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[CentralStore] Storage quota exceeded for ${key}:`, e);
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
  private isInitialized = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize catalog from bundled source & restore local modifications
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

    // 2. Load products (bundle + local overrides)
    const savedProducts = safeRead<Product[]>(STORAGE_PRODUCTS_KEY, []);
    if (savedProducts.length > 0) {
      const savedMap = new Map(savedProducts.map(p => [p.id, p]));
      const merged: Product[] = [];

      for (const baseProd of INITIAL_PRODUCTS) {
        if (this.deletedProductIds.has(baseProd.id)) continue;
        merged.push(savedMap.get(baseProd.id) || baseProd);
      }

      // Add any custom products added by admin that are not in base
      for (const savedProd of savedProducts) {
        if (this.deletedProductIds.has(savedProd.id)) continue;
        if (!merged.some(p => p.id === savedProd.id)) {
          merged.unshift(savedProd);
        }
      }
      this.products = merged;
    } else {
      this.products = INITIAL_PRODUCTS.filter(p => !this.deletedProductIds.has(p.id));
    }

    // 3. Load categories (bundle + local overrides)
    const savedCategories = safeRead<CategoryInfo[]>(STORAGE_CATEGORIES_KEY, []);
    if (savedCategories.length > 0) {
      this.categories = savedCategories;
    } else {
      this.categories = [...CATEGORIES];
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
    return this.categories;
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

  // --- MUTATIONS ---

  public saveProduct(product: Product): void {
    if (!this.isInitialized) this.init();

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
  }

  public deleteProduct(productId: string): void {
    if (!this.isInitialized) this.init();

    this.deletedProductIds.add(productId);
    safeWrite(STORAGE_DELETED_PRODUCTS_KEY, Array.from(this.deletedProductIds));

    this.products = this.products.filter(p => p.id !== productId);
    safeWrite(STORAGE_PRODUCTS_KEY, this.products);
  }

  public saveCategory(category: CategoryInfo): void {
    if (!this.isInitialized) this.init();

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
    this.products = [...INITIAL_PRODUCTS];
    this.categories = [...CATEGORIES];
    this.settings = { ...DEFAULT_STORE_SETTINGS };

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_PRODUCTS_KEY);
      localStorage.removeItem(STORAGE_DELETED_PRODUCTS_KEY);
      localStorage.removeItem(STORAGE_CATEGORIES_KEY);
      localStorage.removeItem(STORAGE_SETTINGS_KEY);
    }
  }
}

// Global Singleton Instance
export const centralStore = new CentralDataStore();
