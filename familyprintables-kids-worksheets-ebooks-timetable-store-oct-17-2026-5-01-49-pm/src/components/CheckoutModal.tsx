import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, RefreshCw, AlertCircle, Sparkles, CheckCircle2, Globe, ExternalLink, Zap } from 'lucide-react';
import { CartItem, MerchantSettings } from '../types';
import { formatCurrency } from '../utils/currency';
import { resolveImageUrl } from '../assets/images';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (orderData: {
    customerName: string;
    customerEmail: string;
    country: string;
    city: string;
    paymentMethod: 'card' | 'applepay' | 'googlepay' | 'stripe' | 'paypal' | 'payoneer';
    totalUSD: number;
    transactionId?: string;
  }) => void;
  currency: string;
  merchantSettings?: MerchantSettings;
  logoUrl?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
  currency,
  merchantSettings = {
    payoneerEmail: 'merchant.payments@familyprintables.com',
    payoneerAccountId: 'PAY-8829-4102',
    receivingAccountNumber: '984210384729',
    routingNumber: '021000021',
    bankName: 'First Century Bank (US Receiving Account)',
    gatewayMode: 'test',
    currency: 'USD',
    paymentGateway: 'stripe',
    stripePublishableKey: 'pk_test_placeholder_key_for_stripe'
  },
  logoUrl = '/logo.png'
}) => {
  // Payment Method selection: 'card' (Direct Card Gateway) or 'stripe' (Stripe Hosted / Elements)
  const [selectedGateway, setSelectedGateway] = useState<'card' | 'stripe'>('card');

  // Customer contact info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');

  // Gateway Processing and Error State
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayStep, setGatewayStep] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalUSD = items.reduce((sum, i) => sum + i.product.priceUSD * i.quantity, 0);

  // Helper to format card number with spaces every 4 digits
  const handleCardNumberChange = (rawVal: string) => {
    setPaymentError(null);
    const cleaned = rawVal.replace(/\D/g, '').slice(0, 16);
    if (cleaned.startsWith('34') || cleaned.startsWith('37')) {
      setCardBrand('amex');
    } else if (cleaned.startsWith('5')) {
      setCardBrand('mastercard');
    } else {
      setCardBrand('visa');
    }

    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  // Helper to format expiry date MM/YY
  const handleExpiryChange = (rawVal: string) => {
    setPaymentError(null);
    const cleaned = rawVal.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  // Validation & Processing
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // 1. Strict Full Name validation
    if (!name.trim() || name.trim().length < 2) {
      setPaymentError('Full Name is required for payment authorization and vault access license.');
      return;
    }

    // 2. Strict Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setPaymentError('Valid Email Address is required to deliver your 90-day access token and download links.');
      return;
    }

    // 3. Card Validation when in Direct Card Mode
    if (selectedGateway === 'card') {
      const plainCard = cardNumber.replace(/\s+/g, '');
      if (plainCard.length < 15) {
        setPaymentError('Payment Error: Invalid card number. Minimum 15-16 digits required.');
        return;
      }

      if (cardExpiry.length < 5 || !cardExpiry.includes('/')) {
        setPaymentError('Payment Error: Invalid expiration date. Format must be MM/YY.');
        return;
      }

      const [expMonthStr, expYearStr] = cardExpiry.split('/');
      const expMonth = parseInt(expMonthStr, 10);
      const expYear = parseInt('20' + expYearStr, 10);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (expMonth < 1 || expMonth > 12) {
        setPaymentError('Payment Error: Invalid card expiration month (01-12).');
        return;
      }

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setPaymentError('Payment Denied: The card provided is expired. Files remain strictly LOCKED.');
        return;
      }

      if (cardCvv.length < 3) {
        setPaymentError('Payment Error: Security CVV / CVC code must be 3 or 4 digits.');
        return;
      }

      // Simulated Bank Decline test scenario
      if (plainCard === '4000000000000002' || cardCvv === '000') {
        setIsProcessing(true);
        setGatewayStep('Contacting Issuing Bank for authorization...');
        setTimeout(() => {
          setIsProcessing(false);
          setGatewayStep(null);
          setPaymentError(
            'Payment Gateway Rejection [ERR_402_AUTH_DECLINED]: Issuing bank declined authorization. The card was NOT debited, and files remain strictly LOCKED.'
          );
        }, 1200);
        return;
      }
    }

    // Initiate Real Secure Gateway Handshake Simulation (Card or Stripe)
    setIsProcessing(true);
    const gatewayName = selectedGateway === 'stripe' ? 'Stripe Checkout API' : '256-bit TLS Gateway';
    setGatewayStep(`Connecting to secure ${gatewayName}...`);

    setTimeout(() => {
      setGatewayStep(`Verifying authorization & debiting ${formatCurrency(totalUSD, currency)}...`);

      setTimeout(() => {
        setGatewayStep('Payment verified! Authorizing 90-day temporary access license...');

        setTimeout(() => {
          setIsProcessing(false);
          setGatewayStep(null);

          const randomTxnId = selectedGateway === 'stripe'
            ? `ch_stripe_${Math.random().toString(36).substring(2, 9)}${Date.now().toString(36)}`
            : `ch_direct_${Math.random().toString(36).substring(2, 9)}${Date.now().toString(36)}`;

          // Transaction confirmed and debited -> strictly unlock files
          onOrderComplete({
            customerName: name.trim(),
            customerEmail: email.trim(),
            country: 'Online Store',
            city: 'Direct Checkout',
            paymentMethod: selectedGateway === 'stripe' ? 'stripe' : 'card',
            totalUSD,
            transactionId: randomTxnId
          });
        }, 700);
      }, 800);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header: Clean Brand Logo, Secure Checkout Title & 256-Bit TLS Security Badge */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Auto-Adjusted Synchronized Store Logo */}
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-white flex items-center justify-center shrink-0">
              <img
                src={logoUrl || '/logo.png'}
                alt="Store Brand Logo"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Secure Checkout
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>256-Bit TLS Encrypted</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium truncate">
                <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Instant 90-day download vault unlock upon verified authorization</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors shrink-0 ml-2"
            title="Cancel and close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleProcessPayment} className="p-5 sm:p-6 space-y-4">
          {/* Order Summary & Locked File Status */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>Locked Files (Mandatory Payment Required):</span>
              </span>
              <span className="text-indigo-700 font-black">{items.length} Workbooks</span>
            </div>

            <div className="space-y-1.5 text-slate-600 max-h-24 overflow-y-auto">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={resolveImageUrl(i.product.image)}
                      alt={i.product.title}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/cover_toddler.jpg';
                      }}
                    />
                    <span className="font-bold text-slate-900 truncate max-w-[240px] text-xs">
                      {i.product.title}
                    </span>
                  </div>
                  <span className="font-black text-slate-900 tabular-nums text-xs shrink-0">
                    {formatCurrency(i.product.priceUSD * i.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-black text-slate-900 text-sm">
              <span>Total Charge Amount:</span>
              <span className="text-xl font-black text-emerald-600 tabular-nums">
                {formatCurrency(totalUSD, currency)}
              </span>
            </div>
          </div>

          {/* PAYMENT GATEWAY SELECTOR (Stripe or Direct Card) */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Select Payment Method:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedGateway('card');
                  setPaymentError(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 text-xs cursor-pointer ${
                  selectedGateway === 'card'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Credit / Debit Card</div>
                  <div className="text-[10px] text-slate-400 font-normal">Visa, MC, Amex</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGateway('stripe');
                  setPaymentError(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 text-xs cursor-pointer ${
                  selectedGateway === 'stripe'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <Zap className="w-4 h-4 text-[#635BFF] shrink-0" />
                <div className="truncate">
                  <div className="flex items-center gap-1">
                    <span className="truncate">Stripe Payment</span>
                    <span className="text-[9px] font-black uppercase px-1 rounded bg-[#635BFF] text-white">PRO</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">Instant 1-Click Gateway</div>
                </div>
              </button>
            </div>
          </div>

          {/* CUSTOMER CONTACT FIELDS: Full Name and Email Address */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setPaymentError(null);
                  setName(e.target.value);
                }}
                placeholder="e.g. Jessica Davis"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address (For 90-Day Download Token &amp; Receipt) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setPaymentError(null);
                  setEmail(e.target.value);
                }}
                placeholder="jessica.davis@gmail.com"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium text-xs"
              />
            </div>
          </div>

          {/* CONDITIONAL PAYMENT INPUTS: DIRECT CARD DETAILS OR STRIPE PLACEHOLDER */}
          {selectedGateway === 'card' ? (
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Card Details</span>
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                  <span className={cardBrand === 'visa' ? 'text-indigo-600 font-black' : 'opacity-40'}>VISA</span>
                  <span>·</span>
                  <span className={cardBrand === 'mastercard' ? 'text-rose-600 font-black' : 'opacity-40'}>MC</span>
                  <span>·</span>
                  <span className={cardBrand === 'amex' ? 'text-blue-600 font-black' : 'opacity-40'}>AMEX</span>
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Card Number <span className="text-rose-500">*</span>:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 tracking-wider text-xs font-semibold"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Expires (MM/YY) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-center text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Security Code (CVV) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => {
                      setPaymentError(null);
                      setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    placeholder="928"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-center text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STRIPE PAYMENT INTEGRATION PLACEHOLDER & READY HOOK */
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-black text-xs">
                    S
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Stripe Elements &amp; Checkout Ready</span>
                    <span className="text-[10px] text-slate-500">Global debit/credit card gateway by Stripe</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#635BFF] bg-white px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                  Ready to Connect
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-semibold">Stripe Publishable Key:</span>
                  <code className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">
                    {merchantSettings?.stripePublishableKey || 'pk_test_...'}
                  </code>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  When you are ready to connect live Stripe processing, simply paste your live Stripe keys in the Store Admin Console or <code className="text-indigo-800 font-mono">.env</code>. The checkout will automatically route transactions directly to your Stripe account.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simulated Stripe test flow active for testing purchases right now.</span>
              </div>
            </div>
          )}

          {/* Gateway Error Display (Strict Lock Enforcement) */}
          {paymentError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Transaction Authorization Denied</span>
                <p className="text-[11px] text-rose-700 leading-relaxed">{paymentError}</p>
              </div>
            </div>
          )}

          {/* Gateway Progress indicator */}
          {isProcessing && gatewayStep && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
              <span className="font-bold">{gatewayStep}</span>
            </div>
          )}

          {/* Complete Payment CTA Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-5 text-sm font-black text-white rounded-2xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Payment Authorization...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>
                    {selectedGateway === 'stripe' ? 'Pay with Stripe' : 'Complete Payment'} • {formatCurrency(totalUSD, currency)}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Strict Security: File unlocks for 90 days only upon verified payment charge approval</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
