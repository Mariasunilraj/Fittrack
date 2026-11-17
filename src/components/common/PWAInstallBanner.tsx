import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if app is already running standalone as an installed PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return; // Already installed as PWA!
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('fittrack_pwa_dismissed');
    if (isDismissed) return;

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);

    if (isIosDevice && isSafari) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    // Listen for Android / Chrome / Edge install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('fittrack_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-16 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp">
      <div className="bg-brand-surface/98 backdrop-blur-xl border border-brand-yellow/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl text-slate-100 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow text-slate-950 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md shadow-brand-yellow/20">
              FT
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs text-white">Install FitTrack App</h4>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                  Fast & Offline
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Add to your home screen for full-screen workouts, instant load times, and offline logging.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-1 border-t border-brand-border/60">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-yellow/20 transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIOS ? 'How to Install on iPhone' : 'Install to Home Screen'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-300 text-xs font-semibold transition cursor-pointer active:scale-95"
          >
            Not Now
          </button>
        </div>

        {/* iOS Step-by-step Helper Sheet */}
        {showIOSGuide && isIOS && (
          <div className="p-3 rounded-xl bg-brand-dark/90 border border-brand-border space-y-2 text-xs animate-fadeIn">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-brand-yellow" />
              <span>2-Step iPhone Install:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span>1. Tap the Safari <strong>Share</strong> button</span>
                <Share className="w-3.5 h-3.5 text-sky-400 inline" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>2. Scroll down & tap <strong>Add to Home Screen</strong></span>
                <PlusSquare className="w-3.5 h-3.5 text-brand-yellow inline" />
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
