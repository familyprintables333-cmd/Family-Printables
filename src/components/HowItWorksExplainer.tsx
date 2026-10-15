import React from 'react';
import { Download, CreditCard, Printer, ShoppingCart, Globe2, Layers, CheckCircle2 } from 'lucide-react';

interface HowItWorksExplainerProps {
  onExploreProducts: () => void;
  onOpenEtsyHub?: () => void;
}

export const HowItWorksExplainer: React.FC<HowItWorksExplainerProps> = ({
  onExploreProducts
}) => {
  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Instant Digital Delivery Worldwide</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Family Printables Works
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            All workbooks, routine sheets, and audio books are 100% instant digital downloads. Zero shipping delays, zero paper waste, and immediate delivery directly to your device anywhere in the world.
          </p>
        </div>

        {/* The 4-Step Customer Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Choose a Collection
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parents and teachers explore age-appropriate learning workbooks or bedtime stories and enter their delivery email.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-indigo-500" />
              <span>Easy Selection</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Instant Checkout
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Securely pay using Apple Pay, Google Pay, or Credit/Debit card with transparent pricing in your local currency.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-500" />
              <span>256-Bit SSL Checkout</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Instant Unlock
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your purchased files immediately unlock in your personal My Downloads vault, accessible 24/7 across all devices.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>90-Day Digital Vault Access</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-base mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Print &amp; Enjoy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Print crystal-clear PDFs on your home printer or open the interactive storybooks directly on your tablet or smartphone.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-purple-500" />
              <span>Unlimited Prints</span>
            </div>
          </div>
        </div>

        {/* 3 Quality & Family Delivery Pillars */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white space-y-8">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Standard Quality &amp; Delivery
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
              The 3 Pillars of Family Printables
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>1. Standard US Letter &amp; A4 Sizing</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All workbooks are formatted for both standard US Letter (8.5" x 11") and international A4. High-resolution 300 DPI vector PDFs ensure zero margin clipping and sharp printing on any home printer.
              </p>
            </div>

            {/* Pillar 2: Replaced Multi-Channel Revenue Triad with Instant 24/7 Digital Access */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Download className="w-4 h-4" />
                <span>2. Instant 24/7 Digital Access</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Download files instantly after checkout and keep them safely stored in your personal download vault for 90 days. Re-download clean copies anytime across all your devices during your access window.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Reusability &amp; Lamination Ready</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Workbooks and habit charts feature generous margins perfect for dry-erase pocket sleeves, spiral binding, or 3-ring homeschool binders for endless reuse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
