import React from 'react';
import { Sparkles, Printer, Calendar, BookOpen, Gift, FileSpreadsheet } from 'lucide-react';

interface StoreHeroProps {
  onQuickNav?: (target: string) => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ onQuickNav }) => {
  return (
    <header className="max-w-4xl mx-auto text-center space-y-4 mb-10 sm:mb-14">
      {/* Search Engine Verified Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-200 bg-sky-950/80 border border-sky-700/60 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>100% Free Single-Page Printables &amp; High-Definition 300 DPI PDF Workbooks</span>
      </div>

      {/* Target Keyword H1: Free Printable Timetable, Custom Shop Khata Ledger PDF & Kids Workbooks */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
        Free Printable Timetable, Shop Khata Ledger PDF &amp;{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-pink-300">
          Kids Kindergarten Workbooks
        </span>
      </h1>

      {/* Targeted High-Volume Keywords Description */}
      <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
        Download instant single-page <strong>Free Printable Timetables</strong>, customizable <strong>Shop Khata Ledger PDFs</strong>, <strong>Printable Monthly Calendars</strong>, <strong>Kids Brain Teasers &amp; Kindergarten Activity Workbooks</strong>, and <strong>Printable Greeting Cards (Birthday, Christmas, Ramadan, Eid)</strong> in crystal-clear A4 and US Letter vector formats.
      </p>

      {/* High-Intent Keyword Feature Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
          <Printer className="w-3.5 h-3.5 text-sky-300" />
          <span>Free Printable Timetables</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
          <span>Custom Shop Khata Ledger PDF</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-300" />
          <span>Printable Monthly Calendars</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
          <BookOpen className="w-3.5 h-3.5 text-purple-300" />
          <span>Kids Brain Teasers &amp; Workbooks</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
          <Gift className="w-3.5 h-3.5 text-rose-300" />
          <span>Greeting Cards (Birthday, Christmas, Eid)</span>
        </span>
      </div>
    </header>
  );
};

