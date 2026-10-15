import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Mail, Printer, ShieldCheck, X, Clock } from 'lucide-react';
import { Order } from '../types';
import { formatCurrency } from '../utils/currency';
import { resolveImageUrl } from '../assets/images';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  currency: string;
  logoUrl?: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  currency,
  logoUrl = '/logo.png'
}) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'email'>('downloads');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [order]);

  if (!order) return null;

  const handleDownloadFile = (fileName: string, title: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      const content = `==========================================================\nFAMILY PRINTABLES - OFFICIAL DIGITAL DELIVERABLE\n==========================================================\nOrder ID: ${order.id}\nCustomer: ${order.customerName} (${order.customerEmail})\nProduct: ${title}\nLicense: Personal, Family & Homeschool Use\nPaper Format: US Letter (8.5" x 11") Standard & International A4\nResolution: 300 DPI Print-Ready\n\nPRINTING INSTRUCTIONS:\n1. Open file in free Adobe Acrobat Reader or web browser.\n2. In Print Dialog, select "Actual Size" (Do not scale or shrink).\n3. Recommended Paper: 28lb or 32lb Bright White Paper, or 65lb Cardstock.\n4. For reusable charts, laminate with 3mil or 5mil pouch and use fine-tip dry erase markers.\n\nThank you for supporting Family Printables!\nCustomer Care: 24/7 AI Instant Support Desk & Download Vault (Online)\n==========================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_US_Letter.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setDownloadingFile(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-md border border-white/40 p-0.5 flex items-center justify-center shrink-0">
              <img
                src={logoUrl || '/logo.png'}
                alt="Brand Logo"
                onError={(e) => {
                  e.currentTarget.src = '/icon.svg';
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Order Confirmed! Your Files Are Ready
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Order #{order.id} · Files delivered to {order.customerEmail}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-semibold gap-4">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'downloads'
                ? 'border-indigo-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Instant Download Center</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'email'
                ? 'border-indigo-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Customer Automated Email Receipt</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'downloads' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800 uppercase tracking-wider">
                  Purchased Digital Workbooks:
                </span>
                <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  Token: {order.downloadToken}
                </span>
              </div>

              {/* Download Item Cards */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(item.product.image)}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = '/icon.svg';
                        }}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.product.pages} Pages · {item.product.fileSize} · High-Res 300 DPI
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDownloadFile('letter_pdf', item.product.title)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>US Letter (8.5x11")</span>
                      </button>

                      <button
                        onClick={() => handleDownloadFile('a4_pdf', item.product.title)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>A4 PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Printing Advice Box */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Printer className="w-4 h-4 text-amber-600" />
                  <span>Printing &amp; Paper Recommendations:</span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  1. Select "Actual Size" or 100% in print options. 2. For best results, use 28lb to 32lb bright white paper or 65lb cardstock. 3. Routine boards can be laminated or placed in an 8.5x11" frame for reusable dry-erase practice.
                </p>
              </div>
            </div>
          ) : (
            /* Automated Customer Email Tab */
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 font-sans text-xs">
                {/* Email Header */}
                <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      Subject: Your Family Printables Order #{order.id} is Ready!
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      From: orders@familyprintables.com · To: {order.customerEmail}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    AUTOMATED 24/7
                  </span>
                </div>

                {/* Email Body */}
                <div className="space-y-3 text-slate-700 leading-relaxed">
                  <p>Hi <strong>{order.customerName}</strong>,</p>
                  <p>
                    Thank you for your order with <strong>Family Printables</strong>! Your printable files are ready for immediate download and saved to your account library.
                  </p>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs">Order Summary:</div>
                    {order.items.map((i) => (
                      <div key={i.product.id} className="flex justify-between text-[11px]">
                        <span>{i.product.title}</span>
                        <span className="font-bold tabular-nums">{formatCurrency(i.product.priceUSD * i.quantity, currency)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-xs">
                      <span>Total Paid:</span>
                      <span className="tabular-nums">{formatCurrency(order.totalUSD, currency)} (Via {order.paymentMethod.toUpperCase()})</span>
                    </div>
                  </div>

                  <p className="font-medium">
                    Click below to open your personal 90-day download vault:
                  </p>

                  <div className="text-center py-2">
                    <button
                      onClick={() => setActiveTab('downloads')}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-indigo-700"
                    >
                      Access Your Instant Download Vault
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Download link expires in 90 days (3 months) · Saved in My Downloads</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};
