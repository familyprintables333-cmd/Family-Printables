import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2, Share, PlusSquare } from 'lucide-react';
import { trackMonetizationEvent } from '../utils/monetization';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('fp_pwa_banner_dismissed') === 'true';
  });
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Detect if already installed standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for BeforeInstallPromptEvent (Chromium / Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      trackMonetizationEvent('app_install', 'PWA App Installed to Home Screen', 0.25, 'Native install completed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        trackMonetizationEvent('app_install', 'PWA Installed via Native Prompt', 0.25, 'User accepted install modal');
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Generic fallback instructions
      alert('To install: tap your browser menu (⋮ or ...) and select "Add to Home screen" or "Install App"');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('fp_pwa_banner_dismissed', 'true');
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Prominent Floating / Top PWA Install Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white px-4 py-2.5 shadow-md relative z-30 no-print border-b border-indigo-700/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-white flex items-center gap-1.5">
                <span>Install Family Printables App</span>
                <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Fast &amp; Offline
                </span>
              </div>
              <p className="text-[11px] text-indigo-200">
                Access timetables, workbooks &amp; greeting cards directly from your home screen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>📲 Install App / Add to Home Screen</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Dismiss for now"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm text-indigo-950">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>Install on iPhone or iPad</span>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block font-extrabold mb-0.5">Tap the Share Button</strong>
                  <span>Tap the <Share className="w-3.5 h-3.5 inline text-indigo-600" /> Share icon at the bottom of Safari.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block font-extrabold mb-0.5">Select "Add to Home Screen"</strong>
                  <span>Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600" /> <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSGuide(false);
                trackMonetizationEvent('app_install', 'iOS Safari PWA Add to Home Screen Guided', 0.25);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
