import React, { useState } from 'react';
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
  Play,
  MessageSquare,
  Send
} from 'lucide-react';
import { Product, UserReview } from '../types';
import { resolveImageUrl } from '../assets/images';
import { formatCurrency } from '../utils/currency';
import { resolveProductGumroadUrl } from '../utils/gumroad';
import { formatReviewTimestamp } from '../utils/reviews';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onOpenReviews: (product: Product) => void;
  onFreeDownload?: (product: Product) => void;
  onPlayMedia?: (product: Product) => void;
  onAddReview?: (productId: string, review: UserReview) => void;
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
  onPlayMedia,
  onAddReview,
  isPurchased = false,
  isUnlocked = false,
  isExpired = false,
  daysRemaining = 0,
  currency,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) return null;

  const isFreeProduct = product.isFree === true || product.priceUSD === 0 || product.accessType === 'free';
  const displayPrice = formatCurrency(product.priceUSD, currency);

  const isAudioOrVideo = 
    product.category === 'audio-stories' ||
    (product.category as string) === 'audio-video' ||
    product.mediaType === 'audio' ||
    product.mediaType === 'video' ||
    Boolean(product.audioVideoUrl) ||
    Boolean(product.audioDuration) ||
    Boolean(product.format?.some(f => /audio|video|mp3|mp4/i.test(f)));

  // Isolated product-specific reviews
  const productReviews = product.userReviews || product.reviews || [];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const now = Date.now();
    const newRev: UserReview = {
      id: `rev-${now}`,
      author: reviewerName.trim() || 'Verified Customer',
      rating: reviewRating,
      timestamp: now,
      createdAt: new Date(now).toISOString(),
      date: new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: reviewComment.trim(),
      verifiedPurchase: true
    };

    if (onAddReview) {
      onAddReview(product.id, newRev);
    }
    setReviewComment('');
    setShowReviewForm(false);
  };

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
              {product.categoryLabel || product.category}
            </span>

            {isFreeProduct ? (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                100% Free
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Locked · {displayPrice}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Visual Presentation */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
                <img
                  src={resolveImageUrl(product.image, product.category)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveImageUrl(product.image, product.category);
                  }}
                />

                {/* Status Badges */}
                {isUnlocked && (
                  <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlocked ({daysRemaining}d access)</span>
                  </div>
                )}

                {/* Instant Play Overlay for Free Audio/Video */}
                {isAudioOrVideo && isFreeProduct && (
                  <button
                    type="button"
                    onClick={() => onPlayMedia && onPlayMedia(product)}
                    className="absolute inset-0 bg-slate-950/30 hover:bg-slate-950/50 transition-colors flex items-center justify-center group/btn cursor-pointer"
                    title="Click to Play In-App"
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Quick Specs Badges - Dynamically Adapted to Category & Admin Settings */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {isAudioOrVideo ? (
                  <>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-slate-400 font-medium">Duration</div>
                      <div className="font-extrabold text-slate-800 text-sm mt-0.5">{product.audioDuration || '10 mins'}</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-slate-400 font-medium">{product.targetAge ? 'Audience' : 'Format'}</div>
                      <div className="font-extrabold text-slate-800 text-sm mt-0.5 truncate">{product.targetAge || 'MP3 Audio'}</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-slate-400 font-medium">Player</div>
                      <div className="font-extrabold text-purple-700 text-sm mt-0.5">In-App Player</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-slate-400 font-medium">Format</div>
                      <div className="font-extrabold text-slate-800 text-sm mt-0.5">
                        {product.pages && product.pages > 0 ? `${product.pages} pgs` : 'Standard A4'}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-slate-400 font-medium">{product.targetAge ? 'Age Group' : 'Format'}</div>
                      <div className="font-extrabold text-slate-800 text-sm mt-0.5 truncate">
                        {product.targetAge || 'Universal PDF'}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-slate-400 font-medium">Print Quality</div>
                      <div className="font-extrabold text-slate-800 text-sm mt-0.5">300 DPI Vector</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h2>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {product.shortDesc || product.description}
                </p>
              </div>

              {/* Educational Highlight (Only if specified by admin) */}
              {product.educationalBenefit && product.educationalBenefit.trim() !== '' && (
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      {isAudioOrVideo ? 'Content & Listening Focus' : 'Learning & Developmental Benefit'}
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
                    <span className="text-xs text-slate-500 font-medium block">
                      {isFreeProduct ? (isAudioOrVideo ? 'Free In-App Stream' : 'Instant 100% Free Access') : 'One-Time Digital Purchase'}
                    </span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {isFreeProduct ? <span className="text-emerald-600">FREE</span> : displayPrice}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    {isFreeProduct ? 'Instant Lifetime Access' : 'Instant 90-Day Access'}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  {/* Smart Conditional Action Button Rendering */}
                  {isAudioOrVideo && isFreeProduct ? (
                    /* Free Audio/Video: COMPLETELY HIDE download/purchase and render instant "▶ Play" button */
                    <button
                      type="button"
                      onClick={() => onPlayMedia && onPlayMedia(product)}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>Play Track In-App Now</span>
                    </button>
                  ) : isFreeProduct ? (
                    /* Free Printable Workbook: Direct smooth download without Gumroad 404 errors */
                    <button
                      type="button"
                      onClick={() => onFreeDownload && onFreeDownload(product)}
                      className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Free PDF</span>
                    </button>
                  ) : isUnlocked ? (
                    /* Paid item previously unlocked */
                    <button
                      type="button"
                      onClick={() => onFreeDownload && onFreeDownload(product)}
                      className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download File · Unlocked</span>
                    </button>
                  ) : (
                    /* Paid / Locked item: Securely bind Gumroad checkout URL */
                    <>
                      <a
                        href={resolveProductGumroadUrl(product)}
                        data-gumroad-single-product="true"
                        className="gumroad-button w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer no-underline text-center"
                        title="Instant Buy & Download with Secure Gumroad Overlay"
                        onClick={(e) => {
                          if (!(window as any).GumroadOverlay && !resolveProductGumroadUrl(product).includes('gumroad.com')) {
                            e.preventDefault();
                            onInstantBuy(product);
                            onClose();
                          }
                        }}
                      >
                        <Lock className="w-5 h-5 text-emerald-200" />
                        <span>Instant Buy &amp; Download · {displayPrice}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart(product);
                          onClose();
                        }}
                        className="w-full py-3 px-6 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer"
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
                    {isAudioOrVideo ? 'High-Def MP3 Stream' : 'Standard A4 & Universal Size'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Secure Access
                  </span>
                  <span>•</span>
                  <button 
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    {productReviews.length > 0 ? `Reviews (${productReviews.length})` : 'Write a Review'}
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

          {/* ================================================================ */}
          {/* PRODUCT-SPECIFIC ISOLATED REVIEWS & ACCURATE TIMESTAMPS SECTION   */}
          {/* ================================================================ */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Customer Reviews
                </h3>
                {productReviews.length > 0 && (
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {productReviews.length}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Embedded Write a Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-900">
                  Share your experience with this item:
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setReviewRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starVal <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Jessica M."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Review:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How did you or your family enjoy this printable or audio track?"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>
            )}

            {/* Isolated Reviews List with Accurate Dynamic Timestamps */}
            {productReviews.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
                <Star className="w-6 h-6 text-slate-300 mx-auto" />
                <div className="text-xs font-bold text-slate-700">No reviews yet for this product</div>
                <p className="text-[11px] text-slate-500">
                  Be the first verified customer to share feedback!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.author}</span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatReviewTimestamp(rev.timestamp || rev.createdAt || rev.date, rev.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Customer
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
