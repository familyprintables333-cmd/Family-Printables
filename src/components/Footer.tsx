import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Lock, 
  FileText, 
  RotateCcw
} from 'lucide-react';
import { LegalPolicyModal, PolicyTab } from './LegalPolicyModal';

interface FooterProps {
  onTabChange: (tab: 'catalog' | 'studio' | 'how-it-works' | 'guides' | 'etsy-kdp') => void;
  onSelectCategory?: (categoryId: string) => void;
  onOpenDownloads?: () => void;
  onOpenContactSupport?: () => void;
  logoUrl?: string;
}

const STORAGE_SOCIAL_KEY = 'fp_social_links';

export interface SocialLinks {
  pinterest: string;
  instagram: string;
  facebook: string;
  amazon: string;
  etsy: string;
}

export const DEFAULT_SOCIAL: SocialLinks = {
  pinterest: 'https://www.pinterest.com/familyprintables',
  instagram: 'https://www.instagram.com/familyprintables',
  facebook: 'https://www.facebook.com/familyprintables',
  amazon: 'https://www.amazon.com/author/familyprintables',
  etsy: 'https://www.etsy.com/shop/familyprintables'
};

export const Footer: React.FC<FooterProps> = ({
  onTabChange,
  onSelectCategory,
  onOpenDownloads,
  onOpenContactSupport,
  logoUrl = '/logo.png'
}) => {
  const [legalModalTab, setLegalModalTab] = useState<PolicyTab | null>(null);

  // Social Links loaded from authoritative storage / backend settings
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOCIAL_KEY);
      if (saved) return { ...DEFAULT_SOCIAL, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SOCIAL;
  });

  useEffect(() => {
    // Sync social links from server settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings?.socialLinks) {
          const merged = { ...DEFAULT_SOCIAL, ...data.settings.socialLinks };
          setSocialLinks(merged);
          try {
            localStorage.setItem(STORAGE_SOCIAL_KEY, JSON.stringify(merged));
          } catch {}
        }
      })
      .catch(() => {});

    // Listen for cross-device/tab updates
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === STORAGE_SOCIAL_KEY && e.newValue) {
        try {
          setSocialLinks({ ...DEFAULT_SOCIAL, ...JSON.parse(e.newValue) });
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  const handleOpenLegal = (tab: PolicyTab) => {
    setLegalModalTab(tab);
  };

  const handleOpenGuides = () => {
    onTabChange('guides');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 4-Column Professional Digital Store Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
          
          {/* Col 1: Official Brand Identity & Active Social Links */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src={logoUrl || '/logo.png'}
                alt="Family Printables"
                className="w-8 h-8 rounded-xl object-contain bg-white p-0.5"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
              />
              <span className="text-base font-black text-white tracking-tight">Family Printables</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Instant downloadable educational workbooks, habit trackers, and bedtime audio stories for curious young learners and organized families worldwide.
            </p>

            {/* Active Social Media & Platform Links (Configured exclusively in Admin Panel) */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Connect &amp; Follow Us
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Pinterest */}
                <a
                  href={socialLinks.pinterest || DEFAULT_SOCIAL.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-white flex items-center gap-1.5 transition shadow-2xs group"
                  title="Visit Pinterest Community"
                >
                  <svg className="w-3.5 h-3.5 text-[#E60023] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0a12 12 0 0 0-4.4 23.2c-.1-.9-.1-2.4 0-3.4l1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.3 3.8-5.5 0-2.9-2-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7a.4.4 0 0 1 .1.4l-.3 1.4c-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.4 3 7.4 7 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.4-1.5 3.2A12 12 0 1 0 12 0z"/>
                  </svg>
                  <span>Pinterest</span>
                </a>

                {/* 2. Instagram */}
                <a
                  href={socialLinks.instagram || DEFAULT_SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-white flex items-center gap-1.5 transition shadow-2xs group"
                  title="Visit Instagram Profile"
                >
                  <svg className="w-3.5 h-3.5 text-[#E1306C] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>

                {/* 3. Facebook */}
                <a
                  href={socialLinks.facebook || DEFAULT_SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-white flex items-center gap-1.5 transition shadow-2xs group"
                  title="Visit Facebook Page"
                >
                  <svg className="w-3.5 h-3.5 text-[#1877F2] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* 4. Amazon KDP */}
                <a
                  href={socialLinks.amazon || DEFAULT_SOCIAL.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-white flex items-center gap-1.5 transition shadow-2xs group"
                  title="View Amazon KDP Publishing Store"
                >
                  <svg className="w-3.5 h-3.5 text-[#FF9900] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.62 14.73c-2.73 2.01-6.72 3.08-10.12 3.08-4.78 0-9.1-1.74-12.38-4.65-.26-.23-.03-.56.26-.38 3.52 2.06 7.82 3.28 12.28 3.28 3.01 0 6.54-.71 9.64-2.22.46-.22.81.29.32.89zm1.13-1.64c-.35-.45-.82-1.58-.82-1.58s1.16.16 2.08.65c.93.5 1.77 1.28 1.77 1.28s-.46.58-1.06.86c-.61.27-1.62-.76-1.97-1.21z" />
                    <path d="M13.88 7.37c-.11-.79-.47-1.43-1.07-1.93-.6-.5-1.39-.75-2.37-.75-1.2 0-2.23.41-3.08 1.23-.85.82-1.28 1.86-1.28 3.12 0 1.2.4 2.19 1.2 2.96.8.77 1.78 1.16 2.94 1.16.71 0 1.34-.14 1.89-.42.55-.28.98-.67 1.29-1.17v1.31h2.24V7.47h-1.76v-.1zm-2.02 5.09c-.53.4-1.17.6-1.92.6-.71 0-1.3-.23-1.77-.69-.47-.46-.7-1.07-.7-1.83 0-.78.24-1.41.72-1.89.48-.48 1.09-.72 1.83-.72.69 0 1.29.21 1.8.63v3.9z"/>
                  </svg>
                  <span>Amazon</span>
                </a>

                {/* 5. Etsy */}
                <a
                  href={socialLinks.etsy || DEFAULT_SOCIAL.etsy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-white flex items-center gap-1.5 transition shadow-2xs group"
                  title="View Etsy Merchant Shop"
                >
                  <svg className="w-3.5 h-3.5 text-[#F1641E] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.8 14.5h-5.2c-.3 0-.5-.2-.5-.5V8c0-.3.2-.5.5-.5h5.1c.3 0 .5.2.5.5v1.2c0 .3-.2.5-.5.5h-3.4v1.7h2.8c.3 0 .5.2.5.5v1.1c0 .3-.2.5-.5.5h-2.8v1.8h3.5c.3 0 .5.2.5.5v1.2c0 .3-.2.5-.5.5z"/>
                  </svg>
                  <span>Etsy</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Store Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Curated Collections
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>
                <button
                  onClick={() => {
                    onTabChange('catalog');
                    if (onSelectCategory) onSelectCategory('toddlers');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Toddlers &amp; Preschool
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('catalog');
                    if (onSelectCategory) onSelectCategory('early-learning');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Early Learning &amp; Kindergarten
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('catalog');
                    if (onSelectCategory) onSelectCategory('puzzles');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Brain Puzzles &amp; STEM Mazes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('catalog');
                    if (onSelectCategory) onSelectCategory('routines');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Elite Planners &amp; Digital Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('catalog');
                    if (onSelectCategory) onSelectCategory('festivals');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Printable Greeting Cards &amp; Celebrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('catalog');
                    if (onSelectCategory) onSelectCategory('audio-stories');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Bedtime Audio Stories &amp; Calming Tunes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Trust Policies */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Legal &amp; Store Policies
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>
                <button
                  onClick={() => handleOpenLegal('privacy')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Privacy Policy (GDPR / CCPA)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenLegal('terms')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Terms of Service &amp; License</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenLegal('refund')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Refund &amp; Return Policy (30 Days)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleOpenGuides}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Educational Guides &amp; Blog</span>
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Instant 24/7 Digital Downloads</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>90-Day Download Vault Guarantee</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Clean, Professional, Realistic Publishing Studio Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Publishing Studio &amp; Support
            </h4>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Global Publishing Studio &amp; Registry:</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Family Printables Publishing Group<br />
                742 Evergreen Studio Promenade, Floor 4<br />
                Creative District, Suite 100<br />
                <span className="text-[10px] text-slate-400">Digital Delivery Worldwide · Reg. No. FP-89412</span>
              </div>
              <div className="text-[10px] text-emerald-400 pt-1.5 border-t border-slate-700/80 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>24/7 Global Digital Fulfillment &amp; Support Desk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Professional Navigation Links & Copyright */}
        <div className="space-y-4">
          <div className="py-3 px-4 bg-slate-800/50 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
            <button
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Privacy Policy</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Terms of Service</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              onClick={() => handleOpenLegal('refund')}
              className="hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Refund Policy</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              onClick={handleOpenGuides}
              className="hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guides &amp; Articles</span>
            </button>

            {onOpenContactSupport && (
              <>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <button
                  onClick={onOpenContactSupport}
                  className="hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>24/7 Support Desk</span>
                </button>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/90 text-center text-xs text-slate-500 font-medium tracking-wide">
            <p>© 2026 Family Printables. All Rights Reserved.</p>
          </div>
        </div>
      </div>

      {/* Legally Compliant Store Policies Modal */}
      <LegalPolicyModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </footer>
  );
};
