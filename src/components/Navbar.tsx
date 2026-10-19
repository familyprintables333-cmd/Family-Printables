import React from 'react';
import { User, ShoppingBag, Award } from 'lucide-react';
import { CartItem, UserAccount } from '../types';
import { CURRENCIES, CurrencyCode } from '../utils/currency';

interface NavbarProps {
  activeTab: 'catalog' | 'studio' | 'how-it-works' | 'guides' | 'reviews' | 'etsy-kdp';
  setActiveTab: (tab: 'catalog' | 'studio' | 'how-it-works' | 'guides' | 'reviews' | 'etsy-kdp') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  onOpenDownloads: () => void;
  onOpenAuth: () => void;
  onOpenAdmin?: () => void;
  onOpenContactSupport?: () => void;
  account: UserAccount;
  currency: string;
  setCurrency: (currency: string) => void;
  onReturnToCategories?: () => void;
  logoUrl?: string;
  userPoints?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  onOpenDownloads,
  onOpenAuth,
  onOpenContactSupport,
  account,
  currency,
  setCurrency,
  onReturnToCategories,
  logoUrl = '/logo.png',
  userPoints = 150
}) => {
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unlockedCount = account.purchasedProductIds.length;

  const handleBrandClick = () => {
    setActiveTab('catalog');
    if (onReturnToCategories) {
      onReturnToCategories();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* ================================================================ */}
        {/* ROW 1: BRAND LOGO & TITLE (LEFT) + ONLY CURRENCY SELECTOR (RIGHT) */}
        {/* ================================================================ */}
        <div className="flex items-center justify-between gap-1 sm:gap-4 h-14 sm:h-16 w-full min-w-0">
          {/* Main Brand Logo & Title */}
          <button
            onClick={handleBrandClick}
            className="flex items-center gap-1.5 sm:gap-3 text-left group focus:outline-none min-w-0 flex-1"
            title="Return to Home / Collections"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={logoUrl || '/logo.png'}
                alt="Family Printables Brand Logo"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                }}
                className="w-full h-full object-contain p-0.5"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-sm xs:text-base sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap block leading-tight">
                Family Printables
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5 block truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                Smart Printables for Modern Families &amp; Global Businesses
              </span>
            </div>
          </button>

          {/* Top-Right: STRICTLY ONLY CURRENCY SELECTOR DROPDOWN */}
          <div className="flex items-center shrink-0 ml-1">
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-[11px] sm:text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl px-1.5 py-1.5 sm:px-3 sm:py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition shadow-2xs max-w-[80px] sm:max-w-none truncate"
                title="Change Currency"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCIES[code].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ROW 2: CLEAN SUB-ROW - STRICTLY ONLY PROFILE, CART & PTS BADGE */}
        {/* ================================================================ */}
        <div 
          className="py-2 border-t border-slate-100 flex items-center justify-between w-full text-xs overflow-x-hidden"
          style={{ justifyContent: 'space-between', overflowX: 'hidden' }}
        >
          {/* Left: Profile & Cart Icons */}
          <div className="flex items-center gap-2">
            {/* 1. Profile / Account */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="relative p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title={account.isLoggedIn ? `Account: ${account.name}` : 'Sign Up / Account Profile'}
              aria-label="Profile"
            >
              <User className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden sm:inline">
                {account.isLoggedIn ? account.name.split(' ')[0] : 'Profile'}
              </span>
              {account.isLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              )}
            </button>

            {/* 2. Shopping Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full tabular-nums shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: STRICTLY ONLY REWARDS POINTS BADGE */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="View Earn & Review Rewards"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{userPoints} Pts</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
