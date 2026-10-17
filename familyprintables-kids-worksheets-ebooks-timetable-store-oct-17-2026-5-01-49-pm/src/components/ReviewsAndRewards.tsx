import React, { useState } from 'react';
import { 
  Star, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Send, 
  Gift, 
  Trophy, 
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserReviewItem } from '../types/templates';

interface ReviewsAndRewardsProps {
  onPointsUpdated?: (newPoints: number) => void;
  onExploreTemplates?: () => void;
}

const DIVERSE_DEFAULT_REVIEWS: UserReviewItem[] = [
  {
    id: 'rev-study',
    author: 'Prof. Sarah Jenkins',
    role: 'High School Educator & Parent',
    categoryTag: 'Study Plans',
    rating: 5,
    date: '2 days ago',
    comment: 'The single-page Study Planner and Weekly Timetable helped my students organize exam revision blocks without feeling overwhelmed. Prints crisp on standard A4 with zero ink bleed.',
    verified: true,
    templateUsed: 'Single-Page Study Planner'
  },
  {
    id: 'rev-ledger',
    author: 'Tariq Al-Mansoor',
    role: 'Retail Store Proprietor',
    categoryTag: 'Business Ledgers',
    rating: 5,
    date: '3 days ago',
    comment: 'Customizing my Shop Name, Address, and Contact at the top of the Khata Ledger while keeping the debit/credit grid fixed saved me hours of design work. Simple and highly functional.',
    verified: true,
    templateUsed: 'Shop Ledger (Khata Book)'
  },
  {
    id: 'rev-puzzles',
    author: 'Elena Rostova',
    role: 'Mother of Two (Ages 6 & 8)',
    categoryTag: 'Brain Puzzles',
    rating: 5,
    date: '4 days ago',
    comment: 'The STEM Mazes and logic puzzles are completely screen-free entertainment for road trips. The difficulty curve is well-paced and kept my kids happily engaged for hours.',
    verified: true,
    templateUsed: 'Brain Puzzles & STEM Mazes'
  },
  {
    id: 'rev-invoice',
    author: 'Rashid Patel',
    role: 'Wholesale Supplier & Trader',
    categoryTag: 'Business Ledgers',
    rating: 5,
    date: '5 days ago',
    comment: 'The Invoicing & Billing Receipt and Stock Inventory sheets print cleanly on Letter and A4. Entering our store header and tax number gives our customer receipts a professional look.',
    verified: true,
    templateUsed: 'Invoicing & Billing Receipt'
  },
  {
    id: 'rev-chores',
    author: 'David & Emily Vance',
    role: 'Family Household Manager',
    categoryTag: 'Home & Chores',
    rating: 5,
    date: '1 week ago',
    comment: 'The Family Chore Board and 4-section Grocery List stopped our weekend supermarket chaos. We laminated the chore board for dry-erase markers and our kids love ticking their daily stars.',
    verified: true,
    templateUsed: 'Family Routine & Chore Board'
  },
  {
    id: 'rev-ramadan',
    author: 'Amina Qureshi',
    role: 'Homeschooling Mother of Three',
    categoryTag: 'Seasonal & Ramadan',
    rating: 5,
    date: '1 week ago',
    comment: 'The Ramadan countdown calendar, good deeds tracker, and DIY holiday greeting cards made our family celebration extra special. Beautiful high-resolution vector artwork.',
    verified: true,
    templateUsed: 'Ramadan & Eid Celebration Kit'
  },
  {
    id: 'rev-budget',
    author: 'Chloe Martin',
    role: 'Budget Coach & Parent',
    categoryTag: 'Home & Chores',
    rating: 5,
    date: '10 days ago',
    comment: 'The Monthly Budget Planner and 7-Day Meal Schedule keep our family expenses on track. Having clean single-page templates without clutter makes weekly planning seamless.',
    verified: true,
    templateUsed: 'Monthly Budget Planner'
  },
  {
    id: 'rev-preschool',
    author: 'Marcus Thorne',
    role: 'Pre-K Early Learning Specialist',
    categoryTag: 'Preschool & ABC',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Extra-thick dotted guide lines and cute animal tracing paths are perfect for early pencil grip development. My toddler asks to do two practice sheets every morning.',
    verified: true,
    templateUsed: 'Pre-K Animal Tracing Lines'
  }
];

const CATEGORY_FILTERS = [
  'All Categories',
  'Study Plans',
  'Business Ledgers',
  'Brain Puzzles',
  'Home & Chores',
  'Seasonal & Ramadan',
  'Preschool & ABC'
];

export const ReviewsAndRewards: React.FC<ReviewsAndRewardsProps> = ({
  onPointsUpdated,
  onExploreTemplates
}) => {
  // Points wallet stored in localStorage
  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fp_user_reward_points');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 150; // Welcome reward points
  });

  const [reviewsList, setReviewsList] = useState<UserReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('fp_user_reviews_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge user-submitted reviews with our complete diverse catalog
          const userSubmitted = parsed.filter(
            (p: UserReviewItem) => !DIVERSE_DEFAULT_REVIEWS.some((d) => d.id === p.id)
          );
          return [...userSubmitted, ...DIVERSE_DEFAULT_REVIEWS];
        }
      }
    } catch {}
    return DIVERSE_DEFAULT_REVIEWS;
  });

  // Display controls for compact testimonials
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);

  // Review Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Parent / Educator');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComment, setFormComment] = useState('');
  const [formCategory, setFormCategory] = useState('Study Plans');
  const [formTemplate, setFormTemplate] = useState('Daily Timetable');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Play Store Claim State
  const [hasClaimedPlayStore, setHasClaimedPlayStore] = useState(() => {
    return localStorage.getItem('fp_claimed_playstore_reward') === 'true';
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addPoints = (amount: number, reason: string) => {
    const updated = points + amount;
    setPoints(updated);
    try {
      localStorage.setItem('fp_user_reward_points', updated.toString());
    } catch {}
    if (onPointsUpdated) onPointsUpdated(updated);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {}

    showToast(`🎉 +${amount} Points Earned! (${reason})`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      alert('Please enter your name and comments.');
      return;
    }

    const newRev: UserReviewItem = {
      id: `rev-${Date.now()}`,
      author: formName.trim(),
      role: formRole,
      categoryTag: formCategory,
      rating: formRating,
      date: 'Just now',
      comment: formComment.trim(),
      verified: true,
      templateUsed: formTemplate
    };

    const updatedList = [newRev, ...reviewsList];
    setReviewsList(updatedList);
    try {
      localStorage.setItem('fp_user_reviews_catalog', JSON.stringify(updatedList));
    } catch {}

    // Reset Form, collapse accordion, & Award 50 points
    setFormName('');
    setFormComment('');
    setIsReviewFormOpen(false);
    addPoints(50, 'Review Submission Reward');
  };

  const handlePlayStorePrompt = () => {
    if (!hasClaimedPlayStore) {
      setHasClaimedPlayStore(true);
      try {
        localStorage.setItem('fp_claimed_playstore_reward', 'true');
      } catch {}
      addPoints(100, 'Google Play Store Community Review');
    }
    window.open('https://play.google.com/store/apps', '_blank');
  };

  // Strictly show 2 short testimonials by default with 'See All' toggle
  const displayedReviews = showAllReviews ? reviewsList : reviewsList.slice(0, 2);

  return (
    <div className="bg-slate-50/70 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 no-print">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0c233c] via-[#0f2d4e] to-[#0a1b2e] text-white py-8 sm:py-12 border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Earn &amp; Review Reward Program</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ratings, Community Reviews &amp; Rewards
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Complete quick actions to earn reward points, read authentic feedback across our workbook &amp; template collections, and post your review.
              </p>
            </div>

            {/* Points Wallet Card */}
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-3.5 shrink-0 shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  Reward Points Wallet
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {points} <span className="text-xs font-sans font-medium text-slate-300">FP Pts</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>VIP Print Tier Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ================================================================ */}
        {/* SECTION 1: THE 3 ACTION-BASED REWARD TASKS (KEPT INTACT) */}
        {/* ================================================================ */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Earn &amp; Review: 3 Core Reward Actions</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Earn reward credits automatically through your daily app actions.
              </p>
            </div>

            {/* Play Store Prompt Button */}
            <button
              onClick={handlePlayStorePrompt}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 shrink-0"
              title="Leave a 5-star review on Google Play"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#00E676] shrink-0" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a2.41 2.41 0 0 1-.61-.954V2.768c0-.36.104-.694.61-.954zM15.207 13.414l2.58 2.58-12.72 7.234 10.14-9.814zM15.207 10.586L5.067.772l12.72 7.234-2.58 2.58zm1.414 1.414l3.172 3.172a1.5 1.5 0 0 0 0-2.122l-3.172-3.172 1.414 1.414z" />
              </svg>
              <span>{hasClaimedPlayStore ? 'Play Store Claimed (+100 Pts)' : 'Review on Play Store (+100 Pts)'}</span>
            </button>
          </div>

          {/* 3 Core Reward Tasks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Task 1: Daily Check-in */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Action 1</span>
                  <span className="text-xs font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                    +20 Pts
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">Daily Timetable Check-In</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Open your schedules and check off daily study or routine milestones.
                </p>
              </div>
              <button
                onClick={() => addPoints(20, 'Daily Check-in')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
              >
                <span>Claim +20 Points</span>
              </button>
            </div>

            {/* Task 2: PDF Export */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Action 2</span>
                  <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    +10 Pts
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">Single-Page PDF Export</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Customize any template and generate high-res 300 DPI single-page PDF.
                </p>
              </div>
              <button
                onClick={() => {
                  if (onExploreTemplates) onExploreTemplates();
                  addPoints(10, 'PDF Export Perk');
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
              >
                <span>Export &amp; Earn +10</span>
              </button>
            </div>

            {/* Task 3: Submit Verified Review */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Action 3</span>
                  <span className="text-xs font-black text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    +50 Pts
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">Submit Template Review</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Share your printing experience to help other parents and merchants.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsReviewFormOpen(true);
                  const el = document.getElementById('submit-review-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 text-center cursor-pointer"
              >
                <span>✍️ Write a Review (+50 Pts)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 2: CLEAN, COMPACT TESTIMONIALS SECTION */}
        {/* ================================================================ */}
        <div className="space-y-4 overflow-x-hidden" style={{ overflowX: 'hidden' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Community Testimonials
                </h2>
                <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5.0 Rating</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic feedback across all printables, study plans, business ledgers, puzzles &amp; greeting cards.
              </p>
            </div>
          </div>

          {/* Compact 2-Column Grid (Zero Horizontal Scrolling) */}

          {/* Compact 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {rev.author}
                      </strong>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                          <Check className="w-2.5 h-2.5" />
                          <span>Verified</span>
                        </span>
                      )}
                      {rev.categoryTag && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded-md border border-indigo-100">
                          {rev.categoryTag}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {rev.role}
                    </div>
                  </div>

                  {/* Clean Visual Rating Badge (Non-button, clear score) */}
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/90 px-2 py-0.5 rounded-lg shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-black text-amber-900">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600 truncate max-w-[220px]">
                    Item: {rev.templateUsed || 'Custom Printable'}
                  </span>
                  <span className="shrink-0">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Show More / Show Less Toggle (Show only 2 short testimonials by default) */}
          {reviewsList.length > 2 && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-xl text-xs border border-slate-300 shadow-2xs transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{showAllReviews ? '▲ Show Fewer Reviews' : `▼ See All Reviews (${reviewsList.length})`}</span>
              </button>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* SECTION 3: COLLAPSED REVIEW SUBMISSION (ACCORDION STYLE) */}
        {/* ================================================================ */}
        <div id="submit-review-form" className="pt-2">
          {!isReviewFormOpen ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsReviewFormOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>✍️ Write a Review (+50 Pts)</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-indigo-100 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Write a Review &amp; Claim +50 Points
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Fatima Vance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Role / Occupation:</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
                >
                  <option value="Parent / Educator">Parent / Educator</option>
                  <option value="Shop Owner / Proprietor">Shop Owner / Proprietor</option>
                  <option value="Student / Academic">Student / Academic</option>
                  <option value="Teacher / School Staff">Teacher / School Staff</option>
                  <option value="Home Organizer">Home Organizer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Printable Category:</label>
                <select
                  value={formCategory}
                  onChange={(e) => {
                    setFormCategory(e.target.value);
                    if (e.target.value === 'Business Ledgers') setFormTemplate('Shop Ledger (Khata Book)');
                    else if (e.target.value === 'Brain Puzzles') setFormTemplate('Brain Puzzles & STEM Mazes');
                    else if (e.target.value === 'Home & Chores') setFormTemplate('Family Routine & Chore Board');
                    else if (e.target.value === 'Seasonal & Ramadan') setFormTemplate('Ramadan & Eid Celebration Kit');
                    else setFormTemplate('Single-Page Study Planner');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
                >
                  <option value="Study Plans">Study Plans &amp; Timetables</option>
                  <option value="Business Ledgers">Business Ledgers &amp; Invoices</option>
                  <option value="Brain Puzzles">Brain Puzzles &amp; Mazes</option>
                  <option value="Home & Chores">Home &amp; Chore Management</option>
                  <option value="Seasonal & Ramadan">Seasonal &amp; Ramadan Kits</option>
                  <option value="Preschool & ABC">Preschool &amp; Early Learning</option>
                </select>
              </div>
            </div>

            {/* Straightforward Interactive Star Rating Selector */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 block text-xs">
                  Select Your Star Rating:
                </label>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                  {formRating}.0 / 5.0 Stars
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* 100% Interactive Large Star Buttons (1 to 5) */}
                <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-300 shadow-2xs">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isActive = starVal <= formRating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setFormRating(starVal)}
                        className={`p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
                          isActive ? 'bg-amber-50' : 'hover:bg-slate-100'
                        }`}
                        title={`Rate ${starVal} Star${starVal > 1 ? 's' : ''}`}
                        aria-label={`Select ${starVal} star rating`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            isActive ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Quick Selection Rating Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { val: 5, label: '5 ★ Exceptional' },
                    { val: 4, label: '4 ★ Very Good' },
                    { val: 3, label: '3 ★ Good' },
                    { val: 2, label: '2 ★ Fair' },
                    { val: 1, label: '1 ★ Needs Work' }
                  ].map((pill) => (
                    <button
                      key={pill.val}
                      type="button"
                      onClick={() => setFormRating(pill.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
                        formRating === pill.val
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Your Review Comments &amp; Home Printing Experience:
              </label>
              <textarea
                rows={2}
                required
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="How did the template fit on your printer? Did you customize the business header or use Pastel, Botanical, or Minimalist themes?"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+50 Reward Credits added immediately to your wallet upon posting</span>
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Post Review &amp; Claim +50</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  </div>
</div>
  );
};
