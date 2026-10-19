import React from 'react';
import { 
  X, 
  Download, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Unlock, 
  Clock, 
  Printer, 
  ShieldCheck, 
  ShoppingCart, 
  FileText, 
  Layers, 
  Share2 
} from 'lucide-react';
import { Product } from '../types';
import { resolveImageUrl } from '../assets/images';
import { formatCurrency } from '../utils/currency';
import { resolveProductGumroadUrl } from '../utils/gumroad';

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
  currency,
}) => {
  if (!product) return null;

  const displayPrice = formatCurrency(product.priceUSD, currency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
              {product.categoryLabel || product.category}
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-amber-500/80">({product.reviewsCount})</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Product Cover Art */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
                <img
                  src={resolveImageUrl(product.image, product.category)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveImageUrl(product.image, product.category);
                  }}
                />

                {isUnlocked && (
                  <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlocked ({daysRemaining}d access)</span>
                  </div>
                )}
              </div>

              {/* Quick Specs Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-slate-400 font-medium">Pages</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{product.pages} pgs</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-slate-400 font-medium">Age Group</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{product.targetAge}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-slate-400 font-medium">Resolution</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">300 DPI</div>
                </div>
              </div>
            </div>

            {/* Product Details & Actions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h2>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {product.shortDesc || product.description}
                </p>
              </div>

              {/* Educational Highlight */}
              {product.educationalBenefit && (
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Learning &amp; Developmental Benefit
                    </h4>
                    <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                      {product.educationalBenefit}
                    </p>
                  </div>
                </div>
              )}

              {/* Price & Purchase Actions */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">One-Time Download Price</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {displayPrice}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    Instant 90-Day Access
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  {isUnlocked ? (
                    <button
                      onClick={() => onFreeDownload ? onFreeDownload(product) : onInstantBuy(product)}
                      className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download PDF Files Now</span>
                    </button>
                  ) : (
                    <>
                      <a
                        href={resolveProductGumroadUrl(product)}
                        data-gumroad-single-product="true"
                        className="gumroad-button w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer no-underline text-center"
                        title="Instant Buy & Download with Secure Gumroad In-App Overlay"
                        onClick={(e) => {
                          if (!(window as any).GumroadOverlay && !resolveProductGumroadUrl(product).includes('gumroad.com')) {
                            e.preventDefault();
                            onInstantBuy(product);
                            onClose();
                          }
                        }}
                      >
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>Instant Buy &amp; Download · {displayPrice}</span>
                      </a>

                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onClose();
                        }}
                        className="w-full py-3 px-6 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <ShoppingCart className="w-4 h-4 text-slate-500" />
                        <span>Add to Cart</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Trust Guarantee */}
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    Standard A4 &amp; Universal Size
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Secure Checkout
                  </span>
                  <span>•</span>
                  <button 
                    onClick={() => {
                      onClose();
                      onOpenReviews(product);
                    }}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Read Reviews ({product.reviewsCount})
                  </button>
                </div>
              </div>

              {/* What's Included */}
              {product.includedItems && product.includedItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>What's Inside This Pack</span>
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {product.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sample Page Previews */}
          {product.samplePages && product.samplePages.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Sample Page Activity Previews</span>
                </h3>
                <span className="text-xs text-slate-500">Preview 3 sample sheets</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.samplePages.map((sample, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                      {sample.title}
                    </div>
                    <div className="font-extrabold text-sm text-slate-800">
                      {sample.subtitle}
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "{sample.previewText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
