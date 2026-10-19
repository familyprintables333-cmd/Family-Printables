import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sun, 
  Moon, 
  BookOpen, 
  Heart, 
  Clock, 
  Download, 
  Star, 
  RotateCcw,
  Image as ImageIcon,
  FileText,
  Smile,
  Award,
  Calendar,
  Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface RoutineItem {
  id: string;
  time: string;
  title: string;
  icon: string;
  reward: string;
}

const PRESET_ROUTINES: Record<'morning' | 'bedtime' | 'daily', RoutineItem[]> = {
  morning: [
    { id: 'm1', time: '7:00 AM', title: 'Wake Up & Make Bed', icon: '🛏️', reward: '⭐ 1 Star' },
    { id: 'm2', time: '7:15 AM', title: 'Brush Teeth & Wash Face', icon: '🪥', reward: '⭐ 1 Star' },
    { id: 'm3', time: '7:30 AM', title: 'Get Dressed in School Clothes', icon: '👕', reward: '⭐ 1 Star' },
    { id: 'm4', time: '7:45 AM', title: 'Healthy Breakfast & Water', icon: '🥞', reward: '⭐ 1 Star' },
    { id: 'm5', time: '8:10 AM', title: 'Pack Backpack & Shoes On', icon: '🎒', reward: '⭐ 2 Stars' },
  ],
  bedtime: [
    { id: 'b1', time: '7:30 PM', title: 'Put Away Toys & Clear Desk', icon: '🧸', reward: '⭐ 1 Star' },
    { id: 'b2', time: '7:45 PM', title: 'Warm Bath / Shower', icon: '🛁', reward: '⭐ 1 Star' },
    { id: 'b3', time: '8:05 PM', title: 'Put On Pajamas & Brush Teeth', icon: '🪥', reward: '⭐ 1 Star' },
    { id: 'b4', time: '8:20 PM', title: 'Read 2 Bedtime Storybooks', icon: '📖', reward: '⭐ 2 Stars' },
    { id: 'b5', time: '8:45 PM', title: 'Lights Out & Sweet Dreams', icon: '💤', reward: '⭐ 2 Stars' },
  ],
  daily: [
    { id: 'd1', time: '8:00 AM', title: 'Morning Routine & Breakfast', icon: '☀️', reward: '⭐ 1 Star' },
    { id: 'd2', time: '3:30 PM', title: 'After-School Snack & Unpack', icon: '🍎', reward: '⭐ 1 Star' },
    { id: 'd3', time: '4:15 PM', title: '30 Mins Focused Workbook Practice', icon: '✏️', reward: '⭐ 2 Stars' },
    { id: 'd4', time: '5:30 PM', title: 'Outdoor Play & Screen-Free Fun', icon: '🚲', reward: '⭐ 1 Star' },
    { id: 'd5', time: '7:00 PM', title: 'Family Dinner & Clear Dishes', icon: '🍽️', reward: '⭐ 1 Star' },
    { id: 'd6', time: '8:30 PM', title: 'Bedtime Reading & Lights Out', icon: '🌙', reward: '⭐ 2 Stars' },
  ]
};

const QUICK_ICONS = ['🛏️', '🪥', '🥞', '🎒', '👕', '📚', '✏️', '🧸', '🛁', '💤', '🍎', '🚲', '👟', '⭐', '🎨', '🧹'];

export const InteractiveTimetableStudio: React.FC = () => {
  const [childName, setChildName] = useState('Leo');
  const [routineType, setRoutineType] = useState<'morning' | 'bedtime' | 'daily'>('morning');
  const [items, setItems] = useState<RoutineItem[]>(PRESET_ROUTINES.morning);
  const [targetGoal, setTargetGoal] = useState('25 Stars');
  const [weeklyReward, setWeeklyReward] = useState('Family Pizza & Movie Night');

  // Milestone input form state
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('8:30 AM');
  const [selectedIcon, setSelectedIcon] = useState('✨');
  const [selectedReward, setSelectedReward] = useState('⭐ 1 Star');

  // Feedback states
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const printableRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Switch Theme Preset
  const handleThemeChange = (type: 'morning' | 'bedtime' | 'daily') => {
    setRoutineType(type);
    setItems(PRESET_ROUTINES[type]);
  };

  // Add Item
  const addItem = () => {
    if (!newItemTitle.trim()) return;
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      time: newItemTime.trim() || 'Anytime',
      title: newItemTitle.trim(),
      icon: selectedIcon,
      reward: selectedReward,
    };
    setItems([...items, newItem]);
    setNewItemTitle('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // 1. Direct Print Handler
  const handlePrint = () => {
    window.print();
  };

  // 2. Client-side PDF Generator (using jsPDF)
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const primaryColor =
        routineType === 'morning' ? [217, 119, 6] : routineType === 'bedtime' ? [79, 70, 229] : [5, 150, 105];

      // Outer Decorative Border
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1.2);
      doc.rect(8, 8, 194, 281, 'S');
      doc.setLineWidth(0.4);
      doc.rect(10, 10, 190, 277, 'S');

      // Header Banner Box
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(14, 14, 182, 26, 4, 4, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      const nameText = childName.trim() ? `${childName.toUpperCase()}'S` : "MY";
      const routineLabel = routineType.toUpperCase();
      doc.text(`${nameText} ${routineLabel} SUCCESS TIMETABLE`, 105, 25, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('FAMILY PRINTABLES · CHECK OFF EACH HABIT & EARN WEEKLY REWARDS', 105, 33, { align: 'center' });

      // Table Header
      let y = 48;
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(14, y, 182, 9, 2, 2, 'F');
      doc.setTextColor(55, 65, 81);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('TIME', 20, y + 6);
      doc.text('ROUTINE HABIT / MILESTONE', 50, y + 6);
      doc.text('M   T   W   T   F   S   S', 125, y + 6);
      doc.text('REWARD', 175, y + 6);

      // Rows
      y += 12;
      items.forEach((item, index) => {
        if (y > 240) return; // avoid page overflow

        // Alternating row background
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.roundedRect(14, y - 2, 182, 11, 1, 1, 'F');
        }

        // Checkbox square
        doc.setDrawColor(156, 163, 175);
        doc.setLineWidth(0.5);
        doc.roundedRect(16, y, 4.5, 4.5, 0.8, 0.8, 'S');

        // Time
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(item.time, 24, y + 3.5);

        // Title
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(17, 24, 39);
        const truncatedTitle = item.title.length > 34 ? item.title.substring(0, 32) + '...' : item.title;
        doc.text(truncatedTitle, 50, y + 3.5);

        // Mon-Sun checkboxes (7 small square tick boxes)
        for (let d = 0; d < 7; d++) {
          const boxX = 125 + d * 5.8;
          doc.roundedRect(boxX, y, 4, 4, 0.6, 0.6, 'S');
        }

        // Reward points
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(217, 119, 6);
        doc.text(item.reward, 173, y + 3.5);

        y += 11;
      });

      // Weekly Reward Box
      y = Math.max(y + 4, 235);
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(14, y, 182, 22, 3, 3, 'FD');

      doc.setTextColor(146, 64, 14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`WEEKLY GOAL TARGET: ${targetGoal}`, 20, y + 8);
      doc.text(`REWARD CELEBRATION: ${weeklyReward}`, 20, y + 16);

      // Signature & Footer
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Parent Signature: _______________________      Date: ______________', 20, y + 32);
      doc.text('© Family Printables · Reusable Dry-Erase Chart', 135, y + 32);

      const fileName = `${childName.replace(/[^a-zA-Z0-9]/g, '_') || 'Kids'}_${routineType}_Timetable.pdf`;
      doc.save(fileName);
      showToast(`Downloaded print-ready PDF: ${fileName}`);
    } catch (err) {
      console.error('PDF generation error', err);
      // Fallback to print
      window.print();
    }
  };

  // 3. Client-side HD Image Generator (Canvas -> PNG)
  const handleDownloadHDImage = () => {
    try {
      const canvas = document.createElement('canvas');
      // High-resolution canvas (1400 x 1980 px - standard crisp 300 DPI A4 ratio)
      canvas.width = 1400;
      canvas.height = 1980;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isMorning = routineType === 'morning';
      const isBedtime = routineType === 'bedtime';
      const mainThemeColor = isMorning ? '#D97706' : isBedtime ? '#4F46E5' : '#059669';
      const lightThemeBg = isMorning ? '#FFFBEB' : isBedtime ? '#EEF2FF' : '#ECFDF5';

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Double Outer Border
      ctx.strokeStyle = mainThemeColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

      // Header Ribbon
      ctx.fillStyle = mainThemeColor;
      ctx.beginPath();
      ctx.roundRect(65, 65, canvas.width - 130, 160, 24);
      ctx.fill();

      // Header Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const nameText = childName.trim() ? `${childName.toUpperCase()}'S` : "MY";
      ctx.fillText(`⭐ ${nameText} ${routineType.toUpperCase()} SUCCESS TIMETABLE ⭐`, canvas.width / 2, 140);

      ctx.font = '600 24px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#FDE68A';
      ctx.fillText('FAMILY PRINTABLES · CHECK OFF EACH HABIT & EARN WEEKLY REWARDS', canvas.width / 2, 195);

      // Table Header Row
      let rowY = 280;
      ctx.fillStyle = '#F3F4F6';
      ctx.beginPath();
      ctx.roundRect(65, rowY, canvas.width - 130, 60, 12);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DONE', 90, rowY + 38);
      ctx.fillText('TIME', 190, rowY + 38);
      ctx.fillText('ROUTINE HABIT / ACTIVITY', 350, rowY + 38);
      ctx.fillText('M   T   W   T   F   S   S', 920, rowY + 38);
      ctx.fillText('REWARD', 1190, rowY + 38);

      rowY += 80;

      // Render Each Task Row
      items.forEach((item, index) => {
        if (rowY > 1650) return;

        // Row background
        ctx.fillStyle = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(65, rowY - 15, canvas.width - 130, 75, 12);
        ctx.fill();
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Checkbox square
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 3;
        ctx.strokeRect(95, rowY + 8, 30, 30);

        // Time Pill
        ctx.fillStyle = lightThemeBg;
        ctx.beginPath();
        ctx.roundRect(165, rowY + 4, 140, 38, 8);
        ctx.fill();

        ctx.fillStyle = mainThemeColor;
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.time, 235, rowY + 30);

        // Icon + Title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${item.icon}  ${item.title}`, 340, rowY + 32);

        // Mon-Sun checkboxes (7 square boxes)
        for (let d = 0; d < 7; d++) {
          const boxX = 920 + d * 36;
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(boxX, rowY + 10, 24, 24);
        }

        // Reward Badge
        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.fillText(item.reward, 1180, rowY + 30);

        rowY += 90;
      });

      // Weekly Goal Card
      const goalY = Math.max(rowY + 20, 1680);
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.roundRect(65, goalY, canvas.width - 130, 140, 20);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🎯 WEEKLY STAR GOAL: ${targetGoal}`, 100, goalY + 55);
      ctx.fillText(`🏆 FAMILY REWARD CELEBRATION: ${weeklyReward}`, 100, goalY + 105);

      // Footer
      ctx.fillStyle = '#6B7280';
      ctx.font = '600 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('Parent Signature: ___________________________    Date: ______________', 100, goalY + 200);
      ctx.textAlign = 'right';
      ctx.fillText('FamilyPrintables.com · Printable Routine System', canvas.width - 100, goalY + 200);

      // Trigger Download
      const link = document.createElement('a');
      const fileName = `${childName.replace(/[^a-zA-Z0-9]/g, '_') || 'Kids'}_${routineType}_Chart_HD.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(`Downloaded HD Image: ${fileName}`);
    } catch (err) {
      console.error('HD Image generation error', err);
    }
  };

  const isMorning = routineType === 'morning';
  const isBedtime = routineType === 'bedtime';
  const themeAccentBorder = isMorning ? 'border-amber-300' : isBedtime ? 'border-indigo-300' : 'border-emerald-300';
  const themeAccentBg = isMorning ? 'bg-amber-500' : isBedtime ? 'bg-indigo-600' : 'bg-emerald-600';
  const themePillBg = isMorning ? 'bg-amber-50 text-amber-800' : isBedtime ? 'bg-indigo-50 text-indigo-800' : 'bg-emerald-50 text-emerald-800';

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28">
      {/* Studio Header */}
      <section className="bg-gradient-to-r from-[#0c233c] via-[#0f2d4e] to-[#0a1b2e] text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Routine Creator &amp; Printables Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Visual Routine &amp; Habit Timetable Studio
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Design a personalized weekly routine chart for your child. Print directly to Standard A4 paper or download in high-definition PDF and HD Image formats.
            </p>
          </div>
        </div>
      </section>

      {/* Toast Alert */}
      {downloadSuccess && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Studio Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================================================================ */}
          {/* LEFT: CONTROLS & CUSTOMIZATION PANEL */}
          {/* ================================================================ */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 no-print">
            
            {/* Header */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Customize Child's Timetable</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust names, routine milestones, icons, and weekly goal rewards.
              </p>
            </div>

            <div className="space-y-5">
              {/* Child Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Child's Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  placeholder="e.g. Leo, Maya, Oliver"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Routine Theme Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleThemeChange('morning')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                      routineType === 'morning'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Morning</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('bedtime')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                      routineType === 'bedtime'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Bedtime</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('daily')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                      routineType === 'daily'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Full Day</span>
                  </button>
                </div>
              </div>

              {/* ============================================================ */}
              {/* FIXED RESPONSIVE: ADD ROUTINE MILESTONE (NO OVERFLOW!) */}
              {/* ============================================================ */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Add Routine Milestone</label>
                  <span className="text-[11px] text-slate-400">Custom task &amp; time</span>
                </div>

                {/* Quick Icon Selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-500">Choose Milestone Emoji:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-base">
                    {QUICK_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-1.5 rounded-lg border text-sm transition-transform active:scale-90 ${
                          selectedIcon === icon ? 'bg-indigo-50 border-indigo-400 scale-110' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fully Responsive Input Fields with Zero Overflow */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={newItemTime}
                        onChange={(e) => setNewItemTime(e.target.value)}
                        placeholder="Time (8:30 AM)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-8 flex gap-2">
                      <input
                        type="text"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        placeholder="Milestone (e.g. Read 20 mins)"
                        className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addItem}
                        className="shrink-0 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Reward Target */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Weekly Goal &amp; Reward</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 mb-1 block">Star Target:</span>
                    <input
                      type="text"
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 mb-1 block">Family Reward:</span>
                    <input
                      type="text"
                      value={weeklyReward}
                      onChange={(e) => setWeeklyReward(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* DUAL DOWNLOAD OPTIONS & PRINT ACTIONS (FULLY RESTORED) */}
              {/* ============================================================ */}
              <div className="pt-5 border-t border-slate-100 space-y-2.5">
                <div className="text-xs font-bold text-slate-700">Download &amp; Print Options</div>
                
                {/* 1. PDF Download */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-transform active:scale-98"
                >
                  <FileText className="w-4 h-4 text-indigo-200" />
                  <span>Download Print-Ready PDF</span>
                </button>

                {/* 2. HD Image Download (PNG) */}
                <button
                  type="button"
                  onClick={handleDownloadHDImage}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-transform active:scale-98"
                >
                  <ImageIcon className="w-4 h-4 text-purple-200" />
                  <span>Download HD Image (PNG)</span>
                </button>

                {/* 3. Direct Print Feature */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Direct Print (Standard A4)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT: RESTORED CLEAN & BEAUTIFUL TIMETABLE CHART DESIGN */}
          {/* ================================================================ */}
          <div className="lg:col-span-7">
            {/* Action Bar Above Preview (Helpful on Desktop) */}
            <div className="hidden sm:flex items-center justify-between pb-3 px-1 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Interactive Preview (Standard A4 Portrait)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-indigo-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleDownloadHDImage}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3 text-purple-600" />
                  <span>HD Image</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  <Printer className="w-3 h-3 text-slate-600" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Printable Canvas Sheet (Professional Layout) */}
            <div 
              ref={printableRef}
              id="printable-canvas" 
              className={`bg-white rounded-3xl p-6 sm:p-10 border-4 border-dashed ${themeAccentBorder} shadow-xl space-y-6 print:p-0 print:border-none print:shadow-none print:m-0`}
            >
              {/* Header Ribbon on Printable */}
              <div className={`${themeAccentBg} text-white rounded-2xl p-5 sm:p-6 text-center space-y-2 shadow-sm`}>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 backdrop-blur-xs text-white text-[11px] font-black rounded-full uppercase tracking-widest">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>Daily Habit &amp; Routine Success Chart</span>
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                  {childName.trim() ? `${childName}'s` : "My"} {routineType} Routine
                </h2>

                <p className="text-white/80 text-xs font-medium">
                  Complete each daily milestone, tick off the weekly days, and earn your star reward!
                </p>
              </div>

              {/* Table Column Labels */}
              <div className="bg-slate-100/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center">Done</span>
                  <span className="w-16">Time</span>
                  <span>Habit &amp; Activity</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-slate-500 font-bold">M · T · W · T · F · S · S</span>
                  <span className="w-16 text-right">Reward</span>
                </div>
              </div>

              {/* Checklist Table Rows */}
              <div className="space-y-2.5">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Checkbox square */}
                      <div className="w-6 h-6 rounded-lg border-2 border-slate-400 flex items-center justify-center bg-white shrink-0 group-hover:border-indigo-500 transition-colors cursor-pointer">
                        <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Time Pill */}
                      <span className={`px-2.5 py-1 ${themePillBg} rounded-lg text-xs font-bold shrink-0`}>
                        {item.time}
                      </span>

                      {/* Emoji Icon & Milestone Title */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">
                          {item.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Mon-Sun 7 Day Tick Circles (Visible on larger screens) */}
                      <div className="hidden sm:flex items-center gap-1.5">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => (
                          <div
                            key={dIdx}
                            className="w-5 h-5 rounded-md border border-slate-300 bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 select-none"
                            title={`${day} checkbox`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Star Reward Badge */}
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {item.reward}
                      </span>

                      {/* Remove Milestone Button (Hidden in Print) */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 no-print transition-colors"
                        title="Remove milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly Reward Goal Box */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/70 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-amber-800">
                      Weekly Goal Target: <span className="underline">{targetGoal}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-amber-950 mt-0.5">
                      Celebration Reward: {weeklyReward}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-amber-700 font-semibold border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span>Tracked on Reusable Sheet</span>
                </div>
              </div>

              {/* Motivational Footer & Sign-off Line */}
              <div className="border-t-2 border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span className="font-bold text-slate-700">FamilyPrintables.com · Kids Routine System</span>
                <div className="flex items-center gap-4 text-xs">
                  <span>Parent Signature: _______________________</span>
                  <span>Date: ____________</span>
                </div>
              </div>
            </div>

            {/* Print & Lamination Recommendation Tip Box */}
            <div className="mt-4 p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3 no-print">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Parent Lamination &amp; Dry-Erase Tip:</span>
                <span className="text-indigo-800/90 leading-relaxed">
                  Slip your printed chart into a standard transparent plastic binder sleeve or laminate it. Kids can check off their boxes each morning and evening using dry-erase markers, and wipe clean every Sunday night!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
