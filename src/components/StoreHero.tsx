import React from 'react';
import { Sparkles, CheckCircle2, Lock, ArrowRight, Printer, BookOpen } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface StoreHeroProps {
  onQuickNav?: (target: string) => void;
  currency?: string;
  storeName?: string;
  storeTagline?: string;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ 
  onQuickNav, 
  currency = 'USD',
  storeName = 'Family Printables',
  storeTagline = 'Smart Digital Printables for Families & Business'
}) => {
  return (
    <header className="max-w-4xl mx-auto text-center space-y-2.5 sm:space-y-5 mb-5 sm:mb-10 px-1">
      {/* Global Freemium Status Banner */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-emerald-200 bg-emerald-950/80 border border-emerald-700/60 shadow-inner">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
        <span>Global Digital Printables • 300 DPI Vector PDFs</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white font-sans">
        {storeTagline || 'Smart Digital Printables for Families & Business'}
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl mx-auto font-normal">
        Instantly download 100% free single-page daily timetables, productivity planners, and business sales ledgers in Standard A4 &amp; Universal formats, alongside premium kids' learning workbooks and greeting cards from {storeName || 'Family Printables'}.
      </p>

      {/* Freemium Model Clarity Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-2xl mx-auto pt-1 sm:pt-2 text-left">
        {/* Free Tier Callout */}
        <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-sm">
          <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">100% Free Forever</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
              <strong>Single-Page Utility Printables:</strong> Timetables, Planners, and Business Ledgers. Customize live and print with zero cost.
            </p>
          </div>
        </div>

        {/* Premium Tier Callout */}
        <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-sm">
          <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300">Premium Downloads</span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-200 font-semibold">From {formatCurrency(0.99, currency)}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
              <strong>Kids' Workbooks &amp; Special Packs:</strong> Multi-page activity books, brain puzzles, and artistic greeting card collections.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Interactive Quick-Nav Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
        <button
          type="button"
          onClick={() => onQuickNav?.('studio')}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Generate Free Printables (Studio)</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-200" />
        </button>

        <button
          type="button"
          onClick={() => onQuickNav?.('catalog')}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
          <span>Exclusive Kids Collections</span>
        </button>
      </div>
    </header>
  );
};
