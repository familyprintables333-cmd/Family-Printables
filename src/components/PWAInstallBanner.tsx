import React, { useState } from 'react';
import { DownloadCloud, Smartphone, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed as standalone or dismissed, hide banner
  if (isInstalled || dismissed) {
    return null;
  }

  // Android / Chrome flow
  if (isInstallable) {
    return (
      <aside aria-label="Install App Banner" className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold">Install Family Printables App</span>
              <span className="hidden sm:inline text-indigo-200 ml-1.5">
                · Fast 1-tap home-screen access &amp; offline downloads
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={install}
              className="px-3.5 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-lg shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-white/70 hover:text-white rounded-md"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <aside aria-label="iOS Install Banner" className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white px-4 py-2.5 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold">Add to iPhone / iPad Home Screen</span>
                <span className="hidden sm:inline text-indigo-200 ml-1.5">
                  · Operates smoothly like a native iOS app
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-3.5 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-lg shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Add to Home</span>
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="p-1 text-white/70 hover:text-white rounded-md"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  <span>Install on iPhone / iPad</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share button</strong> (<Share2 className="w-3.5 h-3.5 inline text-indigo-600" />) in your Safari toolbar at the bottom.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-indigo-600" />).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top right corner. Family Printables will launch like a native app with offline support!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
