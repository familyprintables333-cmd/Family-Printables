import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Printer, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  Lightbulb, 
  Share2,
  Calendar
} from 'lucide-react';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogArticles';
import { CategoryId } from '../types';

interface GuidesBlogSectionProps {
  onBackToStore: () => void;
  onSelectCategory?: (categoryId: CategoryId) => void;
}

export const GuidesBlogSection: React.FC<GuidesBlogSectionProps> = ({
  onBackToStore,
  onSelectCategory,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'neuroscience', label: 'Child Neuroscience' },
    { id: 'homeschool', label: 'Homeschool & Routine' },
    { id: 'printing', label: 'Printing & Lamination' },
    { id: 'psychology', label: 'Positive Psychology' },
  ];

  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    if (filterCategory === 'all') return true;
    return article.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Resource Hub:</span>
            <span className="font-extrabold text-slate-900 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
              Learning Guides &amp; Blog
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0c233c] via-[#0f2d4e] to-[#0a1b2e] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Parent &amp; Educator Learning Library</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Practical Guides, Screen-Free Habits &amp; Printing Hacks
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore science-backed advice on early childhood development, pencil grip milestones, daily routine strategies, and high-efficiency home printing tips.
            </p>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-full">
                    {article.tag}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium line-clamp-2">{article.keyTakeaways[0]}</span>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{article.date}</span>
                <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedArticle(null)} 
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {selectedArticle.tag}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>

              {selectedArticle.keyTakeaways && selectedArticle.keyTakeaways.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Key Takeaway</span>
                    <span>{selectedArticle.keyTakeaways[0]}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                {selectedArticle.content?.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onBackToStore();
                }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Browse Matching Workbooks
              </button>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
