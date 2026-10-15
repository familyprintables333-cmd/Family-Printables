import React from 'react';
import { Sparkles } from 'lucide-react';

export const StoreHero: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-10 sm:mb-14">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-200 bg-sky-950/80 border border-sky-700/60 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>Instant Digital Workbooks &amp; Activity Sheets</span>
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
        Fun Workbooks, Activity Sheets &amp;{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-pink-300">
          Audio Stories for Kids
        </span>
      </h1>
      <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
        Instant print-ready learning workbooks, daily habit charts, and bedtime adventures designed for curious young learners and organized families.
      </p>
    </div>
  );
};
