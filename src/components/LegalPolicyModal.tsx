import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RotateCcw, CheckCircle2, Lock, AlertCircle, Building2, Mail, ExternalLink } from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'refund';

interface LegalPolicyModalProps {
  isOpen: boolean;
  initialTab?: PolicyTab;
  onClose: () => void;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  // Sync initial tab when opened
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-black text-slate-900 tracking-tight">
                Family Printables Legal &amp; Store Policies
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Official Digital Store Guidelines • Effective Date: January 1, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
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
            className={`py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
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
            className={`py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'refund'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refund &amp; Return Policy</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* ---------------- PRIVACY POLICY ---------------- */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3 text-indigo-900">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-bold">Your Privacy is Protected</p>
                  <p className="text-indigo-800/90 text-xs">
                    Family Printables Publishing LLC adheres to stringent consumer privacy protections (including GDPR, CCPA, and COPPA). We never sell, rent, or trade your personal data.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. Data Controller &amp; Scope</h3>
                <p>
                  This Privacy Policy applies to all services, downloadable printables, routine builders, and transactions provided by <strong>Family Printables Publishing LLC</strong> ("we," "us," or "our"), with business headquarters located at <strong>123 Learning Way, Suite 400, Dover, DE 19901, USA</strong>.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. Information We Collect</h3>
                <p>We collect only the minimum information necessary to deliver your digital purchases and maintain access to your personal downloads vault:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Account &amp; Order Identifiers:</strong> Name and email address provided during checkout or account registration to transmit printable deliverables, purchase receipts, and unlock keys.</li>
                  <li><strong>Transaction Records:</strong> Order timestamp, purchased workbook IDs, amount paid, and invoice identifiers. <em>Note: All credit card processing is handled by encrypted PCI-DSS Level 1 compliant processors (Stripe). We never receive or store full card numbers.</em></li>
                  <li><strong>Local Vault Access:</strong> Browser local storage (`localStorage`) used exclusively on your client device to maintain your 90-day download access window without tracking your activity across third-party websites.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. Children’s Online Privacy Protection Act (COPPA)</h3>
                <p>
                  Our workbooks and learning printables are crafted for children's educational development; however, <strong>all store transactions, account creations, and customer communications must be conducted solely by parents, legal guardians, or educators aged 18 or older</strong>. We do not knowingly solicit or collect personal information directly from children under 13.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">4. Data Sharing &amp; Third Parties</h3>
                <p>
                  We do not sell, license, or monetize customer data to advertising brokers. Data is shared exclusively with critical infrastructure partners under strict confidentiality:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Payment Gateways:</strong> Stripe for secure, tokenized payment settlement.</li>
                  <li><strong>Hosting &amp; CDN:</strong> Netlify and cloud infrastructure for fast, global delivery of digital PDF deliverables.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">5. Your Legal Rights (GDPR &amp; CCPA)</h3>
                <p>
                  Depending on your jurisdiction, you have the right to request access to the personal data we hold about you, request rectification of erroneous records, or request complete erasure of your customer profile. Contact our 24/7 AI Instant Support Desk or corporate office to submit a verifiable data privacy request.
                </p>
              </section>
            </div>
          )}

          {/* ---------------- TERMS OF SERVICE ---------------- */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-900">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-bold">Digital Delivery Notice</p>
                  <p className="text-emerald-800/90 text-xs">
                    All items sold in this digital store are instant, downloadable electronic files (PDF, MP3, PNG). No physical paper, books, or dry-erase sleeves are shipped via postal mail.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h3>
                <p>
                  By browsing, purchasing, or downloading content from Family Printables, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not access our digital store or services.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. License Grant &amp; Permitted Uses</h3>
                <p>
                  Upon confirmed payment, Family Printables Publishing LLC grants you a perpetual, non-exclusive, non-transferable license to download and print the purchased materials subject to the following terms:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Permitted Uses:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Printing unlimited copies for your own household children.</li>
                      <li>Printing copies for a single physical classroom or homeschool co-op.</li>
                      <li>Laminating pages for repeated dry-erase marker practice.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-rose-700 flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Strictly Prohibited:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Reselling or redistributing original or modified digital PDF files.</li>
                      <li>Uploading files to Amazon KDP, Etsy, Creative Fabrica, or file shares.</li>
                      <li>Extracting individual vector graphics, clip art, or mascot illustrations.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. 90-Day Download Access Policy</h3>
                <p>
                  Purchased digital files remain unlocked in your device's <strong>My Downloads Vault</strong> for a period of <strong>90 days (3 months)</strong> following purchase. Customers are strongly encouraged to download and save permanent backup copies to their local computer, tablet, or external drive immediately following checkout.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">4. Intellectual Property &amp; Copyright</h3>
                <p>
                  All educational curricula, puzzle layouts, illustrations, audio narrations, character designs, and digital code are the sole intellectual property of Family Printables Publishing LLC and protected by United States and international copyright treaties. All rights not expressly granted herein are reserved.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">5. Limitation of Liability</h3>
                <p>
                  Our printables are educational support materials and are provided "as-is" without warranties of any specific academic outcome. In no event shall Family Printables Publishing LLC be liable for any indirect, incidental, or consequential damages.
                </p>
              </section>
            </div>
          )}

          {/* ---------------- REFUND POLICY ---------------- */}
          {activeTab === 'refund' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-start gap-3 text-amber-900">
                <RotateCcw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-bold">Digital Goods Refund Standard</p>
                  <p className="text-amber-800/90 text-xs">
                    Because our digital printables and workbooks are delivered immediately upon order completion and cannot be physically returned, standard return policies for physical goods do not apply. However, we stand behind the quality of our educational content with our 30-Day Defective File &amp; Satisfaction Guarantee.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. Instant Download Nature</h3>
                <p>
                  Under United States commercial law and European Union consumer regulations, digital downloads that have begun download or deliver access with customer consent are generally exempt from statutory right of withdrawal. Once an unlock key is issued, the digital deliverable is considered fulfilled.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. Our 30-Day Technical &amp; Quality Guarantee</h3>
                <p>We will gladly issue a <strong>100% full refund or replacement</strong> within 30 days of purchase under the following circumstances:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>Corrupted or Defective Files:</strong> If a downloaded PDF or audio file cannot be opened, has unreadable text, or contains corrupted pages that our support team cannot rectify.</li>
                  <li><strong>Accidental Duplicate Purchases:</strong> If you accidentally purchased the exact same printable twice within a 24-hour period.</li>
                  <li><strong>Material Description Discrepancy:</strong> If the delivered printable significantly deviates from the preview pages and product specifications listed in the store catalog.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. Non-Refundable Circumstances</h3>
                <p>Refunds cannot be granted for:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Purchaser remorse or change of mind after successful file download.</li>
                  <li>Customer hardware printer malfunctions, low home printer ink levels, or personal device paper feeding issues.</li>
                  <li>Claims submitted beyond the 30-day purchase window.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">4. How to Request a Refund</h3>
                <p>
                  To request assistance or a refund, open our <strong>24/7 AI Support Desk</strong> or contact our administrative office with your Order ID (e.g., <code>ORD-...</code>), purchase email address, and a brief explanation of the technical issue. Valid refund requests are processed within 1–3 business days directly to the original payment method.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Family Printables Publishing LLC • Dover, Delaware, USA</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold transition shadow-sm"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
