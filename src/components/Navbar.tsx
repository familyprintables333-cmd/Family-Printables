import React, { useState } from 'react';
import { BookOpen, Sparkles, Download, User, Shield, ShoppingBag, MessageSquare } from 'lucide-react';
import { CartItem, UserAccount } from '../types';
import { CURRENCIES, CurrencyCode } from '../utils/currency';

interface NavbarProps {
  activeTab: 'catalog' | 'studio' | 'how-it-works' | 'guides' | 'etsy-kdp';
  setActiveTab: (tab: 'catalog' | 'studio' | 'how-it-works' | 'guides' | 'etsy-kdp') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  onOpenDownloads: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenContactSupport?: () => void;
  account: UserAccount;
  currency: string;
  setCurrency: (currency: string) => void;
  onReturnToCategories?: () => void;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  onOpenDownloads,
  onOpenAuth,
  onOpenAdmin,
  onOpenContactSupport,
  account,
  currency,
  setCurrency,
  onReturnToCategories,
  logoUrl = 'logo.png'
}) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unlockedCount = account.purchasedProductIds.length;

  const handleBrandClick = () => {
    setActiveTab('catalog');
    if (onReturnToCategories) {
      onReturnToCategories();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Permanently Fixed & Anchored Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleBrandClick}
              className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
              title="Return to Home / Collections"
            >
              {/* Permanently anchored uploaded brand logo */}
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={logoUrl || '/logo.png'}
                  alt="Family Printables Brand Logo"
                  onError={(e) => {
                    // Fallback to vector icon in public if custom image fails
                    (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                  }}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>

              <div className="shrink-0">
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap block">
                  Family Printables
                </span>
                <span className="hidden lg:block text-[11px] text-slate-500 font-medium whitespace-nowrap">
                  Fun Workbooks, Activity Sheets &amp; Audio Stories for Kids
                </span>
              </div>
            </button>
          </div>

          {/* Pill Navigation Bar (100% English) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('catalog');
                if (onReturnToCategories) onReturnToCategories();
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'catalog'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Routine Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'how-it-works'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'guides'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Guides &amp; Blog</span>
            </button>
          </nav>

          {/* Right Actions: Currency Selector + My Downloads + Account + Cart */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Multi-Currency Dropdown (USD, INR, PKR, EUR, GBP, AED, CAD) */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl px-2.5 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition shadow-2xs"
                title="Change Currency"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCIES[code].label}
                  </option>
                ))}
              </select>
            </div>

            {/* My Downloads Slide-Over Trigger */}
            <button
              onClick={onOpenDownloads}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-200/70 shadow-2xs"
              title="Open My Downloads Vault"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">My Downloads</span>
              {unlockedCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full tabular-nums">
                  {unlockedCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            <button
              onClick={onOpenAuth}
              className="p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition shadow-2xs"
              title={account.isLoggedIn ? `Logged in: ${account.name}` : 'Sign In'}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Admin Console Trigger */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition shadow-2xs"
              title="Store Admin & Price Manager"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* AI Auto-Response Support Widget Trigger */}
            {onOpenContactSupport && (
              <button
                onClick={onOpenContactSupport}
                className="p-2 text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition shadow-2xs border border-indigo-200/60"
                title="24/7 AI Support & Help Desk"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-all shadow-xs"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full tabular-nums shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <button
            onClick={() => {
              setActiveTab('catalog');
              if (onReturnToCategories) onReturnToCategories();
            }}
            className={`py-1 ${activeTab === 'catalog' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-1 ${activeTab === 'studio' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Timetables
          </button>
          <button
            onClick={onOpenDownloads}
            className="py-1 text-indigo-600 font-bold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Downloads</span>
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`py-1 ${activeTab === 'how-it-works' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Guide
          </button>
        </div>
      </div>
    </header>
  );
};
