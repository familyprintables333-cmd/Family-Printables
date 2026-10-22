/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StoreHero } from './components/StoreHero';
import { CategoryCard } from './components/CategoryCard';
import { CategoryDetailView } from './components/CategoryDetailView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InteractiveTimetableStudio } from './components/InteractiveTimetableStudio';
import { HowItWorksExplainer } from './components/HowItWorksExplainer';
import { EtsyAmazonHub } from './components/EtsyAmazonHub';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { DownloadsDrawer } from './components/DownloadsDrawer';
import { UserAuthModal } from './components/UserAuthModal';
import { MandatorySignUpGateModal } from './components/MandatorySignUpGateModal';
import { ReviewsModal } from './components/ReviewsModal';
import { AdminPortal } from './components/AdminPortal';
import { ContactSupportModal } from './components/ContactSupportModal';
import { GuidesBlogSection } from './components/GuidesBlogSection';
import { LivePrintStudio } from './components/LivePrintStudio';
import { ReviewsAndRewards } from './components/ReviewsAndRewards';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { CATEGORIES } from './data/categories';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order, CategoryId, CategoryInfo, UserAccount, UserReview, MerchantSettings } from './types';
import { createAccessGrant, getProductAccessStatus, AccessGrant } from './utils/access';
import { getActiveSession, saveActiveSession, clearActiveSession, recordCompletedPurchase } from './utils/authStorage';
import { trackMonetizationEvent } from './utils/monetization';
import { ensureGumroadScriptLoaded } from './utils/gumroad';
import { downloadProductFileOffline } from './utils/offlineDownload';
import { MediaPlayerModal } from './components/MediaPlayerModal';
import { 
  fetchServerProducts, 
  fetchServerCategories,
  fetchServerSettings,
  syncSaveSettings,
  performFullSync, 
  subscribeToSyncEvents, 
  getLocalDeletedProductIds, 
  filterDeletedProducts,
  syncSaveProduct
} from './utils/syncService';
import { 
  testFirestoreConnection, 
  subscribeToCloudProducts, 
  subscribeToCloudCategories, 
  subscribeToCloudSettings,
  seedCloudDatabaseIfEmpty 
} from './lib/firebase';
import { centralStore, DEFAULT_STORE_SETTINGS } from './data/centralStore';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Home, 
  BookOpen, 
  Download, 
  ShoppingBag,
  LayoutGrid,
  MessageSquare
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'studio' | 'how-it-works' | 'guides' | 'reviews' | 'etsy-kdp'>('catalog');
  
  // Reward Points State
  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fp_user_reward_points');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 150;
  });

  // Persistent Categories state with full CRUD support
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('fp_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((cat: CategoryInfo) => {
            let title = cat.title || '';
            if (cat.id === 'routines' && (title === 'Family Routines & Visual Timetables' || !title)) {
              title = 'Elite Planners & Digital Guides';
            }
            title = title.replace(/\s*\([^)]*age[^)]*\)/gi, '').trim();
            const shortTitle = (cat.shortTitle || title).replace(/\s*\([^)]*age[^)]*\)/gi, '').trim();
            return {
              ...cat,
              title,
              shortTitle: cat.id === 'routines' ? 'Elite Planners & Digital Guides' : shortTitle
            };
          });
        }
      }
    } catch {}
    return CATEGORIES;
  });

  // Persistent Products with custom flexible price support & permanent deletion guarantee
  const [products, setProducts] = useState<Product[]>(() => {
    const deletedSet = new Set(getLocalDeletedProductIds());
    try {
      const saved = localStorage.getItem('fp_custom_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((p: Product) => !deletedSet.has(p.id))
            .map((p: Product) => {
              if (p.category === 'routines' && p.categoryLabel === 'Family Routines & Visual Timetables') {
                return { ...p, categoryLabel: 'Elite Planners & Digital Guides' };
              }
              return p;
            });
        }
      }
    } catch {}
    return PRODUCTS.filter(p => !deletedSet.has(p.id));
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);

  // Hidden Admin Route Detection (/admin or #admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.toLowerCase();

      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
        setIsAdminRoute(true);
        return;
      }

      setIsAdminRoute(false);

      if (hash === '#studio' || hash === '#timetables' || hash === '#printable-studio') {
        setActiveTab('studio');
        setSelectedCategoryId(null);
      } else if (hash === '#reviews' || hash === '#rewards' || hash === '#testimonials') {
        setActiveTab('reviews');
        setSelectedCategoryId(null);
      } else if (hash === '#how-it-works') {
        setActiveTab('how-it-works');
        setSelectedCategoryId(null);
      } else if (hash === '#guides' || hash === '#blog') {
        setActiveTab('guides');
        setSelectedCategoryId(null);
      } else if (hash === '#etsy-kdp' || hash === '#kdp') {
        setActiveTab('etsy-kdp');
        setSelectedCategoryId(null);
      } else if (hash.startsWith('#category-')) {
        const catId = hash.replace('#category-', '') as CategoryId;
        const exists = categories.some((c) => c.id === catId);
        if (exists) {
          setSelectedCategoryId(catId);
          setActiveTab('catalog');
        }
      }
    };

    // Run on initial mount
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [categories]);

  // Ensure Gumroad In-App Overlay Script is Active
  useEffect(() => {
    ensureGumroadScriptLoaded();
  }, []);

  // Active real-time Cloud Database synchronization & permanent cross-device sync
  useEffect(() => {
    // 1. Validate connection and auto-seed cloud database if initial boot
    testFirestoreConnection();
    seedCloudDatabaseIfEmpty(PRODUCTS, CATEGORIES, DEFAULT_STORE_SETTINGS);

    // 2. Real-time Cloud Firestore subscriptions (instantly syncs across all devices globally)
    const unsubProducts = subscribeToCloudProducts((cloudProducts) => {
      if (Array.isArray(cloudProducts)) {
        setProducts(cloudProducts);
        centralStore.setProductsFromCloud(cloudProducts);
      }
    });

    const unsubCategories = subscribeToCloudCategories((cloudCategories) => {
      if (Array.isArray(cloudCategories)) {
        setCategories(cloudCategories);
        centralStore.setCategoriesFromCloud(cloudCategories);
      }
    });

    const unsubSettings = subscribeToCloudSettings((cloudSettings) => {
      if (cloudSettings) {
        setMerchantSettings((prev) => ({ ...prev, ...cloudSettings }));
        centralStore.setSettingsFromCloud(cloudSettings);
        if (cloudSettings.logoUrl) {
          setLogoUrl(cloudSettings.logoUrl);
        }
        if (cloudSettings.currency) {
          setCurrency(cloudSettings.currency);
        }
      }
    });

    // 3. Fallback server/local initial fetches
    fetchServerProducts(PRODUCTS).then((serverProds) => {
      if (serverProds && serverProds.length > 0) {
        setProducts(serverProds);
      }
    });

    fetchServerCategories(CATEGORIES).then((serverCats) => {
      if (serverCats && serverCats.length > 0) {
        setCategories(serverCats);
      }
    });

    fetchServerSettings().then((serverSettings) => {
      if (serverSettings) {
        setMerchantSettings((prev) => ({ ...prev, ...serverSettings }));
        if (serverSettings.logoUrl) {
          setLogoUrl(serverSettings.logoUrl);
          try {
            localStorage.setItem('fp_custom_logo', serverSettings.logoUrl);
          } catch {}
        }
        if (serverSettings.currency) {
          setCurrency(serverSettings.currency);
        }
      }
    });

    // 4. Real-time multi-tab & cross-window sync listener
    const unsubscribe = subscribeToSyncEvents((event) => {
      if (event.type === 'PRODUCT_SAVED') {
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === event.product.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = event.product;
            return next;
          }
          return [event.product, ...prev];
        });
      } else if (event.type === 'PRODUCT_DELETED') {
        setProducts((prev) => prev.filter((p) => p.id !== event.productId));
      } else if (event.type === 'STORAGE_UPDATED') {
        const deletedSet = new Set(getLocalDeletedProductIds());
        try {
          const saved = localStorage.getItem('fp_custom_products');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setProducts(parsed.filter((p: Product) => !deletedSet.has(p.id)));
            }
          }
        } catch {}
      }
    });

    // 5. Sync when window regains focus or comes back online
    const handleSync = () => {
      performFullSync(products, (data) => {
        if (data.products) setProducts(data.products);
      });
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('online', handleSync);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
      unsubscribe();
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('online', handleSync);
    };
  }, []);

  // Synchronize High-Impact SEO Page Titles & Meta Descriptions across Views
  useEffect(() => {
    let title = 'Smart Digital Printables for Families & Business | Family Printables';
    let desc = 'Instantly download 100% free single-page daily timetables, productivity planners, and business sales ledgers in Standard A4 & Universal formats, alongside premium kids\' learning workbooks and greeting cards.';

    if (isAdminRoute) {
      title = 'Store Admin Console & Revenue Dashboard | Family Printables';
      desc = 'Owner control portal for dynamic pricing, workbook locking, monetization tracking, and catalog management.';
    } else if (activeTab === 'studio') {
      title = 'Free Printable Timetable & Custom Schedule Studio (300 DPI) | Family Printables';
      desc = 'Design and print free daily schedules, study timetables, weekly routine charts, and habit trackers in 300 DPI high resolution.';
    } else if (activeTab === 'catalog' && selectedCategoryId) {
      const catObj = categories.find((c) => c.id === selectedCategoryId);
      if (catObj) {
        title = `${catObj.title} - Printable PDF Workbooks | Family Printables`;
        desc = `${catObj.description} Instant download in Standard A4 & Universal 300 DPI formats.`;
      }
    } else if (activeTab === 'reviews') {
      title = 'Customer Ratings, Verified Reviews & Rewards Program | Family Printables';
      desc = 'Read authentic feedback from parents, teachers, and shop owners. Submit your review to earn reward points.';
    } else if (activeTab === 'guides') {
      title = 'Printing & Lamination Master Guides | Family Printables';
      desc = 'Expert advice on printing 300 DPI PDFs, choosing cardstock paper, and laminating for dry-erase reuse.';
    } else if (activeTab === 'how-it-works') {
      title = 'How It Works: Instant 300 DPI Digital Downloads & Access Vault | Family Printables';
      desc = 'Learn how to purchase, download, and reprint your educational workbooks with 90 days vault access.';
    } else if (activeTab === 'etsy-kdp') {
      title = 'Etsy & Amazon KDP Seller Export Hub | Family Printables';
      desc = 'Commercial licensing, high-res PDF exports, and metadata tools for digital printable sellers.';
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', desc);
  }, [activeTab, selectedCategoryId, isAdminRoute, categories]);

  // User Account & My Downloads Vault state (Persistent via authStorage)
  const [account, setAccount] = useState<UserAccount>(() => getActiveSession());

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Drawers and Modals
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [activeMediaProduct, setActiveMediaProduct] = useState<Product | null>(null);

  // Mandatory Sign-Up Gate State (Requires Full Name & Gmail before any download or print)
  const [isSignUpGateOpen, setIsSignUpGateOpen] = useState(false);
  const [pendingGateAction, setPendingGateAction] = useState<{
    type: 'download' | 'print' | 'checkout';
    title?: string;
    onProceed: (authAccount: UserAccount) => void;
  } | null>(null);

  const requireAuthGate = (
    actionType: 'download' | 'print' | 'checkout',
    actionTitle: string,
    onProceed: (authAccount: UserAccount) => void
  ) => {
    if (account.isLoggedIn && account.email && account.name) {
      onProceed(account);
      return;
    }
    setPendingGateAction({
      type: actionType,
      title: actionTitle,
      onProceed,
    });
    setIsSignUpGateOpen(true);
  };

  // Merchant & Payoneer Payout Settings state
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(() => {
    try {
      const saved = localStorage.getItem('fp_merchant_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      payoneerEmail: 'merchant.payments@familyprintables.com',
      payoneerAccountId: 'PAY-8829-4102',
      receivingAccountNumber: '984210384729',
      routingNumber: '021000021',
      bankName: 'First Century Bank (US Receiving Account)',
      gatewayMode: 'test',
      currency: 'USD'
    };
  });

  // Multi-Currency (USD, INR, PKR, EUR, GBP, AED, CAD)
  const [currency, setCurrency] = useState(() => merchantSettings.currency || 'USD');

  // Dynamically apply Custom CSS injected via Admin Portal
  useEffect(() => {
    const css = merchantSettings.customCode?.customCss;
    let styleEl = document.getElementById('fp-custom-css');
    if (css && css.trim()) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'fp-custom-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;
    } else if (styleEl) {
      styleEl.remove();
    }
  }, [merchantSettings.customCode?.customCss]);

  // Global Brand Logo state (persists in localStorage)
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      const savedLogo = localStorage.getItem('fp_custom_logo');
      if (savedLogo) return savedLogo;
    } catch {}
    return '/logo.png';
  });

  const handleUpdateLogoUrl = (newLogo: string) => {
    const finalLogo = newLogo.trim() || '/logo.png';
    setLogoUrl(finalLogo);
    try {
      localStorage.setItem('fp_custom_logo', finalLogo);
    } catch {}
    syncSaveSettings({ logoUrl: finalLogo });
  };

  // Cart & Buy Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleInstantBuy = (product: Product) => {
    setCart([{ product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  // Order Complete Handler
  const handleOrderComplete = (orderData: {
    customerName: string;
    customerEmail: string;
    country: string;
    city: string;
    paymentMethod: any;
    totalUSD: number;
    transactionId?: string;
  }) => {
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      items: [...cart],
      totalUSD: orderData.totalUSD,
      currency,
      totalConverted: orderData.totalUSD,
      paymentMethod: orderData.paymentMethod,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'completed',
      downloadToken: `DL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      country: orderData.country,
      city: orderData.city,
      transactionId: orderData.transactionId || `TXN-${Date.now()}`,
    };

    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setCart([]);

    // Track Monetization Event for Owner Revenue Dashboard
    trackMonetizationEvent(
      'workbook_sale',
      `Workbook Order: #${newOrder.id.slice(-6)}`,
      newOrder.totalUSD,
      `${newOrder.items.length} item(s) purchased by ${newOrder.customerName}`
    );

    // Persist completed purchase & 90-day access grants in account
    const updatedAccount = recordCompletedPurchase(newOrder, account);
    setAccount(updatedAccount);
  };

  // Instant File Download Handler with Mandatory Sign-Up Gate
  const executeDownload = (product: Product, currentAccount: UserAccount) => {
    const accessStatus = getProductAccessStatus(product.id, currentAccount, product);

    if (!accessStatus.isUnlocked) {
      if (accessStatus.isExpired) {
        alert(`Access Expired: Your 3-month access to "${product.title}" has lapsed. Please renew your access to download.`);
      } else {
        alert('Access Locked: This workbook requires confirmed payment before download.');
      }
      handleInstantBuy(product);
      return;
    }

    // 100% Offline in-memory Standard A4 300 DPI PDF generation with zero network requests
    downloadProductFileOffline(product, 'Standard_A4_PDF');
  };

  const handleFreeDownload = (product: Product) => {
    // Direct, smooth automatic download without Gumroad 404 checkout errors
    downloadProductFileOffline(product, 'Standard_A4_PDF');
  };

  // Product-specific review submission with cross-device sync
  const handleAddReview = (productId: string, review: UserReview) => {
    let updatedProduct: Product | undefined;
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      const currentReviews = p.userReviews || [];
      const updatedReviews = [review, ...currentReviews];
      const avgRating = parseFloat(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
      );
      updatedProduct = {
        ...p,
        rating: avgRating,
        reviewsCount: updatedReviews.length,
        userReviews: updatedReviews
      };
      return updatedProduct;
    });
    setProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}

    if (updatedProduct) {
      syncSaveProduct(updatedProduct);
    }

    // Persist review to server
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...review, productId })
    }).catch(() => {});

    trackMonetizationEvent(
      'review_submitted',
      `Verified Customer Review: ${review.author || 'User'}`,
      0.10,
      `Rated ${review.rating} Stars`
    );
  };

  const handleTabChange = (tab: 'catalog' | 'studio' | 'how-it-works' | 'guides' | 'reviews' | 'etsy-kdp') => {
    setSelectedCategoryId(null);
    setActiveTab(tab);
    if (tab === 'catalog') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = `#${tab}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategoryId(catId);
    setActiveTab('catalog');
    window.location.hash = `#category-${catId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  // Cart count & Unlocked download count for mobile badges
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unlockedCount = (account.purchasedProductIds || []).filter((id) => {
    return getProductAccessStatus(id, account).isUnlocked;
  }).length;

  // --------------------------------------------------------------------------
  // SECURE HIDDEN ADMIN ROUTE (/admin or #admin)
  // Regular users will NEVER see this view on normal routes!
  // --------------------------------------------------------------------------
  if (isAdminRoute) {
    return (
      <AdminPortal
        products={products}
        onUpdateProducts={(updated) => {
          setProducts(updated);
          try {
            localStorage.setItem('fp_custom_products', JSON.stringify(updated));
          } catch {}
        }}
        categories={categories}
        onUpdateCategories={(updated) => {
          setCategories(updated);
          try {
            localStorage.setItem('fp_custom_categories', JSON.stringify(updated));
          } catch {}
        }}
        merchantSettings={merchantSettings}
        onUpdateMerchantSettings={(newSettings) => {
          setMerchantSettings(newSettings);
          setCurrency(newSettings.currency);
          if (newSettings.logoUrl && newSettings.logoUrl !== logoUrl) {
            setLogoUrl(newSettings.logoUrl);
            try {
              localStorage.setItem('fp_custom_logo', newSettings.logoUrl);
            } catch {}
          }
          try {
            localStorage.setItem('fp_merchant_settings', JSON.stringify(newSettings));
          } catch {}
          syncSaveSettings(newSettings);
        }}
        logoUrl={logoUrl}
        onUpdateLogoUrl={handleUpdateLogoUrl}
        currency={currency}
        orders={account.orders || []}
        onClose={() => {
          setIsAdminRoute(false);
          if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
            window.history.pushState(null, '', '/');
          } else {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC-FACING INTERFACE (Standard Mobile & Desktop Web App View)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] text-slate-800 font-sans pb-16 md:pb-0">
      {/* PWA Home-Screen Install Banner for Android and iOS */}
      <PWAInstallBanner />


      {/* Top Banner Notice: Free Delivery & Standard Info */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white text-[11px] sm:text-xs">
              Instant 24/7 Global Digital Delivery · No Physical Shipping Required
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Standard A4 &amp; Universal PDFs</span>
            <span aria-hidden="true">·</span>
            <span>Credit Card · Apple Pay · Google Pay</span>
          </div>
        </div>
      </div>

      {/* Clean Public Navigation Bar (Zero Admin Controls) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenContactSupport={() => setIsContactSupportOpen(true)}
        account={account}
        currency={currency}
        setCurrency={setCurrency}
        onReturnToCategories={handleBackToCategories}
        logoUrl={logoUrl}
        userPoints={userPoints}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <div>
            {/* If a category is selected: Show Sub-Category Product Listing View */}
            {selectedCategoryId && activeCategoryObj ? (
              <CategoryDetailView
                category={activeCategoryObj}
                products={products}
                onBackToCategories={handleBackToCategories}
                onPreviewProduct={(p) => setSelectedProduct(p)}
                onInstantBuy={(p) => handleInstantBuy(p)}
                onOpenReviews={(p) => setReviewProduct(p)}
                onFreeDownload={(p) => handleFreeDownload(p)}
                purchasedProductIds={account.purchasedProductIds}
                account={account}
                currency={currency}
              />
            ) : (
              /* Public Home Page: Hero Banner, Category Cards & Value Props */
              <div>
                <section className="bg-gradient-to-b from-[#0e2a47] via-[#0b1d33] to-[#081424] text-white border-b border-slate-800">
                  <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-5 sm:pt-12 pb-8 sm:pb-16">
                    <StoreHero
                      currency={currency}
                      storeName={merchantSettings.storeName}
                      storeTagline={merchantSettings.storeTagline}
                      onQuickNav={(target) => {
                        if (target.startsWith('category-')) {
                          handleSelectCategory(target.replace('category-', '') as CategoryId);
                        } else {
                          handleTabChange(target as any);
                        }
                      }}
                    />

                    {/* Category Cards (Dynamic from persistent state) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
                      {categories.map((category) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          onSelect={handleSelectCategory}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Value Propositions */}
                <section className="bg-slate-50/90 border-t border-slate-200/70 py-12 sm:py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          <Printer className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">1. Standard A4 &amp; Universal Formats</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Crystal-clear vector print quality. Reuse workbooks repeatedly with dry-erase plastic sleeves.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">2. Instant 24/7 Digital Access</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Download files instantly after checkout and keep them safely stored in your personal download vault for 90 days.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">3. 3-Month Access &amp; Easy Re-prints</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Easily re-download fresh clean copies anytime across all your phones, tablets, and computers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* Interactive Live Print Studio */}
        {activeTab === 'studio' && (
          <LivePrintStudio 
            currency={currency} 
            isUnlockedDefault={true}
            account={account}
            onRequireSignUp={(type, callback) => {
              requireAuthGate(type, 'Printable Studio Document', callback);
            }}
            onTemplateExported={(tplId) => {
              trackMonetizationEvent(
                'template_export',
                `Printable Template Exported: ${tplId}`,
                0.05,
                'Single-page 300 DPI PDF print'
              );
            }}
          />
        )}

        {/* Dedicated Ratings, Reviews & Earn Points Tab */}
        {activeTab === 'reviews' && (
          <div className="pt-6">
            <ReviewsAndRewards
              onPointsUpdated={(newPts) => setUserPoints(newPts)}
              onExploreTemplates={() => handleTabChange('studio')}
            />
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksExplainer
            onExploreProducts={() => handleTabChange('catalog')}
          />
        )}

        {activeTab === 'guides' && (
          <GuidesBlogSection
            onBackToStore={() => handleTabChange('catalog')}
            onSelectCategory={(catId) => handleSelectCategory(catId as CategoryId)}
          />
        )}

        {activeTab === 'etsy-kdp' && <EtsyAmazonHub />}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
        onOpenReviews={(p) => setReviewProduct(p)}
        onFreeDownload={handleFreeDownload}
        onPlayMedia={(p) => setActiveMediaProduct(p)}
        onAddReview={handleAddReview}
        isPurchased={selectedProduct ? account.purchasedProductIds.includes(selectedProduct.id) : false}
        isUnlocked={selectedProduct ? getProductAccessStatus(selectedProduct.id, account).isUnlocked : false}
        isExpired={selectedProduct ? getProductAccessStatus(selectedProduct.id, account).isExpired : false}
        daysRemaining={selectedProduct ? getProductAccessStatus(selectedProduct.id, account).daysRemaining : 0}
        currency={currency}
      />

      {/* Built-In In-App Audio & Video Player Modal */}
      <MediaPlayerModal
        product={activeMediaProduct}
        onClose={() => setActiveMediaProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => setIsCheckoutOpen(true)}
        currency={currency}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderComplete={handleOrderComplete}
        currency={currency}
        merchantSettings={merchantSettings}
        logoUrl={logoUrl}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        currency={currency}
        logoUrl={logoUrl}
      />

      <DownloadsDrawer
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
        products={products}
        account={account}
        onLoginClick={() => setIsAuthOpen(true)}
        onRenewAccess={(product) => handleInstantBuy(product)}
        onRequireSignUp={(type, callback) => {
          requireAuthGate(type, 'Vault Item Download', callback);
        }}
        logoUrl={logoUrl}
        onOpenTimetableStudio={() => handleTabChange('studio')}
      />

      {/* Mandatory Sign-Up Gate Modal (Full Name + Gmail required before download/print) */}
      <MandatorySignUpGateModal
        isOpen={isSignUpGateOpen}
        onClose={() => {
          setIsSignUpGateOpen(false);
          setPendingGateAction(null);
        }}
        onSuccess={(registeredAcc) => {
          setAccount(registeredAcc);
          saveActiveSession(registeredAcc);
          if (pendingGateAction?.onProceed) {
            pendingGateAction.onProceed(registeredAcc);
          }
          setPendingGateAction(null);
        }}
        actionTitle={pendingGateAction?.title || 'this item'}
        actionType={pendingGateAction?.type || 'download'}
        logoUrl={logoUrl}
      />

      {/* User Login & Register Modal with persistent Auth */}
      <UserAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        account={account}
        onAuthSuccess={(newAcc) => {
          setAccount(newAcc);
          saveActiveSession(newAcc);
        }}
        onLogout={() => {
          clearActiveSession();
          setAccount(getActiveSession());
        }}
        logoUrl={logoUrl}
      />

      {/* 24/7 AI Auto-Response Customer Care & USA Business Office Modal */}
      <ContactSupportModal
        isOpen={isContactSupportOpen}
        onClose={() => setIsContactSupportOpen(false)}
        logoUrl={logoUrl}
      />

      {/* Ratings & Reviews Modal */}
      <ReviewsModal
        product={reviewProduct}
        onClose={() => setReviewProduct(null)}
        onAddReview={handleAddReview}
      />

      {/* Owner Monetization & Sponsor Supplies Slot */}
      <AdBanner position="footer-top" />

      {/* Professional Legal Footer */}
      <Footer
        onTabChange={handleTabChange}
        onSelectCategory={(catId) => handleSelectCategory(catId as CategoryId)}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        onOpenContactSupport={() => setIsContactSupportOpen(true)}
        logoUrl={logoUrl}
      />

      {/* =================================================================== */}
      {/* LOCKED BOTTOM APP MENU BAR (Zero Truncation - Full Labels Fit 100%) */}
      {/* =================================================================== */}
      <nav 
        aria-label="App Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1 sm:py-1.5 px-1 sm:px-3 shadow-xl no-print pb-[max(0.35rem,env(safe-area-inset-bottom))]"
        style={{ width: '100%', overflowX: 'hidden' }}
      >
        <div 
          className="w-full max-w-sm sm:max-w-md mx-auto grid grid-cols-4 gap-1 items-center"
        >
          {/* 1. Catalog */}
          <button
            onClick={() => handleTabChange('catalog')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 sm:px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Curated Collections"
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-none tracking-tight whitespace-nowrap">Collections</span>
          </button>

          {/* 2. Downloads Vault */}
          <button
            onClick={() => setIsDownloadsOpen(true)}
            className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 sm:px-1 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all cursor-pointer"
            title="My Downloads Vault"
          >
            <Download className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-none tracking-tight whitespace-nowrap">Vault</span>
            {unlockedCount > 0 && (
              <span className="absolute top-0.5 right-1.5 bg-emerald-600 text-white text-[8px] font-black px-1 rounded-full tabular-nums shadow-2xs">
                {unlockedCount}
              </span>
            )}
          </button>

          {/* 3. Studio */}
          <button
            onClick={() => handleTabChange('studio')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 sm:px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Live Printable Studio"
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-none tracking-tight whitespace-nowrap">Studio</span>
          </button>

          {/* 4. Support */}
          <button
            onClick={() => setIsContactSupportOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 sm:px-1 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all active:scale-95 cursor-pointer"
            title="Customer Support Desk"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-none tracking-tight whitespace-nowrap">Support</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
