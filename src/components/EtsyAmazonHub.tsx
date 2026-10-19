import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Printer, 
  ShoppingBag,
  Zap
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const EtsyAmazonHub: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0c233c] via-[#0f2d4e] to-[#0a1b2e] text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
              <Zap className="w-3.5 h-3.5" />
              <span>Multi-Platform Publishing Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Etsy &amp; Amazon KDP Export Toolkit
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Generate ready-to-paste Etsy listing descriptions, keywords, tags, and KDP 8.5" x 11" bleed interior guidelines for your printable workbook catalog.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Etsy Digital Download Package Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Etsy Instant Download Config</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Standard 5-File Zip Bundle</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">Etsy Listing Optimizer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Etsy requires ZIP archives under 20MB. All product PDFs in this catalog are pre-compressed with vector fonts for instant customer delivery without pixelation.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-700">Recommended 13 Etsy Tags:</div>
              <div className="flex flex-wrap gap-1.5">
                {['toddler workbook', 'preschool tracing', 'homeschool printable', 'screen free kids', 'kindergarten math', 'dry erase reusable', 'a4 printables', 'morning routine chart', 'kids activity sheets', 'pencil grip practice', 'sight words kindergarten', 'alphabet flashcards', 'instant download pdf'].map((tag, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleCopy('toddler workbook, preschool tracing, homeschool printable, screen free kids, kindergarten math, dry erase reusable, a4 printables, morning routine chart, kids activity sheets, pencil grip practice, sight words kindergarten, alphabet flashcards, instant download pdf', 'etsy-tags')}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copiedId === 'etsy-tags' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copied 13 Tags to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy 13 Etsy Tags</span>
                </>
              )}
            </button>
          </div>

          {/* Amazon KDP Interior Publishing Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" />
                <span>Amazon KDP Paperback Specifications</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">8.5" x 11" Bleed</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">Amazon KDP Interior Guide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every workbook in your store matches Amazon KDP's standard 8.5" x 11" trim specifications with safe 0.375" inner gutters, making them paperback print-on-demand ready.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-700">KDP Print Specs:</div>
              <ul className="space-y-1 text-slate-600">
                <li>• <strong>Trim Size:</strong> 8.5 x 11 inches (21.59 x 27.94 cm)</li>
                <li>• <strong>Bleed:</strong> Bleed settings enabled (8.625 x 11.25 in)</li>
                <li>• <strong>Color:</strong> Black &amp; white interior on white paper</li>
                <li>• <strong>Cover:</strong> Glossy paperback finish recommended</li>
              </ul>
            </div>

            <button
              onClick={() => handleCopy('Trim: 8.5x11 inches | Bleed: 8.625x11.25 | Interior: Black and white on 55lb white paper | Cover: Glossy paperback', 'kdp-specs')}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copiedId === 'kdp-specs' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copied KDP Specs!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy KDP Dimension Specs</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
