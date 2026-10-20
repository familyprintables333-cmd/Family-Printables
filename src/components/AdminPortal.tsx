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
  FileText,
  User,
  Users,
  Mail,
  Volume2,
  Play,
  Video,
  X,
  Search
} from 'lucide-react';
import { Product, MerchantSettings, Order, CategoryId, CategoryInfo } from '../types';
import { CATEGORIES } from '../data/categories';
import { IMAGES, resolveImageUrl } from '../assets/images';
import { generateCompleteLayoutHtml } from '../utils/generateLayoutHtml';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { getAllRegisteredUsers, StoredUserRecord } from '../utils/authStorage';
import { 
  getMonetizationSettings, 
  saveMonetizationSettings, 
  calculateRevenueMetrics, 
  getMonetizationEvents,
  MonetizationSettings,
  OwnerRevenueMetrics 
} from '../utils/monetization';
import { 
  getStoredGumroadBaseUrl, 
  setStoredGumroadBaseUrl, 
  getAllGumroadUrls, 
  saveAllGumroadUrls, 
  resolveProductGumroadUrl, 
  getStoredHtmlSnippets, 
  saveStoredHtmlSnippets, 
  HtmlSnippetRecord 
} from '../utils/gumroad';
import { syncSaveProduct, syncDeleteProduct } from '../utils/syncService';

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
  const [activeTab, setActiveTab] = useState<'pricing' | 'products' | 'categories' | 'users' | 'monetization' | 'json' | 'branding' | 'code'>('pricing');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Registered Users State
  const [registeredUsersList, setRegisteredUsersList] = useState<StoredUserRecord[]>(() => getAllRegisteredUsers());
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Multi-Format Upload Boxes State for Product Form
  const [formCoverImage, setFormCoverImage] = useState<string>('');
  const [formDocumentFile, setFormDocumentFile] = useState<{
    name: string;
    size: string;
    url: string;
    type: 'pdf' | 'doc' | 'docx';
  } | null>(null);
  const [formAudioVideoFile, setFormAudioVideoFile] = useState<{
    name: string;
    url: string;
    type: 'audio' | 'video';
  } | null>(null);
  // HTML & Gumroad Link Editor State
  const [gumroadBaseUrl, setGumroadBaseUrl] = useState<string>(() => getStoredGumroadBaseUrl());
  const [productGumroadMap, setProductGumroadMap] = useState<Record<string, string>>(() => {
    const existing = getAllGumroadUrls();
    // Pre-populate with products that already have gumroadUrl
    products.forEach((p) => {
      if (p.gumroadUrl && !existing[p.id]) {
        existing[p.id] = p.gumroadUrl;
      }
    });
    return existing;
  });
  const [htmlSnippets, setHtmlSnippets] = useState<HtmlSnippetRecord[]>(() => getStoredHtmlSnippets());
  const [editorSubTab, setEditorSubTab] = useState<'gumroad' | 'snippets' | 'html-export'>('gumroad');
  const [gumroadFilterSearch, setGumroadFilterSearch] = useState('');
  const [isAddingSnippet, setIsAddingSnippet] = useState(false);
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [newSnippetCategory, setNewSnippetCategory] = useState<HtmlSnippetRecord['category']>('custom');
  const [newSnippetCode, setNewSnippetCode] = useState('');
  const [previewSnippetHtml, setPreviewSnippetHtml] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

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
      setAuthError('Incorrect admin passcode. Please enter the master access key.');
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

    let savedItem: Product | undefined;
    const updated = products.map((p) => {
      if (p.id === productId) {
        const isFree = parsed === 0;
        savedItem = { 
          ...p, 
          priceUSD: parsed,
          accessType: isFree ? ('free' as const) : ('paid' as const),
          isFree,
          // STRICT RECORD INTEGRITY: Preserves locked state
          isLocked: isFree ? false : p.isLocked
        };
        return savedItem;
      }
      return p;
    });

    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    if (savedItem) {
      syncSaveProduct(savedItem);
    }
    showToast(`Price updated to ${formatCurrency(parsed, currency)} and saved across all devices.`);
  };

  const handleToggleLock = (productId: string) => {
    let savedItem: Product | undefined;
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextState = !p.isLocked;
        savedItem = { ...p, isLocked: nextState };
        return savedItem;
      }
      return p;
    });
    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    if (savedItem) {
      syncSaveProduct(savedItem);
    }
    showToast(`Workbook ${savedItem?.isLocked ? 'Locked' : 'Unlocked'} and synced across all devices.`);
  };

  const handleToggleFreePaid = (productId: string) => {
    let savedItem: Product | undefined;
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextIsFree = p.accessType !== 'free';
        savedItem = { 
          ...p, 
          isFree: nextIsFree,
          accessType: nextIsFree ? ('free' as const) : ('paid' as const),
          isLocked: !nextIsFree,
          priceUSD: nextIsFree ? 0 : (p.priceUSD > 0 ? p.priceUSD : 2.50)
        };
        return savedItem;
      }
      return p;
    });
    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    if (savedItem) {
      syncSaveProduct(savedItem);
    }
    showToast('Product Free / Paid status toggled and synced across all devices.');
  };

  // --------------------------------------------------------------------------
  // PRODUCT CRUD HANDLERS
  // --------------------------------------------------------------------------
  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This will permanently purge it across all devices.')) return;
    const updated = products.filter((p) => p.id !== productId);
    onUpdateProducts(updated);
    try {
      localStorage.setItem('fp_custom_products', JSON.stringify(updated));
    } catch {}
    syncDeleteProduct(productId);
    showToast('Listing permanently purged from all devices.');
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string) || (editingProduct?.title ?? 'New Digital Item');
    const cat = (formData.get('category') as CategoryId) || (editingProduct?.category ?? 'early-learning');
    const priceUSD = parseFloat((formData.get('priceUSD') as string) || '2.50');
    const isFree = formData.get('isFree') === 'on' || priceUSD === 0;
    const isLocked = formData.get('isLocked') === 'on';

    // Strict preservation of user inputs without forcing print defaults
    const targetAgeRaw = formData.get('targetAge') as string;
    const targetAge = targetAgeRaw !== null ? targetAgeRaw.trim() : (editingProduct?.targetAge || '');

    const isAudio = cat === 'audio-stories';
    const pagesRaw = formData.get('pages') as string;
    let pages = 0;
    if (!isAudio) {
      pages = pagesRaw ? parseInt(pagesRaw, 10) : (editingProduct?.pages || 0);
      if (isNaN(pages)) pages = 0;
    }

    const shortDesc = (formData.get('shortDesc') as string) || '';
    const description = (formData.get('description') as string) || '';

    const educationalBenefitRaw = formData.get('educationalBenefit') as string;
    const educationalBenefit = educationalBenefitRaw !== null ? educationalBenefitRaw.trim() : (editingProduct?.educationalBenefit || '');

    const customImage = (formData.get('customImage') as string) || '';
    const gumroadUrl = ((formData.get('gumroadUrl') as string) || editingProduct?.gumroadUrl || '').trim();
    const audioDuration = ((formData.get('audioDuration') as string) || editingProduct?.audioDuration || '').trim();

    let chosenImage = formCoverImage || customImage || editingProduct?.image || IMAGES.productKidsWorkbook;
    if (!formCoverImage && !customImage && !editingProduct?.image) {
      if (cat === 'festivals') chosenImage = IMAGES.festivalsCards;
      else if (cat === 'puzzles') chosenImage = IMAGES.coverPuzzles;
      else if (cat === 'routines') chosenImage = IMAGES.productRoutineBoard;
      else if (cat === 'toddlers') chosenImage = IMAGES.coverToddler;
      else if (cat === 'audio-stories') chosenImage = IMAGES.productBedtime;
    }

    const categoryObj = categories.find(c => c.id === cat);
    const categoryLabel = categoryObj ? categoryObj.title : 'Digital Collection';

    const defaultFormats = isAudio
      ? ['High-Fidelity MP3 Audio', 'Printable Storybook PDF', 'Narration Script']
      : ['Standard A4 PDF', 'Universal PDF', '300 DPI Vector Print'];

    const defaultIncluded = isAudio
      ? ['Calming MP3 Audio Narration', 'Companion Storybook PDF', 'Bedtime Routine Listening Guide']
      : ['High-Resolution Vector Worksheets', 'Print-ready Standard A4 & Universal PDFs', 'Unlimited Re-prints'];

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        title,
        category: cat,
        categoryLabel,
        priceUSD: isFree ? 0 : priceUSD,
        isFree,
        accessType: isFree ? ('free' as const) : ('paid' as const),
        isLocked,
        targetAge,
        pages,
        shortDesc,
        description,
        educationalBenefit,
        image: chosenImage,
        gumroadUrl,
        audioDuration: isAudio ? (audioDuration || '10 mins') : undefined,
        format: isAudio ? defaultFormats : (editingProduct.format && editingProduct.format.length > 0 ? editingProduct.format : defaultFormats),
        includedItems: isAudio ? defaultIncluded : (editingProduct.includedItems && editingProduct.includedItems.length > 0 ? editingProduct.includedItems : defaultIncluded),
        documentFileUrl: formDocumentFile?.url || editingProduct.documentFileUrl || '',
        documentFileName: formDocumentFile?.name || editingProduct.documentFileName || `${editingProduct.id}_document.pdf`,
        documentFileType: formDocumentFile?.type || editingProduct.documentFileType || 'pdf',
        fileSize: formDocumentFile?.size || editingProduct.fileSize || (isAudio ? '18.5 MB' : `${Math.max(1, pages * 0.35 + 2.5).toFixed(1)} MB`),
        audioVideoUrl: formAudioVideoFile?.url || editingProduct.audioVideoUrl || '',
        mediaType: formAudioVideoFile?.type || editingProduct.mediaType || (isAudio ? 'audio' : 'none'),
      };

      const updated = products.map((p) => p.id === editingProduct.id ? updatedProduct : p);
      onUpdateProducts(updated);
      try {
        localStorage.setItem('fp_custom_products', JSON.stringify(updated));
      } catch {}
      syncSaveProduct(updatedProduct);
      setEditingProduct(null);
      setFormCoverImage('');
      setFormDocumentFile(null);
      setFormAudioVideoFile(null);
      showToast('Listing updated & locked successfully across all devices!');
    } else {
      const newProd: Product = {
        id: `prod-custom-${Date.now()}`,
        title,
        category: cat,
        categoryLabel,
        priceUSD: isFree ? 0 : priceUSD,
        isFree,
        accessType: isFree ? 'free' : 'paid',
        isLocked,
        rating: 0,
        reviewsCount: 0,
        pages,
        targetAge,
        educationalBenefit,
        includedItems: defaultIncluded,
        format: defaultFormats,
        image: chosenImage,
        shortDesc,
        description,
        features: isAudio ? ['In-app audio player', 'Narrated story', 'Instant download'] : ['Instant digital download', 'High-definition 300 DPI', 'Single-page & workbook options'],
        fileSize: formDocumentFile?.size || (isAudio ? '18.5 MB' : `${Math.max(1, pages * 0.35 + 2.5).toFixed(1)} MB`),
        documentFileUrl: formDocumentFile?.url || '',
        documentFileName: formDocumentFile?.name || 'custom_document.pdf',
        documentFileType: formDocumentFile?.type || 'pdf',
        audioVideoUrl: formAudioVideoFile?.url || '',
        mediaType: formAudioVideoFile?.type || (isAudio ? 'audio' : 'none'),
        gumroadUrl,
        audioDuration: isAudio ? (audioDuration || '10 mins') : undefined,
      };
      const updated = [newProd, ...products];
      onUpdateProducts(updated);
      try {
        localStorage.setItem('fp_custom_products', JSON.stringify(updated));
      } catch {}
      syncSaveProduct(newProd);
      setIsAddingProduct(false);
      setFormCoverImage('');
      setFormDocumentFile(null);
      setFormAudioVideoFile(null);
      showToast('New listing saved & locked across all devices!');
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
            { id: 'users', label: 'Registered Users', icon: Users },
            { id: 'monetization', label: 'Revenue & AdMob / AdSense', icon: TrendingUp },
            { id: 'json', label: 'JSON Export & Import', icon: Upload },
            { id: 'branding', label: 'Branding & Payouts', icon: CreditCard },
            { id: 'code', label: 'HTML & Link Editor', icon: Code },
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
                            Custom Price ({currency}):
                          </label>
                          <div className="flex items-center gap-1.5">
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                                {getCurrencySymbol(currency)}
                              </span>
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
                      <label className="font-bold text-slate-700 block mb-1">Target Age Group (Optional):</label>
                      <input
                        type="text"
                        name="targetAge"
                        placeholder="e.g. All Ages, Ages 3-8, or leave blank"
                        defaultValue={editingProduct?.targetAge ?? ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Page Count (0 for Audio/Video):</label>
                      <input
                        type="number"
                        name="pages"
                        placeholder="0 for audio/digital, or page count"
                        defaultValue={editingProduct ? (editingProduct.pages ?? 0) : ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Educational Benefit / Focus (Optional):</label>
                      <input
                        type="text"
                        name="educationalBenefit"
                        placeholder="e.g. Calming bedtime routine, or leave blank"
                        defaultValue={editingProduct?.educationalBenefit ?? ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Direct Gumroad Product URL (In-App Overlay):</label>
                      <input
                        type="url"
                        name="gumroadUrl"
                        placeholder="https://gumroad.com/l/your-product-slug"
                        defaultValue={editingProduct?.gumroadUrl || ''}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-slate-900 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Audio / Media Duration (Audio Stories):</label>
                      <input
                        type="text"
                        name="audioDuration"
                        placeholder="e.g. 10 mins (Audio files only)"
                        defaultValue={editingProduct?.audioDuration || ''}
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

                  {/* ============================================================ */}
                  {/* 3 DEDICATED MULTI-FORMAT UPLOAD BOXES WITH LIVE PREVIEWS     */}
                  {/* ============================================================ */}
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>Dedicated Multi-Format Upload Boxes &amp; Previews</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* UPLOAD BOX 1: FRONT COVER / THUMBNAIL (JPG / PNG) */}
                      <div className="p-3.5 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                            <span>1. Front Cover Image</span>
                          </label>
                          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                            JPG/PNG
                          </span>
                        </div>

                        {/* Live Image Preview */}
                        {formCoverImage ? (
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-2xs">
                            <img
                              src={formCoverImage}
                              alt="Front Cover Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFormCoverImage('')}
                              className="absolute top-2 right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition"
                              title="Remove uploaded cover image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-[4/3] rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-3 text-center space-y-1">
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                            <span className="text-[10px] font-semibold text-slate-500">
                              Upload Front Cover Image
                            </span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setFormCoverImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="Or paste Image URL..."
                            value={formCoverImage.startsWith('data:') ? '' : formCoverImage}
                            onChange={(e) => setFormCoverImage(e.target.value)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[11px]"
                          />
                        </div>
                      </div>

                      {/* UPLOAD BOX 2: WORKBOOK / DOCUMENT FILE (.pdf, .doc, .docx) */}
                      <div className="p-3.5 bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>2. Document / PDF File</span>
                          </label>
                          <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                            PDF / Word
                          </span>
                        </div>

                        {/* Live Document Preview Badge */}
                        {formDocumentFile ? (
                          <div className="p-2.5 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1.5">
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-[11px] text-slate-900 truncate">
                                    {formDocumentFile.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {formDocumentFile.size} · {formDocumentFile.type.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormDocumentFile(null)}
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                                title="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {formDocumentFile.url && (
                              <a
                                href={formDocumentFile.url}
                                download={formDocumentFile.name}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 underline"
                              >
                                <Download className="w-3 h-3" />
                                <span>Test Preview / Download</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-center space-y-1">
                            <FileText className="w-6 h-6 text-slate-300" />
                            <span className="text-[10px] font-semibold text-slate-500">
                              Upload PDF or MS Word Document
                            </span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const isDoc = file.name.endsWith('.doc') || file.name.endsWith('.docx');
                                const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setFormDocumentFile({
                                    name: file.name,
                                    size: sizeMB,
                                    url: reader.result as string,
                                    type: isDoc ? (file.name.endsWith('.docx') ? 'docx' : 'doc') : 'pdf',
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="Or link PDF / Gumroad URL..."
                            value={formDocumentFile?.url && !formDocumentFile.url.startsWith('data:') ? formDocumentFile.url : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                setFormDocumentFile({
                                  name: val.split('/').pop() || 'linked_document.pdf',
                                  size: 'Cloud Link',
                                  url: val,
                                  type: val.includes('.doc') ? 'doc' : 'pdf',
                                });
                              }
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[11px]"
                          />
                        </div>
                      </div>

                      {/* UPLOAD BOX 3: AUDIO & VIDEO FILE WITH BUILT-IN IN-APP PLAYER */}
                      <div className="p-3.5 bg-slate-50 border-2 border-dashed border-purple-200 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>3. Audio / Video Track</span>
                          </label>
                          <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded">
                            MP3 / MP4
                          </span>
                        </div>

                        {/* Built-In In-App Player Live Preview */}
                        {formAudioVideoFile ? (
                          <div className="p-2.5 bg-slate-900 text-white rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-purple-300 truncate max-w-[140px]">
                                {formAudioVideoFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setFormAudioVideoFile(null)}
                                className="text-slate-400 hover:text-rose-400"
                                title="Remove audio/video"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {formAudioVideoFile.type === 'video' ? (
                              <video
                                controls
                                src={formAudioVideoFile.url}
                                className="w-full max-h-28 rounded-lg bg-black"
                              />
                            ) : (
                              <audio
                                controls
                                src={formAudioVideoFile.url}
                                className="w-full"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-center space-y-1">
                            <Volume2 className="w-6 h-6 text-slate-300" />
                            <span className="text-[10px] font-semibold text-slate-500">
                              Upload MP3 Bedtime Audio or MP4 Video
                            </span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <input
                            type="file"
                            accept="audio/*,video/*,.mp3,.mp4,.wav,.webm"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const isVideo = file.type.startsWith('video') || file.name.endsWith('.mp4');
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setFormAudioVideoFile({
                                    name: file.name,
                                    url: reader.result as string,
                                    type: isVideo ? 'video' : 'audio',
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="Or link MP3/MP4 audio stream URL..."
                            value={formAudioVideoFile?.url && !formAudioVideoFile.url.startsWith('data:') ? formAudioVideoFile.url : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                setFormAudioVideoFile({
                                  name: val.split('/').pop() || 'media_track.mp3',
                                  url: val,
                                  type: val.includes('.mp4') ? 'video' : 'audio',
                                });
                              }
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[11px]"
                          />
                        </div>
                      </div>

                    </div>
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
        {/* TAB: REGISTERED USERS & MANDATORY SIGN-UP DATABASE               */}
        {/* ================================================================ */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Controls */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-2 border border-indigo-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mandatory Sign-Up Gate Database</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <span>Registered Users &amp; Customer Accounts ({registeredUsersList.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All parents, educators, and shop owners who registered via the Mandatory Download Gate or Account portal. Saved in persistent localStorage (`fp_user_accounts_db`).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const fresh = getAllRegisteredUsers();
                    setRegisteredUsersList(fresh);
                    showToast('Registered users list refreshed!');
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const headers = 'Full Name,Gmail / Email,Joined Date,Purchased / Unlocked Items,Session Active\n';
                    const rows = registeredUsersList
                      .map((u) => `"${u.name}","${u.email}","${u.createdAt || 'N/A'}","${u.purchasedProductIds?.length || 0}","${u.isLoggedIn ? 'Yes' : 'No'}"`)
                      .join('\n');
                    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `FamilyPrintables_Registered_Users_${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast('Exported users to CSV file!');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{registeredUsersList.length}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Total Registered Accounts</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {registeredUsersList.filter((u) => u.isLoggedIn).length || 1}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">Active User Sessions</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {registeredUsersList.reduce((acc, u) => acc + (u.purchasedProductIds?.length || 0), 0)}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">Unlocked Vault Workbooks</div>
                </div>
              </div>
            </div>

            {/* Search Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <input
                type="text"
                placeholder="Search registered users by Full Name or Gmail address..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-900"
              />
            </div>

            {/* Users Table / List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">User / Full Name</th>
                      <th className="py-3 px-4">Gmail / Email</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4">Vault Workbooks</th>
                      <th className="py-3 px-4">Session Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registeredUsersList
                      .filter((u) => {
                        const q = userSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          u.name.toLowerCase().includes(q) ||
                          u.email.toLowerCase().includes(q)
                        );
                      })
                      .map((u, idx) => {
                        const initials = u.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || 'FP';
                        const joinedDate = u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent';

                        return (
                          <tr key={u.email || idx} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900">{u.name}</div>
                                  <div className="text-[10px] text-slate-400">Verified Parent</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-slate-700">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <span>{u.email}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 font-medium">
                              {joinedDate}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                <BookOpen className="w-3 h-3" />
                                <span>{u.purchasedProductIds?.length || 0} Workbooks</span>
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {u.isLoggedIn ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>Active Now</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                                  <span>Saved Profile</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove registered user "${u.name}" (${u.email})?`)) {
                                    const filtered = registeredUsersList.filter(
                                      (item) => item.email.toLowerCase() !== u.email.toLowerCase()
                                    );
                                    setRegisteredUsersList(filtered);
                                    try {
                                      localStorage.setItem('fp_user_accounts_db', JSON.stringify(filtered));
                                    } catch {}
                                    showToast(`Removed user ${u.email}`);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Remove User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
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
                    {formatCurrency(revenueMetrics.totalRevenueUSD, currency)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Owner Payout Ready</span>
                </div>
              </div>

              {/* 4 Core Revenue KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-slate-900">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Workbook Sales</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    {formatCurrency(revenueMetrics.workbookSalesUSD, currency)}
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold">Direct Digital Licenses</span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AdMob / AdSense</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    {formatCurrency(revenueMetrics.adRevenueUSD, currency)}
                  </div>
                  <span className="text-[10px] text-amber-600 font-bold">{revenueMetrics.adImpressionsCount.toLocaleString()} Impressions</span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Affiliate Supplies</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    {formatCurrency(revenueMetrics.affiliateRevenueUSD, currency)}
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
                        +{formatCurrency(evt.revenueUSD, currency)}
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
        {/* TAB 8: ADMIN HTML & LINK EDITOR (GUMROAD + SNIPPETS + EXPORT)    */}
        {/* ================================================================ */}
        {activeTab === 'code' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Sub-Nav Switcher */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Code className="w-6 h-6 text-indigo-600" />
                  <span>Admin HTML &amp; Link Editor</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage direct Gumroad checkout links, custom HTML snippets, announcement banners, and production code exports.
                </p>
              </div>

              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 self-start md:self-center">
                <button
                  type="button"
                  onClick={() => setEditorSubTab('gumroad')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                    editorSubTab === 'gumroad'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-pink-500" />
                  <span>Gumroad URLs</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-pink-100 text-pink-700 font-bold">
                    {products.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorSubTab('snippets')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                    editorSubTab === 'snippets'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>HTML Snippets</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-bold">
                    {htmlSnippets.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorSubTab('html-export')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                    editorSubTab === 'html-export'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span>Clean HTML Code</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* SUB-TAB 1: DIRECT GUMROAD PRODUCT URLS & OVERLAY SETTINGS    */}
            {/* ------------------------------------------------------------ */}
            {editorSubTab === 'gumroad' && (
              <div className="space-y-6">
                {/* Global Gumroad Integration Notice & Store Base URL Box */}
                <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-3xl p-6 border border-pink-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-600 text-white text-xs font-black rounded-full shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Gumroad Overlay Checkout Active</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        In-App Overlay Popup (Zero Redirection)
                      </h3>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        The Gumroad embed script (<code className="text-pink-700 font-bold bg-white px-1.5 py-0.5 rounded">https://gumroad.com/js/gumroad-embed.js</code>) is automatically active. All paid buttons have <code className="text-pink-700 font-bold bg-white px-1.5 py-0.5 rounded">class="gumroad-button"</code> to open the instant modal on this site.
                      </p>
                    </div>

                    {/* Global Base URL Form */}
                    <div className="bg-white p-4 rounded-2xl border border-pink-200 shadow-xs space-y-2 lg:w-96 shrink-0">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Default Gumroad Base URL:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={gumroadBaseUrl}
                          onChange={(e) => setGumroadBaseUrl(e.target.value)}
                          placeholder="https://gumroad.com/l"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setStoredGumroadBaseUrl(gumroadBaseUrl);
                            showToast(`Saved Gumroad Base URL: ${gumroadBaseUrl}`);
                          }}
                          className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black rounded-xl transition cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Used automatically for any product without a custom URL.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Gumroad URLs Table / List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Direct Product Gumroad URLs ({products.length} Products)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Assign specific Gumroad permalinks to each workbook or educational kit.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={gumroadFilterSearch}
                          onChange={(e) => setGumroadFilterSearch(e.target.value)}
                          placeholder="Search products..."
                          className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-64"
                        />
                      </div>

                      {/* Save All Button */}
                      <button
                        type="button"
                        onClick={() => {
                          saveAllGumroadUrls(productGumroadMap);
                          const updated = products.map((p) => ({
                            ...p,
                            gumroadUrl: productGumroadMap[p.id] || p.gumroadUrl
                          }));
                          onUpdateProducts(updated);
                          try {
                            localStorage.setItem('fp_custom_products', JSON.stringify(updated));
                          } catch {}
                          showToast('All Gumroad product URLs saved & synced successfully!');
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Links</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Gumroad Links List */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {products
                      .filter((p) => {
                        if (!gumroadFilterSearch.trim()) return true;
                        const q = gumroadFilterSearch.toLowerCase();
                        return (
                          p.title.toLowerCase().includes(q) ||
                          p.category.toLowerCase().includes(q) ||
                          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q))
                        );
                      })
                      .map((product) => {
                        const currentUrl = productGumroadMap[product.id] || product.gumroadUrl || resolveProductGumroadUrl(product);
                        const isCustom = Boolean(productGumroadMap[product.id] || product.gumroadUrl);

                        return (
                          <div
                            key={product.id}
                            className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                          >
                            {/* Product Info */}
                            <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                              <img
                                src={resolveImageUrl(product.image)}
                                alt={product.title}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                                onError={(e) => {
                                  e.currentTarget.src = IMAGES.coverToddler;
                                }}
                              />
                              <div className="min-w-0">
                                <h4 className="font-extrabold text-slate-900 truncate" title={product.title}>
                                  {product.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                  <span>{product.categoryLabel || product.category}</span>
                                  <span>•</span>
                                  <span className="font-bold text-slate-800">{formatCurrency(product.priceUSD, currency)}</span>
                                  {isCustom && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                                      Custom Link
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* URL Input */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <input
                                  type="url"
                                  value={currentUrl}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setProductGumroadMap((prev) => ({
                                      ...prev,
                                      [product.id]: val
                                    }));
                                  }}
                                  placeholder="https://gumroad.com/l/your-product-link"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                />
                              </div>
                            </div>

                            {/* Actions: Test & Copy */}
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={currentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition flex items-center gap-1.5 text-xs no-underline"
                                title="Open Gumroad link in new window"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Test URL</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => {
                                  const snippet = `<a class="gumroad-button" href="${currentUrl}" data-gumroad-single-product="true">Buy ${product.title}</a>`;
                                  navigator.clipboard.writeText(snippet);
                                  showToast(`Copied Gumroad button tag for "${product.title}"`);
                                }}
                                className="px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
                                title="Copy in-app button embed tag"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Tag</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* SUB-TAB 2: CUSTOM HTML & CODE SNIPPETS EDITOR                */}
            {/* ------------------------------------------------------------ */}
            {editorSubTab === 'snippets' && (
              <div className="space-y-6">
                {/* Header & Add Snippet Trigger */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Code className="w-5 h-5 text-indigo-600" />
                      <span>Code Snippets &amp; Custom HTML Blocks</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Edit, create, and manage embed code snippets, marketing banners, Gumroad buttons, and tracking tags.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingSnippet(!isAddingSnippet)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isAddingSnippet ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{isAddingSnippet ? 'Cancel' : 'New Snippet'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        saveStoredHtmlSnippets(htmlSnippets);
                        showToast('All HTML snippets saved successfully!');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Snippets</span>
                    </button>
                  </div>
                </div>

                {/* Add New Snippet Form Modal/Card */}
                {isAddingSnippet && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newSnippetTitle.trim() || !newSnippetCode.trim()) {
                        alert('Please fill out snippet title and code.');
                        return;
                      }
                      const newRecord: HtmlSnippetRecord = {
                        id: `snip-${Date.now()}`,
                        title: newSnippetTitle.trim(),
                        category: newSnippetCategory,
                        code: newSnippetCode.trim(),
                        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      };
                      const updated = [newRecord, ...htmlSnippets];
                      setHtmlSnippets(updated);
                      saveStoredHtmlSnippets(updated);
                      setNewSnippetTitle('');
                      setNewSnippetCode('');
                      setIsAddingSnippet(false);
                      showToast(`Added new snippet: "${newRecord.title}"`);
                    }}
                    className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 text-xs animate-in fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-indigo-400" />
                        <span>Create New HTML / Embed Snippet</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingSnippet(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Snippet Title:</label>
                        <input
                          type="text"
                          required
                          value={newSnippetTitle}
                          onChange={(e) => setNewSnippetTitle(e.target.value)}
                          placeholder="e.g. Gumroad Popup Overlay Button"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Category Tag:</label>
                        <select
                          value={newSnippetCategory}
                          onChange={(e) => setNewSnippetCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="gumroad">Gumroad Overlay</option>
                          <option value="banner">Promo Banner</option>
                          <option value="embed">Embed Script</option>
                          <option value="analytics">Analytics &amp; Tag</option>
                          <option value="custom">Custom HTML</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">HTML / JS Code:</label>
                      <textarea
                        required
                        rows={6}
                        value={newSnippetCode}
                        onChange={(e) => setNewSnippetCode(e.target.value)}
                        placeholder="<a class=&quot;gumroad-button&quot; href=&quot;https://gumroad.com/l/...&quot;>Buy Now</a>"
                        className="w-full px-4 py-3 bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingSnippet(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black transition cursor-pointer"
                      >
                        Save Snippet
                      </button>
                    </div>
                  </form>
                )}

                {/* Snippets List */}
                <div className="space-y-4">
                  {htmlSnippets.map((snippet, idx) => (
                    <div
                      key={snippet.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={snippet.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = htmlSnippets.map((s) =>
                                s.id === snippet.id ? { ...s, title: val } : s
                              );
                              setHtmlSnippets(updated);
                            }}
                            className="font-extrabold text-slate-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1"
                          />
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              snippet.category === 'gumroad'
                                ? 'bg-pink-100 text-pink-700'
                                : snippet.category === 'banner'
                                ? 'bg-indigo-100 text-indigo-700'
                                : snippet.category === 'analytics'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {snippet.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewSnippetHtml(snippet.code)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                            title="Preview rendered HTML output"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(snippet.code);
                              setCopiedSnippetId(snippet.id);
                              setTimeout(() => setCopiedSnippetId(null), 2000);
                              showToast(`Copied "${snippet.title}" to clipboard!`);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSnippetId === snippet.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-indigo-600" />
                            )}
                            <span>{copiedSnippetId === snippet.id ? 'Copied!' : 'Copy Code'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete snippet "${snippet.title}"?`)) {
                                const updated = htmlSnippets.filter((s) => s.id !== snippet.id);
                                setHtmlSnippets(updated);
                                saveStoredHtmlSnippets(updated);
                                showToast(`Deleted snippet "${snippet.title}"`);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete snippet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Monospace Code Editor Textarea */}
                      <div>
                        <textarea
                          rows={5}
                          value={snippet.code}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = htmlSnippets.map((s) =>
                              s.id === snippet.id
                                ? {
                                    ...s,
                                    code: val,
                                    updatedAt: new Date().toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  }
                                : s
                            );
                            setHtmlSnippets(updated);
                          }}
                          className="w-full px-4 py-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 leading-relaxed"
                        />
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 px-1">
                          <span>Auto-saved in local buffer · Click "Save All Snippets" to commit</span>
                          <span>Last updated: {snippet.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* SUB-TAB 3: COMPLETE PRODUCTION LAYOUT HTML EXPORTER          */}
            {/* ------------------------------------------------------------ */}
            {editorSubTab === 'html-export' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Code className="w-6 h-6 text-indigo-600" />
                      <span>Production Clean HTML &amp; Layout Code</span>
                    </h3>
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

                <div className="pt-2">
                  <textarea
                    readOnly
                    rows={14}
                    value={generateCompleteLayoutHtml()}
                    className="w-full px-4 py-3 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800 focus:outline-none select-all"
                  />
                </div>
              </div>
            )}

            {/* HTML Snippet Live Preview Modal */}
            {previewSnippetHtml !== null && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      <span>Live HTML Render Preview</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setPreviewSnippetHtml(null)}
                      className="text-slate-400 hover:text-slate-800 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div
                      dangerouslySetInnerHTML={{ __html: previewSnippetHtml }}
                      className="text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewSnippetHtml(null)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
