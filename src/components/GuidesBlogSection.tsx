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

interface GuidesBlogSectionProps {
  onBackToStore: () => void;
}

export const GuidesBlogSection: React.FC<GuidesBlogSectionProps> = ({ onBackToStore }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredArticles = activeFilter === 'all' 
    ? BLOG_ARTICLES 
    : BLOG_ARTICLES.filter(a => a.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition shadow-2xs group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Store &amp; Workbooks</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Parent &amp; Educator Learning Center</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Educational Guides &amp; Screen-Free Learning Articles
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Evidence-based strategies on tactile pencil-to-paper learning, daily visual routines, budget-friendly lamination hacks, and developmental STEM milestones curated for mindful families.
          </p>
        </div>

        {/* Educational Philosophy & Mission Box (Moved from Front Page to Keep Store Clean) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Our Educational Philosophy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Why We Champion Tactile, Screen-Free Play Over Digital Apps
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Early childhood research reveals that physical pencil-to-paper movement activates motor-sensory regions that digital screens cannot replicate. Tracing, holding markers, and solving physical mazes build bilateral hand coordination, fine-motor stamina, and lasting attention spans. All our workbooks are formatted for instant home printing and reusable with dry-erase plastic sleeves.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-indigo-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                300 DPI High-Resolution Vectors
              </span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-sky-400" />
                Standard US Letter &amp; A4 Formats
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Single Household &amp; Classroom License
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'neuroscience', label: 'Brain Development' },
            { id: 'homeschool', label: 'Homeschool & Lamination' },
            { id: 'psychology', label: 'Visual Routines' },
            { id: 'stem', label: 'Logic & Critical Thinking' },
            { id: 'printing', label: 'Printing Masterclass' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {article.tag}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Call-to-Action Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 text-center space-y-4 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900">
            Ready to Put These Guides into Practice?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Browse our full catalog of tracing workbooks, routine boards, and brain teasers starting at just $1–$4 with instant download delivery.
          </p>
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-indigo-100"
          >
            <span>Explore Workbooks Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-700 bg-indigo-100/70 px-3 py-1 rounded-full text-xs">
                  {selectedArticle.tag}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 italic">
                {selectedArticle.excerpt}
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedArticle.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {selectedArticle.keyTakeaways && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Takeaways for Parents:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    {selectedArticle.keyTakeaways.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Family Printables Educational Team</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
