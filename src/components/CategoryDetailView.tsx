import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Lock, 
  Layers,
  BookOpen,
  Volume2,
  Play,
  X
} from 'lucide-react';
import { CategoryInfo, Product, UserAccount } from '../types';
import { ProductCard } from './ProductCard';

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
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [activeMediaPreview, setActiveMediaPreview] = useState<{
    title: string;
    url: string;
    type: 'audio' | 'video';
  } | null>(null);

  // All products belonging to this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === category.id);
  }, [products, category.id]);

  const freeCount = useMemo(() => {
    return categoryProducts.filter((p) => p.isFree || p.accessType === 'free' || p.priceUSD === 0).length;
  }, [categoryProducts]);

  const paidCount = useMemo(() => {
    return categoryProducts.filter((p) => !p.isFree && p.accessType !== 'free' && p.priceUSD > 0).length;
  }, [categoryProducts]);

  // Filtered & Sorted products
  const displayProducts = useMemo(() => {
    let list = [...categoryProducts];

    if (filterType === 'free') {
      list = list.filter((p) => p.isFree || p.accessType === 'free' || p.priceUSD === 0);
    } else if (filterType === 'paid') {
      list = list.filter((p) => !p.isFree && p.accessType !== 'free' && p.priceUSD > 0);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.priceUSD || 0) - (b.priceUSD || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.priceUSD || 0) - (a.priceUSD || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [categoryProducts, filterType, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Sticky Clean Breadcrumb Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-14 sm:top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <button
            onClick={onBackToCategories}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Collections</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
              {category.shortTitle || category.title}
            </span>
            <span className="text-slate-500 font-semibold hidden xs:inline">
              ({categoryProducts.length} Workbooks &amp; Packs)
            </span>
          </div>
        </div>
      </header>

      {/* Clean Compact Category Header (Zero heavy text, zero center search clutter) */}
      <div className="bg-gradient-to-r from-[#0d2238] via-[#102a46] to-[#0a1b2d] text-white py-5 sm:py-7 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[11px] font-bold rounded-full border border-indigo-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{category.badge || 'Curated Printable Series'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                {category.title}
              </h1>
              <p className="text-xs text-slate-300">
                {category.tagline || 'High-Definition Standard A4 & Universal Printable PDFs'}
              </p>
            </div>

            {/* In-App Media Player Announcement for Audio/Video Stories */}
            {category.id === 'audio-stories' && (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-400/40 rounded-xl text-xs text-purple-200 font-bold self-start sm:self-auto">
                <Volume2 className="w-4 h-4 text-purple-300" />
                <span>Built-in In-App Audio &amp; Video Player Enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Items ({categoryProducts.length})
            </button>

            {freeCount > 0 && (
              <button
                onClick={() => setFilterType('free')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  filterType === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                100% Free ({freeCount})
              </button>
            )}

            {paidCount > 0 && (
              <button
                onClick={() => setFilterType('paid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  filterType === 'paid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                Premium Workbooks ({paidCount})
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold bg-white text-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid-Based Product Catalog Layout (Neatly displays 15-20 workbooks per category) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-slate-900">No items match this filter</h3>
            <p className="text-xs text-slate-500">Try switching back to "All Items" to view the full curated library.</p>
            <button
              onClick={() => setFilterType('all')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              View All {categoryProducts.length} Workbooks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="flex flex-col">
                <ProductCard
                  product={product}
                  onPreview={onPreviewProduct}
                  onInstantBuy={onInstantBuy}
                  onOpenReviews={onOpenReviews}
                  onFreeDownload={onFreeDownload}
                  onPlayMedia={() => {
                    setActiveMediaPreview({
                      title: product.title,
                      url: product.audioVideoUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                      type: product.mediaType === 'video' ? 'video' : 'audio',
                    });
                  }}
                  isPurchased={purchasedProductIds.includes(product.id)}
                  isUnlocked={purchasedProductIds.includes(product.id) || product.isFree}
                  currency={currency}
                />

                {/* Built-in in-app player launcher if product has audio/video */}
                {(product.audioVideoUrl || product.category === 'audio-stories') && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMediaPreview({
                        title: product.title,
                        url: product.audioVideoUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                        type: product.mediaType === 'video' ? 'video' : 'audio',
                      });
                    }}
                    className="mt-2 w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                    <span>In-App Audio Player</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Built-in In-App Audio & Video Player Modal */}
      {activeMediaPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-purple-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 truncate max-w-xs">
                    {activeMediaPreview.title}
                  </h4>
                  <span className="text-[10px] text-purple-600 font-bold">
                    Built-In In-App Media Player
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveMediaPreview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HTML5 Player */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white">
              {activeMediaPreview.type === 'video' ? (
                <video
                  controls
                  autoPlay
                  src={activeMediaPreview.url}
                  className="w-full rounded-xl max-h-64 bg-black"
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center p-6 bg-slate-800/80 rounded-xl">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center mx-auto animate-pulse">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-slate-300">
                        Playing: {activeMediaPreview.title}
                      </p>
                    </div>
                  </div>
                  <audio
                    controls
                    autoPlay
                    src={activeMediaPreview.url}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>High-Definition Digital Audio Stream</span>
              <button
                onClick={() => setActiveMediaPreview(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
