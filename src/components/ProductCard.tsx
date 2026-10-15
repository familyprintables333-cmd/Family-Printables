import React from 'react';
import { Eye, Download, Star, CheckCircle2, Sparkles, Lock, Unlock, Clock } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/currency';
import { resolveImageUrl } from '../assets/images';

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onOpenReviews: (product: Product) => void;
  onFreeDownload?: (product: Product) => void;
  isPurchased: boolean;
  isUnlocked?: boolean;
  isExpired?: boolean;
  daysRemaining?: number;
  currency: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview,
  onInstantBuy,
  onOpenReviews,
  onFreeDownload,
  isPurchased,
  isUnlocked = false,
  isExpired = false,
  daysRemaining = 0,
  currency
}) => {
  // If isUnlocked prop is not explicitly passed, fallback to isPurchased
  const canDownload = isPurchased && !isExpired && (isUnlocked || !isExpired);

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative">
      {/* Thumbnail Area with Cover Art - Pristine and clean with zero text or badges overlapping the image */}
      <div
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onPreview(product)}
      >
        <img
          src={resolveImageUrl(product.image)}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/images/cover_toddler.jpg';
          }}
        />
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Status, Category & Age Badges Row - Cleanly Below Image */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider border border-indigo-100/80">
                {product.categoryLabel}
              </span>

              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>{product.targetAge}</span>
              </span>

              {/* Status Badge */}
              {isExpired ? (
                <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md text-[11px] border border-rose-200">
                  <Clock className="w-3 h-3 text-rose-600" />
                  <span>Expired</span>
                </span>
              ) : canDownload ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-200">
                  <Unlock className="w-3 h-3 text-emerald-600" />
                  <span>Unlocked ({daysRemaining}d)</span>
                </span>
              ) : null}
            </div>

            <button
              onClick={() => onOpenReviews(product)}
              className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition shrink-0"
              title="Read verified parent reviews"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="font-bold text-slate-800 tabular-nums">{product.rating}</span>
              <span className="text-slate-400 text-[11px] underline">({product.reviewsCount})</span>
            </button>
          </div>

          {/* Title - Strictly below image in clean structured layout */}
          <h3
            onClick={() => onPreview(product)}
            className="text-base font-extrabold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Explicit Educational Benefits Callout */}
          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] leading-relaxed text-indigo-950 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900">Educational Benefit: </span>
              <span>{product.educationalBenefit}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions & Highlighted Price / Unlock Module */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Prominently Highlighted Price Callout */}
          <div className="flex flex-col">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {isPurchased ? 'Your License' : 'Price'}
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums flex items-baseline gap-1">
              <span className="text-slate-900">{formatCurrency(product.priceUSD, currency)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview(product)}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-2xs"
              title="Preview Sample Pages"
            >
              <Eye className="w-4 h-4" />
            </button>

            {isExpired ? (
              <button
                onClick={() => onInstantBuy(product)}
                className="px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:from-amber-500 hover:to-rose-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                title="3-month access lapsed. Click to renew access for another 90 days."
              >
                <Clock className="w-3.5 h-3.5 text-amber-100" />
                <span>Renew Access ✨</span>
              </button>
            ) : canDownload ? (
              <button
                onClick={() => onFreeDownload && onFreeDownload(product)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                title={`Instant Download · ${daysRemaining} days access remaining`}
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            ) : (
              <button
                onClick={() => onInstantBuy(product)}
                className="px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl transition-all shadow-md hover:shadow-emerald-600/30 flex items-center gap-1.5 whitespace-nowrap"
                title={`Unlock and purchase for ${formatCurrency(product.priceUSD, currency)}`}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-100" />
                <span>Buy Now ✨</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
