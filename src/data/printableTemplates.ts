import { PrintTheme, PrintableTemplate, TemplateCategoryId, ShopBusinessHeader } from '../types/templates';

export const PRINT_THEMES: Record<string, PrintTheme> = {
  pastel: {
    id: 'pastel',
    name: 'Pastel Dream',
    tagline: 'Soft lavender, gentle blush & periwinkle',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    accentBg: '#F5F3FF',
    borderColor: '#C7D2FE',
    textColor: '#1E1B4B',
    headerBg: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
    badgeBg: '#EEF2FF',
    badgeText: '#4338CA',
    highlightColor: '#F472B6'
  },
  botanical: {
    id: 'botanical',
    name: 'Botanical Forest',
    tagline: 'Sage green, earthy olive & fresh foliage',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentBg: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#064E3B',
    headerBg: 'linear-gradient(135deg, #059669 0%, #047857 50%, #10B981 100%)',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    highlightColor: '#34D399'
  },
  sunshine: {
    id: 'sunshine',
    name: 'Warm Sunshine',
    tagline: 'Amber glow, honey yellow & terracotta',
    primaryColor: '#D97706',
    secondaryColor: '#B45309',
    accentBg: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#78350F',
    headerBg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #EA580C 100%)',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    highlightColor: '#FBBF24'
  },
  minimalist: {
    id: 'minimalist',
    name: 'Modern Minimalist',
    tagline: 'Charcoal, crisp slate & ink-saver monochrome',
    primaryColor: '#18181B',
    secondaryColor: '#3F3F46',
    accentBg: '#FAFAFA',
    borderColor: '#E4E4E7',
    textColor: '#09090B',
    headerBg: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
    badgeBg: '#F4F4F5',
    badgeText: '#18181B',
    highlightColor: '#71717A'
  }
};

export const TEMPLATE_CATEGORIES: { id: TemplateCategoryId; title: string; subtitle: string; description: string; icon: string; badge: string; color: string }[] = [
  {
    id: 'educational-study',
    title: 'Educational & Study',
    subtitle: 'Daily & Weekly Timetables, Monthly Calendars & Study Planners',
    description: 'Crisp single-page study schedules, revision roadmaps, and time-blocked academic timetables designed for maximum focus and zero distractions.',
    icon: 'GraduationCap',
    badge: 'Study & Academics',
    color: 'indigo'
  },
  {
    id: 'shop-business',
    title: 'Shop & Business',
    subtitle: 'Business Ledger & Sales Record, Order Forms, Invoices & Stock Sheets with Editable Headers',
    description: 'Professional commercial templates for small shops, merchants, and freelancers. Customize your Business Name, Owner, Phone, and Address while keeping tables fixed.',
    icon: 'Store',
    badge: 'Commercial & Retail',
    color: 'emerald'
  },
  {
    id: 'personal-home',
    title: 'Personal & Home Management',
    subtitle: 'Routine & Chore Boards, Grocery Lists, Budgets & Kitchen Planners',
    description: 'Streamline family life with single-page weekly chore charts, categorized shopping checklists, zero-based monthly budgets, and 7-day meal planners.',
    icon: 'Home',
    badge: 'Home & Lifestyle',
    color: 'amber'
  }
];

export const TEMPLATES: PrintableTemplate[] = [
  // 1. Educational & Study
  {
    id: 'daily-timetable',
    categoryId: 'educational-study',
    categoryTitle: 'Educational & Study',
    title: 'Daily Timetable & Schedule',
    subtitle: 'Time-blocked daily plan from 6:00 AM to 10:00 PM with Top 3 Priorities',
    description: 'Hour-by-hour single-page daily master planner with top priorities, habit checklist, daily homework tracker, and evening reflection notes.',
    iconName: 'Clock',
    badge: 'Daily Planner',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'weekly-timetable',
    categoryId: 'educational-study',
    categoryTitle: 'Educational & Study',
    title: 'Weekly Timetable & Schedule Grid',
    subtitle: 'Monday through Sunday academic class schedule & revision blocks',
    description: 'Clean single-page 7-day master timetable. Organize subjects, lecture times, study goals, assignment due dates, and weekend review sessions.',
    iconName: 'CalendarRange',
    badge: 'Weekly Grid',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'monthly-calendar',
    categoryId: 'educational-study',
    categoryTitle: 'Educational & Study',
    title: 'Monthly Calendar & Timetable',
    subtitle: 'Custom single-month calendar grid with key deadlines and monthly goals',
    description: 'Dynamic single-month calendar block sheet with customizable month & year, priority dates, monthly project milestones, and habit checkmarks.',
    iconName: 'Calendar',
    badge: 'Monthly Overview',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'study-planner',
    categoryId: 'educational-study',
    categoryTitle: 'Educational & Study',
    title: 'Single-Page Study & Exam Planner',
    subtitle: 'Comprehensive exam revision roadmap, topics checklist & countdown',
    description: 'Organize study sessions with subject focus blocks, chapters to cover, priority tags, revision status, and exam countdown days.',
    iconName: 'BookOpenCheck',
    badge: 'Exam Ready',
    isLocked: false,
    priceUSD: 0
  },

  // 2. Shop & Business
  {
    id: 'shop-ledger',
    categoryId: 'shop-business',
    categoryTitle: 'Shop & Business',
    title: 'Business Ledger & Sales Record',
    subtitle: 'Debit/Credit customer transaction tracking with editable business header',
    description: 'Professional daily business sales ledger sheet. Features date, particulars, transaction reference, debit (-), credit (+), net balance, and verified signature.',
    iconName: 'BookSpread',
    badge: 'Accounting & Ledger',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'order-booking',
    categoryId: 'shop-business',
    categoryTitle: 'Shop & Business',
    title: 'Order Booking Form',
    subtitle: 'Itemized client order sheet with advance payment & delivery tracking',
    description: 'Professional order confirmation sheet for custom products or bulk deliveries. Captures customer details, order item lines, advance paid, balance due, and delivery date.',
    iconName: 'ClipboardList',
    badge: 'Sales & Orders',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'billing-receipt',
    categoryId: 'shop-business',
    categoryTitle: 'Shop & Business',
    title: 'Invoicing & Billing Receipt',
    subtitle: 'Complete bill with tax/discount breakdown, payment terms & authorized seal',
    description: 'Clean, printable tax invoice and payment receipt. Includes editable business header, invoice number, itemized rates, subtotal, tax/discount calculation, and terms.',
    iconName: 'Receipt',
    badge: 'Invoicing & Bills',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'inventory-sheet',
    categoryId: 'shop-business',
    categoryTitle: 'Shop & Business',
    title: 'Stock & Inventory Sheet',
    subtitle: 'Opening/Closing stock auditor with stock-in, stock-out & reorder levels',
    description: 'Essential warehouse and retail shelf inventory auditor. Track item SKUs, descriptions, opening balances, received goods, issued stock, and reorder alerts.',
    iconName: 'Boxes',
    badge: 'Stock & Warehouse',
    isLocked: false,
    priceUSD: 0
  },

  // 3. Personal & Home Management
  {
    id: 'family-chore',
    categoryId: 'personal-home',
    categoryTitle: 'Personal & Home Management',
    title: 'Family Routine & Chore Board',
    subtitle: 'Daily morning, afternoon & evening chore tracker with star points',
    description: 'Single-page family accountability board. Assign tasks to each family member, tick off morning and evening duties, and tally points for weekend celebrations.',
    iconName: 'Sparkles',
    badge: 'Chore Tracker',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'grocery-list',
    categoryId: 'personal-home',
    categoryTitle: 'Personal & Home Management',
    title: 'Grocery & Shopping List',
    subtitle: '4-section categorized supermarket checklist: Produce, Dairy, Pantry & Household',
    description: 'Organized supermarket shopping sheet to save time and money. Pre-divided into Produce & Bakery, Dairy & Chilled, Pantry & Staples, and Household Essentials.',
    iconName: 'ShoppingBasket',
    badge: 'Smart Shopping',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'monthly-budget',
    categoryId: 'personal-home',
    categoryTitle: 'Personal & Home Management',
    title: 'Monthly Budget Planner',
    subtitle: 'Zero-based financial organizer: Incomes, Fixed Bills, Savings & Expenses',
    description: 'Master your monthly cash flow with a clear, single-page budget sheet. Track expected vs actual income, fixed bills, variable spending, and emergency fund growth.',
    iconName: 'DollarSign',
    badge: 'Financial Health',
    isLocked: false,
    priceUSD: 0
  },
  {
    id: 'meal-planner',
    categoryId: 'personal-home',
    categoryTitle: 'Personal & Home Management',
    title: 'Weekly Meal & Kitchen Planner',
    subtitle: 'Monday through Sunday breakfast, lunch, dinner & snack schedule',
    description: 'Plan healthy home-cooked meals for the week. Includes Monday through Sunday slots for all 3 meals + healthy snacks, plus weekly meal prep and grocery notes.',
    iconName: 'UtensilsCrossed',
    badge: 'Kitchen & Nutrition',
    isLocked: false,
    priceUSD: 0
  }
];

export const DEFAULT_BUSINESS_HEADER: ShopBusinessHeader = {
  shopName: 'Metro Hardware & Retail Mart',
  ownerName: 'Robert Vance & Associates',
  contactNumber: '+00 123 456 7890 / sales@metromart.com',
  address: '142 Market Street, Commercial Suite #4B',
  cityState: 'Global Central City, Metro District',
  taxNumber: 'TAX-ID: 94821038-REG'
};
