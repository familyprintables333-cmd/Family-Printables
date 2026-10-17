import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  Printer, 
  ShieldCheck, 
  Clock, 
  Search,
  BookOpen
} from 'lucide-react';
import { CategoryInfo, Product, UserAccount } from '../types';
import { ProductCard } from './ProductCard';
import { resolveImageUrl } from '../assets/images';
import { getProductAccessStatus } from '../utils/access';

interface CategoryDetailViewProps {
  category: CategoryInfo;
  products: Product[];
  onBackToCategories: () => void;
  onPreviewProduct: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onOpenReviews: (product: Product) => void;
  onFreeDownload: (product: Product) => void;
  purchasedProductIds: string[];
  account: UserAccount;
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
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by category and search
  const categoryProducts = products.filter(
    (p) => p.category === category.id
  );

  const filteredProducts = categoryProducts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query) ||
      p.targetAge.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBackToCategories}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Collection:</span>
            <span className="font-extrabold text-slate-900 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
              {category.shortTitle || category.title}
            </span>
            <span className="text-slate-400">({categoryProducts.length} workbooks)</span>
          </div>
        </div>
      </div>

      {/* Hero Header Banner */}
      <section className="bg-gradient-to-r from-[#0c233c] via-[#0f2d4e] to-[#0a1b2e] text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{category.badge || 'Curated Learning Series'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {category.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {category.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 pt-2">
                {category.features?.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white text-xs rounded-lg backdrop-blur-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual Mini Banner */}
            <div className="hidden md:block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15">
                <img
                  src={resolveImageUrl(category.image, category.id)}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveImageUrl(category.image, category.id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${category.shortTitle || 'this collection'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
            <span className="flex items-center gap-1">
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>US Letter &amp; A4 PDFs</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Digital Delivery</span>
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No workbooks found</h3>
            <p className="text-xs text-slate-500">
              Try a different keyword or return to view all items.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const access = getProductAccessStatus(product.id, account, product);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={() => onPreviewProduct(product)}
                  onInstantBuy={() => onInstantBuy(product)}
                  onOpenReviews={() => onOpenReviews(product)}
                  onFreeDownload={() => onFreeDownload(product)}
                  isPurchased={purchasedProductIds.includes(product.id)}
                  isUnlocked={access.isUnlocked}
                  isExpired={access.isExpired}
                  daysRemaining={access.daysRemaining}
                  currency={currency}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
