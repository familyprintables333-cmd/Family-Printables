/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { ReviewsModal } from './components/ReviewsModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ContactSupportModal } from './components/ContactSupportModal';
import { GuidesBlogSection } from './components/GuidesBlogSection';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Footer } from './components/Footer';
import { CATEGORIES } from './data/categories';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order, CategoryId, UserAccount, UserReview, MerchantSettings } from './types';
import { createAccessGrant, getProductAccessStatus, AccessGrant } from './utils/access';
import { getActiveSession, saveActiveSession, clearActiveSession, recordCompletedPurchase } from './utils/authStorage';
import { Sparkles, ShieldCheck, CheckCircle2, Printer } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'studio' | 'how-it-works' | 'guides' | 'etsy-kdp'>('catalog');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);

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
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);

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

  // Global Brand Logo state (auto-syncs across entire store and persists in localStorage)
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      const savedLogo = localStorage.getItem('fp_custom_logo');
      if (savedLogo) return savedLogo;
    } catch {
      // fallback
    }
    return '/logo.png';
  });

  const handleUpdateLogoUrl = (newLogo: string) => {
    const finalLogo = newLogo.trim() || '/logo.png';
    setLogoUrl(finalLogo);
    try {
      localStorage.setItem('fp_custom_logo', finalLogo);
    } catch {
      // fallback
    }
  };

  // Cart & Buy Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleInstantBuy = (product: Product) => {
    setCart([{ product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Order Completion - Single item protected unlock
  const handleOrderComplete = (orderData: {
    customerName: string;
    customerEmail: string;
    country: string;
    city: string;
    paymentMethod: 'card' | 'applepay' | 'googlepay' | 'stripe' | 'paypal' | 'payoneer';
    totalUSD: number;
    transactionId?: string;
  }) => {
    const purchasedIds = cart.map((i) => i.product.id);

    const newOrder: Order = {
      id: `FP-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      country: orderData.country,
      city: orderData.city,
      date: 'Just now',
      items: [...cart],
      totalUSD: orderData.totalUSD,
      paymentMethod: orderData.paymentMethod,
      downloadToken: `DL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    // Unlock purchased items in the user's personal vault with 90-day timer and persist
    const updatedAccount = recordCompletedPurchase(newOrder, {
      ...account,
      name: orderData.customerName,
      email: orderData.customerEmail,
    });
    setAccount(updatedAccount);

    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setCart([]);
  };

  // Toggle simulate expiration (for demo and automated test verification)
  const handleToggleSimulateExpiry = (productId: string) => {
    setAccount((prev) => {
      const existing = prev.purchasedAccess?.[productId];
      const newGrants = { ...(prev.purchasedAccess || {}) };
      if (!existing || new Date(existing.expiresAt).getTime() > Date.now()) {
        // Force expire: set expiration timestamp to yesterday
        newGrants[productId] = {
          purchasedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        };
      } else {
        // Reset to active 90-day access grant
        newGrants[productId] = createAccessGrant(90);
      }
      return {
        ...prev,
        purchasedAccess: newGrants,
      };
    });
  };

  // Renew access to an expired item
  const handleRenewAccess = (product: Product) => {
    setIsDownloadsOpen(false);
    handleInstantBuy(product);
  };

  // Verified re-download of strictly purchased workbook with 3-month access check
  const handleFreeDownload = (product: Product) => {
    // STRICT ACCESS & EXPIRATION LOCK: Verify item is purchased and 3-month access has not lapsed
    const accessStatus = getProductAccessStatus(product.id, account);
    if (!accessStatus.isUnlocked) {
      if (accessStatus.isExpired) {
        alert(`Access Expired: Your 3-month access to "${product.title}" has lapsed. Please renew your access to download.`);
      } else {
        alert('Access Locked: This workbook requires confirmed payment before download.');
      }
      handleInstantBuy(product);
      return;
    }

    const content = `==========================================================\nFAMILY PRINTABLES - VAULT SECURE DOWNLOAD\n==========================================================\nProduct: ${product.title}\nCategory: ${product.categoryLabel}\nTarget Age: ${product.targetAge}\nFormat: US Letter (8.5x11") & A4 PDF (300 DPI)\nStatus: UNLOCKED FOR ${account.email || 'CUSTOMER'}\nAccess Duration: 3 Months (90 Days) - ${accessStatus.daysRemaining} days remaining\nPrice Paid: $${product.priceUSD.toFixed(2)} USD\nVerification: 100% CONFIRMED PAYMENT & VERIFIED RECEIPT\n\nPRINTING GUIDE:\n1. Open in free Adobe Acrobat Reader or mobile browser.\n2. In printer settings, set Scale to 100% (Actual Size).\n3. Recommended paper: 28lb to 32lb bright white paper, or 65lb cardstock.\n4. For reusable dry-erase activities, slip sheets into plastic protectors or laminate.\n\nThank you for choosing Family Printables!\n==========================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_US_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Restore past purchases by email - STRICT: Only restores if verified paid order exists
  const handleRestorePurchases = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const matchingOrders = account.orderHistory.filter(
      (order) => order.customerEmail.trim().toLowerCase() === cleanEmail
    );

    if (matchingOrders.length === 0) {
      return false; // No paid purchases found, files remain strictly locked
    }

    const restoredIds: string[] = [];
    matchingOrders.forEach((o) => {
      o.items.forEach((item) => {
        restoredIds.push(item.product.id);
      });
    });

    const uniqueRestoredIds = Array.from(new Set(restoredIds));
    const restoredGrants: Record<string, AccessGrant> = { ...(account.purchasedAccess || {}) };
    uniqueRestoredIds.forEach((id) => {
      if (!restoredGrants[id]) {
        restoredGrants[id] = createAccessGrant(90);
      }
    });

    setAccount((prev) => ({
      ...prev,
      email: cleanEmail,
      isLoggedIn: true,
      purchasedProductIds: Array.from(new Set([...prev.purchasedProductIds, ...uniqueRestoredIds])),
      purchasedAccess: restoredGrants
    }));
    return true;
  };

  // Reviews submission
  const handleAddReview = (productId: string, review: UserReview) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const currentReviews = p.reviews || [];
        const updatedReviews = [review, ...currentReviews];
        const avgRating = parseFloat(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...p,
          rating: avgRating,
          reviewsCount: p.reviewsCount + 1,
          reviews: updatedReviews
        };
      })
    );
  };

  // Admin handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, priceUSD: newPrice } : p))
    );
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] text-slate-800 font-sans">
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
            <span>US Letter 8.5"x11" &amp; A4 PDFs</span>
            <span aria-hidden="true">·</span>
            <span>Credit Card · Apple Pay · Google Pay</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContactSupport={() => setIsContactSupportOpen(true)}
        account={account}
        currency={currency}
        setCurrency={setCurrency}
        onReturnToCategories={() => setSelectedCategoryId(null)}
        logoUrl={logoUrl}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <div>
            {/* If a category is selected: Show Sub-Category Product Listing View (Prices and Buy Buttons appear here ONLY!) */}
            {selectedCategoryId && activeCategoryObj ? (
              <CategoryDetailView
                category={activeCategoryObj}
                products={products}
                onBackToCategories={() => setSelectedCategoryId(null)}
                onPreviewProduct={(p) => setSelectedProduct(p)}
                onInstantBuy={(p) => handleInstantBuy(p)}
                onOpenReviews={(p) => setReviewProduct(p)}
                onFreeDownload={(p) => handleFreeDownload(p)}
                purchasedProductIds={account.purchasedProductIds}
                account={account}
                currency={currency}
              />
            ) : (
              /* If no category is selected: UNIFIED CLEAN TOP SECTION (BLUE THEME CONTAINER) WITH RESTORED HERO BANNER & CATEGORY CARDS DIRECTLY UNDERNEATH */
              <div>
                {/* 1. UNIFIED CLEAN TOP SECTION (BLUE THEME CONTAINER) */}
                <section className="bg-gradient-to-b from-[#0e2a47] via-[#0b1d33] to-[#081424] text-white border-b border-slate-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-20">
                    {/* Restored Hero Banner in its original prominent position at the top */}
                    <StoreHero />

                    {/* Category Cards: Neatly aligned directly underneath the main introduction without any 'QUICK JUMP' heading or fragmented boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {CATEGORIES.map((category) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          onSelect={(catId) => {
                            setSelectedCategoryId(catId);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>


                {/* 3. VALUE-PROPOSITIONS RIGHT ABOVE FOOTER */}
                <section className="bg-slate-50/90 border-t border-slate-200/70 py-12 sm:py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 3 Key Value-Prop Points Cleanly Adjusted */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          <Printer className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">1. Standard 8.5" x 11" &amp; A4 Formats</h4>
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

        {activeTab === 'studio' && <InteractiveTimetableStudio />}

        {activeTab === 'how-it-works' && (
          <HowItWorksExplainer
            onExploreProducts={() => {
              setSelectedCategoryId(null);
              setActiveTab('catalog');
            }}
          />
        )}

        {activeTab === 'guides' && (
          <GuidesBlogSection
            onBackToStore={() => {
              setSelectedCategoryId(null);
              setActiveTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
        isPurchased={selectedProduct ? account.purchasedProductIds.includes(selectedProduct.id) : false}
        isUnlocked={selectedProduct ? getProductAccessStatus(selectedProduct.id, account).isUnlocked : false}
        isExpired={selectedProduct ? getProductAccessStatus(selectedProduct.id, account).isExpired : false}
        daysRemaining={selectedProduct ? getProductAccessStatus(selectedProduct.id, account).daysRemaining : 0}
        currency={currency}
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

      {/* My Downloads Slide-Over Drawer */}
      <DownloadsDrawer
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
        products={products}
        account={account}
        onLoginClick={() => {
          setIsDownloadsOpen(false);
          setIsAuthOpen(true);
        }}
        onRestorePurchases={handleRestorePurchases}
        onRenewAccess={handleRenewAccess}
        onToggleSimulateExpiry={handleToggleSimulateExpiry}
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

      {/* Store Owner Mobile Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdatePrice={handleUpdatePrice}
        logoUrl={logoUrl}
        onUpdateLogoUrl={handleUpdateLogoUrl}
        merchantSettings={merchantSettings}
        onUpdateMerchantSettings={(newSettings) => {
          setMerchantSettings(newSettings);
          setCurrency(newSettings.currency);
        }}
      />

      {/* Footer with Educational Blog Hub, USA Business Address, and AI Support Desk */}
      <Footer
        onTabChange={(tab) => {
          setSelectedCategoryId(null);
          setActiveTab(tab);
        }}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId as CategoryId);
          setActiveTab('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContactSupport={() => setIsContactSupportOpen(true)}
        logoUrl={logoUrl}
      />
    </div>
  );
}
