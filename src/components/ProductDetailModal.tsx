import React, { useState } from 'react';
import { X, Star, Check, ArrowRight, ArrowLeft, Printer, ShieldCheck, Download, Layers, Sparkles, CheckCircle2, Lock, Unlock, Clock } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/currency';
import { resolveImageUrl } from '../assets/images';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onOpenReviews: (product: Product) => void;
  onFreeDownload?: (product: Product) => void;
  isPurchased?: boolean;
  isUnlocked?: boolean;
  isExpired?: boolean;
  daysRemaining?: number;
  currency: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  onOpenReviews,
  onFreeDownload,
  isPurchased = false,
  isUnlocked = false,
  isExpired = false,
  daysRemaining = 0,
  currency
}) => {
  const [activePageIndex, setActivePageIndex] = useState(0);

  if (!product) return null;

  const canDownload = isPurchased && !isExpired && (isUnlocked || !isExpired);

  const samplePages = product.samplePages || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 bg-white/80 hover:bg-white rounded-full shadow-xs transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image & Sample Page Viewer */}
          <div className="md:col-span-6 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              {/* Main Cover Image - Pristine without overlapping text/badges */}
              <div className="rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200/80 mb-5 relative">
                <img
                  src={resolveImageUrl(product.image)}
                  alt={product.title}
                  className="w-full h-auto aspect-[4/3] object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/cover_toddler.jpg';
                  }}
                />
              </div>

              {/* Sample Page Previewer */}
              {samplePages.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Look Inside (Sample Spread)</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {activePageIndex + 1} / {samplePages.length}
                    </span>
                  </div>

                  <div className="min-h-[75px] bg-indigo-50/40 rounded-xl p-3 border border-indigo-100">
                    <h4 className="text-xs font-bold text-slate-900">
                      {samplePages[activePageIndex].title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {samplePages[activePageIndex].subtitle}
                    </p>
                    <p className="text-xs text-slate-600 italic mt-2 border-t border-indigo-100/70 pt-1.5 font-serif">
                      {samplePages[activePageIndex].previewText}
                    </p>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setActivePageIndex((prev) => (prev > 0 ? prev - 1 : samplePages.length - 1))}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Previous</span>
                    </button>
                    <div className="flex items-center gap-1">
                      {samplePages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === activePageIndex ? 'bg-indigo-600 w-3' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActivePageIndex((prev) => (prev < samplePages.length - 1 ? prev + 1 : 0))}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Print advice */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-start gap-2">
              <Printer className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Formatted for 8.5" x 11" US Letter &amp; A4. Laminate or use sheet protectors for reusable dry-erase practice.
              </span>
            </div>
          </div>

          {/* Right Column: Details & Buy Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              {/* Category & Ratings */}
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider font-bold text-indigo-600">
                  {product.categoryLabel}
                </span>

                <button
                  onClick={() => onOpenReviews(product)}
                  className="flex items-center gap-1 text-amber-500 hover:text-amber-600 font-semibold"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="font-bold text-slate-900 tabular-nums">{product.rating}</span>
                  <span className="text-slate-400 underline">({product.reviewsCount} reviews)</span>
                </button>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {product.title}
              </h2>

              {/* Prominently Highlighted Price Section */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-rose-200/70 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    {isPurchased ? 'Unlocked License' : 'Special Digital Price'}
                  </div>
                  <div className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
                    {formatCurrency(product.priceUSD, currency)}
                  </div>
                </div>
                <div className="text-right">
                  {isPurchased ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300">
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-indigo-800 bg-indigo-100 border border-indigo-200">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Instant Delivery
                    </span>
                  )}
                  <div className="text-[10px] text-slate-500 mt-0.5">High-Res PDF Download</div>
                </div>
              </div>

              {/* Educational Benefit */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-900">Educational Benefit: </span>
                  <span>{product.educationalBenefit}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Included Items Checklist */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Included in this PDF Package:
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  {product.includedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              {isExpired ? (
                <button
                  onClick={() => {
                    onInstantBuy(product);
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 text-xs font-black text-white bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:from-amber-500 hover:to-rose-500 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-100" />
                  <span>Renew 3-Month Access ({formatCurrency(product.priceUSD, currency)})</span>
                </button>
              ) : canDownload ? (
                <button
                  onClick={() => {
                    onFreeDownload && onFreeDownload(product);
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File from Vault ({daysRemaining}d left)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onInstantBuy(product);
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 rounded-2xl transition-all shadow-md hover:shadow-emerald-600/30 active:scale-98 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-emerald-100" />
                  <span>Buy Now ✨ ({formatCurrency(product.priceUSD, currency)})</span>
                </button>
              )}

              {!canDownload && !isExpired && (
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Add to Shopping Bag</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3-Month Access Vault</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>Unlimited Re-downloads during active period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
