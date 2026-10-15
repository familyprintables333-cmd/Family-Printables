import React, { useState } from 'react';
import { Copy, Check, Calculator, Tag, Sparkles, BookCheck, TrendingUp } from 'lucide-react';
import { PRODUCTS, ETSY_TAGS_MAP, MOCK_ORDERS } from '../data/products';

export const EtsyAmazonHub: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [kdpPageCount, setKdpPageCount] = useState<number>(68);
  const [kdpPaperType, setKdpPaperType] = useState<'white' | 'cream' | 'color'>('white');

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const etsyData = ETSY_TAGS_MAP[selectedProductId] || {
    title: `${selectedProduct.title} | Instant Download PDF US Letter 8.5x11 & A4`,
    tags: [
      'kids printable',
      'family chore chart',
      'instant download pdf',
      'homeschool worksheet',
      'activity pages',
      'toddler workbook',
      'us letter size',
      'preschool curriculum',
      'dry erase chart',
      'bedtime routine',
      'reading workbook',
      'kindergarten pdf',
      'family organizer'
    ],
    descSnippet: '★ INSTANT DIGITAL DOWNLOAD ★\nNo physical shipping required. Includes US Letter & A4 size high-resolution print-ready PDFs.'
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const pageMultiplier = kdpPaperType === 'cream' ? 0.0025 : kdpPaperType === 'color' ? 0.002347 : 0.002252;
  const spineWidth = (kdpPageCount * pageMultiplier).toFixed(3);
  const trimWidth = 8.5;
  const trimHeight = 11.0;
  const bleed = 0.125;
  const totalCoverWidth = ((trimWidth * 2) + parseFloat(spineWidth) + (bleed * 2)).toFixed(3);
  const totalCoverHeight = (trimHeight + (bleed * 2)).toFixed(3);

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 tracking-wider uppercase bg-indigo-100/70 px-3 py-1 rounded-full border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Etsy &amp; Amazon KDP Seller Command Center</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Scale on Etsy &amp; Amazon KDP with Ready-to-Use Listings
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Generate 1-click SEO titles, 13 high-volume Etsy tags, and calculated Amazon KDP trim &amp; spine dimensions for your educational workbooks and bedtime storybooks.
          </p>
        </div>

        {/* Global Sales & Orders Tracker Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Live Global Orders &amp; Fulfillment Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated instant digital fulfillment tokens for buyers across USA, UK, Canada &amp; Australia
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-slate-600">
                Sample Revenue:{' '}
                <strong className="text-slate-900 tabular-nums font-bold">$1,482.50 USD</strong>
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Automated
              </span>
            </div>
          </div>

          {/* Orders list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">{order.id}</span>
                  <span className="text-slate-400 text-[11px]">{order.date}</span>
                </div>
                <div className="font-medium text-slate-900 truncate">{order.customerName}</div>
                <div className="text-slate-500 text-[11px] truncate">{order.city}, {order.country}</div>
                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-emerald-700 tabular-nums">${order.totalUSD.toFixed(2)}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
            Select Printable or eBook:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {PRODUCTS.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.title} (${prod.priceUSD.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Etsy SEO Kit */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <span>Etsy Listing SEO Generator</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formatted with 13 high-rank search tags &amp; instant digital delivery disclaimers
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                Etsy Ready
              </span>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Etsy Optimized Title (140 Chars):
                </label>
                <button
                  onClick={() => handleCopy(etsyData.title, 'title')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  {copiedField === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'title' ? 'Copied!' : 'Copy Title'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed">
                {etsyData.title}
              </div>
            </div>

            {/* 13 Etsy Search Tags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  13 High-Volume Etsy Search Tags:
                </label>
                <button
                  onClick={() => handleCopy(etsyData.tags.join(', '), 'tags')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  {copiedField === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'tags' ? 'Copied!' : 'Copy All 13 Tags'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {etsyData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-1 bg-white text-slate-700 rounded-md border border-slate-200 shadow-2xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Listing Description Snippet */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Etsy Description &amp; Digital Delivery Guide:
                </label>
                <button
                  onClick={() => handleCopy(etsyData.descSnippet, 'desc')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  {copiedField === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'desc' ? 'Copied!' : 'Copy Description'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {etsyData.descSnippet}
              </pre>
            </div>
          </div>

          {/* Right Column: Amazon KDP Specs Calculator */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-blue-600" />
                <span>Amazon KDP Book Specs</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paperback trim size, bleed, and cover spine calculator
              </p>
            </div>

            {/* Page Count input */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Interior Page Count:
                </label>
                <input
                  type="number"
                  min="24"
                  max="400"
                  value={kdpPageCount}
                  onChange={(e) => setKdpPageCount(parseInt(e.target.value) || 24)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Paper &amp; Ink Type:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setKdpPaperType('white')}
                    className={`py-2 px-1 text-center rounded-xl border font-semibold ${
                      kdpPaperType === 'white' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    B&amp;W White
                  </button>
                  <button
                    type="button"
                    onClick={() => setKdpPaperType('cream')}
                    className={`py-2 px-1 text-center rounded-xl border font-semibold ${
                      kdpPaperType === 'cream' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    B&amp;W Cream
                  </button>
                  <button
                    type="button"
                    onClick={() => setKdpPaperType('color')}
                    className={`py-2 px-1 text-center rounded-xl border font-semibold ${
                      kdpPaperType === 'color' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Standard Color
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 space-y-3">
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Calculated Print Dimensions:</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-blue-200/60">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Standard Trim</div>
                  <div className="font-bold text-slate-900 tabular-nums">8.5" x 11.0" in</div>
                  <div className="text-[10px] text-slate-500">21.59 x 27.94 cm</div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-blue-200/60">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Spine Width</div>
                  <div className="font-bold text-blue-700 tabular-nums">{spineWidth} in</div>
                  <div className="text-[10px] text-slate-500">{(parseFloat(spineWidth) * 25.4).toFixed(2)} mm</div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-blue-200/60 col-span-2">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Full Cover (With Bleed)</div>
                  <div className="font-bold text-slate-900 tabular-nums text-sm">
                    {totalCoverWidth}" W × {totalCoverHeight}" H
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Target canvas size at 300 DPI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
