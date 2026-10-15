import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { CategoryInfo, Product, UserAccount } from '../types';
import { ProductCard } from './ProductCard';
import { getProductAccessStatus } from '../utils/access';
import { resolveImageUrl } from '../assets/images';

interface CategoryDetailViewProps {
  category: CategoryInfo;
  products: Product[];
  onBackToCategories: () => void;
  onPreviewProduct: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onOpenReviews: (product: Product) => void;
  onFreeDownload: (product: Product) => void;
  purchasedProductIds: string[];
  account?: UserAccount;
  currency: string;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  products,
  onBackToCategories,
  onPreviewProduct,
  onInstantBuy,
  onOpenReviews,
  onFreeDownload,
  purchasedProductIds,
  account,
  currency
}) => {
  // Match products for category, including aliases (e.g. seasonal/festivals, audio-stories/stories)
  const categoryProducts = products.filter((p) => {
    if (category.id === 'seasonal' || category.id === 'festivals') {
      return p.category === 'seasonal' || p.category === 'festivals';
    }
    if (category.id === 'audio-stories' || category.id === 'stories') {
      return p.category === 'audio-stories' || p.category === 'stories';
    }
    return p.category === category.id;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Clean Minimal Back Navigation & Active Category Name (No Redundant 'Collection:' or bulky styling) */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToCategories}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95 group"
          title="Back to Categories"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-slate-800 tracking-tight">
          {category.title}
        </span>
      </div>

      {/* Streamlined Category Overview Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/70">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Age: {category.targetAge}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {category.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {category.fullDescription}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 pt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Instant 24/7 Digital Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-indigo-600" />
                Standard US Letter 8.5"x11" &amp; A4
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verified Purchase Digital Vault
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative w-44 sm:w-52 h-32 sm:h-38 rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 bg-slate-50 shrink-0">
              <img
                src={resolveImageUrl(category.image)}
                alt={category.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Individual Workbooks Listing (Clean, Direct Grid Without Redundant Filters or Search) */}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-500 text-sm">
            No workbooks currently available in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoryProducts.map((product) => {
            const accessStatus = account
              ? getProductAccessStatus(product.id, account)
              : {
                  isPurchased: purchasedProductIds.includes(product.id),
                  isUnlocked: purchasedProductIds.includes(product.id),
                  isExpired: false,
                  daysRemaining: 90,
                  expiresAt: null
                };

            return (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={onPreviewProduct}
                onInstantBuy={onInstantBuy}
                onOpenReviews={onOpenReviews}
                onFreeDownload={onFreeDownload}
                isPurchased={accessStatus.isPurchased}
                isUnlocked={accessStatus.isUnlocked}
                isExpired={accessStatus.isExpired}
                daysRemaining={accessStatus.daysRemaining}
                currency={currency}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
