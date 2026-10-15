import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  RefreshCw,
  Star,
  Heart,
  Sun,
  Leaf,
  Layers,
  Award,
  Calendar,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';
import { TimetableConfig, RoutineItem } from '../types';

const DEFAULT_ROUTINES: RoutineItem[] = [
  { id: '1', name: 'Make Bed & Tidy Room', timeSlot: 'Morning', days: [true, true, true, true, true, true, false] },
  { id: '2', name: 'Brush Teeth & Wash Face', timeSlot: 'Morning', days: [true, true, true, true, true, true, true] },
  { id: '3', name: 'Healthy Breakfast & Water', timeSlot: 'Morning', days: [true, true, true, true, true, true, true] },
  { id: '4', name: 'School & Learning Time', timeSlot: 'Afternoon', days: [true, true, true, true, true, false, false] },
  { id: '5', name: 'Homework & Reading (20m)', timeSlot: 'Afternoon', days: [true, true, true, true, true, false, false] },
  { id: '6', name: 'Outdoor Play & Exercise', timeSlot: 'Afternoon', days: [true, true, true, true, true, true, true] },
  { id: '7', name: 'Clean Up Toys & Backpack', timeSlot: 'Evening', days: [true, true, true, true, true, true, true] },
  { id: '8', name: 'Dinner & Help Clear Table', timeSlot: 'Evening', days: [true, true, true, true, true, true, true] },
  { id: '9', name: 'Pajamas & Bedtime Story', timeSlot: 'Bedtime', days: [true, true, true, true, true, true, true] },
];

const PRESET_SUGGESTIONS = [
  { name: 'Lunch & Snack Time', slot: 'Afternoon' },
  { name: 'School & Classes', slot: 'Morning' },
  { name: 'Homework & Math Practice', slot: 'Afternoon' },
  { name: 'Playtime & Creative Arts', slot: 'Afternoon' },
  { name: 'Bath & Pajamas', slot: 'Bedtime' },
  { name: 'Bedtime & Night Reading', slot: 'Bedtime' },
  { name: 'Feed Pets & Water Plants', slot: 'Morning' },
  { name: 'Instrument / Music Practice', slot: 'Evening' },
  { name: 'Screen-Free Quiet Time', slot: 'Afternoon' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type ThemeOption = {
  id: 'pastel' | 'forest' | 'sunshine' | 'minimal';
  name: string;
  tagline: string;
  accentHex: string;
  swatchClass: string;
  containerClass: string;
  headerBadgeClass: string;
  titleColor: string;
  tableHeadClass: string;
  tableDayText: string;
  tableBorderClass: string;
  activeCheckClass: string;
  inactiveCheckClass: string;
  bulletClass: string;
  rewardCardClass: string;
  rewardBadgeClass: string;
  rewardTitleClass: string;
  icon: React.ElementType;
  canvas: {
    bg: string;
    headerBar: string;
    title: string;
    sub: string;
    tableHeadBg: string;
    tableHeadText: string;
    checkFill: string;
    checkBorder: string;
    gridLine: string;
    rewardBg: string;
    rewardBorder: string;
    rewardText: string;
    rewardSub: string;
  };
};

const THEMES: Record<'pastel' | 'forest' | 'sunshine' | 'minimal', ThemeOption> = {
  pastel: {
    id: 'pastel',
    name: 'Pastel Dream',
    tagline: 'Soft blush, lilac & lavender',
    accentHex: '#8B5CF6',
    swatchClass: 'from-pink-400 via-purple-400 to-indigo-400',
    containerClass: 'bg-gradient-to-br from-pink-50/70 via-purple-50/40 to-indigo-50/60 border-purple-200/90 shadow-purple-500/5',
    headerBadgeClass: 'bg-purple-100/90 text-purple-800 border-purple-200',
    titleColor: 'text-purple-950',
    tableHeadClass: 'bg-purple-100/70 text-purple-900 border-purple-200',
    tableDayText: 'text-purple-800',
    tableBorderClass: 'border-purple-100/80',
    activeCheckClass: 'bg-gradient-to-br from-pink-500 to-indigo-600 border-indigo-600 text-white shadow-xs',
    inactiveCheckClass: 'border-purple-200 bg-white/90 hover:border-purple-400 text-transparent',
    bulletClass: 'bg-purple-400',
    rewardCardClass: 'bg-purple-50/90 border-purple-200 text-purple-950',
    rewardBadgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    rewardTitleClass: 'text-purple-900',
    icon: Heart,
    canvas: {
      bg: '#FFF8FA',
      headerBar: '#9333EA',
      title: '#581C87',
      sub: '#7E22CE',
      tableHeadBg: '#F3E8FF',
      tableHeadText: '#6B21A8',
      checkFill: '#9333EA',
      checkBorder: '#C084FC',
      gridLine: '#F3E8FF',
      rewardBg: '#FAF5FF',
      rewardBorder: '#D8B4FE',
      rewardText: '#581C87',
      rewardSub: '#6B21A8',
    },
  },
  forest: {
    id: 'forest',
    name: 'Botanical Forest',
    tagline: 'Fresh sage, eucalyptus & pine',
    accentHex: '#059669',
    swatchClass: 'from-emerald-400 via-teal-500 to-green-600',
    containerClass: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-stone-50 border-emerald-200/90 shadow-emerald-500/5',
    headerBadgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    titleColor: 'text-emerald-950',
    tableHeadClass: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
    tableDayText: 'text-emerald-800',
    tableBorderClass: 'border-emerald-100/80',
    activeCheckClass: 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-700 text-white shadow-xs',
    inactiveCheckClass: 'border-emerald-200 bg-white/90 hover:border-emerald-400 text-transparent',
    bulletClass: 'bg-emerald-500',
    rewardCardClass: 'bg-emerald-50/90 border-emerald-300 text-emerald-950',
    rewardBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rewardTitleClass: 'text-emerald-900',
    icon: Leaf,
    canvas: {
      bg: '#F2FDF6',
      headerBar: '#059669',
      title: '#064E3B',
      sub: '#047857',
      tableHeadBg: '#D1FAE5',
      tableHeadText: '#065F46',
      checkFill: '#059669',
      checkBorder: '#34D399',
      gridLine: '#E6F8F0',
      rewardBg: '#ECFDF5',
      rewardBorder: '#A7F3D0',
      rewardText: '#064E3B',
      rewardSub: '#047857',
    },
  },
  sunshine: {
    id: 'sunshine',
    name: 'Warm Sunshine',
    tagline: 'Golden honey, amber & citrus',
    accentHex: '#D97706',
    swatchClass: 'from-amber-400 via-orange-400 to-yellow-500',
    containerClass: 'bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-50/60 border-amber-200/90 shadow-amber-500/5',
    headerBadgeClass: 'bg-amber-100/90 text-amber-900 border-amber-300',
    titleColor: 'text-amber-950',
    tableHeadClass: 'bg-amber-100/80 text-amber-950 border-amber-300',
    tableDayText: 'text-amber-900',
    tableBorderClass: 'border-amber-100/80',
    activeCheckClass: 'bg-gradient-to-br from-amber-500 to-orange-500 border-orange-500 text-white shadow-xs',
    inactiveCheckClass: 'border-amber-200 bg-white/90 hover:border-amber-400 text-transparent',
    bulletClass: 'bg-amber-500',
    rewardCardClass: 'bg-amber-50/90 border-amber-300 text-amber-950',
    rewardBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    rewardTitleClass: 'text-amber-950',
    icon: Sun,
    canvas: {
      bg: '#FFFDF5',
      headerBar: '#D97706',
      title: '#78350F',
      sub: '#92400E',
      tableHeadBg: '#FEF3C7',
      tableHeadText: '#92400E',
      checkFill: '#D97706',
      checkBorder: '#FBBF24',
      gridLine: '#FEF9C3',
      rewardBg: '#FEF3C7',
      rewardBorder: '#FCD34D',
      rewardText: '#78350F',
      rewardSub: '#92400E',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Modern Minimalist',
    tagline: 'Clean Scandinavian monochrome',
    accentHex: '#0F172A',
    swatchClass: 'from-slate-700 via-slate-800 to-slate-950',
    containerClass: 'bg-white border-slate-300 shadow-slate-200/50',
    headerBadgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    titleColor: 'text-slate-900',
    tableHeadClass: 'bg-slate-100 text-slate-900 border-slate-300',
    tableDayText: 'text-slate-700',
    tableBorderClass: 'border-slate-200',
    activeCheckClass: 'bg-slate-900 border-slate-900 text-white shadow-xs',
    inactiveCheckClass: 'border-slate-300 bg-white hover:border-slate-400 text-transparent',
    bulletClass: 'bg-slate-600',
    rewardCardClass: 'bg-slate-50 border-slate-300 text-slate-900',
    rewardBadgeClass: 'bg-slate-200 text-slate-900 border-slate-300',
    rewardTitleClass: 'text-slate-900',
    icon: Layers,
    canvas: {
      bg: '#FFFFFF',
      headerBar: '#0F172A',
      title: '#0F172A',
      sub: '#475569',
      tableHeadBg: '#F1F5F9',
      tableHeadText: '#0F172A',
      checkFill: '#0F172A',
      checkBorder: '#64748B',
      gridLine: '#F1F5F9',
      rewardBg: '#F8FAFC',
      rewardBorder: '#CBD5E1',
      rewardText: '#0F172A',
      rewardSub: '#475569',
    },
  },
};

// Canvas helper to draw crisp 5-point stars
function drawCanvasStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes = 5,
  outerRadius = 10,
  innerRadius = 5
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

export const InteractiveTimetableStudio: React.FC = () => {
  const [config, setConfig] = useState<TimetableConfig>({
    kidName: 'Mia & Leo',
    weekLabel: 'WEEK OF: OCT 14 - 20',
    theme: 'pastel',
    rewardGoal: 'Weekend Pizza Night & Zoo Adventure 🍕🦁',
    notes: 'Kindness, teamwork, and completing our daily routines unlock the weekend prize!',
    routines: DEFAULT_ROUTINES,
  });

  const [newRoutineText, setNewRoutineText] = useState('');
  const [newRoutineSlot, setNewRoutineSlot] = useState('Morning');
  const [isExporting, setIsExporting] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES[config.theme] || THEMES.pastel;
  const ThemeIcon = activeTheme.icon;

  // Calculate stats
  const totalStars = config.routines.reduce(
    (acc, r) => acc + r.days.filter(Boolean).length,
    0
  );
  const maxPossibleStars = config.routines.length * 7;

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Add Routine Item
  const handleAddRoutine = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newRoutineText.trim()) return;

    const newItem: RoutineItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: newRoutineText.trim(),
      timeSlot: newRoutineSlot,
      days: [true, true, true, true, true, true, true],
    };

    setConfig((prev) => ({
      ...prev,
      routines: [...prev.routines, newItem],
    }));
    setNewRoutineText('');
  };

  // Quick Preset Add
  const handleAddPreset = (preset: { name: string; slot: string }) => {
    const newItem: RoutineItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: preset.name,
      timeSlot: preset.slot,
      days: [true, true, true, true, true, true, true],
    };

    setConfig((prev) => ({
      ...prev,
      routines: [...prev.routines, newItem],
    }));
  };

  // Delete Individual Routine
  const handleDeleteRoutine = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      routines: prev.routines.filter((r) => r.id !== id),
    }));
  };

  // Clear All Routines (Bespoke schedule from scratch)
  const handleClearAllRoutines = () => {
    setConfig((prev) => ({
      ...prev,
      routines: [],
    }));
  };

  // Reset to Default Routines
  const handleResetDefaults = () => {
    setConfig((prev) => ({
      ...prev,
      routines: DEFAULT_ROUTINES,
    }));
  };

  // Toggle Day
  const toggleDay = (routineId: string, dayIndex: number) => {
    setConfig((prev) => ({
      ...prev,
      routines: prev.routines.map((r) => {
        if (r.id !== routineId) return r;
        const newDays = [...r.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...r, days: newDays };
      }),
    }));
  };

  // Canvas 300-DPI PNG Download (Theme Aware)
  const handleCanvasDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      const rowCount = config.routines.length;
      const rowHeight = 65;
      const tableTop = 220;
      const tableHeight = Math.max(rowCount * rowHeight, 150);
      const rewardHeight = 170;
      const totalHeight = Math.max(1550, tableTop + tableHeight + rewardHeight + 150);

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const c = activeTheme.canvas;

        // Background
        ctx.fillStyle = c.bg;
        ctx.fillRect(0, 0, 1200, totalHeight);

        // Top decorative brand bar
        ctx.fillStyle = c.headerBar;
        ctx.fillRect(50, 40, 1100, 14);

        // Printable Badge
        ctx.fillStyle = c.sub;
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('FAMILY ROUTINE & CHORE BOARD · CANVA-STYLE PRINTABLE', 60, 85);

        // Child/Family Main Title
        ctx.fillStyle = c.title;
        ctx.font = 'bold 44px sans-serif';
        const displayTitle = config.kidName ? `${config.kidName.toUpperCase()}'S WEEKLY ROUTINE` : 'WEEKLY ROUTINE CHART';
        ctx.fillText(displayTitle, 60, 135);

        // Subtitle / Date / US Letter info
        ctx.fillStyle = '#64748B';
        ctx.font = '20px sans-serif';
        ctx.fillText(`${config.weekLabel} · US LETTER (8.5" x 11") / A4 REUSABLE`, 60, 175);

        // Table Header Background
        ctx.fillStyle = c.tableHeadBg;
        ctx.fillRect(50, tableTop, 1100, 48);

        // Table Header Columns
        ctx.fillStyle = c.tableHeadText;
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('DAILY TASK / ROUTINE', 75, tableTop + 30);

        DAYS.forEach((d, i) => {
          ctx.fillText(d.toUpperCase(), 580 + i * 78, tableTop + 30);
        });

        // Table Rows
        if (config.routines.length === 0) {
          ctx.fillStyle = '#94A3B8';
          ctx.font = 'italic 20px sans-serif';
          ctx.fillText('No tasks added yet. Add custom tasks in the Routine Builder!', 75, tableTop + 90);
        } else {
          config.routines.forEach((routine, rIdx) => {
            const y = tableTop + 50 + rIdx * rowHeight;

            // Zebra background for rows
            if (rIdx % 2 === 1) {
              ctx.fillStyle = c.gridLine;
              ctx.fillRect(50, y, 1100, rowHeight);
            }

            // Bottom border
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(50, y + rowHeight);
            ctx.lineTo(1150, y + rowHeight);
            ctx.stroke();

            // Task Number & Name
            ctx.fillStyle = '#0F172A';
            ctx.font = '600 20px sans-serif';
            const taskLabel = `${rIdx + 1}. ${routine.name}`;
            ctx.fillText(taskLabel.length > 38 ? taskLabel.slice(0, 36) + '...' : taskLabel, 75, y + 38);

            // Time slot badge
            if (routine.timeSlot) {
              ctx.fillStyle = c.sub;
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText(routine.timeSlot.toUpperCase(), 460, y + 38);
            }

            // Checkboxes
            routine.days.forEach((active, dIdx) => {
              const bx = 585 + dIdx * 78;
              const by = y + 15;
              const boxSize = 34;

              ctx.strokeStyle = active ? c.checkFill : '#CBD5E1';
              ctx.lineWidth = 2;
              ctx.strokeRect(bx, by, boxSize, boxSize);

              if (active) {
                ctx.fillStyle = c.checkFill;
                ctx.fillRect(bx + 2, by + 2, boxSize - 4, boxSize - 4);

                // Star icon inside
                ctx.fillStyle = '#FFFFFF';
                drawCanvasStar(ctx, bx + boxSize / 2, by + boxSize / 2, 5, 9, 4.5);
              }
            });
          });
        }

        // Reward Box Position
        const rewardTop = Math.max(tableTop + tableHeight + 40, totalHeight - 210);

        ctx.fillStyle = c.rewardBg;
        ctx.fillRect(50, rewardTop, 1100, rewardHeight);
        ctx.strokeStyle = c.rewardBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(50, rewardTop, 1100, rewardHeight);

        // Reward title
        ctx.fillStyle = c.rewardText;
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('⭐ WEEKLY REWARD GOAL:', 80, rewardTop + 45);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(config.rewardGoal || 'Set a family reward goal!', 80, rewardTop + 85);

        ctx.fillStyle = c.rewardSub;
        ctx.font = 'italic 18px sans-serif';
        ctx.fillText(`"${config.notes}"`, 80, rewardTop + 120);

        // Star target badge in reward box
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(860, rewardTop + 30, 260, 50);
        ctx.strokeStyle = c.rewardBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(860, rewardTop + 30, 260, 50);

        ctx.fillStyle = c.rewardText;
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`TARGET: ${Math.round(maxPossibleStars * 0.85)} / ${maxPossibleStars} STARS`, 885, rewardTop + 62);

        // Printable Footer notice
        ctx.fillStyle = '#94A3B8';
        ctx.font = '14px monospace';
        ctx.fillText('Printed via Timetable Studio · High-Resolution US Letter & A4 · Frame or Laminate for Dry-Erase Use', 60, totalHeight - 20);

        // Download trigger
        const safeName = (config.kidName || 'Family').replace(/[^a-z0-9]/gi, '_');
        const link = document.createElement('a');
        link.download = `${safeName}_${config.theme}_Routine_Chart_Printable.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Custom Routine Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Design &amp; Print Custom Family Routines
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Fully personalize your child's name, daily habits, tasks, and reward goals. Choose stunning Canva-style themes for instant US Letter (8.5" x 11") &amp; A4 home printing or dry-erase framing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Dynamic Task Builder & Customization Controls */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Routine &amp; Board Controls</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                8.5" x 11" US Letter / A4
              </span>
            </div>

            {/* 1. Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Print Theme &amp; Color Style:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = config.theme === themeKey;
                  const Icon = t.icon;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setConfig({ ...config, theme: themeKey })}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${t.swatchClass} shrink-0`} />
                          <span className="text-xs font-bold text-slate-900">{t.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{t.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Title & Date Header Inputs */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Child or Family Name:
                </label>
                <input
                  type="text"
                  value={config.kidName}
                  onChange={(e) => setConfig({ ...config, kidName: e.target.value })}
                  placeholder="e.g. Mia & Leo, Oliver's Routine"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Week Header Subtext:
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={config.weekLabel}
                    onChange={(e) => setConfig({ ...config, weekLabel: e.target.value })}
                    placeholder="e.g. WEEK OF: OCT 14 - 20"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* 3. DYNAMIC CUSTOM ROUTINE BUILDER: Add / Remove Items */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Add New Routine / Task:
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {config.routines.length} total tasks
                </span>
              </div>

              <form onSubmit={handleAddRoutine} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRoutineText}
                    onChange={(e) => setNewRoutineText(e.target.value)}
                    placeholder="e.g. Lunch Time, School Work, Bedtime..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  <select
                    value={newRoutineSlot}
                    onChange={(e) => setNewRoutineSlot(e.target.value)}
                    className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Bedtime">Bedtime</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!newRoutineText.trim()}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Quick Add Suggestion Chips */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Quick Activity Suggestions (Click to Add):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {PRESET_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPreset(sug)}
                        className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-600 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5 text-slate-400" />
                        <span>{sug.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Current Task Items List with Quick Delete Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Manage Active Tasks ({config.routines.length}):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearAllRoutines}
                      disabled={config.routines.length === 0}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                      title="Remove all tasks to create a schedule from scratch"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                      title="Load default starter routine template"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Defaults</span>
                    </button>
                  </div>
                </div>

                {config.routines.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                    <p className="text-xs text-slate-500 font-medium">No routine tasks currently added.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Type a custom activity above or click any suggestion chip to build your routine from scratch!
                    </p>
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                    {config.routines.map((routine, idx) => (
                      <div
                        key={routine.id}
                        className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] font-mono text-slate-400 w-4 shrink-0">
                            {idx + 1}.
                          </span>
                          <span className="font-medium text-slate-800 truncate" title={routine.name}>
                            {routine.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
                            {routine.timeSlot}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoutine(routine.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors shrink-0"
                          title={`Delete "${routine.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Reward & Note Settings */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Weekly Reward Prize:
                </label>
                <input
                  type="text"
                  value={config.rewardGoal}
                  onChange={(e) => setConfig({ ...config, rewardGoal: e.target.value })}
                  placeholder="e.g. Weekend Zoo Trip, Pizza Night & Movie"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Family Encouragement Note:
                </label>
                <input
                  type="text"
                  value={config.notes}
                  onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                  placeholder="e.g. Kindness, teamwork, and smiles unlock the prize!"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* 5. Print & Export Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                onClick={handlePrint}
                className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Printer className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
                <span>Print or Save to PDF (Letter / A4)</span>
              </button>

              <button
                onClick={handleCanvasDownload}
                disabled={isExporting}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <Download className="w-4 h-4 text-indigo-600" />
                )}
                <span>Download Print-Ready PNG (300 DPI)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Printable Canvas / Canva-Style Preview Card */}
          <div className="lg:col-span-7">
            <div className="sticky top-6">
              {/* Toolbar helper above preview */}
              <div className="flex items-center justify-between mb-3 px-1 no-print">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Print Preview ({activeTheme.name})</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {totalStars} / {maxPossibleStars} Stars Active
                </div>
              </div>

              {/* The Printable Board */}
              <div
                id="printable-canvas"
                ref={printableRef}
                className={`p-6 sm:p-9 rounded-3xl border-2 transition-all duration-300 ${activeTheme.containerClass}`}
              >
                {/* Printable Header Section */}
                <div className="text-center border-b-2 border-slate-900/10 pb-5 mb-6 relative">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border mb-2 shadow-2xs">
                    <ThemeIcon className="w-3.5 h-3.5" />
                    <span>FAMILY ROUTINE &amp; CHORE BOARD</span>
                    <ThemeIcon className="w-3.5 h-3.5" />
                  </div>

                  <h2 className={`text-2xl sm:text-4xl font-black mt-1 uppercase tracking-tight ${activeTheme.titleColor}`}>
                    {config.kidName || 'Family Routine'}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{config.weekLabel}</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>TARGET: {Math.round(maxPossibleStars * 0.85)} STARS</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">
                      US Letter / A4
                    </span>
                  </div>
                </div>

                {/* Routines Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b-2 font-bold ${activeTheme.tableHeadClass}`}>
                        <th className="py-2.5 pl-3 rounded-l-xl">DAILY CHORE / ROUTINE</th>
                        {DAYS.map((day, idx) => (
                          <th
                            key={idx}
                            className={`py-2.5 text-center px-1 font-mono uppercase text-[11px] ${activeTheme.tableDayText}`}
                          >
                            {day}
                          </th>
                        ))}
                        <th className="py-2.5 text-right pr-2 rounded-r-xl no-print w-10"></th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${activeTheme.tableBorderClass}`}>
                      {config.routines.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-slate-400 italic">
                            No routine items added yet. Click "+ Add" on the left to add activities.
                          </td>
                        </tr>
                      ) : (
                        config.routines.map((routine, rIdx) => (
                          <tr key={routine.id} className="group hover:bg-white/50 transition-colors">
                            {/* Routine Name & Bullet */}
                            <td className="py-3 pl-2 sm:pl-3 font-semibold text-slate-800 max-w-[220px]">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${activeTheme.bulletClass}`} />
                                <span className="truncate">{routine.name}</span>
                                {routine.timeSlot && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 bg-white/70 text-slate-500 rounded border border-slate-200/80 shrink-0">
                                    {routine.timeSlot}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Mon - Sun Star Checkboxes */}
                            {routine.days.map((active, dayIdx) => (
                              <td key={dayIdx} className="py-3 text-center px-1">
                                <button
                                  type="button"
                                  onClick={() => toggleDay(routine.id, dayIdx)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center mx-auto transition-all cursor-pointer ${
                                    active ? activeTheme.activeCheckClass : activeTheme.inactiveCheckClass
                                  }`}
                                  title={`Toggle ${DAYS[dayIdx]} for ${routine.name}`}
                                >
                                  {active && <Star className="w-3.5 h-3.5 fill-current" />}
                                </button>
                              </td>
                            ))}

                            {/* Direct Row Delete / Remove Button (Omitted during print) */}
                            <td className="py-3 text-right pr-2 no-print">
                              <button
                                type="button"
                                onClick={() => handleDeleteRoutine(routine.id)}
                                className="text-slate-300 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                                title="Remove task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Reward & Family Note Box */}
                <div
                  className={`mt-7 rounded-2xl p-4 sm:p-5 border-2 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${activeTheme.rewardCardClass}`}
                >
                  <div className="space-y-1">
                    <div
                      className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${activeTheme.rewardBadgeClass}`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>WEEKLY REWARD PRIZE</span>
                    </div>
                    <div className={`text-base font-extrabold ${activeTheme.rewardTitleClass}`}>
                      {config.rewardGoal || 'Complete daily chores for a family treat!'}
                    </div>
                    <div className="text-xs text-slate-600 italic">
                      "{config.notes}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold bg-white/95 px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Goal: {Math.round(maxPossibleStars * 0.85)} Stars to Win!</span>
                  </div>
                </div>

                {/* Printable Footer note */}
                <div className="mt-6 pt-3 border-t border-slate-300/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Standard 8.5" x 11" US Letter &amp; A4 Printable</span>
                  <span>Frame or Laminate for Dry-Erase Practice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
