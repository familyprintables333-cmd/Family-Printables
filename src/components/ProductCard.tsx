import React from 'react';
import { Eye, Download, Star, CheckCircle2, Sparkles, Lock, Unlock, Clock, Play } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/currency';
import { resolveImageUrl } from '../assets/images';
import { resolveProductGumroadUrl } from '../utils/gumroad';

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onOpenReviews: (product: Product) => void;
  onFreeDownload?: (product: Product) => void;
  onPlayMedia?: (product: Product) => void;
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
  onPlayMedia,
  isPurchased,
  isUnlocked = false,
  isExpired = false,
  daysRemaining = 0,
  currency
}) => {
  const isFreeProduct = product.isFree === true || product.priceUSD === 0 || product.accessType === 'free';
  const canDownload = isFreeProduct || (isPurchased && !isExpired && (isUnlocked || !isExpired));

  const isAudioOrVideo = 
    product.category === 'audio-stories' ||
    (product.category as string) === 'audio-video' ||
    product.mediaType === 'audio' ||
    product.mediaType === 'video' ||
    Boolean(product.audioVideoUrl) ||
    Boolean(product.audioDuration) ||
    Boolean(product.format?.some(f => /audio|video|mp3|mp4/i.test(f)));

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative">
      {/* Thumbnail Area with Cover Art */}
      <div
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onPreview(product)}
      >
        <img
          src={resolveImageUrl(product.image, product.category)}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = resolveImageUrl(product.image, product.category);
          }}
        />

        {/* Quick Play Overlay Button for Audio/Video */}
        {isAudioOrVideo && isFreeProduct && (
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Status, Category & Age Badges Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider border border-indigo-100/80">
                {product.categoryLabel}
              </span>

              {product.targetAge && product.targetAge.trim() !== '' && (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>{product.targetAge}</span>
                </span>
              )}

              {/* Status Badge */}
              {isFreeProduct ? (
                <span className="inline-flex items-center gap-1 font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md text-[11px] border border-emerald-300 shadow-2xs">
                  <Unlock className="w-3 h-3 text-emerald-600" />
                  <span>100% Free</span>
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md text-[11px] border border-rose-200">
                  <Clock className="w-3 h-3 text-rose-600" />
                  <span>Expired</span>
                </span>
              ) : canDownload ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-200">
                  <Unlock className="w-3 h-3 text-emerald-600" />
                  <span>Unlocked ({daysRemaining}d)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Locked</span>
                </span>
              )}
            </div>

            {/* Clean Review Rating Badge - Zero fake reviews */}
            {product.reviewsCount > 0 ? (
              <button
                type="button"
                onClick={() => onOpenReviews(product)}
                className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition shrink-0"
                title="Verified customer reviews"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span className="font-bold text-slate-800 tabular-nums">{product.rating}</span>
                <span className="text-slate-400 text-[11px] underline">({product.reviewsCount})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenReviews(product)}
                className="text-slate-400 hover:text-indigo-600 text-[11px] font-semibold transition shrink-0"
                title="Write a review"
              >
                Review
              </button>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onPreview(product)}
            className="text-base font-extrabold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Benefits Callout */}
          {product.educationalBenefit && product.educationalBenefit.trim() !== '' && (
            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] leading-relaxed text-indigo-950 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900">
                  {isAudioOrVideo ? 'Focus: ' : 'Benefit: '}
                </span>
                <span>{product.educationalBenefit}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Highlighted Price Callout */}
          <div className="flex flex-col">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {isFreeProduct ? (isAudioOrVideo ? 'Free Stream' : 'Instant Access') : isPurchased ? 'Your License' : 'Price'}
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums flex items-baseline gap-1">
              {isFreeProduct ? (
                <span className="text-emerald-600 font-black">FREE</span>
              ) : (
                <span className="text-slate-900">{formatCurrency(product.priceUSD, currency)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(product)}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-2xs"
              title="Preview Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Smart Conditional Button Rendering */}
            {isAudioOrVideo && isFreeProduct ? (
              /* If Free Audio/Video: Render instant "▶ Play" button. No Gumroad link or checkout. */
              <button
                type="button"
                onClick={() => onPlayMedia ? onPlayMedia(product) : onPreview(product)}
                className="px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                title="Stream or play directly in in-app audio player"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Now</span>
              </button>
            ) : isFreeProduct ? (
              /* If Free Printable Workbook: Direct, smooth automatic download without Gumroad 404 errors */
              <button
                type="button"
                onClick={() => onFreeDownload && onFreeDownload(product)}
                className="px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                title="Download Free PDF"
              >
                <Download className="w-4 h-4" />
                <span>Download Free PDF</span>
              </button>
            ) : isExpired ? (
              /* If Paid Expired item: Gumroad checkout to renew */
              <a
                href={resolveProductGumroadUrl(product)}
                data-gumroad-single-product="true"
                className="gumroad-button px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:from-amber-500 hover:to-rose-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer no-underline"
                title="Renew access for another 90 days via Gumroad"
                onClick={(e) => {
                  if (!(window as any).GumroadOverlay && !resolveProductGumroadUrl(product).includes('gumroad.com')) {
                    e.preventDefault();
                    onInstantBuy(product);
                  }
                }}
              >
                <Clock className="w-3.5 h-3.5 text-amber-100" />
                <span>Renew Access ✨</span>
              </a>
            ) : canDownload ? (
              /* If Paid Unlocked item */
              <button
                type="button"
                onClick={() => onFreeDownload && onFreeDownload(product)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                title={`Download File · ${daysRemaining} days access remaining`}
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            ) : (
              /* If Paid / Locked: Show proper locked badge & securely bind active Gumroad checkout URL */
              <a
                href={resolveProductGumroadUrl(product)}
                data-gumroad-single-product="true"
                className="gumroad-button px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl transition-all shadow-md hover:shadow-emerald-600/30 flex items-center gap-1.5 whitespace-nowrap cursor-pointer no-underline"
                title={`Unlock and purchase for ${formatCurrency(product.priceUSD, currency)} via secure Gumroad overlay`}
                onClick={(e) => {
                  if (!(window as any).GumroadOverlay && !resolveProductGumroadUrl(product).includes('gumroad.com')) {
                    e.preventDefault();
                    onInstantBuy(product);
                  }
                }}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-100" />
                <span>Buy Now ✨</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
