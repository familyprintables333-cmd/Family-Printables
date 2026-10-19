import React from 'react';
import { ExternalLink, Tag, Sparkles } from 'lucide-react';
import { getMonetizationSettings, trackMonetizationEvent } from '../utils/monetization';

interface AdBannerProps {
  position?: 'hero-bottom' | 'footer-top' | 'studio-side';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position = 'footer-top', className = '' }) => {
  const settings = getMonetizationSettings();

  if (!settings.adMobEnabled && !settings.affiliateEnabled) {
    return null;
  }

  const handleAffiliateClick = () => {
    trackMonetizationEvent(
      'affiliate_click',
      `Affiliate Click: ${settings.affiliateTitle}`,
      0.85,
      `User clicked sponsor banner link`
    );
  };

  return (
    <div className={`no-print ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl p-4 sm:p-5 border border-indigo-200/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.2 rounded-md tracking-wider">
                  Sponsored Partner
                </span>
                <span className="text-xs font-black text-slate-900">
                  {settings.affiliateTitle}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {settings.affiliateSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={settings.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAffiliateClick}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get 30% Off Supplies</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
