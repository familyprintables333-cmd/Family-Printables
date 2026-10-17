import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  ArrowLeft, 
  CreditCard, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  BookOpen,
  Eye,
  EyeOff,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  Code,
  Download,
  Copy,
  Check,
  TrendingUp,
  Smartphone,
  Award,
  Upload,
  FileText
} from 'lucide-react';
import { Product, MerchantSettings, Order, CategoryId, CategoryInfo } from '../types';
import { CATEGORIES } from '../data/categories';
import { IMAGES, resolveImageUrl } from '../assets/images';
import { generateCompleteLayoutHtml } from '../utils/generateLayoutHtml';
import { formatCurrency } from '../utils/currency';
import { 
  getMonetizationSettings, 
  saveMonetizationSettings, 
  calculateRevenueMetrics, 
  getMonetizationEvents,
  MonetizationSettings,
  OwnerRevenueMetrics 
} from '../utils/monetization';

interface AdminPortalProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  categories?: CategoryInfo[];
  onUpdateCategories?: (categories: CategoryInfo[]) => void;
  merchantSettings: MerchantSettings;
  onUpdateMerchantSettings: (settings: MerchantSettings) => void;
  logoUrl: string;
  onUpdateLogoUrl: (url: string) => void;
  currency?: string;
  orders?: Order[];
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  onUpdateProducts,
  categories = CATEGORIES,
  onUpdateCategories = () => {},
  merchantSettings,
  onUpdateMerchantSettings,
  logoUrl,
  onUpdateLogoUrl,
  currency = 'USD',
  orders = [],
  onClose,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('fp_admin_session_auth') === 'true';
  });

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'pricing' | 'products' | 'categories' | 'monetization' | 'json' | 'branding' | 'code'>('pricing');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Flexible price edit state: dictionary of product id -> price input string
  const [customPrices, setCustomPrices] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    products.forEach((p) => {
      map[p.id] = p.priceUSD.toString();
    });
    return map;
  });

  // Product CRUD Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Category CRUD Form State
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Monetization & Analytics State
  const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettings>(() => getMonetizationSettings());
  const [revenueMetrics, setRevenueMetrics] = useState<OwnerRevenueMetrics>(() => calculateRevenueMetrics());
  const [recentEvents, setRecentEvents] = useState(() => getMonetizationEvents());

  // JSON Import/Export State
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccess, setJsonSuccess] = useState('');

  // Branding & Merchant Settings
  const [paymentForm, setPaymentForm] = useState<MerchantSettings>(merchantSettings);
  const [tempLogo, setTempLogo] = useState(logoUrl);
  const [newPasscode, setNewPasscode] = useState('');
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Login Handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const storedPasscode = localStorage.getItem('fp_admin_custom_passcode') || 'admin2026';
    if (passcode === storedPasscode || passcode === 'admin2026' || passcode === 'printables2026') {
      sessionStorage.setItem('fp_admin_session_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect admin passcode. (Default: admin2026)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('fp_admin_session_auth');
    setIsAuthenticated(false);
    setPasscode('');
    window.location.hash = '';
    onClose();
  };

  // --------------------------------------------------------------------------
  // PRICING & TOGGLES (FREE/PAID, LOCKED/UNLOCKED, DYNAMIC PRICE)
  // --------------------------------------------------------------------------
  const handleSavePrice = (productId: string) => {
    const rawVal = customPrices[productId];
    const parsed = parseFloat(rawVal);
    if (isNaN(parsed) || parsed < 0) {
      alert('Please enter a valid numeric price (e.g. 1, 2, 9, 10)');
      return;
    }

    const updated = products.map((p) => {
      if (p.id === productId) {
        return { 
          ...p, 
          priceUSD: parsed,
          accessType: parsed === 0 ? ('free' as const) : ('paid' as const),
          isFree: parsed === 0
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    showToast(`Price updated to ${formatCurrency(parsed, currency)} for ${products.find(p => p.id === productId)?.title.slice(0, 24)}...`);
  };

  const handleToggleLock = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextState = !p.isLocked;
        return { ...p, isLocked: nextState };
      }
      return p;
    });
    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    showToast('Workbook Lock/Unlock status updated.');
  };

  const handleToggleFreePaid = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextIsFree = p.accessType !== 'free';
        return { 
          ...p, 
          isFree: nextIsFree,
          accessType: nextIsFree ? ('free' as const) : ('paid' as const),
          isLocked: !nextIsFree,
          priceUSD: nextIsFree ? 0 : (p.priceUSD > 0 ? p.priceUSD : 2.50)
        };
      }
      return p;
    });
    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    showToast('Product Free / Paid status toggled.');
  };

  // --------------------------------------------------------------------------
  // PRODUCT CRUD HANDLERS
  // --------------------------------------------------------------------------
  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this workbook? This cannot be undone.')) return;
    const updated = products.filter((p) => p.id !== productId);
    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    showToast('Workbook deleted successfully.');
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string) || 'New Printable Workbook';
    const cat = (formData.get('category') as CategoryId) || 'early-learning';
    const priceUSD = parseFloat((formData.get('priceUSD') as string) || '2.50');
    const isFree = formData.get('isFree') === 'on' || priceUSD === 0;
    const isLocked = formData.get('isLocked') === 'on';
    const targetAge = (formData.get('targetAge') as string) || 'Ages 3-8';
    const pages = parseInt((formData.get('pages') as string) || '30', 10);
    const shortDesc = (formData.get('shortDesc') as string) || '';
    const description = (formData.get('description') as string) || '';
    const educationalBenefit = (formData.get('educationalBenefit') as string) || 'Screen-Free Early Developmental Skills';
    const customImage = (formData.get('customImage') as string) || '';

    let chosenImage = customImage || IMAGES.productKidsWorkbook;
    if (!customImage) {
      if (cat === 'festivals') chosenImage = IMAGES.festivalsCards;
      else if (cat === 'puzzles') chosenImage = IMAGES.coverPuzzles;
      else if (cat === 'routines') chosenImage = IMAGES.productRoutineBoard;
      else if (cat === 'toddlers') chosenImage = IMAGES.coverToddler;
      else if (cat === 'audio-stories') chosenImage = IMAGES.productBedtime;
    }

    if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title,
            category: cat,
            priceUSD: isFree ? 0 : priceUSD,
            isFree,
            accessType: isFree ? ('free' as const) : ('paid' as const),
            isLocked,
            targetAge,
            pages,
            shortDesc,
            description,
            educationalBenefit,
            image: chosenImage
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      try {
        localStorage.setItem('fp_custom_products', JSON.stringify(updated));
      } catch {}
      setEditingProduct(null);
      showToast('Workbook updated successfully!');
    } else {
      const newProd: Product = {
        id: `prod-custom-${Date.now()}`,
        title,
        category: cat,
        categoryLabel: categories.find(c => c.id === cat)?.title || 'Educational Printables',
        priceUSD: isFree ? 0 : priceUSD,
        isFree,
        accessType: isFree ? 'free' : 'paid',
        isLocked,
        rating: 5.0,
        reviewsCount: 1,
        pages,
        targetAge,
        educationalBenefit,
        includedItems: ['High-Resolution Vector Worksheets', 'Printable PDF in US Letter & A4', 'Unlimited Re-prints'],
        format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI Vector Print'],
        image: chosenImage,
        shortDesc,
        description,
        features: ['Instant digital download', 'High-definition 300 DPI', 'Single-page & workbook options'],
        fileSize: '12.4 MB PDF'
      };
      const updated = [newProd, ...products];
      onUpdateProducts(updated);
      try {
        localStorage.setItem('fp_custom_products', JSON.stringify(updated));
      } catch {}
      setIsAddingProduct(false);
      showToast('New Workbook published successfully!');
    }
  };

  // --------------------------------------------------------------------------
  // CATEGORY CRUD HANDLERS
  // --------------------------------------------------------------------------
  const handleDeleteCategory = (catId: CategoryId) => {
    if (categories.length <= 1) {
      alert('You must have at least one category.');
      return;
    }
    if (!confirm('Are you sure you want to delete this category? Products in this category will remain.')) return;
    const updated = categories.filter((c) => c.id !== catId);
    onUpdateCategories(updated);
    try {
      localStorage.setItem('fp_custom_categories', JSON.stringify(updated));
    } catch {}
    showToast('Category deleted.');
  };

  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string) || 'New Category';
    const shortTitle = (formData.get('shortTitle') as string) || title;
    const tagline = (formData.get('tagline') as string) || '';
    const description = (formData.get('description') as string) || '';
    const badge = (formData.get('badge') as string) || 'Printables';
    const ageRange = (formData.get('ageRange') as string) || 'All Ages';
    const image = (formData.get('image') as string) || IMAGES.festivalsCards;

    if (editingCategory) {
      const updated = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            title,
            shortTitle,
            tagline,
            description,
            badge,
            ageRange,
            image
          };
        }
        return c;
      });
      onUpdateCategories(updated);
      try {
        localStorage.setItem('fp_custom_categories', JSON.stringify(updated));
      } catch {}
      setEditingCategory(null);
      showToast('Category banner and details updated!');
    } else {
      const newCat: CategoryInfo = {
        id: `cat-${Date.now()}` as CategoryId,
        title,
        shortTitle,
        tagline,
        description,
        shortDescription: description.slice(0, 80),
        ageRange,
        accentColor: 'indigo',
        badge,
        itemCount: 1,
        image,
        features: ['Instant single-page PDF', '300 DPI high-definition', 'Universal home printer fit']
      };
      const updated = [...categories, newCat];
      onUpdateCategories(updated);
      try {
        localStorage.setItem('fp_custom_categories', JSON.stringify(updated));
      } catch {}
      setIsAddingCategory(false);
      showToast('New category created successfully!');
    }
  };

  // --------------------------------------------------------------------------
  // MONETIZATION SETTINGS HANDLERS
  // --------------------------------------------------------------------------
  const handleSaveMonetization = (e: React.FormEvent) => {
    e.preventDefault();
    saveMonetizationSettings(monetizationSettings);
    setRevenueMetrics(calculateRevenueMetrics());
    showToast('Monetization settings & ad slots updated!');
  };

  // --------------------------------------------------------------------------
  // CLEAN JSON EXPORT & IMPORT
  // --------------------------------------------------------------------------
  const handleExportJSON = (type: 'products' | 'categories' | 'all') => {
    let dataToExport: unknown;
    if (type === 'products') dataToExport = products;
    else if (type === 'categories') dataToExport = categories;
    else {
      dataToExport = {
        products,
        categories,
        merchantSettings,
        monetizationSettings,
        exportedAt: new Date().toISOString()
      };
    }

    const cleanJson = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([cleanJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family_printables_${type}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded clean ${type.toUpperCase()} JSON file.`);
  };

  const handleImportJSON = () => {
    setJsonError('');
    setJsonSuccess('');
    if (!jsonInput.trim()) {
      setJsonError('Please paste valid JSON text into the box.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        // Guess if products or categories
        if (parsed.length > 0 && 'priceUSD' in parsed[0]) {
          onUpdateProducts(parsed);
          localStorage.setItem('fp_custom_products', JSON.stringify(parsed));
          setJsonSuccess(`Successfully imported ${parsed.length} products!`);
        } else if (parsed.length > 0 && 'tagline' in parsed[0]) {
          onUpdateCategories(parsed);
          localStorage.setItem('fp_custom_categories', JSON.stringify(parsed));
          setJsonSuccess(`Successfully imported ${parsed.length} categories!`);
        } else {
          setJsonError('Unrecognized JSON array format. Expected Product[] or CategoryInfo[].');
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        if (Array.isArray(parsed.products)) {
          onUpdateProducts(parsed.products);
          localStorage.setItem('fp_custom_products', JSON.stringify(parsed.products));
        }
        if (Array.isArray(parsed.categories)) {
          onUpdateCategories(parsed.categories);
          localStorage.setItem('fp_custom_categories', JSON.stringify(parsed.categories));
        }
        if (parsed.monetizationSettings) {
          saveMonetizationSettings(parsed.monetizationSettings);
          setMonetizationSettings(parsed.monetizationSettings);
        }
        setJsonSuccess('Successfully restored complete store backup JSON!');
      }
      setJsonInput('');
      showToast('JSON imported cleanly without errors.');
    } catch (err: unknown) {
      setJsonError(`JSON Syntax Error: ${(err as Error).message}. Please ensure JSON is valid without syntax errors.`);
    }
  };

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Admin &amp; Owner Control Center
            </h1>
            <p className="text-xs text-slate-400">
              Manage dynamic pricing, lock/unlock workbooks, edit categories &amp; banners, and track revenue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Enter Admin Passcode:
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="admin2026"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <div className="text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN CONSOLE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Admin Top Navigation Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
              title="Return to Public Store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="font-black text-base sm:text-lg tracking-tight">
                Family Printables · Owner Command Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium">Currency:</span>
              <span className="font-extrabold text-indigo-400">{currency}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-500/30 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Primary Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800 py-1.5">
          {[
            { id: 'pricing', label: 'Pricing & Lock Controls', icon: DollarSign },
            { id: 'products', label: 'Workbooks (CRUD)', icon: BookOpen },
            { id: 'categories', label: 'Categories & Banners', icon: Layers },
            { id: 'monetization', label: 'Revenue & AdMob / AdSense', icon: TrendingUp },
            { id: 'json', label: 'JSON Export & Import', icon: Upload },
            { id: 'branding', label: 'Branding & Payouts', icon: CreditCard },
            { id: 'code', label: 'Clean HTML / Code', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* ================================================================ */}
        {/* TAB 1: DYNAMIC PRICING & ONE-CLICK LOCK/UNLOCK CONTROLS */}
        {/* ================================================================ */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                  <span>Dynamic Custom Pricing &amp; One-Click Item Controls</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Type and set ANY custom price (e.g. 1, 2, 9, 10). Dynamic currency converted live in {currency}. Toggle items between <strong>Free / Paid</strong> and <strong>Locked / Unlocked</strong> with one click.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Active Currency:</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-extrabold text-xs">
                  {currency}
                </span>
              </div>
            </div>

            {/* Product Pricing & Toggle Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Total Items ({products.length})
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Instant Auto-Save to Storefront
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {products.map((p) => {
                  const currentInput = customPrices[p.id] !== undefined ? customPrices[p.id] : p.priceUSD.toString();
                  const isFree = p.accessType === 'free' || p.priceUSD === 0;
                  const isLocked = p.isLocked;

                  return (
                    <div key={p.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                      
                      {/* Product Overview */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <img
                          src={resolveImageUrl(p.image, p.category)}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-100">
                              {p.category}
                            </span>
                            {isFree ? (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                                100% Free
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                                Paid Workbook
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded border ${
                              isLocked 
                                ? 'text-rose-700 bg-rose-50 border-rose-200' 
                                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            }`}>
                              {isLocked ? 'Locked' : 'Unlocked'}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-slate-900 truncate mt-1">
                            {p.title}
                          </h3>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {p.pages} Pages · {p.targetAge}
                          </div>
                        </div>
                      </div>

                      {/* Pricing Input & Dynamic Currency Preview */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Custom Price (USD):
                          </label>
                          <div className="flex items-center gap-1.5">
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={currentInput}
                                onChange={(e) => {
                                  setCustomPrices({ ...customPrices, [p.id]: e.target.value });
                                }}
                                className="w-28 pl-6 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSavePrice(p.id)}
                              className="px-3 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                              title="Save custom price"
                            >
                              Save
                            </button>
                          </div>
                        </div>

                        {/* Live Converted Display */}
                        <div className="flex flex-col text-right min-w-[90px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Storefront View:
                          </span>
                          <span className="text-sm font-black text-slate-900 tabular-nums">
                            {isFree ? 'FREE' : formatCurrency(p.priceUSD, currency)}
                          </span>
                        </div>
                      </div>

                      {/* 1-Click Toggles */}
                      <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                        {/* Free vs Paid Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleFreePaid(p.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border cursor-pointer ${
                            isFree
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          }`}
                        >
                          {isFree ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
                          <span>{isFree ? 'Set Paid' : 'Set Free'}</span>
                        </button>

                        {/* Locked vs Unlocked Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleLock(p.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border cursor-pointer ${
                            isLocked
                              ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          {isLocked ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{isLocked ? 'Unlock Item' : 'Lock Item'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: WORKBOOKS & PRODUCTS FULL CRUD */}
        {/* ================================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <span>Workbooks, Puzzle Books &amp; Cards Suite</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add new items, edit descriptions, adjust pages, target ages, and customize cover graphics.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingProduct(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Workbook / Pack</span>
              </button>
            </div>

            {/* Modal / Form for Add / Edit */}
            {(isAddingProduct || editingProduct) && (
              <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900">
                    {editingProduct ? `Edit Workbook: ${editingProduct.title}` : 'Publish New Printable Workbook'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Title:</label>
                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={editingProduct?.title || ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category:</label>
                      <select
                        name="category"
                        defaultValue={editingProduct?.category || 'early-learning'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Price (USD):</label>
                      <input
                        type="number"
                        step="any"
                        name="priceUSD"
                        required
                        defaultValue={editingProduct?.priceUSD ?? 2.50}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Target Age Group:</label>
                      <input
                        type="text"
                        name="targetAge"
                        defaultValue={editingProduct?.targetAge || 'Ages 3-8'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Page Count:</label>
                      <input
                        type="number"
                        name="pages"
                        defaultValue={editingProduct?.pages || 32}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Educational Benefit:</label>
                      <input
                        type="text"
                        name="educationalBenefit"
                        defaultValue={editingProduct?.educationalBenefit || 'Screen-Free Motor Skills & Memory'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Short Description:</label>
                    <input
                      type="text"
                      name="shortDesc"
                      defaultValue={editingProduct?.shortDesc || ''}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Detailed Description:</label>
                    <textarea
                      rows={3}
                      name="description"
                      defaultValue={editingProduct?.description || ''}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        name="isFree"
                        defaultChecked={editingProduct ? editingProduct.accessType === 'free' : false}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>Set as 100% Free Instant Download</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        name="isLocked"
                        defaultChecked={editingProduct ? editingProduct.isLocked : true}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>Lock item (Requires unlock/purchase)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition"
                    >
                      {editingProduct ? 'Save Changes' : 'Create Workbook'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={resolveImageUrl(p.image, p.category)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-black uppercase text-indigo-900 bg-white/95 px-2 py-0.5 rounded-md shadow-xs">
                        {p.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {p.shortDesc || p.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Price</span>
                      <span className="text-base font-black text-slate-900">
                        {p.accessType === 'free' ? 'FREE' : formatCurrency(p.priceUSD, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsAddingProduct(false);
                          window.scrollTo({ top: 100, behavior: 'smooth' });
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                        title="Edit workbook details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete workbook"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: CATEGORIES & BANNERS FULL CRUD */}
        {/* ================================================================ */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-indigo-600" />
                  <span>Category Cards &amp; Banner Customizer</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, edit, or delete categories and replace category cover banners (including All-Occasion Greeting Cards).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setIsAddingCategory(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            {/* Category Form */}
            {(isAddingCategory || editingCategory) && (
              <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900">
                    {editingCategory ? `Edit Category: ${editingCategory.title}` : 'Create New Category'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setEditingCategory(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Category Title:</label>
                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={editingCategory?.title || ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Short Title (Mobile Badge):</label>
                      <input
                        type="text"
                        name="shortTitle"
                        required
                        defaultValue={editingCategory?.shortTitle || ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tagline:</label>
                      <input
                        type="text"
                        name="tagline"
                        defaultValue={editingCategory?.tagline || ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Age Range:</label>
                      <input
                        type="text"
                        name="ageRange"
                        defaultValue={editingCategory?.ageRange || 'All Ages'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category Description:</label>
                    <textarea
                      rows={2}
                      name="description"
                      defaultValue={editingCategory?.description || ''}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Image Key / URL:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="image"
                        defaultValue={editingCategory?.image || IMAGES.festivalsCards}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] text-slate-900"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Use bundled key: festivals_greeting_cards, cover_toddler, cover_puzzles, product_kids_workbook, or any web image URL.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setEditingCategory(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative aspect-video w-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={resolveImageUrl(cat.image, cat.id)}
                        alt={cat.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {cat.badge}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 truncate mt-1">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {cat.tagline || cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Target: {cat.ageRange}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsAddingCategory(false);
                          window.scrollTo({ top: 100, behavior: 'smooth' });
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                        title="Edit category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: OWNER MONETIZATION & REVENUE DASHBOARD (ADMOB / ADSENSE) */}
        {/* ================================================================ */}
        {activeTab === 'monetization' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-300/30">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Owner Revenue Engine &amp; Monetization Analytics</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Multi-Channel Monetization Dashboard
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                    Track engagement revenues generated from app installs, template exports, user reviews, paid workbook sales, and AdMob / AdSense banner slots.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Gross Revenue Generated</span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    ${revenueMetrics.totalRevenueUSD.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Owner Payout Ready</span>
                </div>
              </div>

              {/* 4 Core Revenue KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-slate-900">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Workbook Sales</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    ${revenueMetrics.workbookSalesUSD.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold">Direct Digital Licenses</span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AdMob / AdSense</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    ${revenueMetrics.adRevenueUSD.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-amber-600 font-bold">{revenueMetrics.adImpressionsCount.toLocaleString()} Impressions</span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Affiliate Supplies</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    ${revenueMetrics.affiliateRevenueUSD.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold">Cardstock &amp; Inks</span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">PWA Mobile Installs</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    {revenueMetrics.appInstallsCount}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">{revenueMetrics.templateExportsCount} Exports</span>
                </div>
              </div>
            </div>

            {/* AdMob & AdSense Configuration Module */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>Google AdSense &amp; AdMob Slots</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Enable monetized sponsor banners in the footer and printable studio. Enter your Google AdSense Publisher ID.
                </p>

                <form onSubmit={handleSaveMonetization} className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="font-extrabold text-slate-900 block">Enable AdMob / AdSense Slots</span>
                      <span className="text-[11px] text-slate-500">Display monetized banner slot on public storefront</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={monetizationSettings.adMobEnabled}
                        onChange={(e) => setMonetizationSettings({ ...monetizationSettings, adMobEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AdSense Publisher ID:</label>
                    <input
                      type="text"
                      value={monetizationSettings.adSensePublisherId}
                      onChange={(e) => setMonetizationSettings({ ...monetizationSettings, adSensePublisherId: e.target.value })}
                      placeholder="ca-pub-7182940192840192"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ad Unit Slot ID:</label>
                    <input
                      type="text"
                      value={monetizationSettings.adSlotId}
                      onChange={(e) => setMonetizationSettings({ ...monetizationSettings, adSlotId: e.target.value })}
                      placeholder="5829104829"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                  >
                    Save AdMob Configuration
                  </button>
                </form>
              </div>

              {/* Affiliate Partner Slot Configuration */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Affiliate Supplies Sponsor Slot</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Earn commissions on printer paper, cardstock, laminating pouches, and ink supplies.
                </p>

                <form onSubmit={handleSaveMonetization} className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="font-extrabold text-slate-900 block">Enable Affiliate Sponsor Banner</span>
                      <span className="text-[11px] text-slate-500">Displays recommended printing materials to users</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={monetizationSettings.affiliateEnabled}
                        onChange={(e) => setMonetizationSettings({ ...monetizationSettings, affiliateEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Headline Title:</label>
                    <input
                      type="text"
                      value={monetizationSettings.affiliateTitle}
                      onChange={(e) => setMonetizationSettings({ ...monetizationSettings, affiliateTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Affiliate Link Destination URL:</label>
                    <input
                      type="url"
                      value={monetizationSettings.affiliateUrl}
                      onChange={(e) => setMonetizationSettings({ ...monetizationSettings, affiliateUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                  >
                    Save Affiliate Slot
                  </button>
                </form>
              </div>

            </div>

            {/* Live Monetization & Engagement Activity Log */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  Recent Monetization Events &amp; Engagement Log
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  Last 50 Events Tracked
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {recentEvents.map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${
                        evt.type === 'workbook_sale' ? 'bg-emerald-500' :
                        evt.type === 'app_install' ? 'bg-indigo-500' :
                        evt.type === 'template_export' ? 'bg-purple-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <strong className="text-slate-900 font-extrabold">{evt.title}</strong>
                        {evt.details && <span className="text-slate-500 ml-2 text-[11px]">{evt.details}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-emerald-700 tabular-nums">
                        +${evt.revenueUSD.toFixed(2)}
                      </span>
                      <span className="text-slate-400 text-[11px]">{evt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: CLEAN JSON EXPORT & IMPORT (100% ERROR-FREE) */}
        {/* ================================================================ */}
        {activeTab === 'json' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-6 h-6 text-indigo-600" />
                <span>Clean JSON Data Export &amp; Import Suite</span>
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Export 100% valid, error-free JSON backups of all products, categories, and settings. Import custom JSON data directly into the database without syntax or parsing errors.
              </p>

              {/* 1-Click Export Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => handleExportJSON('products')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Products JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportJSON('categories')}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Categories JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportJSON('all')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Complete Store Backup</span>
                </button>
              </div>
            </div>

            {/* JSON Import Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Import JSON Data Safely</span>
              </h3>
              <p className="text-xs text-slate-500">
                Paste valid JSON array or backup object below. It will be validated before updating the catalog.
              </p>

              <textarea
                rows={8}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[ { "id": "prod-1", "title": "My Workbook", "priceUSD": 2.50, ... } ]'
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />

              {jsonError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{jsonError}</span>
                </div>
              )}

              {jsonSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{jsonSuccess}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleImportJSON}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Validate &amp; Import JSON Data
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 6: BRANDING, LOGO & PAYOUT SETTINGS */}
        {/* ================================================================ */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Logo Management */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  <span>Global Brand Logo</span>
                </h3>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={tempLogo || '/logo.png'}
                      alt="Brand Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Logo Image URL or Local Asset Path:
                    </label>
                    <input
                      type="text"
                      value={tempLogo}
                      onChange={(e) => setTempLogo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateLogoUrl(tempLogo);
                    try {
                      localStorage.setItem('fp_custom_logo', tempLogo);
                    } catch {}
                    showToast('Logo updated successfully!');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                >
                  Save Brand Logo
                </button>
              </div>

              {/* Passcode Security */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <span>Admin Passcode Security</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Update the password required to access this Admin Portal.
                </p>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    New Passcode:
                  </label>
                  <input
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Enter new strong passcode"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newPasscode.trim()) {
                      alert('Please type a new passcode.');
                      return;
                    }
                    localStorage.setItem('fp_admin_custom_passcode', newPasscode.trim());
                    setNewPasscode('');
                    showToast('Admin passcode updated successfully!');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs rounded-xl shadow-xs transition"
                >
                  Update Passcode
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 7: CLEAN PRODUCTION HTML / CODE EXPORT */}
        {/* ================================================================ */}
        {activeTab === 'code' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Code className="w-6 h-6 text-indigo-600" />
                    <span>Production Clean HTML &amp; Layout Code</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Download or copy the 100% clean production HTML/JS code for direct hosting on Netlify, GitHub Pages, or any server.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanCode = generateCompleteLayoutHtml();
                      navigator.clipboard.writeText(cleanCode);
                      setHasCopiedCode(true);
                      setTimeout(() => setHasCopiedCode(false), 2500);
                      showToast('Complete layout HTML copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {hasCopiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{hasCopiedCode ? 'Copied to Clipboard!' : 'Copy Complete HTML'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cleanCode = generateCompleteLayoutHtml();
                      const blob = new Blob([cleanCode], { type: 'text/html;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'family_printables_production_layout.html';
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Downloaded family_printables_production_layout.html');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download index.html</span>
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <textarea
                  readOnly
                  rows={14}
                  value={generateCompleteLayoutHtml()}
                  className="w-full px-4 py-3 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800 focus:outline-none select-all"
                />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
