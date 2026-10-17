import React from 'react';
import { Sparkles } from 'lucide-react';
import { CategoryInfo } from '../types';
import { resolveImageUrl } from '../assets/images';

interface CategoryCardProps {
  category: CategoryInfo;
  onSelect: (categoryId: CategoryInfo['id']) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect
}) => {
  return (
    <article
      onClick={() => onSelect(category.id)}
      className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* High-Quality Cover Image (Zero overlays, no "1 Workbook" count, no age badges on image) */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={resolveImageUrl(category.image, category.id)}
          alt={category.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = resolveImageUrl(category.image, category.id);
          }}
        />
      </div>

      {/* Content Area: Category Title, Short Benefit Description, and Modern Redesigned Button */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {category.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {category.shortDescription}
          </p>
        </div>

        {/* Modern, Highly Attractive Redesigned Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(category.id);
            }}
            className="w-full py-3.5 px-5 text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-400 rounded-2xl shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn tracking-wide"
          >
            <span>Explore Collection</span>
            <Sparkles className="w-4 h-4 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
