import { Product } from '../types';

const STORAGE_GUMROAD_LINKS_KEY = 'fp_custom_gumroad_links';
const STORAGE_GUMROAD_BASE_URL_KEY = 'fp_gumroad_store_base_url';
const STORAGE_HTML_SNIPPETS_KEY = 'fp_custom_html_snippets';

export const DEFAULT_GUMROAD_BASE_URL = 'https://gumroad.com/l';

export interface HtmlSnippetRecord {
  id: string;
  title: string;
  category: 'gumroad' | 'banner' | 'embed' | 'analytics' | 'custom';
  code: string;
  updatedAt: string;
}

export const DEFAULT_HTML_SNIPPETS: HtmlSnippetRecord[] = [
  {
    id: 'gumroad-overlay-script',
    title: 'Gumroad In-App Overlay Script',
    category: 'gumroad',
    code: '<script src="https://gumroad.com/js/gumroad-embed.js"></script>',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'gumroad-buy-button',
    title: 'Standard In-App Gumroad Popup Button',
    category: 'gumroad',
    code: '<a class="gumroad-button" href="https://gumroad.com/l/familyprintables-all" data-gumroad-single-product="true">Buy Family Printables Bundle</a>',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'promo-announcement-banner',
    title: 'Top Announcement Banner HTML',
    category: 'banner',
    code: '<div style="background: linear-gradient(90deg, #4f46e5, #7c3aed); color: white; padding: 8px 16px; text-align: center; font-size: 13px; font-weight: bold; border-radius: 12px;">🎉 Special Offer: Download any 100% Free Timetable or Unlock the Elite Planners Bundle with Instant Gumroad In-App Delivery!</div>',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
];

export const getStoredGumroadBaseUrl = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_GUMROAD_BASE_URL_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return DEFAULT_GUMROAD_BASE_URL;
};

export const setStoredGumroadBaseUrl = (url: string): void => {
  try {
    localStorage.setItem(STORAGE_GUMROAD_BASE_URL_KEY, url.trim());
  } catch {}
};

export const getAllGumroadUrls = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(STORAGE_GUMROAD_LINKS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch {}
  return {};
};

export const setStoredGumroadUrl = (productId: string, url: string): void => {
  try {
    const existing = getAllGumroadUrls();
    existing[productId] = url.trim();
    localStorage.setItem(STORAGE_GUMROAD_LINKS_KEY, JSON.stringify(existing));
  } catch {}
};

export const saveAllGumroadUrls = (map: Record<string, string>): void => {
  try {
    localStorage.setItem(STORAGE_GUMROAD_LINKS_KEY, JSON.stringify(map));
  } catch {}
};

export const resolveProductGumroadUrl = (product: Product): string => {
  if (product.gumroadUrl && product.gumroadUrl.trim()) {
    return product.gumroadUrl.trim();
  }

  const map = getAllGumroadUrls();
  if (map[product.id] && map[product.id].trim()) {
    return map[product.id].trim();
  }

  const base = getStoredGumroadBaseUrl().replace(/\/+$/, '');
  const slug = product.id.replace(/^prod-/, '');
  return `${base}/familyprintables-${slug}`;
};

export const getStoredHtmlSnippets = (): HtmlSnippetRecord[] => {
  try {
    const saved = localStorage.getItem(STORAGE_HTML_SNIPPETS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_HTML_SNIPPETS;
};

export const saveStoredHtmlSnippets = (snippets: HtmlSnippetRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_HTML_SNIPPETS_KEY, JSON.stringify(snippets));
  } catch {}
};

/**
 * Ensures Gumroad embed script is loaded into the document DOM.
 */
export const ensureGumroadScriptLoaded = (): void => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector('script[src*="gumroad-embed.js"], script[src*="gumroad.js"]');
  if (!existing) {
    const script = document.createElement('script');
    script.src = 'https://gumroad.com/js/gumroad-embed.js';
    script.async = true;
    document.head.appendChild(script);
  }
};
