import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { UserAccount } from '../types';
import { quickRegisterOrSignIn } from '../utils/authStorage';

interface MandatorySignUpGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: UserAccount) => void;
  actionTitle?: string;
  actionType?: 'download' | 'print' | 'checkout';
  logoUrl?: string;
}

export const MandatorySignUpGateModal: React.FC<MandatorySignUpGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'this printable item',
  actionType = 'download',
  logoUrl = '/logo.png'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid Gmail / Email address.');
      return;
    }

    setIsSubmitting(true);

    const res = quickRegisterOrSignIn(cleanName, cleanEmail);
    if (!res.success || !res.account) {
      setIsSubmitting(false);
      setErrorMessage(res.error || 'Failed to register account.');
      return;
    }

    // Success: notify and execute pending download/print
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(res.account!);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-indigo-200/90 overflow-hidden my-4 sm:my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-10 p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-[#0d233a] via-[#122e4d] to-[#0a1b2d] text-white p-6 sm:p-7 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            {actionType === 'print' ? (
              <Printer className="w-6 h-6 text-emerald-400" />
            ) : (
              <Download className="w-6 h-6 text-indigo-300" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mandatory Free Sign-Up Gate</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
            Enter Your Name &amp; Gmail to {actionType === 'print' ? 'Print' : 'Download'}
          </h3>

          <p className="text-xs text-slate-300 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Please register your parent profile to access <span className="text-white font-semibold underline">{actionTitle}</span> and unlock your 90-day download vault.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
                Gmail / Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Instant delivery link &amp; receipt will be linked to this Gmail.
              </span>
            </div>

            {/* Benefit Bullets */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Free Single-Page Printables &amp; Planners</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>90-Day Cloud Download Vault Linked to Gmail</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Fillable PDF &amp; Editable Word (.doc) Exports</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-600 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Verifying Profile...' : `Register & Continue to ${actionType === 'print' ? 'Print' : 'Download'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Privacy Guaranteed · Registered to Family Printables</span>
          </div>
        </div>
      </div>
    </div>
  );
};
