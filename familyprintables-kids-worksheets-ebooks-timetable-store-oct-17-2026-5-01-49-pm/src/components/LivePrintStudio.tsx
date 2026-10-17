import React, { useState, useRef, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  RotateCcw, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Check, 
  Clock, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  ShoppingBag, 
  Edit3, 
  Palette, 
  Maximize2,
  ChevronRight,
  Plus,
  Trash2,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { 
  PRINT_THEMES, 
  TEMPLATES, 
  TEMPLATE_CATEGORIES, 
  DEFAULT_BUSINESS_HEADER 
} from '../data/printableTemplates';
import { 
  PrintThemeId, 
  PaperSize, 
  TemplateCategoryId, 
  PrintableTemplate, 
  ShopBusinessHeader 
} from '../types/templates';

const TEMPLATE_INSPIRING_QUOTES: Record<string, string> = {
  'daily-timetable': 'Small daily steps lead to big family moments — Family Printables',
  'weekly-timetable': 'Consistency each week turns simple routines into lifelong success — Family Printables',
  'monthly-calendar': 'Cherish every day with joyful planning, gratitude, and purpose — Family Printables',
  'study-planner': 'Knowledge grows with daily patience, focus, and curiosity — Family Printables',
  'shop-ledger': 'Honest accounts build lasting customer trust and a thriving business — Family Printables',
  'order-booking': 'Prompt service and sincere care turn customers into lifelong friends — Family Printables',
  'billing-receipt': 'Clear communication and trust are the foundation of good business — Family Printables',
  'inventory-sheet': 'Orderly management brings peace of mind and prosperity — Family Printables',
  'family-chore': 'Teamwork makes our home happier, and every helping hand shines — Family Printables',
  'grocery-list': 'Nourishing our family with wholesome food, love, and care — Family Printables',
  'monthly-budget': 'Financial peace begins with intentional choices and shared family values — Family Printables',
  'meal-planner': 'Warm meals and happy laughter begin around the family table — Family Printables',
};

interface LivePrintStudioProps {
  initialTemplateId?: string;
  onTemplateExported?: (templateId: string) => void;
  currency?: string;
  isUnlockedDefault?: boolean;
}

export const LivePrintStudio: React.FC<LivePrintStudioProps> = ({
  initialTemplateId = 'daily-timetable',
  onTemplateExported,
  currency = 'USD',
  isUnlockedDefault = true
}) => {
  // Studio State
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId>('educational-study');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplateId);
  const [selectedTheme, setSelectedTheme] = useState<PrintThemeId>('pastel');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Shop & Business Custom Header State
  const [businessHeader, setBusinessHeader] = useState<ShopBusinessHeader>(() => {
    try {
      const saved = localStorage.getItem('fp_custom_business_header');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BUSINESS_HEADER;
  });

  // Save business header to local storage
  const handleUpdateBusinessHeader = (key: keyof ShopBusinessHeader, val: string) => {
    const updated = { ...businessHeader, [key]: val };
    setBusinessHeader(updated);
    try {
      localStorage.setItem('fp_custom_business_header', JSON.stringify(updated));
    } catch {}
  };

  // Educational & Study Customization State
  const [eduStudentName, setEduStudentName] = useState('Alex Morgan');
  const [eduMonthYear, setEduMonthYear] = useState('October 2026');
  const [eduExamDate, setEduExamDate] = useState('Nov 15, 2026');

  // Personal & Home Customization State
  const [homeFamilyName, setHomeFamilyName] = useState('The Morgan Family');
  const [homeTargetBudget, setHomeTargetBudget] = useState('3,800.00');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Printable Canvas / Ref
  const sheetContainerRef = useRef<HTMLDivElement>(null);

  // Active theme & template
  const currentTheme = PRINT_THEMES[selectedTheme] || PRINT_THEMES.pastel;
  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  // Sync category when template changes
  useEffect(() => {
    const found = TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (found && found.categoryId !== selectedCategory) {
      setSelectedCategory(found.categoryId);
    }
  }, [selectedTemplateId]);

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
    showToast('Sent to printer! Single-page format optimized.');
    if (onTemplateExported) onTemplateExported(currentTemplate.id);
  };

  // Generate High-Res 300 DPI PDF using jsPDF
  const handleDownloadPDF = () => {
    try {
      const isA4 = paperSize === 'a4';
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: isA4 ? 'a4' : 'letter'
      });

      const pageWidth = isA4 ? 210 : 215.9;
      const pageHeight = isA4 ? 297 : 279.4;

      // Primary theme colors
      const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      };

      const primaryRgb = hexToRgb(currentTheme.primaryColor);
      const secondaryRgb = hexToRgb(currentTheme.secondaryColor);

      // Outer Decorative Border (Single Page)
      doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.setLineWidth(0.8);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Header Banner
      doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.roundedRect(14, 14, pageWidth - 28, 18, 3, 3, 'F');

      // Title (Clean title only - no category badge or paper size pill)
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(currentTemplate.title.toUpperCase(), pageWidth / 2, 25.5, { align: 'center' });

      // Secondary details & Header info
      let contentY = 40;
      if (currentTemplate.categoryId === 'shop-business') {
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(businessHeader.shopName, 16, contentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Owner: ${businessHeader.ownerName}  |  Contact: ${businessHeader.contactNumber}`, 16, contentY + 5);
        doc.text(`Address: ${businessHeader.address}, ${businessHeader.cityState}`, 16, contentY + 10);
        if (businessHeader.taxNumber) {
          doc.text(businessHeader.taxNumber, pageWidth - 16, contentY + 5, { align: 'right' });
        }
        contentY += 16;
      } else if (currentTemplate.categoryId === 'educational-study') {
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`Student: ${eduStudentName}`, 16, contentY);
        doc.text(`Academic Period: ${eduMonthYear}`, pageWidth - 16, contentY, { align: 'right' });
        contentY += 8;
      } else {
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`Family: ${homeFamilyName}`, 16, contentY);
        doc.text(`Target: $${homeTargetBudget}`, pageWidth - 16, contentY, { align: 'right' });
        contentY += 8;
      }

      // Draw Structured Grid Rows
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      const rowHeight = 9.5;
      const numRows = Math.floor((pageHeight - contentY - 26) / rowHeight);

      // Table Header Row
      doc.setFillColor(240, 242, 248);
      doc.rect(14, contentY, pageWidth - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);

      if (currentTemplate.id === 'shop-ledger') {
        doc.text('Date', 18, contentY + 5.5);
        doc.text('Particulars / Customer Note', 45, contentY + 5.5);
        doc.text('Debit (-)', 115, contentY + 5.5);
        doc.text('Credit (+)', 145, contentY + 5.5);
        doc.text('Balance', 175, contentY + 5.5);
      } else if (currentTemplate.id === 'daily-timetable') {
        doc.text('Time Block', 18, contentY + 5.5);
        doc.text('Task / Subject Focus', 60, contentY + 5.5);
        doc.text('Priority', 135, contentY + 5.5);
        doc.text('Done [X]', 175, contentY + 5.5);
      } else if (currentTemplate.id === 'grocery-list') {
        doc.text('Item Description', 18, contentY + 5.5);
        doc.text('Category Section', 85, contentY + 5.5);
        doc.text('Qty / Weight', 135, contentY + 5.5);
        doc.text('Got It [X]', 175, contentY + 5.5);
      } else {
        doc.text('S.No', 18, contentY + 5.5);
        doc.text('Description / Key Milestone', 45, contentY + 5.5);
        doc.text('Target / Budget', 135, contentY + 5.5);
        doc.text('Status', 175, contentY + 5.5);
      }

      contentY += 8;

      // Table Data Lines
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      for (let r = 0; r < numRows; r++) {
        const lineY = contentY + r * rowHeight;
        if (r % 2 === 1) {
          doc.setFillColor(250, 250, 252);
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
        }
        doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');

        // Checkbox square
        doc.setDrawColor(180, 180, 180);
        doc.rect(pageWidth - 26, lineY + 2.5, 4.5, 4.5);
      }

      // Single-Page Footer with Warm Inspiring Statement
      const footerY = pageHeight - 12;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const inspiringQuote = TEMPLATE_INSPIRING_QUOTES[currentTemplate.id] || 'Small daily steps lead to big family moments — Family Printables';
      doc.text(`"${inspiringQuote}"`, pageWidth / 2, footerY, { align: 'center' });

      // Save PDF
      const fileName = `${currentTemplate.id}_${selectedTheme}_${paperSize.toUpperCase()}.pdf`;
      doc.save(fileName);
      showToast(`Downloaded Single-Page PDF: ${fileName}`);
      if (onTemplateExported) onTemplateExported(currentTemplate.id);
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Error generating PDF. Please use Direct Print.');
    }
  };

  // Filter templates by current category
  const filteredTemplates = TEMPLATES.filter((t) => t.categoryId === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Navigation & Hero */}
      <section className="bg-gradient-to-r from-[#0d2238] via-[#102b48] to-[#0a1b2d] text-white py-8 sm:py-12 border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Live Print Studio · Single-Page Clean Templates</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Printable Template Studio &amp; Live Preview
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose your theme style, paper format (A4 / US Letter), customize business headers or study goals, and print single-page high-definition templates instantly.
              </p>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition active:scale-95"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>Direct Home Print</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <Download className="w-4 h-4 text-white" />
                <span>300 DPI PDF</span>
              </button>
            </div>
          </div>

          {/* 3 Main Category Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const firstInCat = TEMPLATES.find((t) => t.categoryId === cat.id);
                    if (firstInCat) setSelectedTemplateId(firstInCat.id);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-white/15 border-white text-white shadow-md ring-2 ring-indigo-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      {cat.badge}
                    </span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <h3 className="text-sm font-extrabold text-white mt-1">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-300/90 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================================================================ */}
          {/* LEFT COLUMN: CUSTOMIZATION CONTROLS (THEMES, SIZES, HEADERS) */}
          {/* UPGRADED SOFT LAVENDER-TO-ROSE & WARM CREAM-TO-PEACH GRADIENT */}
          {/* ================================================================ */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#ede9fe] via-[#fce7f3] to-[#ffedd5] rounded-3xl p-5 sm:p-7 border-2 border-purple-200/90 shadow-xl space-y-6 no-print">
            
            {/* 1. Template Selector for Active Category */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-700" />
                  <span>Choose Template ({filteredTemplates.length})</span>
                </label>
                <span className="text-[10px] text-purple-800 bg-white/90 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                  Single-Page Clean Fit
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedTemplateId === t.id
                        ? 'bg-white border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-400'
                        : 'bg-white/85 hover:bg-white border-purple-100/90 text-slate-700 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{t.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md shrink-0 ml-2 shadow-2xs">
                      Unlocked Free
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Print Themes & Color Styles Selector */}
            <div className="pt-5 border-t border-purple-200/60 space-y-3">
              <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-700" />
                <span>Print Theme &amp; Color Style</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(PRINT_THEMES) as PrintThemeId[]).map((themeKey) => {
                  const theme = PRINT_THEMES[themeKey];
                  const isSelected = selectedTheme === themeKey;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(themeKey)}
                      className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-400'
                          : 'border-purple-100/90 bg-white/85 hover:bg-white text-slate-700 shadow-xs hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span 
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs" 
                          style={{ background: theme.primaryColor }}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 -ml-1" 
                          style={{ background: theme.secondaryColor }}
                        />
                        <span className="text-xs font-black text-slate-900 truncate">
                          {theme.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">
                        {theme.tagline}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Paper Size Selector (A4 & US Letter) */}
            <div className="pt-5 border-t border-purple-200/60 space-y-3">
              <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-purple-700" />
                <span>Standard Paper Size</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paperSize === 'a4'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-400 text-purple-950 font-bold'
                      : 'border-purple-100/90 bg-white/85 hover:bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">A4 Format</span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">Global</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">210 × 297 mm (International)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaperSize('us-letter')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paperSize === 'us-letter'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-400 text-purple-950 font-bold'
                      : 'border-purple-100/90 bg-white/85 hover:bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">US Letter</span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">US / CA</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">8.5 × 11 in (Home Printers)</div>
                </button>
              </div>
            </div>

            {/* 4. Category-Specific Editable Header Section */}
            {selectedCategory === 'shop-business' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Editable Business Header</span>
                  </label>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    Updates Live
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Shop / Business Name:</span>
                    <input
                      type="text"
                      value={businessHeader.shopName}
                      onChange={(e) => handleUpdateBusinessHeader('shopName', e.target.value)}
                      placeholder="e.g. Metro Supply & Hardware"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">Owner Name:</span>
                      <input
                        type="text"
                        value={businessHeader.ownerName}
                        onChange={(e) => handleUpdateBusinessHeader('ownerName', e.target.value)}
                        placeholder="Owner / Proprietor"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">Contact / Phone:</span>
                      <input
                        type="text"
                        value={businessHeader.contactNumber}
                        onChange={(e) => handleUpdateBusinessHeader('contactNumber', e.target.value)}
                        placeholder="Phone or Email"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Shop Address &amp; Location:</span>
                    <input
                      type="text"
                      value={businessHeader.address}
                      onChange={(e) => handleUpdateBusinessHeader('address', e.target.value)}
                      placeholder="Street Address, Market / Area"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">City, State / ZIP:</span>
                      <input
                        type="text"
                        value={businessHeader.cityState}
                        onChange={(e) => handleUpdateBusinessHeader('cityState', e.target.value)}
                        placeholder="City, State"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">Tax / Reg # (Optional):</span>
                      <input
                        type="text"
                        value={businessHeader.taxNumber || ''}
                        onChange={(e) => handleUpdateBusinessHeader('taxNumber', e.target.value)}
                        placeholder="e.g. TAX-ID / GST"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editable Fields for Educational & Study */}
            {selectedCategory === 'educational-study' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Academic &amp; Student Fields</span>
                  </label>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Student / User Name:</span>
                    <input
                      type="text"
                      value={eduStudentName}
                      onChange={(e) => setEduStudentName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Study Month / Year:</span>
                    <input
                      type="text"
                      value={eduMonthYear}
                      onChange={(e) => setEduMonthYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Editable Fields for Personal & Home Management */}
            {selectedCategory === 'personal-home' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-indigo-600" />
                    <span>Family &amp; Planner Customization</span>
                  </label>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Family / Household Name:</span>
                    <input
                      type="text"
                      value={homeFamilyName}
                      onChange={(e) => setHomeFamilyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Target Monthly Budget:</span>
                    <input
                      type="text"
                      value={homeTargetBudget}
                      onChange={(e) => setHomeTargetBudget(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setBusinessHeader(DEFAULT_BUSINESS_HEADER);
                  setEduStudentName('Alex Morgan');
                  setEduMonthYear('October 2026');
                  setHomeFamilyName('The Morgan Family');
                  showToast('Reset to clean defaults');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Quick Print</span>
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: INTERACTIVE LIVE SHEET PREVIEW (CLEAN SINGLE-PAGE) */}
          {/* ================================================================ */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Preview Top Bar */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-800">
                  Interactive Live Print Preview
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  · {paperSize.toUpperCase()} Single-Page View
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  title="Print this sheet"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  title="Download single-page PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>

            {/* The Actual Single-Page Paper Sheet Canvas Container */}
            <div className="flex justify-center bg-slate-200/60 p-2 sm:p-6 rounded-3xl overflow-x-auto">
              <div 
                ref={sheetContainerRef}
                id="printable-sheet"
                style={{
                  width: paperSize === 'a4' ? '210mm' : '8.5in',
                  minHeight: paperSize === 'a4' ? '297mm' : '11in',
                  maxHeight: paperSize === 'a4' ? '297mm' : '11in',
                  background: '#FFFFFF',
                  color: currentTheme.textColor,
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)',
                  borderColor: currentTheme.borderColor,
                }}
                className="p-6 sm:p-8 flex flex-col justify-between border relative overflow-hidden transition-all duration-300 select-none single-page-print"
              >
                {/* Outer Decorative Double Border */}
                <div 
                  className="absolute inset-2.5 border-2 pointer-events-none rounded-xl opacity-70"
                  style={{ borderColor: currentTheme.primaryColor }}
                />
                <div 
                  className="absolute inset-3.5 border pointer-events-none rounded-lg opacity-40"
                  style={{ borderColor: currentTheme.secondaryColor }}
                />

                {/* ============================================================== */}
                {/* SHEET HEADER */}
                {/* ============================================================== */}
                <div className="relative z-10 space-y-3">
                  
                  {/* Clean Title Banner: Strictly Only Main Template Title */}
                  <div 
                    className="p-3.5 rounded-2xl text-white shadow-sm text-center"
                    style={{ background: currentTheme.headerBg }}
                  >
                    <h2 className="text-base sm:text-xl font-black tracking-tight leading-tight">
                      {currentTemplate.title}
                    </h2>
                  </div>

                  {/* Business Header if Shop & Business */}
                  {currentTemplate.categoryId === 'shop-business' && (
                    <div 
                      className="p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                      style={{ background: currentTheme.accentBg, borderColor: currentTheme.borderColor }}
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-black text-slate-900 tracking-tight">
                          {businessHeader.shopName}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          Proprietor: <strong className="text-slate-800">{businessHeader.ownerName}</strong> · Phone: {businessHeader.contactNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {businessHeader.address}, {businessHeader.cityState}
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-mono text-slate-600 shrink-0">
                        {businessHeader.taxNumber && (
                          <div className="font-bold text-slate-800">{businessHeader.taxNumber}</div>
                        )}
                        <div>Date: _______________</div>
                      </div>
                    </div>
                  )}

                  {/* Academic Header if Educational & Study */}
                  {currentTemplate.categoryId === 'educational-study' && (
                    <div 
                      className="p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                      style={{ background: currentTheme.accentBg, borderColor: currentTheme.borderColor }}
                    >
                      <div>
                        <span className="text-slate-500">Student: </span>
                        <strong className="text-slate-900 text-xs sm:text-sm">{eduStudentName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Period: </span>
                        <strong className="text-slate-800">{eduMonthYear}</strong>
                      </div>
                      <div className="text-slate-600 font-medium">
                        Goal: <span className="underline decoration-indigo-300">Top Focus &amp; Excellence</span>
                      </div>
                    </div>
                  )}

                  {/* Personal Header if Personal & Home Management */}
                  {currentTemplate.categoryId === 'personal-home' && (
                    <div 
                      className="p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                      style={{ background: currentTheme.accentBg, borderColor: currentTheme.borderColor }}
                    >
                      <div>
                        <span className="text-slate-500">Household: </span>
                        <strong className="text-slate-900 text-xs sm:text-sm">{homeFamilyName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Target Budget: </span>
                        <strong className="text-slate-800">${homeTargetBudget}</strong>
                      </div>
                      <div className="text-slate-600 font-medium">
                        Week of: <span className="underline decoration-amber-300">Current Week</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ============================================================== */}
                {/* SHEET BODY: FIXED STRUCTURED CLEAN TABLES */}
                {/* ============================================================== */}
                <div className="relative z-10 flex-1 my-3 overflow-hidden flex flex-col justify-between">
                  
                  {/* TEMPLATE A: SHOP LEDGER (KHATA BOOK) */}
                  {currentTemplate.id === 'shop-ledger' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                        <div className="col-span-2 text-left">Date</div>
                        <div className="col-span-4 text-left">Particulars / Customer Transaction</div>
                        <div className="col-span-2">Debit (-)</div>
                        <div className="col-span-2">Credit (+)</div>
                        <div className="col-span-2 text-right">Net Balance</div>
                      </div>
                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                        {[
                          { date: '10/01', desc: 'Opening Balance Carried Forward', dr: '—', cr: '$450.00', bal: '$450.00' },
                          { date: '10/03', desc: 'Inventory Supply - Order #942', dr: '$120.00', cr: '—', bal: '$330.00' },
                          { date: '10/06', desc: 'Cash Sales & Client Deposit', dr: '—', cr: '$280.00', bal: '$610.00' },
                          { date: '10/09', desc: 'Store Maintenance & Packaging', dr: '$65.00', cr: '—', bal: '$545.00' },
                          { date: '10/12', desc: 'Wholesale Invoice Cleared', dr: '—', cr: '$390.00', bal: '$935.00' },
                          { date: '10/15', desc: 'Utility Bill (Power & Internet)', dr: '$95.00', cr: '—', bal: '$840.00' },
                          { date: '10/18', desc: 'Direct Customer Payment (Cash)', dr: '—', cr: '$210.00', bal: '$1,050.00' },
                          { date: '10/22', desc: 'Custom Booking Advance Received', dr: '—', cr: '$150.00', bal: '$1,200.00' },
                          { date: '10/25', desc: 'Vendor Restock - Hardware Parts', dr: '$310.00', cr: '—', bal: '$890.00' },
                          { date: '10/29', desc: 'Weekend Retail Collections', dr: '—', cr: '$425.00', bal: '$1,315.00' },
                          { date: '____', desc: '', dr: '', cr: '', bal: '' },
                          { date: '____', desc: '', dr: '', cr: '', bal: '' }
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-12 py-1.5 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-2 text-left font-mono text-slate-500">{row.date}</div>
                            <div className="col-span-4 text-left font-medium text-slate-800 truncate">{row.desc}</div>
                            <div className="col-span-2 text-rose-600 font-mono font-bold">{row.dr}</div>
                            <div className="col-span-2 text-emerald-600 font-mono font-bold">{row.cr}</div>
                            <div className="col-span-2 text-right font-mono font-black text-slate-900">{row.bal}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE B: ORDER BOOKING FORM */}
                  {currentTemplate.id === 'order-booking' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                        <div className="col-span-1 text-left">#</div>
                        <div className="col-span-5 text-left">Item Description / Specs</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>
                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                        {[
                          { no: '1', item: 'Custom Wood Craft Shelves (Standard)', qty: '2 Pcs', rate: '$45.00', total: '$90.00' },
                          { no: '2', item: 'Heavy-Duty Steel Brackets & Hardware', qty: '4 Sets', rate: '$12.50', total: '$50.00' },
                          { no: '3', item: 'Protective Matte Sealant Finish', qty: '1 Service', rate: '$25.00', total: '$25.00' },
                          { no: '4', item: 'Delivery & Handling to Address', qty: '1 Trip', rate: '$15.00', total: '$15.00' },
                          { no: '5', item: 'Additional Custom Engraving / Labels', qty: '2 Pcs', rate: '$10.00', total: '$20.00' },
                          { no: '6', item: '', qty: '', rate: '', total: '' },
                          { no: '7', item: '', qty: '', rate: '', total: '' },
                          { no: '8', item: '', qty: '', rate: '', total: '' },
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-12 py-1.5 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-1 text-left font-mono text-slate-400">{row.no}</div>
                            <div className="col-span-5 text-left font-bold text-slate-800 truncate">{row.item}</div>
                            <div className="col-span-2 font-mono text-slate-600">{row.qty}</div>
                            <div className="col-span-2 font-mono text-slate-600">{row.rate}</div>
                            <div className="col-span-2 text-right font-mono font-black text-slate-900">{row.total}</div>
                          </div>
                        ))}
                      </div>

                      {/* Order Totals & Advance Bar */}
                      <div className="bg-slate-50 border-t border-slate-300 p-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                          <span className="text-slate-500 block text-[10px]">Total Order Amount:</span>
                          <strong className="text-sm font-black text-slate-900">$200.00</strong>
                        </div>
                        <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                          <span className="text-emerald-700 block text-[10px]">Advance Paid:</span>
                          <strong className="text-sm font-black text-emerald-600">$100.00</strong>
                        </div>
                        <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                          <span className="text-rose-700 block text-[10px]">Remaining Balance:</span>
                          <strong className="text-sm font-black text-rose-600">$100.00</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE C: INVOICE / BILLING RECEIPT */}
                  {currentTemplate.id === 'billing-receipt' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-slate-800">Invoice No:</strong> <span className="font-mono">INV-2026-089</span>
                        </div>
                        <div>
                          <strong className="text-slate-800">Due Date:</strong> <span className="font-mono">On Receipt</span>
                        </div>
                        <div>
                          <strong className="text-slate-800">Payment Mode:</strong> <span>Cash / Card / Bank</span>
                        </div>
                      </div>

                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                        <div className="col-span-1 text-left">S.No</div>
                        <div className="col-span-6 text-left">Product / Service Breakdown</div>
                        <div className="col-span-1">Qty</div>
                        <div className="col-span-2">Rate</div>
                        <div className="col-span-2 text-right">Amount</div>
                      </div>

                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                        {[
                          { no: '1', desc: 'Commercial Consulting & Print Layout Package', qty: '1', rate: '$120.00', amt: '$120.00' },
                          { no: '2', desc: 'Premium Cardstock Paper Stock (Bundle of 250)', qty: '2', rate: '$22.50', amt: '$45.00' },
                          { no: '3', desc: 'Double-Sided High-Gloss Thermal Lamination', qty: '40', rate: '$1.25', amt: '$50.00' },
                          { no: '4', desc: 'Custom Binder & Dividers Assembly Service', qty: '1', rate: '$15.00', amt: '$15.00' },
                          { no: '5', desc: '', qty: '', rate: '', amt: '' },
                          { no: '6', desc: '', qty: '', rate: '', amt: '' },
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-12 py-2 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-1 text-left font-mono text-slate-400">{row.no}</div>
                            <div className="col-span-6 text-left font-bold text-slate-800 truncate">{row.desc}</div>
                            <div className="col-span-1 font-mono text-slate-600">{row.qty}</div>
                            <div className="col-span-2 font-mono text-slate-600">{row.rate}</div>
                            <div className="col-span-2 text-right font-mono font-black text-slate-900">{row.amt}</div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 border-t border-slate-300 p-3 flex justify-between items-end">
                        <div className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                          Thank you for your business! Please inspect items on delivery.<br />
                          Terms: Goods once sold are backed by our 30-day quality guarantee.
                        </div>
                        <div className="space-y-1 text-right text-[11px] min-w-48">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal:</span>
                            <span className="font-mono font-bold">$230.00</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Sales Tax / VAT (5%):</span>
                            <span className="font-mono font-bold">$11.50</span>
                          </div>
                          <div className="flex justify-between text-base font-black text-slate-950 pt-1 border-t border-slate-300">
                            <span>Grand Total:</span>
                            <span className="text-emerald-700 font-mono">$241.50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE D: STOCK & INVENTORY SHEET */}
                  {currentTemplate.id === 'inventory-sheet' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                        <div className="col-span-2 text-left">SKU / Code</div>
                        <div className="col-span-4 text-left">Item Description</div>
                        <div className="col-span-1">Opening</div>
                        <div className="col-span-1">In (+)</div>
                        <div className="col-span-1">Out (-)</div>
                        <div className="col-span-1">Closing</div>
                        <div className="col-span-2 text-right">Reorder Level</div>
                      </div>
                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                        {[
                          { sku: 'SKU-101', name: 'A4 Bright White 32lb Paper (Ream)', op: '45', in: '20', out: '18', cl: '47', re: '15 Min' },
                          { sku: 'SKU-102', name: 'US Letter Cardstock 65lb (Pack 100)', op: '30', in: '10', out: '14', cl: '26', re: '10 Min' },
                          { sku: 'SKU-103', name: 'Dry-Erase Pocket Sleeves 9x12"', op: '80', in: '0', out: '25', cl: '55', re: '20 Min' },
                          { sku: 'SKU-104', name: 'Fine Tip Dry-Erase Markers (Black)', op: '150', in: '50', out: '65', cl: '135', re: '50 Min' },
                          { sku: 'SKU-105', name: '3mil Thermal Laminating Pouches', op: '60', in: '40', out: '30', cl: '70', re: '25 Min' },
                          { sku: 'SKU-106', name: 'Velcro Dot Pairs (Hook & Loop)', op: '200', in: '0', out: '40', cl: '160', re: '50 Min' },
                          { sku: 'SKU-107', name: 'Star Reward Stickers (Pack of 500)', op: '90', in: '30', out: '20', cl: '100', re: '30 Min' },
                          { sku: 'SKU-108', name: 'Spiral Binding Coils 12mm', op: '40', in: '10', out: '15', cl: '35', re: '15 Min' },
                          { sku: 'SKU-109', name: '', op: '', in: '', out: '', cl: '', re: '' },
                          { sku: 'SKU-110', name: '', op: '', in: '', out: '', cl: '', re: '' },
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-12 py-1.5 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-2 text-left font-mono font-bold text-slate-600">{row.sku}</div>
                            <div className="col-span-4 text-left font-bold text-slate-800 truncate">{row.name}</div>
                            <div className="col-span-1 font-mono">{row.op}</div>
                            <div className="col-span-1 font-mono text-emerald-600">{row.in}</div>
                            <div className="col-span-1 font-mono text-rose-600">{row.out}</div>
                            <div className="col-span-1 font-mono font-black text-slate-900">{row.cl}</div>
                            <div className="col-span-2 text-right font-mono text-amber-700 font-bold">{row.re}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE E: DAILY TIMETABLE & SCHEDULE */}
                  {currentTemplate.id === 'daily-timetable' && (
                    <div className="grid grid-cols-12 gap-3 flex-1">
                      {/* Left Side: Hour by hour schedule */}
                      <div className="col-span-7 border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between">
                        <div className="bg-slate-100 font-black text-slate-800 py-1.5 px-3 text-xs border-b border-slate-300 flex justify-between">
                          <span>Hourly Time Schedule</span>
                          <span className="text-[10px] text-slate-500 font-normal">6:00 AM – 10:00 PM</span>
                        </div>
                        <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                          {[
                            { time: '6:00 AM', label: 'Morning Wakeup, Hydration & Stretching' },
                            { time: '7:00 AM', label: 'Breakfast & Family Planning' },
                            { time: '8:00 AM', label: 'Priority Study Block #1 (Math & Logic)' },
                            { time: '9:30 AM', label: 'Short Break & Quick Walk' },
                            { time: '10:00 AM', label: 'Deep Work Block #2 (Science & Reading)' },
                            { time: '11:30 AM', label: 'Practical Assignment Revision' },
                            { time: '1:00 PM', label: 'Lunch Break & Relax' },
                            { time: '2:30 PM', label: 'Language & Writing Exercises' },
                            { time: '4:00 PM', label: 'Creative Project / Outdoor Sport' },
                            { time: '6:00 PM', label: 'Family Dinner & Chores' },
                            { time: '8:00 PM', label: 'Book Reading & Reflection' },
                            { time: '9:30 PM', label: 'Wind-down & Lights Out' },
                          ].map((slot, idx) => (
                            <div key={idx} className="flex items-center px-2 py-1 gap-2">
                              <span className="w-16 font-mono font-bold text-slate-600 shrink-0 text-[10px]">{slot.time}</span>
                              <span className="w-4 h-4 border border-slate-300 rounded shrink-0" />
                              <span className="text-slate-800 truncate font-medium text-[11px]">{slot.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: Priorities, Checklist & Notes */}
                      <div className="col-span-5 flex flex-col justify-between gap-2.5">
                        <div className="p-3 border border-slate-300 rounded-xl bg-amber-50/50 space-y-1.5">
                          <strong className="text-xs font-black text-amber-900 block uppercase tracking-wide">
                            Top 3 Daily Priorities
                          </strong>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                              <span className="truncate text-slate-800">Complete Math Chapter 4 Quiz</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                              <span className="truncate text-slate-800">Review Science Lab Notes</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                              <span className="truncate text-slate-800">30 Mins Daily Physical Play</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 flex-1 space-y-1.5 flex flex-col justify-between">
                          <strong className="text-xs font-black text-slate-800 block uppercase tracking-wide">
                            Daily Habits &amp; Wellness
                          </strong>
                          <div className="space-y-1.5 text-xs">
                            {['Drink 8 Glasses of Water', 'Eat Healthy Fresh Fruit', 'Read 20 Mins Book', 'Clean Desk & Pack Bag'].map((h, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="w-4 h-4 border border-slate-400 rounded shrink-0" />
                                <span className="text-slate-700 text-[11px]">{h}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Daily Reflection:</span>
                            <div className="h-14 border border-dashed border-slate-300 rounded-lg mt-1 p-1 text-[10px] text-slate-400 italic">
                              What went well today? What can I improve tomorrow?
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE F: WEEKLY TIMETABLE GRID */}
                  {currentTemplate.id === 'weekly-timetable' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-8 border-b border-slate-300 py-2 px-2 text-center text-[11px]">
                        <div className="col-span-1 text-left">Time</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div className="text-indigo-600">Sat</div>
                        <div className="text-rose-600">Sun</div>
                      </div>
                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[10px]">
                        {[
                          { t: '8:00 AM', m: 'Math', tu: 'English', w: 'Math', th: 'English', f: 'Science', sa: 'Revision', su: 'Rest' },
                          { t: '9:30 AM', m: 'Science', tu: 'History', w: 'Science', th: 'History', f: 'Coding', sa: 'Project', su: 'Family' },
                          { t: '11:00 AM', m: 'Language', tu: 'Art', w: 'Language', th: 'Art', f: 'Music', sa: 'Reading', su: 'Outdoor' },
                          { t: '1:00 PM', m: 'Lunch', tu: 'Lunch', w: 'Lunch', th: 'Lunch', f: 'Lunch', sa: 'Lunch', su: 'Lunch' },
                          { t: '2:30 PM', m: 'Physics', tu: 'Biology', w: 'Algebra', th: 'Chem', f: 'Quiz', sa: 'Sports', su: 'Prep' },
                          { t: '4:00 PM', m: 'Exercise', tu: 'Sports', w: 'Clubs', th: 'Sports', f: 'Social', sa: 'Free', su: 'Plan' },
                          { t: '6:30 PM', m: 'Homework', tu: 'Homework', w: 'Review', th: 'Prep', f: 'Movie', sa: 'Games', su: 'Sleep' },
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-8 py-2 px-2 text-center items-center ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-1 text-left font-mono font-bold text-slate-600">{row.t}</div>
                            <div className="p-1 bg-indigo-50/60 rounded border border-indigo-100/80 font-medium text-slate-800">{row.m}</div>
                            <div className="p-1 bg-slate-50 rounded border border-slate-200 font-medium text-slate-800">{row.tu}</div>
                            <div className="p-1 bg-indigo-50/60 rounded border border-indigo-100/80 font-medium text-slate-800">{row.w}</div>
                            <div className="p-1 bg-slate-50 rounded border border-slate-200 font-medium text-slate-800">{row.th}</div>
                            <div className="p-1 bg-emerald-50/60 rounded border border-emerald-100/80 font-medium text-slate-800">{row.f}</div>
                            <div className="p-1 bg-amber-50/60 rounded border border-amber-100/80 font-bold text-slate-800">{row.sa}</div>
                            <div className="p-1 bg-rose-50/60 rounded border border-rose-100/80 font-bold text-slate-800">{row.su}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE G: MONTHLY CALENDAR BLOCK */}
                  {currentTemplate.id === 'monthly-calendar' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-7 border-b border-slate-300 py-1.5 px-2 text-center text-xs">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                      </div>
                      <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y divide-slate-200">
                        {Array.from({ length: 35 }).map((_, i) => {
                          const dayNum = i >= 3 && i <= 33 ? i - 2 : '';
                          return (
                            <div key={i} className="p-1.5 flex flex-col justify-between bg-white hover:bg-slate-50">
                              <span className="font-mono font-bold text-slate-600 text-[10px]">{dayNum}</span>
                              <div className="h-6 border-t border-dashed border-slate-100" />
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-2 bg-slate-50 border-t border-slate-300 flex justify-between text-[10px] text-slate-600">
                        <span>🎯 Monthly Focus: High-efficiency exam prep &amp; balanced sleep</span>
                        <span>Key Milestones: Week 2 Midterms · Week 4 Project Submit</span>
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE H: SINGLE-PAGE STUDY PLANNER */}
                  {currentTemplate.id === 'study-planner' && (
                    <div className="grid grid-cols-12 gap-3 flex-1">
                      <div className="col-span-8 border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between">
                        <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 py-2 px-3 text-xs border-b border-slate-300 text-center">
                          <div className="col-span-4 text-left">Subject &amp; Topic</div>
                          <div className="col-span-3">Difficulty</div>
                          <div className="col-span-3">Due / Exam</div>
                          <div className="col-span-2 text-right">Done</div>
                        </div>
                        <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                          {[
                            { sub: 'Mathematics - Calculus Ch. 3', diff: 'High', due: 'Nov 02' },
                            { sub: 'Physics - Mechanics & Vectors', diff: 'Medium', due: 'Nov 05' },
                            { sub: 'Chemistry - Organic Reactions', diff: 'High', due: 'Nov 09' },
                            { sub: 'Literature - Essay Final Draft', diff: 'Low', due: 'Nov 12' },
                            { sub: 'History - World War II Timeline', diff: 'Medium', due: 'Nov 15' },
                            { sub: 'Computer Science - Data Structures', diff: 'High', due: 'Nov 18' },
                            { sub: 'Biology - Cell Genetics', diff: 'Medium', due: 'Nov 22' },
                            { sub: '', diff: '', due: '' },
                          ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 py-2 px-3 text-center items-center">
                              <div className="col-span-4 text-left font-bold text-slate-800 truncate">{row.sub}</div>
                              <div className="col-span-3">
                                {row.diff && (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    row.diff === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {row.diff}
                                  </span>
                                )}
                              </div>
                              <div className="col-span-3 font-mono font-medium text-slate-600">{row.due}</div>
                              <div className="col-span-2 text-right">
                                <span className="w-4 h-4 border border-slate-300 rounded inline-block" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-4 flex flex-col justify-between gap-3">
                        <div className="p-3 border border-slate-300 rounded-xl bg-indigo-50/50 space-y-2">
                          <span className="text-xs font-black text-indigo-950 uppercase block">Revision Formula</span>
                          <div className="text-[11px] text-slate-700 leading-relaxed space-y-1">
                            <div>• 25m Focus + 5m Break (Pomodoro)</div>
                            <div>• Active Recall Flashcards</div>
                            <div>• Practice 5 Past Exam Papers</div>
                          </div>
                        </div>

                        <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 flex-1 space-y-2 flex flex-col justify-between">
                          <span className="text-xs font-black text-slate-800 uppercase block">Countdown Tracker</span>
                          <div className="text-center p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                            <span className="text-2xl font-black text-indigo-600 font-mono">18</span>
                            <span className="text-[11px] text-slate-500 block">Days Until Major Exam</span>
                          </div>
                          <div className="h-16 border border-dashed border-slate-300 rounded-lg p-1.5 text-[10px] text-slate-400 italic">
                            Exam Hall checklist: Pen, ID Card, Calculator, Ruler.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE I: FAMILY ROUTINE & CHORE BOARD */}
                  {currentTemplate.id === 'family-chore' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                        <div className="col-span-4 text-left">Family Member &amp; Assigned Chore</div>
                        <div className="col-span-1">M</div>
                        <div className="col-span-1">T</div>
                        <div className="col-span-1">W</div>
                        <div className="col-span-1">T</div>
                        <div className="col-span-1">F</div>
                        <div className="col-span-1">S</div>
                        <div className="col-span-1">S</div>
                        <div className="col-span-1 text-right">Stars</div>
                      </div>
                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                        {[
                          { person: 'Leo', task: 'Make bed & tidy bedroom desk' },
                          { person: 'Leo', task: 'Feed pet & refill fresh water bowl' },
                          { person: 'Maya', task: 'Set dinner table & clean placemats' },
                          { person: 'Maya', task: 'Put away laundry in closet' },
                          { person: 'Ethan', task: 'Take out kitchen recycling & trash' },
                          { person: 'Ethan', task: 'Empty dishwasher & sort silverware' },
                          { person: 'Family', task: 'Living room 10-minute speed sweep' },
                          { person: 'Family', task: 'Water indoor plants & garden patio' },
                          { person: '', task: '' },
                          { person: '', task: '' }
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-12 py-2 px-3 items-center text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-4 text-left truncate">
                              {row.person && <strong className="text-indigo-600 mr-1.5">[{row.person}]</strong>}
                              <span className="text-slate-800">{row.task}</span>
                            </div>
                            {Array.from({ length: 7 }).map((_, d) => (
                              <div key={d} className="col-span-1 flex justify-center">
                                <span className="w-3.5 h-3.5 border border-slate-300 rounded inline-block" />
                              </div>
                            ))}
                            <div className="col-span-1 text-right font-mono font-bold text-amber-600">
                              {row.person ? '⭐ 5' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE J: GROCERY & SHOPPING LIST */}
                  {currentTemplate.id === 'grocery-list' && (
                    <div className="grid grid-cols-2 gap-3 flex-1 text-xs">
                      {[
                        { title: 'Fresh Produce & Fruits', items: ['Apples & Bananas', 'Baby Spinach & Kale', 'Carrots & Cucumbers', 'Avocados & Lemons', 'Potatoes & Onions', 'Berries & Melons'] },
                        { title: 'Dairy, Bakery & Chilled', items: ['Organic Whole Milk', 'Cheddar & Mozzarella', 'Whole Grain Bread', 'Eggs (Cage-Free)', 'Greek Yogurt Cups', 'Butter & Cream Cheese'] },
                        { title: 'Pantry & Dry Staples', items: ['Jasmine Rice & Pasta', 'Olive Oil & Vinegar', 'Canned Crushed Tomatoes', 'Rolled Oats & Cereal', 'Peanut Butter & Honey', 'Snack Crackers & Nuts'] },
                        { title: 'Household & Kitchen', items: ['Dishwasher Detergent', 'Paper Towels (3-pack)', 'Trash Bags (13-gallon)', 'Hand Soap Refill', 'Aluminum Foil & Ziplocs', 'Laundry Detergent Pods'] },
                      ].map((col, idx) => (
                        <div key={idx} className="border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between">
                          <div className="bg-slate-100 font-black text-slate-800 py-1.5 px-3 border-b border-slate-300 text-[11px]">
                            {col.title}
                          </div>
                          <div className="divide-y divide-slate-100 p-2 space-y-1 flex-1 flex flex-col justify-between">
                            {col.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-[11px] py-0.5">
                                <span className="w-3.5 h-3.5 border border-slate-400 rounded shrink-0" />
                                <span className="text-slate-800 truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TEMPLATE K: MONTHLY BUDGET PLANNER */}
                  {currentTemplate.id === 'monthly-budget' && (
                    <div className="grid grid-cols-12 gap-3 flex-1 text-xs">
                      <div className="col-span-7 border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between">
                        <div className="bg-slate-100 font-black text-slate-800 py-2 px-3 border-b border-slate-300 text-xs">
                          Income &amp; Fixed Bills Breakdown
                        </div>
                        <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                          {[
                            { name: 'Primary Household Salary', plan: '$4,200', actual: '$4,200', diff: '$0' },
                            { name: 'Secondary / Freelance Revenue', plan: '$800', actual: '$950', diff: '+$150' },
                            { name: 'Home Mortgage / Rent', plan: '$1,400', actual: '$1,400', diff: '$0' },
                            { name: 'Electricity, Gas & Water Utilities', plan: '$220', actual: '$210', diff: '+$10' },
                            { name: 'Health & Automobile Insurance', plan: '$310', actual: '$310', diff: '$0' },
                            { name: 'Broadband Internet & Mobile Plans', plan: '$130', actual: '$130', diff: '$0' },
                            { name: 'Monthly Car Loan & Fuel', plan: '$350', actual: '$340', diff: '+$10' },
                            { name: '', plan: '', actual: '', diff: '' }
                          ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 py-1.5 px-3 items-center text-center">
                              <div className="col-span-6 text-left font-bold text-slate-800 truncate">{row.name}</div>
                              <div className="col-span-2 font-mono text-slate-600">{row.plan}</div>
                              <div className="col-span-2 font-mono font-bold text-slate-900">{row.actual}</div>
                              <div className="col-span-2 text-right font-mono font-bold text-emerald-600">{row.diff}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-5 flex flex-col justify-between gap-3">
                        <div className="p-3 border border-slate-300 rounded-xl bg-emerald-50/50 space-y-1.5 text-center">
                          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Net Savings Goal</span>
                          <div className="text-2xl font-black text-emerald-700 font-mono">$1,250.00</div>
                          <span className="text-[10px] text-slate-500">Allocated to Emergency Fund</span>
                        </div>

                        <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 flex-1 space-y-2 flex flex-col justify-between">
                          <strong className="text-xs font-black text-slate-800 uppercase block">Expense Rule</strong>
                          <div className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
                            <div>• <strong>50%</strong> Needs (Housing, Food)</div>
                            <div>• <strong>30%</strong> Wants (Dining, Play)</div>
                            <div>• <strong>20%</strong> Savings &amp; Debt-Free</div>
                          </div>
                          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                            Zero-based budgeting ensures every dollar has a dedicated job.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE L: MEAL & KITCHEN PLANNER */}
                  {currentTemplate.id === 'meal-planner' && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                      <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                        <div className="col-span-2 text-left">Day of Week</div>
                        <div className="col-span-3 text-left">Breakfast</div>
                        <div className="col-span-3 text-left">Lunch</div>
                        <div className="col-span-3 text-left">Dinner</div>
                        <div className="col-span-1 text-right">Snack</div>
                      </div>
                      <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                        {[
                          { day: 'Monday', b: 'Oatmeal & Fresh Berries', l: 'Grilled Chicken Salad', d: 'Baked Salmon & Broccoli', s: 'Almonds' },
                          { day: 'Tuesday', b: 'Scrambled Eggs & Toast', l: 'Quinoa Veggie Bowl', d: 'Homemade Turkey Tacos', s: 'Apple' },
                          { day: 'Wednesday', b: 'Green Smoothie & Granola', l: 'Turkey Avocado Wrap', d: 'Vegetable Stir-Fry & Rice', s: 'Yogurt' },
                          { day: 'Thursday', b: 'Pancakes & Pure Maple', l: 'Minestrone Soup & Bread', d: 'Lemon Herb Roast Chicken', s: 'Carrots' },
                          { day: 'Friday', b: 'Avocado Toast & Boiled Egg', l: 'Tuna Salad Sandwich', d: 'Family Homemade Pizza', s: 'Popcorn' },
                          { day: 'Saturday', b: 'French Toast & Fruit', l: 'Leftover Buffet Spread', d: 'BBQ Burgers & Sweet Fries', s: 'Smoothie' },
                          { day: 'Sunday', b: 'Sunday Brunch Omelette', l: 'Mediterranean Mezze', d: 'Slow Cooker Beef Stew', s: 'Nuts' },
                        ].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-12 py-1.5 px-3 items-center text-center ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <div className="col-span-2 text-left font-bold text-indigo-700">{row.day}</div>
                            <div className="col-span-3 text-left truncate text-slate-800">{row.b}</div>
                            <div className="col-span-3 text-left truncate text-slate-800">{row.l}</div>
                            <div className="col-span-3 text-left truncate text-slate-800">{row.d}</div>
                            <div className="col-span-1 text-right font-medium text-slate-500">{row.s}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ============================================================== */}
                {/* SHEET FOOTER: WARM INSPIRING ONE-LINE QUOTE */}
                {/* ============================================================== */}
                <div 
                  className="relative z-10 pt-2 border-t text-center text-[10px] sm:text-[11px] shrink-0 font-semibold italic text-slate-500"
                  style={{ borderColor: currentTheme.borderColor }}
                >
                  <span>
                    "{TEMPLATE_INSPIRING_QUOTES[currentTemplate.id] || 'Small daily steps lead to big family moments — Family Printables'}"
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Export Advice for Single Page */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs text-indigo-900 no-print">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Clean Single-Page Guaranteed:</strong> Formatted to fit standard 8.5"×11" and A4 home printers with zero cutoff margins.
                </span>
              </div>
              <button
                onClick={handlePrint}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0"
              >
                Print Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
