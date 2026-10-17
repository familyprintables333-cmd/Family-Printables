import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Store, 
  GraduationCap, 
  Home, 
  Calendar, 
  Clock, 
  Receipt, 
  ClipboardList, 
  Boxes, 
  ShoppingBasket, 
  DollarSign, 
  UtensilsCrossed,
  Layers,
  Award,
  Search,
  BookOpenCheck,
  Check
} from 'lucide-react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/printableTemplates';
import { PrintableTemplate, TemplateCategoryId } from '../types/templates';

interface TemplateCatalogViewProps {
  onOpenTemplateInStudio: (templateId: string) => void;
  onOpenReviews: () => void;
  currency?: string;
  userPoints?: number;
}

export const TemplateCatalogView: React.FC<TemplateCatalogViewProps> = ({
  onOpenTemplateInStudio,
  onOpenReviews,
  currency = 'USD',
  userPoints = 150
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TemplateCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategoryFilter === 'all' || t.categoryId === selectedCategoryFilter;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.categoryTitle.toLowerCase().includes(q)
    );
  });

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-5 h-5 text-indigo-600" />;
      case 'CalendarRange': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'BookOpenCheck': return <BookOpenCheck className="w-5 h-5 text-indigo-600" />;
      case 'BookSpread': return <Store className="w-5 h-5 text-emerald-600" />;
      case 'ClipboardList': return <ClipboardList className="w-5 h-5 text-emerald-600" />;
      case 'Receipt': return <Receipt className="w-5 h-5 text-emerald-600" />;
      case 'Boxes': return <Boxes className="w-5 h-5 text-emerald-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'ShoppingBasket': return <ShoppingBasket className="w-5 h-5 text-amber-600" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5 text-amber-600" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-amber-600" />;
      default: return <Layers className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-[#0c233c] via-[#0f2d4e] to-[#081525] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-sky-200 bg-sky-950/80 border border-sky-700/60 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Interactive Live Print Studio · Clean Single-Page Templates</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Standard Home Printing Templates &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-pink-300">
                Live Studio
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Single-page educational study timetables, small shop ledgers (Khata books) with customizable headers, and family lifestyle planners. Optimized for A4 and US Letter with zero margin cutoff.
            </p>

            {/* Quick 4 Color Themes Teaser */}
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-300">
              <span className="text-slate-400">Available Themes:</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-semibold">
                ✨ Pastel Dream
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                🌿 Botanical Forest
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold">
                ☀️ Warm Sunshine
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-400/30 font-semibold">
                🖤 Modern Minimalist
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                    {cat.id === 'educational-study' && <GraduationCap className="w-5 h-5 text-indigo-600" />}
                    {cat.id === 'shop-business' && <Store className="w-5 h-5 text-emerald-600" />}
                    {cat.id === 'personal-home' && <Home className="w-5 h-5 text-amber-600" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>View 4 Templates</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategoryFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Templates ({TEMPLATES.length})
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('educational-study')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategoryFilter === 'educational-study'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Educational &amp; Study (4)
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('shop-business')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategoryFilter === 'shop-business'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Shop &amp; Business (4)
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('personal-home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategoryFilter === 'personal-home'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              3. Personal &amp; Home (4)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 12 Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isShop = template.categoryId === 'shop-business';
            return (
              <article
                key={template.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {getTemplateIcon(template.iconName)}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>100% Free &amp; Unlocked</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {template.categoryTitle}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {template.subtitle}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                    {isShop ? (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Editable Header: Shop Name, Phone &amp; Address</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-indigo-800 font-bold">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Single-Page A4 / US Letter home printing fit</span>
                      </div>
                    )}
                    <div className="text-slate-500">
                      • Pastel, Botanical, Sunshine &amp; Minimalist styles
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                    FREE $0.00
                  </span>

                  <button
                    onClick={() => onOpenTemplateInStudio(template.id)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open in Studio</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Earn & Review Program Teaser Card */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Earn &amp; Review Reward Program</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Love Our Templates? Leave a Review &amp; Earn +50 Points!
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Earn rewards for testing templates, sharing verified ratings, and checking in daily. Review on the Google Play Store for an instant +100 point bonus.
            </p>
          </div>

          <button
            onClick={onOpenReviews}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs sm:text-sm font-black shadow-lg transition active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>Visit Reviews &amp; Rewards</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
