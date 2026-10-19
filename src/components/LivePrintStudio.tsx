import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  AlertCircle,
  ZoomIn,
  ZoomOut
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
  'study-planner': 'Master your mind with focused daily intention and clear study goals — Family Printables',
  'shop-ledger': 'Accurate daily records build thriving, trusted business relationships — Family Printables',
  'order-booking': 'Every customer order fulfilled with excellence builds a lasting brand — Family Printables',
  'billing-receipt': 'Transparent bookkeeping and clear invoicing power financial confidence — Family Printables',
  'inventory-sheet': 'Organized inventory ensures smooth operations and zero stockouts — Family Printables',
  'family-chore': 'Teamwork in the home teaches responsibility with a grateful heart — Family Printables',
  'grocery-list': 'Healthy family meals begin with mindful, organized kitchen planning — Family Printables',
  'monthly-budget': 'Financial peace comes from knowing where every dollar is assigned — Family Printables',
  'meal-planner': 'Nourishing food made with love brings families closer together — Family Printables'
};

import { UserAccount } from '../types';
import { getCurrencySymbol } from '../utils/currency';

interface LivePrintStudioProps {
  onOpenAuth?: () => void;
  onExploreTemplates?: () => void;
  initialTemplateId?: string;
  onTemplateExported?: (templateId: string) => void;
  currency?: string;
  isUnlockedDefault?: boolean;
  account?: UserAccount;
  onRequireSignUp?: (actionType: 'download' | 'print', onComplete: () => void) => void;
}

// Data structures for mobile-editable Shop & Business forms
export interface InvoiceItem {
  id: string;
  desc: string;
  qty: number;
  rate: number;
}

export interface OrderItem {
  id: string;
  item: string;
  qty: number;
  rate: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  desc: string;
  dr: number;
  cr: number;
}

// Educational & Study Data Structures
export interface DailyScheduleSlot {
  id: string;
  time: string;
  label: string;
}

export interface WeeklyScheduleSlot {
  id: string;
  time: string;
  m: string;
  tu: string;
  w: string;
  th: string;
  f: string;
  sa: string;
  su: string;
}

export interface StudyTopicItem {
  id: string;
  num: number;
  topic: string;
  hours: number;
  confidence: string;
}

// Personal & Home Management Data Structures
export interface MealPlanDay {
  day: string;
  b: string;
  l: string;
  d: string;
  s: string;
}

export interface GroceryCategoryGroup {
  id: string;
  title: string;
  items: string[];
}

export interface BudgetItem {
  id: string;
  cat: string;
  planned: number;
  actual: number;
}

export interface FamilyChore {
  id: string;
  chore: string;
  member: string;
}

const DEFAULT_INVOICE_ITEMS: InvoiceItem[] = [
  { id: '1', desc: 'Commercial Consulting & Print Layout Package', qty: 1, rate: 120.00 },
  { id: '2', desc: 'Premium Cardstock Paper Stock (Bundle of 250)', qty: 2, rate: 22.50 },
  { id: '3', desc: 'Double-Sided High-Gloss Thermal Lamination', qty: 40, rate: 1.25 },
  { id: '4', desc: 'Custom Binder & Dividers Assembly Service', qty: 1, rate: 15.00 },
];

const DEFAULT_ORDER_ITEMS: OrderItem[] = [
  { id: '1', item: 'Custom Wood Craft Shelves (Standard)', qty: 2, rate: 45.00 },
  { id: '2', item: 'Heavy-Duty Steel Brackets & Hardware', qty: 4, rate: 12.50 },
  { id: '3', item: 'Protective Matte Sealant Finish', qty: 1, rate: 25.00 },
  { id: '4', item: 'Delivery & Handling to Address', qty: 1, rate: 15.00 },
  { id: '5', item: 'Additional Custom Engraving / Labels', qty: 2, rate: 10.00 },
];

const DEFAULT_LEDGER_ENTRIES: LedgerEntry[] = [
  { id: '1', date: '10/01', desc: 'Opening Balance Carried Forward', dr: 0, cr: 450.00 },
  { id: '2', date: '10/03', desc: 'Inventory Supply - Order #942', dr: 120.00, cr: 0 },
  { id: '3', date: '10/06', desc: 'Cash Sales & Client Deposit', dr: 0, cr: 280.00 },
  { id: '4', date: '10/09', desc: 'Store Maintenance & Packaging', dr: 65.00, cr: 0 },
  { id: '5', date: '10/12', desc: 'Wholesale Invoice Cleared', dr: 0, cr: 390.00 },
  { id: '6', date: '10/15', desc: 'Utility Bill (Power & Internet)', dr: 95.00, cr: 0 },
  { id: '7', date: '10/18', desc: 'Direct Customer Payment (Cash)', dr: 0, cr: 210.00 },
  { id: '8', date: '10/22', desc: 'Custom Booking Advance Received', dr: 0, cr: 150.00 },
  { id: '9', date: '10/25', desc: 'Vendor Restock - Hardware Parts', dr: 310.00, cr: 0 },
  { id: '10', date: '10/29', desc: 'Weekend Retail Collections', dr: 0, cr: 425.00 },
];

const DEFAULT_DAILY_SLOTS: DailyScheduleSlot[] = [
  { id: '1', time: '6:00 AM', label: 'Morning Wakeup, Hydration & Stretching' },
  { id: '2', time: '7:00 AM', label: 'Breakfast & Family Planning' },
  { id: '3', time: '8:00 AM', label: 'Priority Study Block #1 (Math & Logic)' },
  { id: '4', time: '9:30 AM', label: 'Short Break & Quick Walk' },
  { id: '5', time: '10:00 AM', label: 'Deep Work Block #2 (Science & Reading)' },
  { id: '6', time: '11:30 AM', label: 'Practical Assignment Revision' },
  { id: '7', time: '1:00 PM', label: 'Lunch Break & Relax' },
  { id: '8', time: '2:30 PM', label: 'Language & Writing Exercises' },
  { id: '9', time: '4:00 PM', label: 'Creative Project / Outdoor Sport' },
  { id: '10', time: '6:00 PM', label: 'Family Dinner & Chores' },
  { id: '11', time: '8:00 PM', label: 'Book Reading & Reflection' },
  { id: '12', time: '9:30 PM', label: 'Wind-down & Lights Out' },
];

const DEFAULT_DAILY_PRIORITIES = [
  'Complete Math Chapter 4 Quiz',
  'Review Science Lab Notes',
  '30 Mins Daily Physical Play'
];

const DEFAULT_DAILY_HABITS = [
  'Drink 8 Glasses of Water',
  'Eat Healthy Fresh Fruit',
  'Read 20 Mins Book',
  'Clean Desk & Pack Bag'
];

const DEFAULT_WEEKLY_SLOTS: WeeklyScheduleSlot[] = [
  { id: '1', time: '8:00 AM', m: 'Math', tu: 'English', w: 'Math', th: 'English', f: 'Science', sa: 'Revision', su: 'Rest' },
  { id: '2', time: '9:30 AM', m: 'Science', tu: 'History', w: 'Science', th: 'History', f: 'Coding', sa: 'Project', su: 'Family' },
  { id: '3', time: '11:00 AM', m: 'Language', tu: 'Art', w: 'Language', th: 'Art', f: 'Music', sa: 'Reading', su: 'Outdoor' },
  { id: '4', time: '1:00 PM', m: 'Lunch', tu: 'Lunch', w: 'Lunch', th: 'Lunch', f: 'Lunch', sa: 'Lunch', su: 'Lunch' },
  { id: '5', time: '2:30 PM', m: 'Physics', tu: 'Biology', w: 'Algebra', th: 'Chem', f: 'Quiz', sa: 'Sports', su: 'Prep' },
  { id: '6', time: '4:00 PM', m: 'Exercise', tu: 'Sports', w: 'Clubs', th: 'Sports', f: 'Social', sa: 'Free', su: 'Plan' },
  { id: '7', time: '6:30 PM', m: 'Homework', tu: 'Homework', w: 'Review', th: 'Prep', f: 'Movie', sa: 'Games', su: 'Sleep' },
];

const DEFAULT_STUDY_TOPICS: StudyTopicItem[] = [
  { id: '1', num: 1, topic: 'Quadratic Equations & Parabolas', hours: 1.5, confidence: '⭐⭐⭐⭐' },
  { id: '2', num: 2, topic: 'Polynomial Factorization Drills', hours: 1.0, confidence: '⭐⭐⭐' },
  { id: '3', num: 3, topic: 'Logarithmic Functions & Word Problems', hours: 1.0, confidence: '⭐⭐' },
  { id: '4', num: 4, topic: 'Sample Exam Paper Revision', hours: 1.0, confidence: '⭐⭐⭐⭐' },
];

const DEFAULT_MEAL_PLAN: MealPlanDay[] = [
  { day: 'Monday', b: 'Oatmeal & Fresh Berries', l: 'Grilled Chicken Salad', d: 'Baked Salmon & Broccoli', s: 'Almonds' },
  { day: 'Tuesday', b: 'Scrambled Eggs & Toast', l: 'Quinoa Veggie Bowl', d: 'Homemade Turkey Tacos', s: 'Apple' },
  { day: 'Wednesday', b: 'Green Smoothie & Granola', l: 'Turkey Avocado Wrap', d: 'Vegetable Stir-Fry & Rice', s: 'Yogurt' },
  { day: 'Thursday', b: 'Pancakes & Pure Maple', l: 'Minestrone Soup & Bread', d: 'Lemon Herb Roast Chicken', s: 'Carrots' },
  { day: 'Friday', b: 'Avocado Toast & Boiled Egg', l: 'Tuna Salad Sandwich', d: 'Family Homemade Pizza', s: 'Popcorn' },
  { day: 'Saturday', b: 'French Toast & Fruit', l: 'Leftover Buffet Spread', d: 'BBQ Burgers & Sweet Fries', s: 'Smoothie' },
  { day: 'Sunday', b: 'Sunday Brunch Omelette', l: 'Mediterranean Mezze', d: 'Slow Cooker Beef Stew', s: 'Nuts' },
];

const DEFAULT_GROCERY_GROUPS: GroceryCategoryGroup[] = [
  { id: '1', title: 'Fresh Produce & Fruits', items: ['Crisp Apples & Bananas', 'Baby Spinach & Salad Greens', 'Carrots & Cucumbers', 'Sweet Vine Tomatoes'] },
  { id: '2', title: 'Dairy, Eggs & Bakery', items: ['Organic Whole Milk', 'Pasture-Raised Eggs (12)', 'Greek Yogurt Plain', 'Whole Wheat Sourdough'] },
  { id: '3', title: 'Pantry Staples & Grains', items: ['Brown Rice & Quinoa', 'Olive Oil Extra Virgin', 'Rolled Oats & Chia Seeds', 'Black Beans & Lentils'] },
  { id: '4', title: 'Household & Essentials', items: ['Eco Dishwashing Soap', 'Paper Towels (Pack 4)', 'Laundry Detergent Pods', 'Dry-Erase Marker Pack'] },
];

const DEFAULT_BUDGET_ITEMS: BudgetItem[] = [
  { id: '1', cat: 'Housing, Rent & Utilities', planned: 1400.00, actual: 1385.00 },
  { id: '2', cat: 'Groceries & Household Supplies', planned: 650.00, actual: 670.00 },
  { id: '3', cat: 'Transportation & Vehicle Fuel', planned: 250.00, actual: 230.00 },
  { id: '4', cat: 'Children Education & Workbooks', planned: 120.00, actual: 110.00 },
  { id: '5', cat: 'Emergency Fund Savings Goal', planned: 400.00, actual: 400.00 },
];

const DEFAULT_FAMILY_CHORES: FamilyChore[] = [
  { id: '1', chore: 'Make Bed & Clean Pillow', member: 'Alex' },
  { id: '2', chore: 'Pack School Backpack', member: 'Alex' },
  { id: '3', chore: 'Brush Teeth Morning & Night', member: 'Emma' },
  { id: '4', chore: 'Help Clear Dinner Plates', member: 'Everyone' },
  { id: '5', chore: 'Feed & Water Family Pet', member: 'Emma' },
  { id: '6', chore: 'Put Away Laundry Clothes', member: 'Alex' },
  { id: '7', chore: '30 Mins Screen-Free Reading', member: 'Kids' },
];

export interface InventoryItemRow {
  id: string;
  sku: string;
  name: string;
  op: number;
  inQty: number;
  outQty: number;
  re: string;
}

const DEFAULT_INVENTORY_ITEMS: InventoryItemRow[] = [
  { id: '1', sku: 'SKU-101', name: 'A4 Bright White 32lb Paper (Ream)', op: 45, inQty: 20, outQty: 18, re: '15 Min' },
  { id: '2', sku: 'SKU-102', name: 'Universal Heavy Cardstock 65lb (Pack 100)', op: 30, inQty: 10, outQty: 14, re: '10 Min' },
  { id: '3', sku: 'SKU-103', name: 'Dry-Erase Pocket Sleeves Universal Fit', op: 80, inQty: 0, outQty: 25, re: '20 Min' },
  { id: '4', sku: 'SKU-104', name: 'Fine Tip Dry-Erase Markers (Black)', op: 150, inQty: 50, outQty: 65, re: '50 Min' },
  { id: '5', sku: 'SKU-105', name: '3mil Thermal Laminating Pouches', op: 60, inQty: 40, outQty: 30, re: '25 Min' },
  { id: '6', sku: 'SKU-106', name: 'Velcro Dot Pairs (Hook & Loop)', op: 200, inQty: 0, outQty: 40, re: '50 Min' },
  { id: '7', sku: 'SKU-107', name: 'Star Reward Stickers (Pack of 500)', op: 90, inQty: 30, outQty: 20, re: '30 Min' },
  { id: '8', sku: 'SKU-108', name: 'Spiral Binding Coils 12mm', op: 40, inQty: 10, outQty: 15, re: '15 Min' },
];

export const LivePrintStudio: React.FC<LivePrintStudioProps> = ({
  onOpenAuth,
  onExploreTemplates,
  initialTemplateId = 'daily-timetable',
  onTemplateExported,
  currency = 'USD',
  isUnlockedDefault = true,
  account,
  onRequireSignUp,
}) => {
  // Studio State
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId>('educational-study');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplateId);
  const [selectedTheme, setSelectedTheme] = useState<PrintThemeId>('pastel');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [manualZoom, setManualZoom] = useState<number>(100);

  // Shop & Business Custom Header State
  const [businessHeader, setBusinessHeader] = useState<ShopBusinessHeader>(() => {
    try {
      const saved = localStorage.getItem('fp_custom_business_header');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BUSINESS_HEADER;
  });

  const handleUpdateBusinessHeader = (key: keyof ShopBusinessHeader, val: string) => {
    const updated = { ...businessHeader, [key]: val };
    setBusinessHeader(updated);
    try {
      localStorage.setItem('fp_custom_business_header', JSON.stringify(updated));
    } catch {}
  };

  // Mobile Edit Mode State
  const [isMobileEditOpen, setIsMobileEditOpen] = useState(true);

  // Commercial Invoice State
  const [invoiceCustomer, setInvoiceCustomer] = useState('Commercial Client / David Miller');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-089');
  const [invoiceDate, setInvoiceDate] = useState('2026-10-18');
  const [invoiceDueDate, setInvoiceDueDate] = useState('On Receipt');
  const [invoicePaymentMode, setInvoicePaymentMode] = useState('Cash / Card / Bank');
  const [invoiceTaxPercent, setInvoiceTaxPercent] = useState<number>(5);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_invoice_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_INVOICE_ITEMS;
  });

  // Order Booking State
  const [orderCustomerName, setOrderCustomerName] = useState('Sarah Jenkins');
  const [orderCustomerPhone, setOrderCustomerPhone] = useState('+00 123 456 7890');
  const [orderNumber, setOrderNumber] = useState('ORD-8821');
  const [orderDeliveryDate, setOrderDeliveryDate] = useState('2026-10-25');
  const [orderAdvancePaid, setOrderAdvancePaid] = useState<number>(100);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_order_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ORDER_ITEMS;
  });

  // Business Ledger State
  const [ledgerAccountName, setLedgerAccountName] = useState('Daily General Store Account');
  const [ledgerPeriod, setLedgerPeriod] = useState('October 2026');
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_ledger_entries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LEDGER_ENTRIES;
  });

  // Global Dynamic Currency Symbol
  const currSymbol = getCurrencySymbol(currency);

  // Watermark Toggle State
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  // Educational & Study Customization State
  const [eduStudentName, setEduStudentName] = useState('Alex Morgan');
  const [eduMonthYear, setEduMonthYear] = useState('October 2026');

  // Daily Timetable State
  const [dailySlots, setDailySlots] = useState<DailyScheduleSlot[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_daily_slots');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DAILY_SLOTS;
  });
  const [dailyPriorities, setDailyPriorities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_daily_priorities');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DAILY_PRIORITIES;
  });
  const [dailyHabits, setDailyHabits] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_daily_habits');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DAILY_HABITS;
  });
  const [dailyReflection, setDailyReflection] = useState('What went well today? What can I improve tomorrow?');

  // Weekly Timetable State
  const [weeklySlots, setWeeklySlots] = useState<WeeklyScheduleSlot[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_weekly_slots');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_WEEKLY_SLOTS;
  });

  // Monthly Calendar State
  const [calMonthYear, setCalMonthYear] = useState('November 2026');
  const [calFocusGoal, setCalFocusGoal] = useState('Focus on Gratitude, Academic Growth & Daily Routines');

  // Study Planner State
  const [studyFocus, setStudyFocus] = useState('Advanced Mathematics & Algebra');
  const [studyTargetHours, setStudyTargetHours] = useState('4.5 Hours Daily');
  const [studyTopics, setStudyTopics] = useState<StudyTopicItem[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_study_topics');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STUDY_TOPICS;
  });

  // Personal & Home Customization State
  const [homeFamilyName, setHomeFamilyName] = useState('The Morgan Family');
  const [homeTargetBudget, setHomeTargetBudget] = useState('3,800.00');

  // Family Chores State
  const [familyChores, setFamilyChores] = useState<FamilyChore[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_family_chores');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FAMILY_CHORES;
  });

  // Grocery List State
  const [groceryGroups, setGroceryGroups] = useState<GroceryCategoryGroup[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_grocery_groups');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GROCERY_GROUPS;
  });

  // Monthly Budget State
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_budget_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BUDGET_ITEMS;
  });

  // Meal Planner State
  const [mealDietaryNotes, setMealDietaryNotes] = useState('High Protein & Balanced Family Dinners');
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_meal_plan');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MEAL_PLAN;
  });

  // Inventory Items State
  const [inventoryItems, setInventoryItems] = useState<InventoryItemRow[]>(() => {
    try {
      const saved = localStorage.getItem('fp_mobile_inventory_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_INVENTORY_ITEMS;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Responsive Scaling & Ref
  const sheetContainerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState<number>(1);

  // Active theme & printable
  const currentTheme = PRINT_THEMES[selectedTheme] || PRINT_THEMES.pastel;
  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  // Dynamically calculate responsive scale for A4 container wrapper
  useEffect(() => {
    const updateScale = () => {
      if (previewWrapperRef.current) {
        const containerW = previewWrapperRef.current.clientWidth;
        // Standard A4 width is 794px. Leave padding space.
        if (containerW > 0 && containerW < 820) {
          const factor = Math.min(1, Math.max(0.35, (containerW - 16) / 794));
          setPreviewScale(factor);
        } else {
          setPreviewScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    const ro = new ResizeObserver(updateScale);
    if (previewWrapperRef.current) {
      ro.observe(previewWrapperRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      ro.disconnect();
    };
  }, []);

  // Sync category when printable changes
  useEffect(() => {
    const found = TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (found && found.categoryId !== selectedCategory) {
      setSelectedCategory(found.categoryId);
    }
  }, [selectedTemplateId]);

  // Invoice calculations
  const invoiceSubtotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.rate || 0)), 0);
  }, [invoiceItems]);

  const invoiceTax = useMemo(() => {
    return invoiceSubtotal * (Number(invoiceTaxPercent || 0) / 100);
  }, [invoiceSubtotal, invoiceTaxPercent]);

  const invoiceGrandTotal = useMemo(() => {
    return invoiceSubtotal + invoiceTax;
  }, [invoiceSubtotal, invoiceTax]);

  // Order calculations
  const orderTotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.rate || 0)), 0);
  }, [orderItems]);

  const orderRemaining = useMemo(() => {
    return Math.max(0, orderTotal - Number(orderAdvancePaid || 0));
  }, [orderTotal, orderAdvancePaid]);

  // Ledger calculations with running balance
  const ledgerCalculated = useMemo(() => {
    let running = 0;
    return ledgerEntries.map((entry) => {
      running += Number(entry.cr || 0) - Number(entry.dr || 0);
      return {
        ...entry,
        runningBalance: running
      };
    });
  }, [ledgerEntries]);

  const ledgerTotalDebits = useMemo(() => {
    return ledgerEntries.reduce((sum, e) => sum + Number(e.dr || 0), 0);
  }, [ledgerEntries]);

  const ledgerTotalCredits = useMemo(() => {
    return ledgerEntries.reduce((sum, e) => sum + Number(e.cr || 0), 0);
  }, [ledgerEntries]);

  const ledgerClosingBalance = useMemo(() => {
    return ledgerTotalCredits - ledgerTotalDebits;
  }, [ledgerTotalCredits, ledgerTotalDebits]);

  // Persistence helpers
  const saveInvoiceItems = (items: InvoiceItem[]) => {
    setInvoiceItems(items);
    try { localStorage.setItem('fp_mobile_invoice_items', JSON.stringify(items)); } catch {}
  };

  const saveOrderItems = (items: OrderItem[]) => {
    setOrderItems(items);
    try { localStorage.setItem('fp_mobile_order_items', JSON.stringify(items)); } catch {}
  };

  const saveLedgerEntries = (entries: LedgerEntry[]) => {
    setLedgerEntries(entries);
    try { localStorage.setItem('fp_mobile_ledger_entries', JSON.stringify(entries)); } catch {}
  };

  // Budget calculations
  const budgetTotalPlanned = useMemo(() => {
    return budgetItems.reduce((sum, item) => sum + Number(item.planned || 0), 0);
  }, [budgetItems]);

  const budgetTotalActual = useMemo(() => {
    return budgetItems.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  }, [budgetItems]);

  const budgetTotalVariance = useMemo(() => {
    return budgetTotalPlanned - budgetTotalActual;
  }, [budgetTotalPlanned, budgetTotalActual]);

  // Additional persistence helpers
  const saveDailySlots = (slots: DailyScheduleSlot[]) => {
    setDailySlots(slots);
    try { localStorage.setItem('fp_mobile_daily_slots', JSON.stringify(slots)); } catch {}
  };

  const saveWeeklySlots = (slots: WeeklyScheduleSlot[]) => {
    setWeeklySlots(slots);
    try { localStorage.setItem('fp_mobile_weekly_slots', JSON.stringify(slots)); } catch {}
  };

  const saveStudyTopics = (topics: StudyTopicItem[]) => {
    setStudyTopics(topics);
    try { localStorage.setItem('fp_mobile_study_topics', JSON.stringify(topics)); } catch {}
  };

  const saveFamilyChores = (chores: FamilyChore[]) => {
    setFamilyChores(chores);
    try { localStorage.setItem('fp_mobile_family_chores', JSON.stringify(chores)); } catch {}
  };

  const saveGroceryGroups = (groups: GroceryCategoryGroup[]) => {
    setGroceryGroups(groups);
    try { localStorage.setItem('fp_mobile_grocery_groups', JSON.stringify(groups)); } catch {}
  };

  const saveBudgetItems = (items: BudgetItem[]) => {
    setBudgetItems(items);
    try { localStorage.setItem('fp_mobile_budget_items', JSON.stringify(items)); } catch {}
  };

  const saveMealPlan = (plan: MealPlanDay[]) => {
    setMealPlan(plan);
    try { localStorage.setItem('fp_mobile_meal_plan', JSON.stringify(plan)); } catch {}
  };

  const saveInventoryItems = (items: InventoryItemRow[]) => {
    setInventoryItems(items);
    try { localStorage.setItem('fp_mobile_inventory_items', JSON.stringify(items)); } catch {}
  };

  const getCategoryWatermarkText = () => {
    switch (currentTemplate.categoryId) {
      case 'educational-study':
        return '★ KIDS LEARNING & ACADEMIC PLANNER · FAMILY PRINTABLES ★';
      case 'shop-business':
        return '★ OFFICIAL COMMERCIAL RECORD · FAMILY PRINTABLES ★';
      case 'personal-home':
        return currentTemplate.id === 'monthly-budget'
          ? '★ FINANCIAL BUDGET & SAVINGS PLANNER · FAMILY PRINTABLES ★'
          : '★ HOME & LIFESTYLE ORGANIZER · FAMILY PRINTABLES ★';
      default:
        return '★ FAMILY PRINTABLES · A4 PRINTABLE EDITION ★';
    }
  };

  // Direct Browser Print
  const executePrint = () => {
    window.print();
    showToast('Sent to printer! Standard A4 format optimized.');
    if (onTemplateExported) onTemplateExported(currentTemplate.id);
  };

  const handlePrint = () => {
    if (onRequireSignUp && (!account?.isLoggedIn || !account?.email || !account?.name)) {
      onRequireSignUp('print', executePrint);
      return;
    }
    executePrint();
  };

  // Generate High-Res 300 DPI Vector PDF with jsPDF
  const executeDownloadPDF = () => {
    try {
      const isA4 = paperSize === 'a4';
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: isA4 ? 'a4' : [216, 279]
      });

      const pageWidth = isA4 ? 210 : 216;
      const pageHeight = isA4 ? 297 : 279;

      const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      };

      const primaryRgb = hexToRgb(currentTheme.primaryColor);

      // Outer Decorative Border (Single Page)
      doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.setLineWidth(0.8);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Header Banner
      doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.roundedRect(14, 14, pageWidth - 28, 18, 3, 3, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
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
        doc.text(`Target: ${currSymbol}${homeTargetBudget}`, pageWidth - 16, contentY, { align: 'right' });
        contentY += 8;
      }

      // Draw Structured Grid Rows
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      const rowHeight = 9.5;
      const numRows = Math.floor((pageHeight - contentY - 30) / rowHeight);

      // Table Header Row
      doc.setFillColor(240, 242, 248);
      doc.rect(14, contentY, pageWidth - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);

      if (currentTemplate.id === 'billing-receipt') {
        doc.text('S.No', 18, contentY + 5.5);
        doc.text('Product / Service Breakdown', 35, contentY + 5.5);
        doc.text('Qty', 125, contentY + 5.5);
        doc.text('Rate', 145, contentY + 5.5);
        doc.text(`Amount (${currSymbol})`, 175, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        invoiceItems.forEach((item, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          doc.text(String(idx + 1), 18, lineY + 6);
          doc.text(item.desc.substring(0, 48), 35, lineY + 6);
          doc.text(String(item.qty), 127, lineY + 6);
          doc.text(`${currSymbol}${Number(item.rate).toFixed(2)}`, 145, lineY + 6);
          doc.text(`${currSymbol}${(item.qty * item.rate).toFixed(2)}`, 175, lineY + 6);
        });

        // Totals Box
        const totalsY = contentY + invoiceItems.length * rowHeight + 4;
        doc.setFont('helvetica', 'bold');
        doc.text(`Subtotal: ${currSymbol}${invoiceSubtotal.toFixed(2)}   |   Tax (${invoiceTaxPercent}%): ${currSymbol}${invoiceTax.toFixed(2)}   |   Grand Total: ${currSymbol}${invoiceGrandTotal.toFixed(2)}`, pageWidth / 2, totalsY + 6, { align: 'center' });
      } else if (currentTemplate.id === 'order-booking') {
        doc.text('#', 18, contentY + 5.5);
        doc.text('Item Description / Specs', 35, contentY + 5.5);
        doc.text('Qty', 125, contentY + 5.5);
        doc.text('Unit Price', 145, contentY + 5.5);
        doc.text(`Total (${currSymbol})`, 175, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        orderItems.forEach((item, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          doc.text(String(idx + 1), 18, lineY + 6);
          doc.text(item.item.substring(0, 48), 35, lineY + 6);
          doc.text(String(item.qty), 127, lineY + 6);
          doc.text(`${currSymbol}${Number(item.rate).toFixed(2)}`, 145, lineY + 6);
          doc.text(`${currSymbol}${(item.qty * item.rate).toFixed(2)}`, 175, lineY + 6);
        });

        const totalsY = contentY + orderItems.length * rowHeight + 4;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: ${currSymbol}${orderTotal.toFixed(2)}   |   Advance Paid: ${currSymbol}${orderAdvancePaid.toFixed(2)}   |   Remaining Balance: ${currSymbol}${orderRemaining.toFixed(2)}`, pageWidth / 2, totalsY + 6, { align: 'center' });
      } else if (currentTemplate.id === 'shop-ledger') {
        doc.text('Date', 18, contentY + 5.5);
        doc.text('Particulars / Customer Note', 45, contentY + 5.5);
        doc.text('Debit (-)', 115, contentY + 5.5);
        doc.text('Credit (+)', 145, contentY + 5.5);
        doc.text(`Balance (${currSymbol})`, 175, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        ledgerCalculated.forEach((entry, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          doc.text(entry.date, 18, lineY + 6);
          doc.text(entry.desc.substring(0, 36), 45, lineY + 6);
          doc.text(entry.dr > 0 ? `${currSymbol}${entry.dr.toFixed(2)}` : '—', 115, lineY + 6);
          doc.text(entry.cr > 0 ? `${currSymbol}${entry.cr.toFixed(2)}` : '—', 145, lineY + 6);
          doc.text(`${currSymbol}${entry.runningBalance.toFixed(2)}`, 175, lineY + 6);
        });

        const totalsY = contentY + ledgerCalculated.length * rowHeight + 4;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Debits: ${currSymbol}${ledgerTotalDebits.toFixed(2)}   |   Total Credits: ${currSymbol}${ledgerTotalCredits.toFixed(2)}   |   Closing Balance: ${currSymbol}${ledgerClosingBalance.toFixed(2)}`, pageWidth / 2, totalsY + 6, { align: 'center' });
      } else if (currentTemplate.id === 'inventory-sheet') {
        doc.text('SKU', 18, contentY + 5.5);
        doc.text('Item Description', 42, contentY + 5.5);
        doc.text('Opening', 110, contentY + 5.5);
        doc.text('+In', 130, contentY + 5.5);
        doc.text('-Out', 145, contentY + 5.5);
        doc.text('Closing', 160, contentY + 5.5);
        doc.text('Reorder', 178, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        inventoryItems.forEach((row, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          const closing = Number(row.op || 0) + Number(row.inQty || 0) - Number(row.outQty || 0);
          doc.text(row.sku, 18, lineY + 6);
          doc.text(row.name.substring(0, 34), 42, lineY + 6);
          doc.text(String(row.op), 110, lineY + 6);
          doc.text(String(row.inQty), 130, lineY + 6);
          doc.text(String(row.outQty), 145, lineY + 6);
          doc.text(String(closing), 160, lineY + 6);
          doc.text(row.re, 178, lineY + 6);
        });
      } else if (currentTemplate.id === 'daily-timetable') {
        doc.text('Time', 18, contentY + 5.5);
        doc.text('Hourly Activity / Study Task', 48, contentY + 5.5);
        doc.text('Priority / Notes', 130, contentY + 5.5);
        doc.text('Done [X]', 175, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        dailySlots.slice(0, 14).forEach((slot, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          doc.text(slot.time, 18, lineY + 6);
          doc.text(slot.label.substring(0, 42), 48, lineY + 6);
          doc.text(dailyPriorities[idx] ? `★ ${dailyPriorities[idx].substring(0, 24)}` : '', 130, lineY + 6);
          doc.rect(pageWidth - 26, lineY + 2.5, 4.5, 4.5);
        });
      } else if (currentTemplate.id === 'monthly-budget') {
        doc.text('Expense Category', 18, contentY + 5.5);
        doc.text(`Planned (${currSymbol})`, 110, contentY + 5.5);
        doc.text(`Actual (${currSymbol})`, 140, contentY + 5.5);
        doc.text(`Variance (${currSymbol})`, 170, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        budgetItems.forEach((item, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          const diff = item.planned - item.actual;
          doc.text(item.cat.substring(0, 45), 18, lineY + 6);
          doc.text(`${currSymbol}${item.planned.toFixed(2)}`, 110, lineY + 6);
          doc.text(`${currSymbol}${item.actual.toFixed(2)}`, 140, lineY + 6);
          doc.text(`${diff >= 0 ? '+' : ''}${currSymbol}${diff.toFixed(2)}`, 170, lineY + 6);
        });

        const totalsY = contentY + budgetItems.length * rowHeight + 4;
        doc.setFont('helvetica', 'bold');
        doc.text(`Planned: ${currSymbol}${budgetTotalPlanned.toFixed(2)}   |   Actual: ${currSymbol}${budgetTotalActual.toFixed(2)}   |   Variance: ${budgetTotalVariance >= 0 ? '+' : ''}${currSymbol}${budgetTotalVariance.toFixed(2)}`, pageWidth / 2, totalsY + 6, { align: 'center' });
      } else if (currentTemplate.id === 'meal-planner') {
        doc.text('Day', 18, contentY + 5.5);
        doc.text('Breakfast', 45, contentY + 5.5);
        doc.text('Lunch', 85, contentY + 5.5);
        doc.text('Dinner', 125, contentY + 5.5);
        doc.text('Snack', 165, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        mealPlan.forEach((m, idx) => {
          const lineY = contentY + idx * (rowHeight * 1.3);
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight * 1.3, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight * 1.3, 'S');
          doc.setFont('helvetica', 'bold');
          doc.text(m.day.substring(0, 9), 18, lineY + 7);
          doc.setFont('helvetica', 'normal');
          doc.text(m.b.substring(0, 18), 45, lineY + 7);
          doc.text(m.l.substring(0, 18), 85, lineY + 7);
          doc.text(m.d.substring(0, 18), 125, lineY + 7);
          doc.text(m.s.substring(0, 15), 165, lineY + 7);
        });
      } else if (currentTemplate.id === 'family-chore') {
        doc.text('Chore / Task Description', 18, contentY + 5.5);
        doc.text('Assigned Member', 130, contentY + 5.5);
        doc.text('Done [X]', 175, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        familyChores.forEach((chore, idx) => {
          const lineY = contentY + idx * rowHeight;
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          doc.text(chore.chore.substring(0, 55), 18, lineY + 6);
          doc.text(chore.member, 130, lineY + 6);
          doc.rect(pageWidth - 26, lineY + 2.5, 4.5, 4.5);
        });
      } else {
        doc.text('Time Block / Task', 18, contentY + 5.5);
        doc.text('Description / Subject Focus', 60, contentY + 5.5);
        doc.text('Priority / Notes', 135, contentY + 5.5);
        doc.text('Completed [X]', 175, contentY + 5.5);
        contentY += 8;

        doc.setFont('helvetica', 'normal');
        for (let r = 0; r < numRows; r++) {
          const lineY = contentY + r * rowHeight;
          if (r % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          if (r % 2 === 1) {
            doc.setFillColor(250, 250, 252);
            doc.rect(14, lineY, pageWidth - 28, rowHeight, 'F');
          }
          doc.rect(14, lineY, pageWidth - 28, rowHeight, 'S');
          doc.setDrawColor(180, 180, 180);
          doc.rect(pageWidth - 26, lineY + 2.5, 4.5, 4.5);
        }
      }

      // Single-Page Footer
      const footerY = pageHeight - 12;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const inspiringQuote = TEMPLATE_INSPIRING_QUOTES[currentTemplate.id] || 'Small daily steps lead to big family moments — Family Printables';
      doc.text(`"${inspiringQuote}"`, pageWidth / 2, footerY, { align: 'center' });

      // Save PDF
      const fileName = `${currentTemplate.id}_${selectedTheme}_${paperSize.toUpperCase()}.pdf`;
      doc.save(fileName);
      showToast(`Downloaded High-Definition PDF: ${fileName}`);
      if (onTemplateExported) onTemplateExported(currentTemplate.id);
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Error generating PDF. Please use Direct Print.');
    }
  };

  const handleDownloadPDF = () => {
    if (onRequireSignUp && (!account?.isLoggedIn || !account?.email || !account?.name)) {
      onRequireSignUp('download', executeDownloadPDF);
      return;
    }
    executeDownloadPDF();
  };

  // Generate Editable Word/Doc (.doc) Export
  const executeDownloadEditableDoc = () => {
    try {
      let tableHtml = '';
      const docTitle = currentTemplate.title;

      if (currentTemplate.id === 'billing-receipt') {
        tableHtml = `
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:16px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:8%;">S.No</th>
              <th style="width:52%;">Product / Service Description</th>
              <th style="width:12%;">Qty</th>
              <th style="width:14%;">Unit Price (${currSymbol})</th>
              <th style="width:14%;">Amount (${currSymbol})</th>
            </tr>
            ${invoiceItems.map((item, idx) => `
              <tr>
                <td style="text-align:center;">${idx + 1}</td>
                <td>${item.desc}</td>
                <td style="text-align:center;">${item.qty}</td>
                <td style="text-align:right;">${currSymbol}${Number(item.rate).toFixed(2)}</td>
                <td style="text-align:right; font-weight:bold;">${currSymbol}${(item.qty * item.rate).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="background:#f8fafc; font-weight:bold;">
              <td colspan="4" style="text-align:right;">Subtotal:</td>
              <td style="text-align:right;">${currSymbol}${invoiceSubtotal.toFixed(2)}</td>
            </tr>
            ${invoiceTaxPercent > 0 ? `
            <tr style="background:#f8fafc;">
              <td colspan="4" style="text-align:right;">Tax (${invoiceTaxPercent}%):</td>
              <td style="text-align:right;">${currSymbol}${invoiceTax.toFixed(2)}</td>
            </tr>` : ''}
            <tr style="background:#e0e7ff; font-weight:bold; font-size:14px;">
              <td colspan="4" style="text-align:right;">Grand Total:</td>
              <td style="text-align:right; color:#4338ca;">${currSymbol}${invoiceGrandTotal.toFixed(2)}</td>
            </tr>
          </table>
        `;
      } else if (currentTemplate.id === 'order-booking') {
        tableHtml = `
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:16px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:8%;">#</th>
              <th style="width:52%;">Item Description / Specifications</th>
              <th style="width:12%;">Quantity</th>
              <th style="width:14%;">Unit Rate (${currSymbol})</th>
              <th style="width:14%;">Line Total (${currSymbol})</th>
            </tr>
            ${orderItems.map((item, idx) => `
              <tr>
                <td style="text-align:center;">${idx + 1}</td>
                <td>${item.item}</td>
                <td style="text-align:center;">${item.qty}</td>
                <td style="text-align:right;">${currSymbol}${Number(item.rate).toFixed(2)}</td>
                <td style="text-align:right; font-weight:bold;">${currSymbol}${(item.qty * item.rate).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="background:#f8fafc; font-weight:bold;">
              <td colspan="4" style="text-align:right;">Total Order Amount:</td>
              <td style="text-align:right;">${currSymbol}${orderTotal.toFixed(2)}</td>
            </tr>
            <tr style="background:#ecfdf5; font-weight:bold;">
              <td colspan="4" style="text-align:right; color:#047857;">Advance Paid:</td>
              <td style="text-align:right; color:#047857;">${currSymbol}${Number(orderAdvancePaid).toFixed(2)}</td>
            </tr>
            <tr style="background:#fff1f2; font-weight:bold;">
              <td colspan="4" style="text-align:right; color:#be123c;">Remaining Balance:</td>
              <td style="text-align:right; color:#be123c;">${currSymbol}${orderRemaining.toFixed(2)}</td>
            </tr>
          </table>
        `;
      } else if (currentTemplate.id === 'shop-ledger') {
        tableHtml = `
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:16px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:15%;">Date</th>
              <th style="width:45%;">Particulars / Transaction Details</th>
              <th style="width:13%;">Debit (-)</th>
              <th style="width:13%;">Credit (+)</th>
              <th style="width:14%;">Net Balance (${currSymbol})</th>
            </tr>
            ${ledgerCalculated.map((e) => `
              <tr>
                <td style="text-align:center;">${e.date}</td>
                <td>${e.desc}</td>
                <td style="text-align:right; color:#dc2626;">${e.dr > 0 ? currSymbol + e.dr.toFixed(2) : '—'}</td>
                <td style="text-align:right; color:#16a34a;">${e.cr > 0 ? currSymbol + e.cr.toFixed(2) : '—'}</td>
                <td style="text-align:right; font-weight:bold;">${currSymbol}${e.runningBalance.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="background:#f8fafc; font-weight:bold;">
              <td colspan="2" style="text-align:right;">Totals:</td>
              <td style="text-align:right; color:#dc2626;">${currSymbol}${ledgerTotalDebits.toFixed(2)}</td>
              <td style="text-align:right; color:#16a34a;">${currSymbol}${ledgerTotalCredits.toFixed(2)}</td>
              <td style="text-align:right; color:#4338ca;">${currSymbol}${ledgerClosingBalance.toFixed(2)}</td>
            </tr>
          </table>
        `;
      } else if (currentTemplate.id === 'inventory-sheet') {
        tableHtml = `
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:16px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:15%;">SKU</th>
              <th style="width:40%;">Item Description</th>
              <th style="width:9%;">Opening</th>
              <th style="width:9%;">Stock In</th>
              <th style="width:9%;">Stock Out</th>
              <th style="width:9%;">Closing</th>
              <th style="width:9%;">Reorder</th>
            </tr>
            ${inventoryItems.map((row) => {
              const cl = Number(row.op || 0) + Number(row.inQty || 0) - Number(row.outQty || 0);
              return `
              <tr>
                <td style="text-align:center; font-family:monospace;">${row.sku}</td>
                <td>${row.name}</td>
                <td style="text-align:center;">${row.op}</td>
                <td style="text-align:center; color:#16a34a;">+${row.inQty}</td>
                <td style="text-align:center; color:#dc2626;">-${row.outQty}</td>
                <td style="text-align:center; font-weight:bold;">${cl}</td>
                <td style="text-align:center; color:#d97706;">${row.re}</td>
              </tr>`;
            }).join('')}
          </table>
        `;
      } else if (currentTemplate.id === 'daily-timetable') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Student:</strong> ${eduStudentName} &bull; <strong>Period:</strong> ${eduMonthYear}</div>
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:12px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:25%;">Hourly Time Slot</th>
              <th style="width:55%;">Daily Routine / Study Task</th>
              <th style="width:20%;">Completed</th>
            </tr>
            ${dailySlots.map((s) => `
              <tr>
                <td style="font-weight:bold; color:#4338ca;">${s.time}</td>
                <td>${s.label}</td>
                <td style="text-align:center;">[ &nbsp; ]</td>
              </tr>
            `).join('')}
          </table>
          <div style="margin-top:16px; background:#fef3c7; padding:10px; border-radius:6px;">
            <strong>Top 3 Priorities:</strong>
            <ol style="margin:4px 0 0 16px;">
              ${dailyPriorities.map(p => `<li>${p}</li>`).join('')}
            </ol>
            <div style="margin-top:6px; font-style:italic;"><strong>Daily Reflection:</strong> ${dailyReflection}</div>
          </div>
        `;
      } else if (currentTemplate.id === 'weekly-timetable') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Student / Organizer:</strong> ${eduStudentName} &bull; <strong>Term:</strong> ${eduMonthYear}</div>
          <table border="1" cellpadding="6" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:12px; font-size:11px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th>Time</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
            </tr>
            ${weeklySlots.map((s) => `
              <tr>
                <td style="font-weight:bold; color:#4338ca;">${s.time}</td>
                <td>${s.m}</td><td>${s.tu}</td><td>${s.w}</td><td>${s.th}</td><td>${s.f}</td><td>${s.sa}</td><td>${s.su}</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else if (currentTemplate.id === 'study-planner') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Exam Focus:</strong> ${studyFocus} &bull; <strong>Target Daily Hours:</strong> ${studyTargetHours}</div>
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:12px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:10%;">#</th>
              <th style="width:60%;">Revision Chapter / Practice Topic</th>
              <th style="width:15%;">Study Hours</th>
              <th style="width:15%;">Mastery</th>
            </tr>
            ${studyTopics.map((t, idx) => `
              <tr>
                <td style="text-align:center;">${idx + 1}</td>
                <td>${t.topic}</td>
                <td style="text-align:center;">${t.hours} hrs</td>
                <td style="text-align:center;">${t.confidence}</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else if (currentTemplate.id === 'monthly-budget') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Month:</strong> ${eduMonthYear} &bull; <strong>Savings Target:</strong> ${currSymbol}${homeTargetBudget}</div>
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:12px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:45%;">Budget Category</th>
              <th style="width:20%;">Planned (${currSymbol})</th>
              <th style="width:20%;">Actual (${currSymbol})</th>
              <th style="width:15%;">Variance (${currSymbol})</th>
            </tr>
            ${budgetItems.map((b) => {
              const diff = b.planned - b.actual;
              return `
              <tr>
                <td>${b.cat}</td>
                <td style="text-align:right;">${currSymbol}${b.planned.toFixed(2)}</td>
                <td style="text-align:right;">${currSymbol}${b.actual.toFixed(2)}</td>
                <td style="text-align:right; font-weight:bold; color:${diff >= 0 ? '#16a34a' : '#dc2626'};">
                  ${diff >= 0 ? '+' : ''}${currSymbol}${diff.toFixed(2)}
                </td>
              </tr>`;
            }).join('')}
            <tr style="background:#f8fafc; font-weight:bold;">
              <td>Totals:</td>
              <td style="text-align:right;">${currSymbol}${budgetTotalPlanned.toFixed(2)}</td>
              <td style="text-align:right;">${currSymbol}${budgetTotalActual.toFixed(2)}</td>
              <td style="text-align:right; color:${budgetTotalVariance >= 0 ? '#16a34a' : '#dc2626'};">
                ${budgetTotalVariance >= 0 ? '+' : ''}${currSymbol}${budgetTotalVariance.toFixed(2)}
              </td>
            </tr>
          </table>
        `;
      } else if (currentTemplate.id === 'meal-planner') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Week Of:</strong> ${eduMonthYear} &bull; <strong>Dietary Notes:</strong> ${mealDietaryNotes}</div>
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:12px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:15%;">Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Snack</th>
            </tr>
            ${mealPlan.map((m) => `
              <tr>
                <td style="font-weight:bold; color:#4338ca;">${m.day}</td>
                <td>${m.b}</td><td>${m.l}</td><td>${m.d}</td><td>${m.s}</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else if (currentTemplate.id === 'grocery-list') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Household:</strong> ${homeFamilyName} &bull; <strong>Budget Target:</strong> ${currSymbol}${homeTargetBudget}</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            ${groceryGroups.map((g) => `
              <div style="border:1px solid #cbd5e1; padding:8px; border-radius:4px; margin-bottom:8px;">
                <div style="font-weight:bold; color:#4338ca; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-bottom:4px;">${g.title}</div>
                <ul style="margin:4px 0 0 16px; font-size:12px;">
                  ${g.items.map(it => `<li>${it}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      } else if (currentTemplate.id === 'family-chore') {
        tableHtml = `
          <div style="margin-bottom:12px; font-size:13px;"><strong>Family Routine:</strong> ${homeFamilyName}</div>
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:12px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th style="width:60%;">Chore Task</th>
              <th style="width:25%;">Family Member Assigned</th>
              <th style="width:15%;">Done</th>
            </tr>
            ${familyChores.map((c) => `
              <tr>
                <td>${c.chore}</td>
                <td style="font-weight:bold; color:#4338ca;">${c.member}</td>
                <td style="text-align:center;">[ &nbsp; ]</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else {
        tableHtml = `
          <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-top:16px;">
            <tr style="background:#f1f5f9; font-weight:bold;">
              <th>Time / Block</th>
              <th>Task / Goal</th>
              <th>Status</th>
            </tr>
            <tr><td>Morning</td><td>Top Priority Goals</td><td>Pending</td></tr>
            <tr><td>Afternoon</td><td>Work / Study Session</td><td>In Progress</td></tr>
            <tr><td>Evening</td><td>Review & Family Reflection</td><td>Completed</td></tr>
          </table>
        `;
      }

      const docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${docTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #1e293b; }
            .header-box { border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 22px; font-weight: bold; color: #1e1b4b; margin: 0; }
            .biz-name { font-size: 16px; font-weight: bold; color: #4338ca; }
            .meta-info { font-size: 12px; color: #64748b; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h1 class="title">${docTitle}</h1>
            ${currentTemplate.categoryId === 'shop-business' ? `
            <div class="biz-name">${businessHeader.shopName}</div>
            <div class="meta-info">
              <strong>Owner:</strong> ${businessHeader.ownerName} &bull; 
              <strong>Contact:</strong> ${businessHeader.contactNumber}<br>
              <strong>Address:</strong> ${businessHeader.address}, ${businessHeader.cityState} &bull; 
              <strong>Tax/Reg:</strong> ${businessHeader.taxNumber || 'N/A'}
            </div>` : currentTemplate.categoryId === 'educational-study' ? `
            <div class="biz-name">${eduStudentName} &bull; Academic Routine</div>
            <div class="meta-info"><strong>Period:</strong> ${eduMonthYear} &bull; <strong>Format:</strong> High-Resolution 300 DPI Standard A4</div>` : `
            <div class="biz-name">${homeFamilyName} &bull; Home &amp; Lifestyle</div>
            <div class="meta-info"><strong>Budget:</strong> ${currSymbol}${homeTargetBudget} &bull; <strong>Format:</strong> High-Resolution 300 DPI Standard A4</div>`}
          </div>
          ${tableHtml}
          <div style="margin-top:24px; font-size:11px; color:#94a3b8; text-align:center; border-top:1px solid #e2e8f0; padding-top:8px;">
            Generated with Family Printables &bull; Standard Universal Document Sizing &bull; 100% Free &amp; Editable
          </div>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentTemplate.id}_editable_document.doc`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded Editable Word/Doc file (.doc)!');
    } catch (err) {
      console.error('Word export error:', err);
      showToast('Could not generate Word doc. Please use PDF.');
    }
  };

  const handleDownloadEditableDoc = () => {
    if (onRequireSignUp && (!account?.isLoggedIn || !account?.email || !account?.name)) {
      onRequireSignUp('download', executeDownloadEditableDoc);
      return;
    }
    executeDownloadEditableDoc();
  };

  // Filter templates by current category
  const filteredTemplates = TEMPLATES.filter((t) => t.categoryId === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Navigation & Hero */}
      <section className="bg-gradient-to-r from-[#0d2238] via-[#102b48] to-[#0a1b2d] text-white py-6 sm:py-10 border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Live Print Studio · Single-Page Clean Printables</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Printable Design Studio &amp; Live Preview
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose your theme style, paper format (Standard A4 / Universal), customize business headers or study goals, and print single-page high-definition documents instantly.
              </p>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition active:scale-95"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>Direct Print</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
              >
                <Download className="w-4 h-4 text-white" />
                <span>300 DPI PDF</span>
              </button>
            </div>
          </div>

          {/* 3 Main Category Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-6">
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
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-white/15 border-white text-white shadow-md ring-2 ring-indigo-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      {cat.badge}
                    </span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-white mt-1">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300/90 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================================================================ */}
          {/* LEFT COLUMN: CUSTOMIZATION CONTROLS (THEMES, SIZES, HEADERS) */}
          {/* ================================================================ */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#ede9fe] via-[#fce7f3] to-[#ffedd5] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-purple-200/90 shadow-lg space-y-5 no-print">
            
            {/* 1. Selector for Active Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-700" />
                  <span>Choose Printable Form ({filteredTemplates.length})</span>
                </label>
                <span className="text-[10px] text-purple-800 bg-white/90 border border-purple-200 px-2 py-0.5 rounded-full font-bold shadow-2xs">
                  Single-Page Fit
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`p-3 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedTemplateId === t.id
                        ? 'bg-white border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-400'
                        : 'bg-white/85 hover:bg-white border-purple-100/90 text-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-slate-900 truncate">
                          {t.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {t.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded shrink-0 ml-2">
                      FREE
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Theme Selector */}
            <div className="pt-4 border-t border-purple-200/60 space-y-2.5">
              <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-700" />
                <span>Color Palette Theme</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PRINT_THEMES) as PrintThemeId[]).map((themeKey) => {
                  const theme = PRINT_THEMES[themeKey];
                  const isSelected = selectedTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setSelectedTheme(themeKey)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-400 text-purple-950 font-bold'
                          : 'border-purple-100/90 bg-white/85 hover:bg-white text-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span className="text-xs font-extrabold truncate">
                          {theme.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Paper Size Selector (Standard A4 & Universal) */}
            <div className="pt-4 border-t border-purple-200/60 space-y-2.5">
              <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-purple-700" />
                <span>Standard Document Sizing</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paperSize === 'a4'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-400 text-purple-950 font-bold'
                      : 'border-purple-100/90 bg-white/85 hover:bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Standard A4</span>
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1 py-0.2 rounded">Global</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">210 × 297 mm (Universal)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaperSize('us-letter')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paperSize === 'us-letter'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-400 text-purple-950 font-bold'
                      : 'border-purple-100/90 bg-white/85 hover:bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Universal Standard</span>
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1 py-0.2 rounded">Fit</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">216 × 279 mm (Universal Fit)</div>
                </button>
              </div>
            </div>

            {/* 4. Business Header Settings */}
            {selectedCategory === 'shop-business' && (
              <div className="pt-4 border-t border-purple-200/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Editable Business Header</span>
                  </label>
                  <span className="text-[10px] text-indigo-600 font-bold bg-white px-2 py-0.5 rounded">
                    Updates Live
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Business Name:</span>
                    <input
                      type="text"
                      value={businessHeader.shopName}
                      onChange={(e) => handleUpdateBusinessHeader('shopName', e.target.value)}
                      placeholder="e.g. Metro Supply & Retail Mart"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Owner / Dept:</span>
                      <input
                        type="text"
                        value={businessHeader.ownerName}
                        onChange={(e) => handleUpdateBusinessHeader('ownerName', e.target.value)}
                        placeholder="e.g. Robert Vance & Associates"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Phone / Contact:</span>
                      <input
                        type="text"
                        value={businessHeader.contactNumber}
                        onChange={(e) => handleUpdateBusinessHeader('contactNumber', e.target.value)}
                        placeholder="e.g. +00 123 456 7890"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Address:</span>
                    <input
                      type="text"
                      value={businessHeader.address}
                      onChange={(e) => handleUpdateBusinessHeader('address', e.target.value)}
                      placeholder="Commercial Suite #4B"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Reset & Print Controls */}
            <div className="pt-4 border-t border-purple-200/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setBusinessHeader(DEFAULT_BUSINESS_HEADER);
                  setInvoiceItems(DEFAULT_INVOICE_ITEMS);
                  setOrderItems(DEFAULT_ORDER_ITEMS);
                  setLedgerEntries(DEFAULT_LEDGER_ENTRIES);
                  showToast('Restored default form values');
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Fields</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Quick Print</span>
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW & MOBILE-EDITABLE FORMS */}
          {/* ================================================================ */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Preview Top Bar with Scaling and Zoom Controls */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 flex-wrap no-print">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-800">
                  Interactive Live Print Preview
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  · Standard A4 Proportional Fit
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                    watermarkEnabled 
                      ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                  }`}
                  title="Toggle professional low-opacity category watermark"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span className="hidden sm:inline">{watermarkEnabled ? 'Watermark: ON' : 'Watermark: OFF'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Print this sheet"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Download single-page PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={handleDownloadEditableDoc}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Download Editable Word Document (.doc)"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Word</span>
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* UNIVERSAL INTERACTIVE "✏️ FILL & EDIT ON MOBILE" PANEL (ALL CATEGORIES) */}
            {/* ============================================================ */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200/90 shadow-md p-3.5 sm:p-5 space-y-3.5 no-print">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-xl">
                    <Edit3 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>✏️ Fill &amp; Edit on Mobile</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Interactive Live Sync
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Tap below to customize task names, routine time slots, meal items, names, and notes. Updates the printable sheet instantly!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileEditOpen(!isMobileEditOpen)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  {isMobileEditOpen ? 'Hide Mobile Editor ▲' : 'Open Mobile Editor ▼'}
                </button>
              </div>

              {/* Mobile Editor Form Accordion */}
              {isMobileEditOpen && (
                <div className="space-y-4 pt-1">

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: EDUCATIONAL & KIDS TIMETABLE (DAILY)           */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'daily-timetable' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Student / Child Name:</span>
                          <input
                            type="text"
                            value={eduStudentName}
                            onChange={(e) => setEduStudentName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                            placeholder="e.g. Alex Morgan"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Academic Period / Date:</span>
                          <input
                            type="text"
                            value={eduMonthYear}
                            onChange={(e) => setEduMonthYear(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                            placeholder="e.g. October 2026"
                          />
                        </div>
                      </div>

                      {/* Time Slots List */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800">Hourly Routine Time Slots:</span>
                          <span className="text-[10px] text-slate-400 font-medium">{dailySlots.length} Slots</span>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {dailySlots.map((slot, idx) => (
                            <div key={slot.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={slot.time}
                                  onChange={(e) => {
                                    const updated = [...dailySlots];
                                    updated[idx].time = e.target.value;
                                    saveDailySlots(updated);
                                  }}
                                  placeholder="Time (e.g. 8:00 AM)"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs font-bold"
                                />
                              </div>
                              <div className="col-span-7">
                                <input
                                  type="text"
                                  value={slot.label}
                                  onChange={(e) => {
                                    const updated = [...dailySlots];
                                    updated[idx].label = e.target.value;
                                    saveDailySlots(updated);
                                  }}
                                  placeholder="Task / Subject Routine"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                />
                              </div>
                              <div className="col-span-1 flex justify-end">
                                {dailySlots.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = dailySlots.filter((_, i) => i !== idx);
                                      saveDailySlots(updated);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newSlot: DailyScheduleSlot = {
                              id: String(Date.now()),
                              time: '5:00 PM',
                              label: 'New Study / Family Activity'
                            };
                            saveDailySlots([...dailySlots, newSlot]);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Time Slot</span>
                        </button>
                      </div>

                      {/* Top 3 Priorities */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-black text-amber-900 block">Top 3 Daily Priorities:</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {dailyPriorities.map((pri, pi) => (
                            <div key={pi} className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {pi + 1}
                              </span>
                              <input
                                type="text"
                                value={pri}
                                onChange={(e) => {
                                  const updated = [...dailyPriorities];
                                  updated[pi] = e.target.value;
                                  setDailyPriorities(updated);
                                  try { localStorage.setItem('fp_mobile_daily_priorities', JSON.stringify(updated)); } catch {}
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs font-medium text-slate-900"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Daily Reflection */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Daily Reflection Prompt / Notes:</span>
                        <input
                          type="text"
                          value={dailyReflection}
                          onChange={(e) => setDailyReflection(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs italic"
                        />
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: WEEKLY TIMETABLE GRID                          */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'weekly-timetable' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Student / Routine Title:</span>
                          <input
                            type="text"
                            value={eduStudentName}
                            onChange={(e) => setEduStudentName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Term / Week:</span>
                          <input
                            type="text"
                            value={eduMonthYear}
                            onChange={(e) => setEduMonthYear(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Weekly Day Blocks (Mon–Sun):</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {weeklySlots.map((slot, idx) => (
                            <div key={slot.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-indigo-700 text-xs">{slot.time}</span>
                                <span className="text-[10px] text-slate-400">Slot #{idx + 1}</span>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-[11px]">
                                {(['m', 'tu', 'w', 'th', 'f', 'sa', 'su'] as const).map((dayKey) => (
                                  <input
                                    key={dayKey}
                                    type="text"
                                    value={slot[dayKey]}
                                    onChange={(e) => {
                                      const updated = [...weeklySlots];
                                      updated[idx][dayKey] = e.target.value;
                                      saveWeeklySlots(updated);
                                    }}
                                    placeholder={dayKey.toUpperCase()}
                                    className="px-1 py-0.5 bg-white border border-slate-300 rounded text-center text-[10px] font-medium"
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: MONTHLY CALENDAR BLOCK                         */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'monthly-calendar' && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Month &amp; Year:</span>
                          <input
                            type="text"
                            value={calMonthYear}
                            onChange={(e) => setCalMonthYear(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                            placeholder="e.g. November 2026"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Student / Family Organizer:</span>
                          <input
                            type="text"
                            value={eduStudentName}
                            onChange={(e) => setEduStudentName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Monthly Theme &amp; Habit Goal:</span>
                        <input
                          type="text"
                          value={calFocusGoal}
                          onChange={(e) => setCalFocusGoal(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                          placeholder="e.g. Focus on Gratitude, Academic Growth & Daily Routines"
                        />
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: STUDY PLANNER                                  */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'study-planner' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Exam Focus / Topic:</span>
                          <input
                            type="text"
                            value={studyFocus}
                            onChange={(e) => setStudyFocus(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Target Daily Study Hours:</span>
                          <input
                            type="text"
                            value={studyTargetHours}
                            onChange={(e) => setStudyTargetHours(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Revision Topics &amp; Chapters:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {studyTopics.map((top, idx) => (
                            <div key={top.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                              <div className="col-span-6">
                                <input
                                  type="text"
                                  value={top.topic}
                                  onChange={(e) => {
                                    const updated = [...studyTopics];
                                    updated[idx].topic = e.target.value;
                                    saveStudyTopics(updated);
                                  }}
                                  placeholder="Topic / Chapter"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={top.hours}
                                  step="0.5"
                                  onChange={(e) => {
                                    const updated = [...studyTopics];
                                    updated[idx].hours = Number(e.target.value);
                                    saveStudyTopics(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono text-xs"
                                  placeholder="Hours"
                                />
                              </div>
                              <div className="col-span-3">
                                <select
                                  value={top.confidence}
                                  onChange={(e) => {
                                    const updated = [...studyTopics];
                                    updated[idx].confidence = e.target.value;
                                    saveStudyTopics(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                                >
                                  <option value="⭐⭐⭐⭐">⭐⭐⭐⭐ High</option>
                                  <option value="⭐⭐⭐">⭐⭐⭐ Medium</option>
                                  <option value="⭐⭐">⭐⭐ Review</option>
                                  <option value="⭐">⭐ Needs Work</option>
                                </select>
                              </div>
                              <div className="col-span-1 flex justify-end">
                                {studyTopics.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = studyTopics.filter((_, i) => i !== idx);
                                      saveStudyTopics(updated);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newTopic: StudyTopicItem = {
                              id: String(Date.now()),
                              num: studyTopics.length + 1,
                              topic: 'New Study Chapter / Practice Test',
                              hours: 1.0,
                              confidence: '⭐⭐⭐'
                            };
                            saveStudyTopics([...studyTopics, newTopic]);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Study Topic</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: FAMILY CHORES & ROUTINES                       */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'family-chore' && (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Family Routine Title:</span>
                        <input
                          type="text"
                          value={homeFamilyName}
                          onChange={(e) => setHomeFamilyName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                          placeholder="e.g. The Morgan Family Routine"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Family Chores &amp; Assignees:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {familyChores.map((chore, idx) => (
                            <div key={chore.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                              <div className="col-span-7">
                                <input
                                  type="text"
                                  value={chore.chore}
                                  onChange={(e) => {
                                    const updated = [...familyChores];
                                    updated[idx].chore = e.target.value;
                                    saveFamilyChores(updated);
                                  }}
                                  placeholder="Chore Task Description"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                />
                              </div>
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={chore.member}
                                  onChange={(e) => {
                                    const updated = [...familyChores];
                                    updated[idx].member = e.target.value;
                                    saveFamilyChores(updated);
                                  }}
                                  placeholder="Assignee (e.g. Alex)"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-indigo-700 text-xs"
                                />
                              </div>
                              <div className="col-span-1 flex justify-end">
                                {familyChores.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = familyChores.filter((_, i) => i !== idx);
                                      saveFamilyChores(updated);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newChore: FamilyChore = {
                              id: String(Date.now()),
                              chore: 'Help Pack Lunchboxes',
                              member: 'Kids'
                            };
                            saveFamilyChores([...familyChores, newChore]);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Family Chore</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: SMART GROCERY & PANTRY CHECKLIST               */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'grocery-list' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Family / Household:</span>
                          <input
                            type="text"
                            value={homeFamilyName}
                            onChange={(e) => setHomeFamilyName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Target Budget ({currSymbol}):</span>
                          <input
                            type="text"
                            value={homeTargetBudget}
                            onChange={(e) => setHomeTargetBudget(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-emerald-700 text-xs"
                            placeholder="e.g. 150.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Categorized Shopping Items:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                          {groceryGroups.map((grp, gi) => (
                            <div key={grp.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                              <input
                                type="text"
                                value={grp.title}
                                onChange={(e) => {
                                  const updated = [...groceryGroups];
                                  updated[gi].title = e.target.value;
                                  saveGroceryGroups(updated);
                                }}
                                className="w-full px-2 py-0.5 bg-white border border-indigo-200 rounded text-xs font-bold text-indigo-900 uppercase"
                              />
                              <div className="space-y-1">
                                {grp.items.map((item, ii) => (
                                  <input
                                    key={ii}
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                      const updated = [...groceryGroups];
                                      updated[gi].items[ii] = e.target.value;
                                      saveGroceryGroups(updated);
                                    }}
                                    className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] text-slate-800"
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: MONTHLY BUDGET PLANNER                         */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'monthly-budget' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Budget Month:</span>
                          <input
                            type="text"
                            value={eduMonthYear}
                            onChange={(e) => setEduMonthYear(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Savings Goal Target ({currSymbol}):</span>
                          <input
                            type="text"
                            value={homeTargetBudget}
                            onChange={(e) => setHomeTargetBudget(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-emerald-700 text-xs"
                          />
                        </div>
                      </div>

                      {/* Budget Categories */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Expense Categories &amp; Live Variance:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {budgetItems.map((item, idx) => {
                            const variance = item.planned - item.actual;
                            return (
                              <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                                <div className="col-span-5">
                                  <input
                                    type="text"
                                    value={item.cat}
                                    onChange={(e) => {
                                      const updated = [...budgetItems];
                                      updated[idx].cat = e.target.value;
                                      saveBudgetItems(updated);
                                    }}
                                    placeholder="Category Name"
                                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <input
                                    type="number"
                                    value={item.planned}
                                    step="10"
                                    onChange={(e) => {
                                      const updated = [...budgetItems];
                                      updated[idx].planned = Number(e.target.value);
                                      saveBudgetItems(updated);
                                    }}
                                    className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-right font-mono text-xs"
                                    placeholder={`Plan (${currSymbol})`}
                                  />
                                </div>
                                <div className="col-span-3">
                                  <input
                                    type="number"
                                    value={item.actual}
                                    step="10"
                                    onChange={(e) => {
                                      const updated = [...budgetItems];
                                      updated[idx].actual = Number(e.target.value);
                                      saveBudgetItems(updated);
                                    }}
                                    className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-right font-mono text-xs"
                                    placeholder={`Actual (${currSymbol})`}
                                  />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  {budgetItems.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = budgetItems.filter((_, i) => i !== idx);
                                        saveBudgetItems(updated);
                                      }}
                                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newItem: BudgetItem = {
                                id: String(Date.now()),
                                cat: 'Personal Care & Wellness',
                                planned: 150.00,
                                actual: 140.00
                              };
                              saveBudgetItems([...budgetItems, newItem]);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Category</span>
                          </button>

                          <div className="text-right text-xs">
                            <span className="text-slate-500 mr-2">Planned: {currSymbol}{budgetTotalPlanned.toFixed(2)}</span>
                            <span className="text-slate-500 mr-2">Actual: {currSymbol}{budgetTotalActual.toFixed(2)}</span>
                            <strong className={`font-mono text-xs font-bold ${budgetTotalVariance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              Variance: {budgetTotalVariance >= 0 ? '+' : ''}{currSymbol}{budgetTotalVariance.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: MEAL & KITCHEN PLANNER                         */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'meal-planner' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Week Of:</span>
                          <input
                            type="text"
                            value={eduMonthYear}
                            onChange={(e) => setEduMonthYear(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                            placeholder="e.g. Week of Nov 2 - Nov 8"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Dietary Notes / Target Food Budget ({currSymbol}):</span>
                          <input
                            type="text"
                            value={mealDietaryNotes}
                            onChange={(e) => setMealDietaryNotes(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                            placeholder="e.g. Balanced Dinners & Target $120.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">7-Day Meal Schedule:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {mealPlan.map((mRow, mi) => (
                            <div key={mRow.day} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                              <span className="font-bold text-indigo-700 block text-xs">{mRow.day}</span>
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5">
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Breakfast:</span>
                                  <input
                                    type="text"
                                    value={mRow.b}
                                    onChange={(e) => {
                                      const updated = [...mealPlan];
                                      updated[mi].b = e.target.value;
                                      saveMealPlan(updated);
                                    }}
                                    className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Lunch:</span>
                                  <input
                                    type="text"
                                    value={mRow.l}
                                    onChange={(e) => {
                                      const updated = [...mealPlan];
                                      updated[mi].l = e.target.value;
                                      saveMealPlan(updated);
                                    }}
                                    className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Dinner:</span>
                                  <input
                                    type="text"
                                    value={mRow.d}
                                    onChange={(e) => {
                                      const updated = [...mealPlan];
                                      updated[mi].d = e.target.value;
                                      saveMealPlan(updated);
                                    }}
                                    className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Snack:</span>
                                  <input
                                    type="text"
                                    value={mRow.s}
                                    onChange={(e) => {
                                      const updated = [...mealPlan];
                                      updated[mi].s = e.target.value;
                                      saveMealPlan(updated);
                                    }}
                                    className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: COMMERCIAL INVOICE EDITOR                      */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'billing-receipt' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Customer / Client:</span>
                          <input
                            type="text"
                            value={invoiceCustomer}
                            onChange={(e) => setInvoiceCustomer(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Invoice #:</span>
                          <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Tax / VAT %:</span>
                          <input
                            type="number"
                            value={invoiceTaxPercent}
                            onChange={(e) => setInvoiceTaxPercent(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Line Items Breakdown:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {invoiceItems.map((item, idx) => (
                            <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                              <div className="col-span-6">
                                <input
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const updated = [...invoiceItems];
                                    updated[idx].desc = e.target.value;
                                    saveInvoiceItems(updated);
                                  }}
                                  placeholder="Item Description"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={item.qty}
                                  min="1"
                                  onChange={(e) => {
                                    const updated = [...invoiceItems];
                                    updated[idx].qty = Number(e.target.value);
                                    saveInvoiceItems(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono text-xs"
                                  placeholder="Qty"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={item.rate}
                                  step="0.01"
                                  onChange={(e) => {
                                    const updated = [...invoiceItems];
                                    updated[idx].rate = Number(e.target.value);
                                    saveInvoiceItems(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-right font-mono text-xs"
                                  placeholder={`Price (${currSymbol})`}
                                />
                              </div>
                              <div className="col-span-2 flex items-center justify-between pl-1">
                                <span className="font-mono font-bold text-slate-900 text-[11px]">
                                  {currSymbol}{(item.qty * item.rate).toFixed(2)}
                                </span>
                                {invoiceItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = invoiceItems.filter((_, i) => i !== idx);
                                      saveInvoiceItems(updated);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newItem: InvoiceItem = {
                                id: String(Date.now()),
                                desc: 'New Service / Product Item',
                                qty: 1,
                                rate: 20.00
                              };
                              saveInvoiceItems([...invoiceItems, newItem]);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Line Item</span>
                          </button>

                          <div className="text-right text-xs">
                            <span className="text-slate-500 mr-2">Subtotal: {currSymbol}{invoiceSubtotal.toFixed(2)}</span>
                            <strong className="text-emerald-700 font-mono text-sm">Grand Total: {currSymbol}{invoiceGrandTotal.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: ORDER BOOKING FORM                             */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'order-booking' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Customer Name:</span>
                          <input
                            type="text"
                            value={orderCustomerName}
                            onChange={(e) => setOrderCustomerName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Contact Phone:</span>
                          <input
                            type="text"
                            value={orderCustomerPhone}
                            onChange={(e) => setOrderCustomerPhone(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Advance Paid ({currSymbol}):</span>
                          <input
                            type="number"
                            value={orderAdvancePaid}
                            onChange={(e) => setOrderAdvancePaid(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Ordered Items &amp; Specifications:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {orderItems.map((item, idx) => (
                            <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                              <div className="col-span-6">
                                <input
                                  type="text"
                                  value={item.item}
                                  onChange={(e) => {
                                    const updated = [...orderItems];
                                    updated[idx].item = e.target.value;
                                    saveOrderItems(updated);
                                  }}
                                  placeholder="Item / Specification"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={item.qty}
                                  min="1"
                                  onChange={(e) => {
                                    const updated = [...orderItems];
                                    updated[idx].qty = Number(e.target.value);
                                    saveOrderItems(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono text-xs"
                                  placeholder="Qty"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={item.rate}
                                  step="0.01"
                                  onChange={(e) => {
                                    const updated = [...orderItems];
                                    updated[idx].rate = Number(e.target.value);
                                    saveOrderItems(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-right font-mono text-xs"
                                  placeholder={`Rate (${currSymbol})`}
                                />
                              </div>
                              <div className="col-span-2 flex items-center justify-between pl-1">
                                <span className="font-mono font-bold text-slate-900 text-[11px]">
                                  {currSymbol}{(item.qty * item.rate).toFixed(2)}
                                </span>
                                {orderItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = orderItems.filter((_, i) => i !== idx);
                                      saveOrderItems(updated);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newItem: OrderItem = {
                                id: String(Date.now()),
                                item: 'Custom Order Item',
                                qty: 1,
                                rate: 25.00
                              };
                              saveOrderItems([...orderItems, newItem]);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Ordered Item</span>
                          </button>

                          <div className="text-right text-xs">
                            <span className="text-slate-500 mr-2">Total: {currSymbol}{orderTotal.toFixed(2)}</span>
                            <strong className="text-rose-600 font-mono text-sm">Remaining: {currSymbol}{orderRemaining.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: BUSINESS LEDGER & RECORD                       */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'shop-ledger' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Account / Ledger Title:</span>
                          <input
                            type="text"
                            value={ledgerAccountName}
                            onChange={(e) => setLedgerAccountName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Accounting Period:</span>
                          <input
                            type="text"
                            value={ledgerPeriod}
                            onChange={(e) => setLedgerPeriod(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      {/* Transactions List */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Ledger Debit/Credit Transactions:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {ledgerCalculated.map((entry, idx) => (
                            <div key={entry.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  value={entry.date}
                                  onChange={(e) => {
                                    const updated = [...ledgerEntries];
                                    updated[idx].date = e.target.value;
                                    saveLedgerEntries(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                                  placeholder="Date"
                                />
                              </div>
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  value={entry.desc}
                                  onChange={(e) => {
                                    const updated = [...ledgerEntries];
                                    updated[idx].desc = e.target.value;
                                    saveLedgerEntries(updated);
                                  }}
                                  placeholder="Particulars"
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={entry.dr || ''}
                                  onChange={(e) => {
                                    const updated = [...ledgerEntries];
                                    updated[idx].dr = Number(e.target.value || 0);
                                    saveLedgerEntries(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-right font-mono text-xs"
                                  placeholder={`Debit (${currSymbol})`}
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={entry.cr || ''}
                                  onChange={(e) => {
                                    const updated = [...ledgerEntries];
                                    updated[idx].cr = Number(e.target.value || 0);
                                    saveLedgerEntries(updated);
                                  }}
                                  className="w-full px-1.5 py-1 bg-white border border-emerald-300 text-emerald-700 rounded-lg text-right font-mono text-xs"
                                  placeholder={`Credit (${currSymbol})`}
                                />
                              </div>
                              <div className="col-span-1 flex justify-end">
                                {ledgerEntries.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = ledgerEntries.filter((_, i) => i !== idx);
                                      saveLedgerEntries(updated);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newEntry: LedgerEntry = {
                                id: String(Date.now()),
                                date: '10/30',
                                desc: 'Customer Payment / Supply',
                                dr: 0,
                                cr: 100.00
                              };
                              saveLedgerEntries([...ledgerEntries, newEntry]);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Transaction</span>
                          </button>

                          <div className="text-right text-xs">
                            <span className="text-rose-600 mr-2">Dr: {currSymbol}{ledgerTotalDebits.toFixed(2)}</span>
                            <span className="text-emerald-600 mr-2">Cr: {currSymbol}{ledgerTotalCredits.toFixed(2)}</span>
                            <strong className="text-indigo-900 font-mono text-sm">Net Balance: {currSymbol}{ledgerClosingBalance.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* CATEGORY: STOCK & INVENTORY RECORD                       */}
                  {/* -------------------------------------------------------- */}
                  {currentTemplate.id === 'inventory-sheet' && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 block">Inventory Stock Items &amp; Reorder Levels:</span>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {inventoryItems.map((item, idx) => {
                            const closing = Number(item.op || 0) + Number(item.inQty || 0) - Number(item.outQty || 0);
                            return (
                              <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-1.5 items-center text-xs">
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={item.sku}
                                    onChange={(e) => {
                                      const updated = [...inventoryItems];
                                      updated[idx].sku = e.target.value;
                                      saveInventoryItems(updated);
                                    }}
                                    placeholder="SKU"
                                    className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                      const updated = [...inventoryItems];
                                      updated[idx].name = e.target.value;
                                      saveInventoryItems(updated);
                                    }}
                                    placeholder="Item Name"
                                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <input
                                    type="number"
                                    value={item.op}
                                    onChange={(e) => {
                                      const updated = [...inventoryItems];
                                      updated[idx].op = Number(e.target.value || 0);
                                      saveInventoryItems(updated);
                                    }}
                                    placeholder="Op"
                                    title="Opening Stock"
                                    className="w-full px-1 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono text-xs"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <input
                                    type="number"
                                    value={item.inQty}
                                    onChange={(e) => {
                                      const updated = [...inventoryItems];
                                      updated[idx].inQty = Number(e.target.value || 0);
                                      saveInventoryItems(updated);
                                    }}
                                    placeholder="+In"
                                    title="Stock In"
                                    className="w-full px-1 py-1 bg-white border border-emerald-300 text-emerald-700 rounded-lg text-center font-mono text-xs"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <input
                                    type="number"
                                    value={item.outQty}
                                    onChange={(e) => {
                                      const updated = [...inventoryItems];
                                      updated[idx].outQty = Number(e.target.value || 0);
                                      saveInventoryItems(updated);
                                    }}
                                    placeholder="-Out"
                                    title="Stock Out"
                                    className="w-full px-1 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-center font-mono text-xs"
                                  />
                                </div>
                                <div className="col-span-1 text-center font-mono font-bold text-slate-900 text-xs" title="Closing Stock">
                                  {closing}
                                </div>
                                <div className="col-span-1">
                                  <input
                                    type="text"
                                    value={item.re}
                                    onChange={(e) => {
                                      const updated = [...inventoryItems];
                                      updated[idx].re = e.target.value;
                                      saveInventoryItems(updated);
                                    }}
                                    placeholder="Reorder"
                                    className="w-full px-1 py-1 bg-white border border-amber-300 text-amber-800 rounded-lg text-center font-mono text-[10px]"
                                  />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  {inventoryItems.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = inventoryItems.filter((_, i) => i !== idx);
                                        saveInventoryItems(updated);
                                      }}
                                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newItem: InventoryItemRow = {
                                id: String(Date.now()),
                                sku: `SKU-${100 + inventoryItems.length + 1}`,
                                name: 'New Inventory Item',
                                op: 50,
                                inQty: 10,
                                outQty: 5,
                                re: '20 Min'
                              };
                              saveInventoryItems([...inventoryItems, newItem]);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Stock Item</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instant Action & Download Bar */}
              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDownloadEditableDoc}
                    className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                    title="Download Editable Word document (.doc) for Microsoft Word, Google Docs, Apple Pages"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Editable Word/Doc (.doc)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                    title="Download Fillable / High-Res Vector PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Fillable PDF (.pdf)</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-medium">
                  Standard A4 / Universal Format
                </span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RESPONSIVE A4 PAPER SHEET CANVAS CONTAINER (NEVER SQUISHED) */}
            {/* ============================================================ */}
            <div 
              ref={previewWrapperRef}
              className="w-full flex flex-col items-center justify-start bg-slate-200/60 p-1.5 sm:p-5 rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              <div 
                className="w-full flex justify-center items-start transition-all duration-200"
                style={{
                  height: previewScale < 1 ? `${Math.round(1123 * previewScale)}px` : 'auto',
                  minHeight: previewScale < 1 ? `${Math.round(1123 * previewScale)}px` : undefined,
                }}
              >
                <div
                  style={{
                    transform: previewScale < 1 ? `scale(${previewScale})` : undefined,
                    transformOrigin: 'top center',
                    width: '794px',
                    minWidth: '794px',
                    maxWidth: '794px',
                    height: '1123px',
                    minHeight: '1123px',
                    maxHeight: '1123px',
                  }}
                >
                  <div 
                    ref={sheetContainerRef}
                    id="printable-sheet"
                    style={{
                      width: '794px',
                      height: '1123px',
                      minHeight: '1123px',
                      maxHeight: '1123px',
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

                    {/* Low-Opacity Aesthetic Category Watermark (Optimized for Color & B/W Printing) */}
                    {watermarkEnabled && (
                      <div 
                        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 select-none"
                        aria-hidden="true"
                      >
                        <div 
                          className="transform -rotate-45 text-center font-black tracking-widest uppercase opacity-[0.035] text-slate-900 border-2 border-dashed border-slate-900/20 px-8 py-5 rounded-3xl"
                          style={{
                            fontSize: '26px',
                            lineHeight: '1.4',
                            maxWidth: '92%',
                          }}
                        >
                          <div className="text-xs tracking-[0.4em] mb-1 font-bold text-slate-700">AUTHENTIC A4 PRINTABLE</div>
                          <div>{getCategoryWatermarkText()}</div>
                          <div className="text-[10px] tracking-[0.3em] mt-1 font-mono text-slate-500">OPTIMIZED FOR COLOR &amp; MONOCHROME PRINTING</div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================== */}
                    {/* SHEET HEADER */}
                    {/* ========================================================== */}
                    <div className="relative z-10 space-y-3">
                      
                      {/* Clean Title Banner: Strictly Only Main Title */}
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
                          style={{ borderColor: currentTheme.borderColor, background: currentTheme.accentBg }}
                        >
                          <div>
                            <strong className="text-sm font-black tracking-tight text-slate-900 block">
                              {businessHeader.shopName}
                            </strong>
                            <span className="text-[11px] text-slate-600 block mt-0.5">
                              {businessHeader.ownerName} • {businessHeader.contactNumber}
                            </span>
                          </div>
                          <div className="text-right text-[11px] text-slate-500">
                            <span>{businessHeader.address}, {businessHeader.cityState}</span>
                            {businessHeader.taxNumber && (
                              <span className="block font-mono text-[10px] text-indigo-700 font-bold mt-0.5">
                                {businessHeader.taxNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Educational Header */}
                      {currentTemplate.categoryId === 'educational-study' && (
                        <div 
                          className="p-2.5 rounded-xl border flex items-center justify-between text-xs"
                          style={{ borderColor: currentTheme.borderColor, background: currentTheme.accentBg }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Student:</span>
                            <strong className="text-slate-900 font-bold">{eduStudentName}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Period:</span>
                            <strong className="text-indigo-700 font-mono font-bold">{eduMonthYear}</strong>
                          </div>
                        </div>
                      )}

                      {/* Personal & Home Header */}
                      {currentTemplate.categoryId === 'personal-home' && (
                        <div 
                          className="p-2.5 rounded-xl border flex items-center justify-between text-xs"
                          style={{ borderColor: currentTheme.borderColor, background: currentTheme.accentBg }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Family:</span>
                            <strong className="text-slate-900 font-bold">{homeFamilyName}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Target:</span>
                            <strong className="text-emerald-700 font-mono font-bold">{currSymbol}{homeTargetBudget}</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ========================================================== */}
                    {/* SHEET BODY: TABLES (DYNAMIC USER-EDITED DATA) */}
                    {/* ========================================================== */}
                    <div className="relative z-10 flex-1 my-3 overflow-hidden flex flex-col justify-between">
                      
                      {/* TEMPLATE A: SHOP LEDGER (BUSINESS LEDGER & SALES RECORD) */}
                      {currentTemplate.id === 'shop-ledger' && (
                        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                          <div className="p-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[11px]">
                            <div><strong className="text-slate-800">Account:</strong> <span>{ledgerAccountName}</span></div>
                            <div><strong className="text-slate-800">Period:</strong> <span className="font-mono">{ledgerPeriod}</span></div>
                            <div><strong className="text-slate-800">Format:</strong> <span>Standard A4 Universal</span></div>
                          </div>
                          <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                            <div className="col-span-2 text-left">Date</div>
                            <div className="col-span-4 text-left">Particulars / Customer Transaction</div>
                            <div className="col-span-2">Debit (-)</div>
                            <div className="col-span-2">Credit (+)</div>
                            <div className="col-span-2 text-right">Net Balance</div>
                          </div>
                          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                            {ledgerCalculated.slice(0, 11).map((row, idx) => (
                              <div key={idx} className={`grid grid-cols-12 py-1.5 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                                <div className="col-span-2 text-left font-mono text-slate-500">{row.date}</div>
                                <div className="col-span-4 text-left font-medium text-slate-800 truncate">{row.desc}</div>
                                <div className="col-span-2 text-rose-600 font-mono font-bold">{row.dr > 0 ? `${currSymbol}${row.dr.toFixed(2)}` : '—'}</div>
                                <div className="col-span-2 text-emerald-600 font-mono font-bold">{row.cr > 0 ? `${currSymbol}${row.cr.toFixed(2)}` : '—'}</div>
                                <div className="col-span-2 text-right font-mono font-black text-slate-900">{currSymbol}{row.runningBalance.toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-slate-50 border-t border-slate-300 p-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Total Debits:</span>
                              <strong className="text-xs font-mono font-bold text-rose-600">{currSymbol}{ledgerTotalDebits.toFixed(2)}</strong>
                            </div>
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Total Credits:</span>
                              <strong className="text-xs font-mono font-bold text-emerald-600">{currSymbol}{ledgerTotalCredits.toFixed(2)}</strong>
                            </div>
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Closing Balance:</span>
                              <strong className="text-xs font-mono font-black text-slate-900">{currSymbol}{ledgerClosingBalance.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE B: ORDER BOOKING FORM */}
                      {currentTemplate.id === 'order-booking' && (
                        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[11px]">
                            <div><strong className="text-slate-800">Client:</strong> <span>{orderCustomerName}</span></div>
                            <div><strong className="text-slate-800">Phone:</strong> <span className="font-mono">{orderCustomerPhone}</span></div>
                            <div><strong className="text-slate-800">Order Ref:</strong> <span className="font-mono">{orderNumber}</span></div>
                          </div>
                          <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                            <div className="col-span-1 text-left">#</div>
                            <div className="col-span-5 text-left">Item Description / Specs</div>
                            <div className="col-span-2">Qty</div>
                            <div className="col-span-2">Unit Price</div>
                            <div className="col-span-2 text-right">Total</div>
                          </div>
                          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                            {orderItems.map((row, idx) => (
                              <div key={idx} className={`grid grid-cols-12 py-1.5 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                                <div className="col-span-1 text-left font-mono text-slate-400">{idx + 1}</div>
                                <div className="col-span-5 text-left font-bold text-slate-800 truncate">{row.item}</div>
                                <div className="col-span-2 font-mono text-slate-600">{row.qty}</div>
                                <div className="col-span-2 font-mono text-slate-600">{currSymbol}{Number(row.rate).toFixed(2)}</div>
                                <div className="col-span-2 text-right font-mono font-black text-slate-900">{currSymbol}{(row.qty * row.rate).toFixed(2)}</div>
                              </div>
                            ))}
                            {Array.from({ length: Math.max(0, 8 - orderItems.length) }).map((_, i) => (
                              <div key={`empty-${i}`} className="grid grid-cols-12 py-1.5 px-3 text-center text-[11px]">
                                <div className="col-span-1 text-left font-mono text-slate-300">{orderItems.length + i + 1}</div>
                                <div className="col-span-5 text-left text-slate-300">________________________</div>
                                <div className="col-span-2 text-slate-300">__</div>
                                <div className="col-span-2 text-slate-300">__</div>
                                <div className="col-span-2 text-right text-slate-300">__</div>
                              </div>
                            ))}
                          </div>

                          {/* Order Totals & Advance Bar */}
                          <div className="bg-slate-50 border-t border-slate-300 p-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Total Order Amount:</span>
                              <strong className="text-sm font-black text-slate-900">{currSymbol}{orderTotal.toFixed(2)}</strong>
                            </div>
                            <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                              <span className="text-emerald-700 block text-[10px]">Advance Paid:</span>
                              <strong className="text-sm font-black text-emerald-600">{currSymbol}{Number(orderAdvancePaid).toFixed(2)}</strong>
                            </div>
                            <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                              <span className="text-rose-700 block text-[10px]">Remaining Balance:</span>
                              <strong className="text-sm font-black text-rose-600">{currSymbol}{orderRemaining.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE C: INVOICE / BILLING RECEIPT */}
                      {currentTemplate.id === 'billing-receipt' && (
                        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[11px]">
                            <div>
                              <strong className="text-slate-800">Invoice No:</strong> <span className="font-mono">{invoiceNumber}</span>
                            </div>
                            <div>
                              <strong className="text-slate-800">Client:</strong> <span>{invoiceCustomer}</span>
                            </div>
                            <div>
                              <strong className="text-slate-800">Due:</strong> <span className="font-mono">{invoiceDueDate}</span>
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
                            {invoiceItems.map((row, idx) => (
                              <div key={idx} className={`grid grid-cols-12 py-2 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                                <div className="col-span-1 text-left font-mono text-slate-400">{idx + 1}</div>
                                <div className="col-span-6 text-left font-bold text-slate-800 truncate">{row.desc}</div>
                                <div className="col-span-1 font-mono text-slate-600">{row.qty}</div>
                                <div className="col-span-2 font-mono text-slate-600">{currSymbol}{Number(row.rate).toFixed(2)}</div>
                                <div className="col-span-2 text-right font-mono font-black text-slate-900">{currSymbol}{(row.qty * row.rate).toFixed(2)}</div>
                              </div>
                            ))}
                            {Array.from({ length: Math.max(0, 6 - invoiceItems.length) }).map((_, i) => (
                              <div key={`empty-inv-${i}`} className="grid grid-cols-12 py-2 px-3 text-center text-[11px]">
                                <div className="col-span-1 text-left font-mono text-slate-300">{invoiceItems.length + i + 1}</div>
                                <div className="col-span-6 text-left text-slate-300">________________________</div>
                                <div className="col-span-1 text-slate-300">__</div>
                                <div className="col-span-2 text-slate-300">__</div>
                                <div className="col-span-2 text-right text-slate-300">__</div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-slate-50 border-t border-slate-300 p-3 flex justify-between items-end">
                            <div className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                              Thank you for your business! Please inspect items on delivery.<br />
                              Terms: Commercial quality guaranteed. Standard A4 document format.
                            </div>
                            <div className="space-y-1 text-right text-[11px] min-w-48">
                              <div className="flex justify-between text-slate-600">
                                <span>Subtotal:</span>
                                <span className="font-mono font-bold">{currSymbol}{invoiceSubtotal.toFixed(2)}</span>
                              </div>
                              {invoiceTaxPercent > 0 && (
                                <div className="flex justify-between text-slate-600">
                                  <span>Tax / VAT ({invoiceTaxPercent}%):</span>
                                  <span className="font-mono font-bold">{currSymbol}{invoiceTax.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-base font-black text-slate-950 pt-1 border-t border-slate-300">
                                <span>Grand Total:</span>
                                <span className="text-emerald-700 font-mono">{currSymbol}{invoiceGrandTotal.toFixed(2)}</span>
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
                            {inventoryItems.map((row, idx) => {
                              const closing = Number(row.op || 0) + Number(row.inQty || 0) - Number(row.outQty || 0);
                              return (
                                <div key={row.id || idx} className={`grid grid-cols-12 py-1.5 px-3 text-center text-[11px] ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                                  <div className="col-span-2 text-left font-mono font-bold text-slate-600">{row.sku}</div>
                                  <div className="col-span-4 text-left font-bold text-slate-800 truncate">{row.name}</div>
                                  <div className="col-span-1 font-mono">{row.op}</div>
                                  <div className="col-span-1 font-mono text-emerald-600">+{row.inQty}</div>
                                  <div className="col-span-1 font-mono text-rose-600">-{row.outQty}</div>
                                  <div className="col-span-1 font-mono font-black text-slate-900">{closing}</div>
                                  <div className="col-span-2 text-right font-mono text-amber-700 font-bold">{row.re}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE E: DAILY TIMETABLE & SCHEDULE */}
                      {currentTemplate.id === 'daily-timetable' && (
                        <div className="grid grid-cols-12 gap-3 flex-1">
                          <div className="col-span-7 border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between">
                            <div className="bg-slate-100 font-black text-slate-800 py-1.5 px-3 text-xs border-b border-slate-300 flex justify-between">
                              <span>Hourly Time Schedule</span>
                              <span className="text-[10px] text-slate-500 font-normal">{dailySlots.length} Slots · Interactive</span>
                            </div>
                            <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                              {dailySlots.slice(0, 12).map((slot, idx) => (
                                <div key={slot.id || idx} className="flex items-center px-2 py-1 gap-2">
                                  <span className="w-16 font-mono font-bold text-slate-600 shrink-0 text-[10px]">{slot.time}</span>
                                  <span className="w-4 h-4 border border-slate-300 rounded shrink-0" />
                                  <span className="text-slate-800 truncate font-medium text-[11px]">{slot.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="col-span-5 flex flex-col justify-between gap-2.5">
                            <div className="p-3 border border-slate-300 rounded-xl bg-amber-50/50 space-y-1.5">
                              <strong className="text-xs font-black text-amber-900 block uppercase tracking-wide">
                                Top 3 Daily Priorities
                              </strong>
                              <div className="space-y-1 text-xs">
                                {dailyPriorities.map((pri, pi) => (
                                  <div key={pi} className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                                      {pi + 1}
                                    </span>
                                    <span className="truncate text-slate-800 font-medium">{pri}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 flex-1 space-y-1.5 flex flex-col justify-between">
                              <strong className="text-xs font-black text-slate-800 block uppercase tracking-wide">
                                Daily Habits &amp; Wellness
                              </strong>
                              <div className="space-y-1.5 text-xs">
                                {dailyHabits.map((h, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <span className="w-4 h-4 border border-slate-400 rounded shrink-0" />
                                    <span className="text-slate-700 text-[11px]">{h}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-slate-200">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block">Daily Reflection:</span>
                                <div className="h-14 border border-dashed border-slate-300 rounded-lg mt-1 p-1 text-[10px] text-slate-600 italic">
                                  {dailyReflection}
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
                            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
                            <div className="text-indigo-600 font-bold">Sat</div>
                            <div className="text-rose-600 font-bold">Sun</div>
                          </div>
                          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[10px]">
                            {weeklySlots.map((row, idx) => (
                              <div key={row.id || idx} className={`grid grid-cols-8 py-2 px-2 text-center items-center ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                                <div className="col-span-1 text-left font-mono font-bold text-slate-600">{row.time}</div>
                                <div className="p-1 bg-indigo-50/60 rounded border border-indigo-100/80 font-medium text-slate-800 truncate">{row.m}</div>
                                <div className="p-1 bg-slate-50 rounded border border-slate-200 font-medium text-slate-800 truncate">{row.tu}</div>
                                <div className="p-1 bg-indigo-50/60 rounded border border-indigo-100/80 font-medium text-slate-800 truncate">{row.w}</div>
                                <div className="p-1 bg-slate-50 rounded border border-slate-200 font-medium text-slate-800 truncate">{row.th}</div>
                                <div className="p-1 bg-emerald-50/60 rounded border border-emerald-100/80 font-medium text-slate-800 truncate">{row.f}</div>
                                <div className="p-1 bg-amber-50/60 rounded border border-amber-100/80 font-bold text-slate-800 truncate">{row.sa}</div>
                                <div className="p-1 bg-rose-50/60 rounded border border-rose-100/80 font-bold text-slate-800 truncate">{row.su}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE G: MONTHLY CALENDAR BLOCK */}
                      {currentTemplate.id === 'monthly-calendar' && (
                        <div className="space-y-2 flex-1 flex flex-col justify-between">
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{calMonthYear}</span>
                            <span className="text-slate-600 italic text-[11px] truncate max-w-md">{calFocusGoal}</span>
                          </div>
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
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE H: STUDY PLANNER */}
                      {currentTemplate.id === 'study-planner' && (
                        <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Exam Focus / Topic:</span>
                              <strong className="text-slate-900 block text-xs mt-0.5">{studyFocus}</strong>
                            </div>
                            <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                              <span className="text-[10px] uppercase font-bold text-amber-700 block">Target Study Hours:</span>
                              <strong className="text-slate-900 block text-xs mt-0.5">{studyTargetHours}</strong>
                            </div>
                          </div>

                          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                            <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-1.5 px-3 text-center">
                              <div className="col-span-1 text-left">#</div>
                              <div className="col-span-6 text-left">Topic / Chapter Description</div>
                              <div className="col-span-2">Hours</div>
                              <div className="col-span-3 text-right">Confidence</div>
                            </div>
                            <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
                              {studyTopics.map((row, idx) => (
                                <div key={row.id || idx} className="grid grid-cols-12 py-2 px-3 text-center items-center text-[11px]">
                                  <div className="col-span-1 text-left font-mono font-bold text-slate-400">{idx + 1}</div>
                                  <div className="col-span-6 text-left font-medium text-slate-800 truncate">{row.topic}</div>
                                  <div className="col-span-2 font-mono text-slate-600">{row.hours}h</div>
                                  <div className="col-span-3 text-right text-amber-500 text-xs">{row.confidence}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE I: FAMILY ROUTINE & CHORE BOARD */}
                      {currentTemplate.id === 'family-chore' && (
                        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                          <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-10 border-b border-slate-300 py-2 px-2 text-center text-[11px]">
                            <div className="col-span-3 text-left">Chore / Responsibility</div>
                            <div className="col-span-1">Mon</div><div className="col-span-1">Tue</div><div className="col-span-1">Wed</div>
                            <div className="col-span-1">Thu</div><div className="col-span-1">Fri</div><div className="col-span-1">Sat</div><div className="col-span-1">Sun</div>
                          </div>
                          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                            {familyChores.map((row, idx) => (
                              <div key={row.id || idx} className="grid grid-cols-10 py-2 px-2 items-center text-center">
                                <div className="col-span-3 text-left truncate">
                                  <strong className="font-medium text-slate-900 block">{row.chore}</strong>
                                  <span className="text-[10px] text-indigo-600 font-bold block">{row.member}</span>
                                </div>
                                {Array.from({ length: 7 }).map((_, di) => (
                                  <div key={di} className="col-span-1 flex justify-center">
                                    <div className="w-4 h-4 border border-slate-300 rounded" />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE J: GROCERY & PANTRY LIST */}
                      {currentTemplate.id === 'grocery-list' && (
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          {groceryGroups.map((grp) => (
                            <div key={grp.id} className="border border-slate-300 rounded-xl p-2.5 flex flex-col justify-between bg-white">
                              <strong className="text-[11px] font-black uppercase text-indigo-900 border-b pb-1 mb-1 block">
                                {grp.title}
                              </strong>
                              <div className="space-y-1.5 flex-1">
                                {grp.items.map((it, li) => (
                                  <div key={li} className="flex items-center gap-2 text-[11px]">
                                    <span className="w-3.5 h-3.5 border border-slate-300 rounded shrink-0" />
                                    <span className="text-slate-800 truncate font-medium">{it}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TEMPLATE K: MONTHLY BUDGET PLANNER */}
                      {currentTemplate.id === 'monthly-budget' && (
                        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                          <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-1.5 px-3 text-center">
                            <div className="col-span-5 text-left">Budget Category</div>
                            <div className="col-span-2">Planned ({currSymbol})</div>
                            <div className="col-span-2">Actual ({currSymbol})</div>
                            <div className="col-span-3 text-right">Variance</div>
                          </div>
                          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                            {budgetItems.map((row, idx) => {
                              const variance = row.planned - row.actual;
                              return (
                                <div key={row.id || idx} className="grid grid-cols-12 py-2 px-3 text-center items-center">
                                  <div className="col-span-5 text-left font-medium text-slate-800 truncate">{row.cat}</div>
                                  <div className="col-span-2 font-mono text-slate-600">{currSymbol}{row.planned.toFixed(2)}</div>
                                  <div className="col-span-2 font-mono text-slate-600">{currSymbol}{row.actual.toFixed(2)}</div>
                                  <div className={`col-span-3 text-right font-mono font-bold ${variance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    {variance >= 0 ? '+' : ''}{currSymbol}{variance.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-slate-50 border-t border-slate-300 p-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Total Planned:</span>
                              <strong className="text-xs font-mono font-bold text-slate-900">{currSymbol}{budgetTotalPlanned.toFixed(2)}</strong>
                            </div>
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Total Actual:</span>
                              <strong className="text-xs font-mono font-bold text-slate-900">{currSymbol}{budgetTotalActual.toFixed(2)}</strong>
                            </div>
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Net Variance:</span>
                              <strong className={`text-xs font-mono font-black ${budgetTotalVariance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {budgetTotalVariance >= 0 ? '+' : ''}{currSymbol}{budgetTotalVariance.toFixed(2)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE L: MEAL & KITCHEN PLANNER */}
                      {currentTemplate.id === 'meal-planner' && (
                        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs flex-1 flex flex-col justify-between">
                          <div className="bg-slate-100 font-black text-slate-800 grid grid-cols-12 border-b border-slate-300 py-2 px-3 text-center">
                            <div className="col-span-2 text-left">Day</div>
                            <div className="col-span-3 text-left">Breakfast</div>
                            <div className="col-span-3 text-left">Lunch</div>
                            <div className="col-span-3 text-left">Dinner</div>
                            <div className="col-span-1 text-right">Snack</div>
                          </div>
                          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between text-[11px]">
                            {mealPlan.map((row, idx) => (
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

                    {/* ========================================================== */}
                    {/* SHEET FOOTER: INSPIRING QUOTE */}
                    {/* ========================================================== */}
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
              </div>
            </div>

            {/* Print Sizing Advice */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs text-indigo-900 no-print">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Standard A4 &amp; Universal Sizing:</strong> Formatted to fit home and commercial printers with zero cutoff margins.
                </span>
              </div>
              <button
                onClick={handlePrint}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0 cursor-pointer"
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
