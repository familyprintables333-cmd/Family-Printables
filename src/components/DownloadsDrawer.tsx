import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Lock, 
  RotateCcw, 
  Clock, 
  AlertTriangle,
  Search,
  Printer,
  Sparkles,
  WifiOff,
  FolderOpen,
  Calendar,
  Layers,
  Volume2
} from 'lucide-react';
import { Product, UserAccount } from '../types';
import { getProductAccessStatus } from '../utils/access';
import { resolveImageUrl } from '../assets/images';
import { downloadProductFileOffline } from '../utils/offlineDownload';

interface DownloadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  account: UserAccount;
  onLoginClick: () => void;
  onRestorePurchases?: (email: string) => boolean;
  onRenewAccess?: (product: Product) => void;
  onToggleSimulateExpiry?: (productId: string) => void;
  onRequireSignUp?: (actionType: 'download' | 'print', onComplete: () => void) => void;
  logoUrl?: string;
  onOpenTimetableStudio?: () => void;
}

export const DownloadsDrawer: React.FC<DownloadsDrawerProps> = ({
  isOpen,
  onClose,
  products,
  account,
  onLoginClick,
  onRenewAccess,
  onToggleSimulateExpiry,
  onRequireSignUp,
  logoUrl = '/logo.png',
  onOpenTimetableStudio
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeVaultTab, setActiveVaultTab] = useState<'all' | 'workbooks' | 'planners' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter products that the user has purchased
  const purchasedProducts = products.filter((p) =>
    (account.purchasedProductIds || []).includes(p.id)
  );

  // Tab filtering
  const filteredProducts = purchasedProducts.filter((p) => {
    const matchesSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeVaultTab === 'audio') {
      return p.category === 'audio-stories';
    }
    if (activeVaultTab === 'planners') {
      return p.category === 'routines' || p.category === 'planning';
    }
    if (activeVaultTab === 'workbooks') {
      return p.category !== 'audio-stories' && p.category !== 'routines';
    }
    return true;
  });

  const handleDownloadFile = (product: Product, formatName: string) => {
    if (onRequireSignUp && (!account.isLoggedIn || !account.email || !account.name)) {
      onRequireSignUp('download', () => handleDownloadFile(product, formatName));
      return;
    }

    // STRICT 3-MONTH EXPIRATION CHECK: Verify access has not expired
    const status = getProductAccessStatus(product.id, account);
    if (!status.isUnlocked) {
      alert(`Access Locked: Your 3-month access to "${product.title}" has lapsed. Please renew your access to download.`);
      if (onRenewAccess) {
        onRenewAccess(product);
      }
      return;
    }

    setDownloadingId(`${product.id}-${formatName}`);
    setTimeout(() => {
      // 100% Offline-capable vector PDF or document file download
      downloadProductFileOffline(product, formatName);
      setDownloadingId(null);
    }, 300);
  };

  const handlePrintFile = (product: Product) => {
    if (onRequireSignUp && (!account.isLoggedIn || !account.email || !account.name)) {
      onRequireSignUp('print', () => handlePrintFile(product));
      return;
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vault-heading"
      >
        {/* ================================================================ */}
        {/* TOP BRANDED HEADER                                              */}
        {/* ================================================================ */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md border border-white/20 bg-white flex items-center justify-center shrink-0">
                <img
                  src={logoUrl || '/logo.png'}
                  alt="Store Logo"
                  onError={(e) => {
                    e.currentTarget.src = '/icon.svg';
                  }}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="vault-heading" className="text-lg font-black tracking-tight text-white">
                    My Downloads Vault
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Encrypted
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5 font-medium">
                  {account.isLoggedIn
                    ? `Registered to: ${account.email}`
                    : 'Personal Digital Library · 90-Day Guaranteed Re-downloads'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-indigo-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Downloads Vault"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Offline-Ready Feature Banner */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <WifiOff className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Offline-Ready · Generates directly in browser memory</span>
            </div>
            <div className="text-indigo-300 font-medium">
              Standard A4 &amp; Universal PDFs
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SEARCH & VAULT CATEGORY TABS                                     */}
        {/* ================================================================ */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your unlocked files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-indigo-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setActiveVaultTab('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeVaultTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              All Items ({purchasedProducts.length})
            </button>
            <button
              onClick={() => setActiveVaultTab('workbooks')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeVaultTab === 'workbooks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              Workbooks &amp; Tracing
            </button>
            <button
              onClick={() => setActiveVaultTab('planners')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeVaultTab === 'planners'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              Elite Planners &amp; Timetables
            </button>
            <button
              onClick={() => setActiveVaultTab('audio')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeVaultTab === 'audio'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              Bedtime Audio Stories
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* VAULT CONTENT LIST                                               */}
        {/* ================================================================ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Account status card if not logged in */}
          {!account.isLoggedIn && (
            <div className="bg-indigo-50/70 rounded-2xl p-3.5 border border-indigo-200 flex items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Guest Browser Session</div>
                  <div className="text-slate-600 text-[11px]">
                    Create a free account to sync your vault across laptop &amp; phone.
                  </div>
                </div>
              </div>
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shrink-0 transition shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Free Printable Timetables Quick Access Card */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Free Daily Timetable &amp; Schedule Studio
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  100% free daily routines, weekly timetables &amp; study planners in 300 DPI.
                </p>
              </div>
            </div>
            {onOpenTimetableStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTimetableStudio();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shrink-0 transition shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Studio</span>
              </button>
            )}
          </div>

          {/* Items Section */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50/80 rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                <FolderOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-800">
                  {searchQuery ? 'No matching files in your vault' : 'No unlocked files in this session'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}". Try a different keyword.`
                    : 'Any workbook or timetable you unlock is stored here for 90 days with unlimited offline high-resolution PDF re-downloads.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm cursor-pointer"
              >
                Curated Learning Library &amp; Timetables
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredProducts.map((prod) => {
                const status = getProductAccessStatus(prod.id, account);
                const isAudio = prod.category === 'audio-stories';

                return (
                  <div
                    key={prod.id}
                    className={`p-4 rounded-2xl border shadow-xs space-y-3 transition-all ${
                      status.isExpired
                        ? 'border-rose-300 bg-rose-50/30'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    {/* Item Info Header */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={resolveImageUrl(prod.image, prod.category)}
                        alt={prod.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src = '/icon.svg';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        {/* Status Chip */}
                        <div className="flex items-center justify-between gap-2">
                          {status.isExpired ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                              <Lock className="w-3.5 h-3.5 text-rose-600" />
                              <span>Access Expired (90-day period lapsed)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active Access · {status.daysRemaining} Days Left</span>
                            </span>
                          )}

                          {onToggleSimulateExpiry && (
                            <button
                              onClick={() => onToggleSimulateExpiry(prod.id)}
                              className="text-[10px] text-slate-400 hover:text-rose-600 underline"
                              title="Test temporary 90-day expiry lock"
                            >
                              Test Lock
                            </button>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 truncate">
                          {prod.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {prod.categoryLabel}
                          </span>
                          {prod.pages && prod.pages > 0 && !isAudio && (
                            <span>{prod.pages} Pages</span>
                          )}
                          {isAudio && prod.audioDuration && (
                            <span className="text-purple-700 font-semibold">{prod.audioDuration}</span>
                          )}
                          <span>·</span>
                          <span>{prod.fileSize || '300 DPI Vector PDF'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    {status.isExpired ? (
                      <div className="pt-2.5 border-t border-rose-200 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-rose-800 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>90-Day Access Period Lapsed</span>
                        </div>

                        {onRenewAccess && (
                          <button
                            onClick={() => onRenewAccess(prod)}
                            className="px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Renew 3-Month Access (${prod.priceUSD.toFixed(2)})</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Standard A4 PDF */}
                          <button
                            onClick={() => handleDownloadFile(prod, 'Standard_A4_PDF')}
                            disabled={downloadingId === `${prod.id}-Standard_A4_PDF`}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>
                              {downloadingId === `${prod.id}-Standard_A4_PDF` ? 'Generating...' : 'Standard A4 PDF'}
                            </span>
                          </button>

                          {/* Universal Format */}
                          <button
                            onClick={() => handleDownloadFile(prod, 'Universal_Standard_PDF')}
                            disabled={downloadingId === `${prod.id}-Universal_Standard_PDF`}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Universal Size</span>
                          </button>

                          {/* Audio MP3 Download if audio story */}
                          {isAudio && (
                            <button
                              onClick={() => handleDownloadFile(prod, 'MP3_Story_Audio')}
                              disabled={downloadingId === `${prod.id}-MP3_Story_Audio`}
                              className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                              <span>MP3 Audio Story</span>
                            </button>
                          )}
                        </div>

                        {/* Instant Print Button */}
                        <button
                          onClick={() => handlePrintFile(prod)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                          title="Print Document"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 90-Day Access Guarantee Policy Box */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <div className="font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>90-Day Guaranteed Download &amp; Reprint Access</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every unlocked digital file comes with 3 full months (90 days) of unlimited high-definition downloads. You can reprint fresh sheets whenever needed across all your computers, tablets, and phones.
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* FOOTER ACTIONS                                                   */}
        {/* ================================================================ */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted · Unlimited Re-prints During 90 Days</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-800 font-extrabold rounded-xl hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
