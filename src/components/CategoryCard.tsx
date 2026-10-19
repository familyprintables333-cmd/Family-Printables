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
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* High-Quality Cover Image */}
      <div className="relative aspect-[16/9] sm:aspect-[4/3] bg-slate-100 overflow-hidden">
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

      {/* Content Area: Category Title, Short Benefit Description, and Modern Compact Button */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
        <div className="space-y-0.5 sm:space-y-1.5">
          <h3 className="text-sm sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
            {category.title}
          </h3>

          <p className="text-[11px] sm:text-sm text-slate-600 leading-snug line-clamp-2">
            {category.shortDescription}
          </p>
        </div>

        {/* Modern, Highly Attractive Redesigned Button */}
        <div className="pt-1.5 sm:pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(category.id);
            }}
            className="w-full py-2 sm:py-3 px-3 sm:px-4 text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-400 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group/btn tracking-wide cursor-pointer"
          >
            <span>Explore Collection</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
