import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  Building2, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'refund';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Legal Compliance &amp; Store Policies</h2>
              <p className="text-xs text-slate-500">Family Printables LLC · Effective as of 2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-white border-b border-slate-200/70 flex gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'refund'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refund &amp; Download Policy</span>
          </button>
        </div>

        {/* Policy Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-indigo-900">
                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Privacy Summary: We Respect Your Family's Data</span>
                </h4>
                <p className="text-xs text-indigo-700">
                  Family Printables does not sell or lease personal data. We only process email addresses for sending instant digital PDF download receipts and maintaining your 90-day download vault.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. Information We Collect</h3>
                <p>
                  When you purchase educational printables or register a vault account, we collect your name, email address, and order transaction details. Payment details (card numbers, Apple Pay tokens) are processed securely through Level 1 PCI-compliant payment gateways (such as Stripe or Payoneer) and never stored on our servers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">2. How We Use Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To generate personalized, high-resolution PDF download links and licenses.</li>
                  <li>To provide 90-day device access and re-print recovery in your downloads vault.</li>
                  <li>To provide automated AI customer assistance and answer educational questions.</li>
                  <li>To prevent unauthorized commercial re-distribution of copyrighted materials.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">3. Children's Online Privacy Protection (COPPA)</h3>
                <p>
                  Our services and workbooks are intended for purchase by parents, legal guardians, homeschool educators, and teachers. We do not intentionally solicit or collect personally identifiable information from children under 13.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">4. Contact &amp; Data Officer</h3>
                <p>
                  For data inquiries or account deletion requests, reach our compliance team at:
                  <br />
                  <strong className="text-slate-800">Family Printables LLC</strong>
                  <br />
                  123 Learning Way, Suite 400, Dover, DE 19901, USA
                </p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800">
                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>Personal &amp; Classroom Educational License</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Every purchase grants an unlimited personal home or single-classroom license to print and reuse the digital files for educational purposes.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. Permitted Uses</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Printing unlimited copies for your immediate children or classroom students.</li>
                  <li>Laminating workbooks for repeated dry-erase use.</li>
                  <li>Re-downloading clean copies from your vault within your 90-day access window.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">2. Prohibited Uses</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Re-selling, distributing, sub-licensing, or uploading raw PDF files to file-sharing clouds or torrent networks.</li>
                  <li>Claiming artwork, illustrations, or workbook design as your own creation.</li>
                  <li>Modifying or extracting individual graphics for commercial merchandise without a commercial license.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">3. Governing Law</h3>
                <p>
                  These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-950">
                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Happiness &amp; Print Clarity Guarantee</span>
                </h4>
                <p className="text-xs text-emerald-800">
                  Because digital items are delivered instantly, standard physical return shipping does not apply. However, if you experience formatting errors or corrupt files, our support desk will replace them or issue a refund.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. 90-Day Download Access</h3>
                <p>
                  Every purchase grants an active 90-day download window. Your files are backed up in your local device vault, allowing you to re-download fresh clean copies anytime across multiple devices without paying again.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">2. Refund Conditions</h3>
                <p>We gladly issue prompt refunds or file replacements if:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The digital PDF file cannot be opened or exhibits corrupted font rendering.</li>
                  <li>Duplicate transactions occurred due to payment network timeouts.</li>
                  <li>You contact our 24/7 AI or human support desk within 14 days of purchase.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">3. Support Assistance</h3>
                <p>
                  For immediate support with downloads or printer settings (A4 vs US Letter fit-to-page margins), use the 24/7 AI Support Desk button on any page.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Official Store Policies · Family Printables
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
