import React, { useState, useEffect } from 'react';
import { X, Plus, BookOpen, ShieldCheck, Check, Image as ImageIcon, RotateCcw, Globe, CreditCard, Building2, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product, CategoryId, MerchantSettings } from '../types';
import { resolveImageUrl } from '../assets/images';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  logoUrl?: string;
  onUpdateLogoUrl?: (url: string) => void;
  merchantSettings?: MerchantSettings;
  onUpdateMerchantSettings?: (settings: MerchantSettings) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdatePrice,
  logoUrl = '/logo.png',
  onUpdateLogoUrl,
  merchantSettings = {
    payoneerEmail: 'merchant.payments@familyprintables.com',
    payoneerAccountId: 'PAY-8829-4102',
    receivingAccountNumber: '984210384729',
    routingNumber: '021000021',
    bankName: 'First Century Bank (US Receiving Account)',
    gatewayMode: 'test',
    currency: 'USD'
  },
  onUpdateMerchantSettings
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'new-product' | 'logo' | 'payouts'>('catalog');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('toddlers');
  const [newPrice, setNewPrice] = useState<number>(1.00);
  const [newAge, setNewAge] = useState('Ages 3-5');
  const [newBenefit, setNewBenefit] = useState('Builds early confidence & fine motor control');
  const [newPages, setNewPages] = useState<number>(40);
  const [successToast, setSuccessToast] = useState(false);

  // Logo state
  const [customLogoInput, setCustomLogoInput] = useState(logoUrl);
  const [logoSaveSuccess, setLogoSaveSuccess] = useState(false);

  useEffect(() => {
    setCustomLogoInput(logoUrl);
  }, [logoUrl]);

  // Merchant, Payoneer & Stripe Payouts State
  const [payoneerEmail, setPayoneerEmail] = useState(merchantSettings.payoneerEmail);
  const [payoneerAccountId, setPayoneerAccountId] = useState(merchantSettings.payoneerAccountId);
  const [receivingAccountNumber, setReceivingAccountNumber] = useState(merchantSettings.receivingAccountNumber);
  const [routingNumber, setRoutingNumber] = useState(merchantSettings.routingNumber);
  const [bankName, setBankName] = useState(merchantSettings.bankName);
  const [gatewayMode, setGatewayMode] = useState<'test' | 'live'>(merchantSettings.gatewayMode);
  const [currencyPref, setCurrencyPref] = useState(merchantSettings.currency);
  const [stripePublishableKey, setStripePublishableKey] = useState(merchantSettings.stripePublishableKey || 'pk_test_sample_stripe_key_familyprintables');
  const [stripeAccountId, setStripeAccountId] = useState(merchantSettings.stripeAccountId || 'acct_family_printables');
  const [merchantSaveSuccess, setMerchantSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: newCategory.replace('-', ' ').toUpperCase(),
      priceUSD: newPrice,
      rating: 5.0,
      reviewsCount: 1,
      pages: newPages,
      targetAge: newAge,
      educationalBenefit: newBenefit,
      includedItems: [`${newPages} Printable Practice Sheets`, 'US Letter 8.5x11" & A4 PDF'],
      format: ['US Letter PDF', 'A4 PDF'],
      image: '/assets/images/cover_toddler_preschool_1791896015426.jpg',
      shortDesc: `${newBenefit}. Ready to print at home.`,
      description: `High quality printable activity workbook. ${newBenefit}. Formatted in 300 DPI high resolution.`,
      features: [`${newPages} Clean Worksheets`, 'US Letter & A4 size', 'Instant download'],
      samplePages: [{ title: 'Sample Page 1', subtitle: 'Overview', previewText: 'Interactive exercises' }],
      fileSize: '10.5 MB PDF'
    };

    onAddProduct(newProd);
    setNewTitle('');
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setActiveTab('catalog');
    }, 1200);
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateLogoUrl) {
      onUpdateLogoUrl(customLogoInput.trim() || 'logo.png');
    }
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomLogoInput(reader.result);
          if (onUpdateLogoUrl) {
            onUpdateLogoUrl(reader.result);
          }
          setLogoSaveSuccess(true);
          setTimeout(() => setLogoSaveSuccess(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setCustomLogoInput('logo.png');
    if (onUpdateLogoUrl) {
      onUpdateLogoUrl('logo.png');
    }
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 2000);
  };

  const handleSaveMerchantSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: MerchantSettings = {
      payoneerEmail: payoneerEmail.trim(),
      payoneerAccountId: payoneerAccountId.trim(),
      receivingAccountNumber: receivingAccountNumber.trim(),
      routingNumber: routingNumber.trim(),
      bankName: bankName.trim(),
      gatewayMode,
      currency: currencyPref,
      paymentGateway: 'stripe',
      stripePublishableKey: stripePublishableKey.trim(),
      stripeAccountId: stripeAccountId.trim()
    };

    if (onUpdateMerchantSettings) {
      onUpdateMerchantSettings(updatedSettings);
    }
    try {
      localStorage.setItem('fp_merchant_settings', JSON.stringify(updatedSettings));
    } catch {
      // safe fallback
    }
    setMerchantSaveSuccess(true);
    setTimeout(() => setMerchantSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-white flex items-center justify-center shrink-0">
              <img
                src={logoUrl || '/logo.png'}
                alt="Brand Logo"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Store Owner &amp; Mobile Admin Console</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage workbook catalog, base pricing, brand logo, and global payout settings
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'catalog' ? 'bg-indigo-600 text-white' : 'bg-slate-200/70 text-slate-700'
              }`}
            >
              Catalog &amp; Pricing
            </button>
            <button
              onClick={() => setActiveTab('new-product')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'new-product' ? 'bg-indigo-600 text-white' : 'bg-slate-200/70 text-slate-700'
              }`}
            >
              + Add Workbook
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'logo' ? 'bg-indigo-600 text-white' : 'bg-slate-200/70 text-slate-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Custom Logo</span>
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'payouts' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-200/70 text-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Merchant &amp; Payoneer Payouts</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Workbooks &amp; Price Adjuster:
              </div>

              <div className="space-y-2.5">
                {products.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={resolveImageUrl(p.image)}
                        alt={p.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/cover_toddler.jpg';
                        }}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-400">{p.categoryLabel} · {p.targetAge}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-slate-700">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={p.priceUSD}
                        onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)}
                        placeholder="1.00"
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-indigo-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                        title="Enter any custom price (e.g. 1.50, 3.00, 5.00)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new-product' && (
            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              {successToast && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>New printable workbook published successfully!</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Workbook Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Toddler Colors & Animals Cutout Fun"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="toddlers">Toddlers (Ages 2-4)</option>
                    <option value="early-learning">Early Learning (Ages 4-6)</option>
                    <option value="brain-teasers">Brain Teasers &amp; Puzzles</option>
                    <option value="planning">Planning &amp; Organization</option>
                    <option value="seasonal">Seasonal &amp; Holidays</option>
                    <option value="audio-stories">Audio Stories &amp; Bedtime</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (USD):</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-slate-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 1.50, 3.00, 5.00, 10.00"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-bold text-indigo-700 text-xs focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Enter any custom price ($1.50, $3, $5, $10, etc.)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Age:</label>
                  <input
                    type="text"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="e.g. Ages 3-5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page Count:</label>
                  <input
                    type="number"
                    value={newPages}
                    onChange={(e) => setNewPages(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Educational Benefit:</label>
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="e.g. Improves fine motor pencil control"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Workbook to Category</span>
              </button>
            </form>
          )}

          {activeTab === 'logo' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
                <div className="font-bold text-indigo-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Custom Brand Logo Setup</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The navigation header renders a customizable logo element (<code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-800 font-mono text-[11px]">&lt;img src="logo.png" alt="Family Printables" /&gt;</code>). You can drop your custom <code className="font-mono text-indigo-800">logo.png</code> file directly into the application, or test a custom image URL or file upload below.
                </p>
              </div>

              {logoSaveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Logo updated successfully! Changes are automatically synced globally across the header, checkout modal, receipt, and store pages.</span>
                </div>
              )}

              {/* Current Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  <img
                    src={customLogoInput || 'logo.png'}
                    alt="Logo Preview"
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.src = '/icon.svg';
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Current Header Logo Preview</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono truncate max-w-xs sm:max-w-md">
                    {customLogoInput || 'logo.png'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Recommended dimensions: Square aspect ratio (1:1), 256x256 or 512x512 PNG with transparent background.
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveLogo} className="space-y-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Logo Path or URL:</label>
                  <input
                    type="text"
                    value={customLogoInput}
                    onChange={(e) => setCustomLogoInput(e.target.value)}
                    placeholder="logo.png or https://example.com/logo.png"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Or Upload Custom Logo Image File:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Custom Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1.5"
                    title="Reset to default logo.png"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to logo.png</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-4 text-xs">
              {/* Header Info */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-black text-slate-900">Merchant &amp; Payoneer Payouts Engine</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                    gatewayMode === 'live'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {gatewayMode === 'live' ? '● Live Production' : '● Test Sandbox Mode'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Configure your store payout pipeline. Direct consumer card payments process through your configured merchant gateway and settle into your Payoneer USD/Global Receiving Account, ready for 24/7 withdrawal to your local bank.
                </p>
              </div>

              {/* Success Banner */}
              {merchantSaveSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center gap-2.5 font-bold animate-fadeIn shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="block font-black text-emerald-950">Merchant Settings Saved Successfully!</span>
                    <span className="text-[11px] font-normal text-emerald-800">
                      Active Gateway: {gatewayMode === 'live' ? 'Live Production' : 'Test Mode'} · Currency: {currencyPref} · Receiving Bank: {bankName}
                    </span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSaveMerchantSettings} className="space-y-4">
                {/* Gateway Mode Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    1. Gateway Operation Mode:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGatewayMode('test')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        gatewayMode === 'test'
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Test Sandbox Mode</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Safe sandbox simulation with instant test cards
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGatewayMode('live')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        gatewayMode === 'live'
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Live Production</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Live consumer debit cards &amp; direct merchant capture
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payoneer Account Credentials */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Payoneer Account Identification:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        Payoneer Registered Email <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="email"
                        required
                        value={payoneerEmail}
                        onChange={(e) => setPayoneerEmail(e.target.value)}
                        placeholder="merchant@familyprintables.com"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        Payoneer Customer / Account ID <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={payoneerAccountId}
                        onChange={(e) => setPayoneerAccountId(e.target.value)}
                        placeholder="PAY-8829-4102"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-mono text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Receiving Account & Bank Routing Details */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>3. Payoneer US / Global Receiving Account Details:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        US / Global Receiving Account Number <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={receivingAccountNumber}
                        onChange={(e) => setReceivingAccountNumber(e.target.value)}
                        placeholder="984210384729"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-mono text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        ACH / ABA Routing Number (9 Digits) <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={9}
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        placeholder="021000021"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-mono text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        Receiving Bank Name:
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="First Century Bank / Community Federal Savings Bank"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Currency Preference Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    4. Default Store &amp; Payout Currency Preference:
                  </label>
                  <select
                    value={currencyPref}
                    onChange={(e) => setCurrencyPref(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-bold text-xs"
                  >
                    <option value="USD">USD ($) - US Dollar (Default Payoneer Clearing)</option>
                    <option value="EUR">EUR (€) - Eurozone SEPA</option>
                    <option value="GBP">GBP (£) - British Pound BACS</option>
                    <option value="PKR">PKR (Rs) - Pakistani Rupee (Local Bank Transfer)</option>
                    <option value="INR">INR (₹) - Indian Rupee (NEFT / UPI Payout)</option>
                    <option value="CAD">CAD ($) - Canadian Dollar EFT</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                  </select>
                  <p className="text-[10px] text-slate-500">
                    Changing currency automatically updates the store prices and active checkout charge currency.
                  </p>
                </div>

                {/* 5. STRIPE PAYMENT GATEWAY CONFIGURATION */}
                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                      <div className="w-4 h-4 rounded bg-[#635BFF] text-white flex items-center justify-center font-black text-[9px]">S</div>
                      <span>5. Stripe Payment Gateway Integration:</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                      Card / Elements Gateway
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Paste your Stripe Publishable API Key below to route consumer credit/debit card checkouts directly into your Stripe Dashboard.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        Stripe Publishable Key (pk_test_... or pk_live_...):
                      </label>
                      <input
                        type="text"
                        value={stripePublishableKey}
                        onChange={(e) => setStripePublishableKey(e.target.value)}
                        placeholder="pk_test_51... or pk_live_51..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                        Stripe Connected Account ID (Optional):
                      </label>
                      <input
                        type="text"
                        value={stripeAccountId}
                        onChange={(e) => setStripeAccountId(e.target.value)}
                        placeholder="acct_1N..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Configurations stored securely in local state and persistent storage.</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl transition shadow-md hover:shadow-emerald-600/25 flex items-center gap-2 active:scale-98 shrink-0 text-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Merchant Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
