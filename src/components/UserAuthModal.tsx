import React, { useState } from 'react';
import { X, User, ArrowRight, CheckCircle2, AlertCircle, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';
import { registerAccount, authenticateAccount } from '../utils/authStorage';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  onAuthSuccess: (account: UserAccount) => void;
  onLogout: () => void;
  logoUrl?: string;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  account,
  onAuthSuccess,
  onLogout,
  logoUrl = '/logo.png'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      const result = registerAccount(name, email, password);
      if (!result.success || !result.account) {
        setErrorMessage(result.error || 'Failed to create account.');
        return;
      }
      setSuccessMessage('Account created successfully! Your vault is now synced.');
      setTimeout(() => {
        onAuthSuccess(result.account!);
        onClose();
      }, 700);
    } else {
      const result = authenticateAccount(email, password);
      if (!result.success || !result.account) {
        setErrorMessage(result.error || 'Invalid email or password.');
        return;
      }
      setSuccessMessage('Welcome back! Logged in successfully.');
      setTimeout(() => {
        onAuthSuccess(result.account!);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center mx-auto mb-2 overflow-hidden p-0.5">
              <img
                src={logoUrl || '/logo.png'}
                alt="Brand Logo"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {account.isLoggedIn
                ? 'Parent Account Profile'
                : mode === 'login'
                ? 'Parent Account Sign In'
                : 'Create Parent Account'}
            </h3>
            <p className="text-xs text-slate-500">
              {account.isLoggedIn
                ? 'Your device is linked to your verified download vault'
                : 'Keep all your purchased printables and 90-day downloads synced'}
            </p>
          </div>

          {account.isLoggedIn ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Currently Signed In</span>
                </div>
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-900">{account.name}</span>
                  <div className="text-slate-500 font-mono text-[11px]">{account.email}</div>
                </div>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Unlocked Vault Items:</span>
                  <span className="font-black text-emerald-700 font-mono">
                    {account.purchasedProductIds.length} items
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Auth Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2 text-xs animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Toggle Login / Register */}
          {!account.isLoggedIn && (
            <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 underline"
                  >
                    Register Free
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-Bit Encrypted Parent Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
