import React, { useState } from 'react';
import { X, Download, ShieldCheck, CheckCircle2, User, Lock, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import { Product, UserAccount } from '../types';
import { getProductAccessStatus } from '../utils/access';
import { resolveImageUrl } from '../assets/images';

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
  logoUrl = '/logo.png'
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter products that the user has purchased
  const purchasedProducts = products.filter((p) =>
    account.purchasedProductIds.includes(p.id)
  );

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
      const content = `==========================================================\nFAMILY PRINTABLES - OFFICIAL DIGITAL VAULT\n==========================================================\nProduct: ${product.title}\nCategory: ${product.categoryLabel}\nTarget Age: ${product.targetAge}\nFormat: ${formatName} (High Resolution 300 DPI Print-Ready)\nLicensed To: ${account.email || 'Verified Purchaser'}\nAccess Duration: 3 Months (90 Days)\nStatus: UNLOCKED & ACTIVE ACCESS (${status.daysRemaining} days remaining)\n\nPRINTING GUIDE:\n1. Open in free Adobe Acrobat Reader or mobile tablet browser.\n2. In printer settings, set Scale to 100% (Actual Size).\n3. Recommended paper: 28lb to 32lb bright white paper, or 65lb cardstock.\n4. For reusable dry-erase activities, slip sheets into plastic protectors or laminate.\n\nThank you for choosing Family Printables!\n==========================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_${formatName}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setDownloadingId(null);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-white flex items-center justify-center shrink-0">
              <img
                src={logoUrl || '/logo.png'}
                alt="Store Logo"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                My Downloads Vault
              </h3>
              <p className="text-xs text-slate-500">
                {account.isLoggedIn
                  ? `${account.email}`
                  : '3-Month (90-Day) High-Speed Download Vault'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Account Status Card */}
          <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  {account.isLoggedIn ? account.name : 'Guest Session'}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {account.isLoggedIn
                    ? account.email
                    : 'Sign in to sync your vault across all your devices'}
                </div>
              </div>
            </div>

            {!account.isLoggedIn ? (
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shrink-0 transition"
              >
                Sign In / Register
              </button>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active
              </span>
            )}
          </div>

          {/* Explicit 90-Day (3-Month) Temporary Access Policy Banner */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-1.5 text-xs text-amber-950 shadow-2xs">
            <div className="font-black flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs">90-Day (3-Month) Temporary Access Policy</span>
            </div>
            <p className="text-[11px] text-amber-900/85 leading-relaxed">
              All unlocked printables and workbooks are granted temporary download vault access for strictly 90 days (3 months) from your verified transaction. During these 90 days, you enjoy unlimited high-resolution PDF re-downloads. Once 90 days elapse, download links automatically re-lock to protect store files, with instant renewal available anytime.
            </p>
          </div>

          {/* Purchased Items List */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider">
                Your Vault Workbooks:
              </span>
              <span className="font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                {purchasedProducts.length} items
              </span>
            </div>

            {purchasedProducts.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-400 flex items-center justify-center mx-auto">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">
                  No unlocked items in this session yet
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  When you purchase any workbook, it unlocks here for 3 months (90 days) with unlimited high-resolution PDF re-downloads.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedProducts.map((prod) => {
                  const status = getProductAccessStatus(prod.id, account);

                  return (
                    <div
                      key={prod.id}
                      className={`p-4 rounded-2xl border shadow-xs space-y-3 transition-colors ${
                        status.isExpired
                          ? 'border-rose-300 bg-rose-50/40'
                          : 'border-emerald-200 bg-emerald-50/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={resolveImageUrl(prod.image)}
                          alt={prod.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = '/icon.svg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          {status.isExpired ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md w-fit">
                              <Lock className="w-3.5 h-3.5 text-rose-600" />
                              <span>Access Expired · 3-Month Period Lapsed</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Unlocked · {status.daysRemaining} Days Access Left</span>
                              </div>
                              {onToggleSimulateExpiry && (
                                <button
                                  onClick={() => onToggleSimulateExpiry(prod.id)}
                                  className="text-[10px] font-medium text-slate-400 hover:text-rose-600 underline transition"
                                  title="Test automatic re-locking when 90-day period expires"
                                >
                                  Test Expire
                                </button>
                              )}
                            </div>
                          )}

                          <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                            {prod.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {prod.pages} Pages · {prod.targetAge} · {prod.fileSize}
                          </div>
                        </div>
                      </div>

                      {/* Download Controls or Expired Re-Locking Banner */}
                      {status.isExpired ? (
                        <div className="pt-2 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Download links locked (90 days lapsed)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {onToggleSimulateExpiry && (
                              <button
                                onClick={() => onToggleSimulateExpiry(prod.id)}
                                className="text-[10px] text-slate-500 hover:text-slate-900 underline px-1 py-0.5"
                                title="Reset timer to active status for testing"
                              >
                                Reset Timer
                              </button>
                            )}

                            {onRenewAccess && (
                              <button
                                onClick={() => onRenewAccess(prod)}
                                className="px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:from-amber-500 hover:to-rose-500 rounded-xl transition shadow-xs flex items-center gap-1.5 active:scale-95"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Renew 3-Month Access (${prod.priceUSD.toFixed(2)})</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleDownloadFile(prod, 'Standard_A4_PDF')}
                            disabled={downloadingId === `${prod.id}-Standard_A4_PDF`}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Standard A4 PDF</span>
                          </button>

                          <button
                            onClick={() => handleDownloadFile(prod, 'Universal_Standard_PDF')}
                            disabled={downloadingId === `${prod.id}-Universal_Standard_PDF`}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Universal Size PDF</span>
                          </button>

                          {prod.category === 'audio-stories' && (
                            <button
                              onClick={() => handleDownloadFile(prod, 'MP3_Story_Audio')}
                              disabled={downloadingId === `${prod.id}-MP3_Story_Audio`}
                              className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5 text-purple-600" />
                              <span>MP3 Audio Story</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted · 3-Month (90-Day) Guaranteed Download Access</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
