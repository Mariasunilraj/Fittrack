import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings2 } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'fittrack_cookie_consent_v1';

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    timestamp: ''
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setShowBanner(true);
      } else {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      const updated = { ...prefs, timestamp: new Date().toISOString() };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
      setPreferences(updated);
      setShowBanner(false);
      setShowCustomizer(false);
    } catch {
      setShowBanner(false);
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString()
    });
  };

  const handleEssentialOnly = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString()
    });
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#10141d] border-t border-brand-border/90 px-3 py-2 sm:px-6 shadow-2xl safe-area-bottom max-h-[33dvh] overflow-y-auto animate-slideUp text-slate-100"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        {/* Concise 1-2 line text notice */}
        <div className="flex items-center gap-2 min-w-0">
          <Cookie className="w-4 h-4 text-brand-yellow flex-shrink-0" />
          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
            FitTrack PRO uses essential cookies for secure login and training records. Zero ad tracking.{' '}
            {onOpenPrivacyPolicy && (
              <button
                type="button"
                onClick={onOpenPrivacyPolicy}
                className="text-brand-yellow underline hover:text-white font-medium cursor-pointer"
              >
                Privacy Policy
              </button>
            )}
          </p>
          {/* Badge hidden on phones, visible on sm+ screens */}
          <span className="hidden sm:inline-flex text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            GDPR & CCPA
          </span>
        </div>

        {/* Compact 1-row button controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-auto">
          <button
            onClick={handleAcceptAll}
            className="py-1 px-3 rounded-lg bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-bold text-xs active:scale-95 transition cursor-pointer min-h-[34px] flex items-center justify-center shadow-sm"
          >
            Accept
          </button>
          <button
            onClick={handleEssentialOnly}
            className="py-1 px-2.5 rounded-lg bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-300 text-xs font-medium active:scale-95 transition cursor-pointer min-h-[34px] flex items-center justify-center"
          >
            Essential
          </button>
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="text-[11px] text-slate-400 hover:text-white underline px-1 py-1 cursor-pointer"
          >
            Customize
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 text-slate-500 hover:text-white cursor-pointer ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Collapsible customizer accordion */}
      {showCustomizer && (
        <div className="mt-2.5 pt-2.5 border-t border-brand-border/70 text-xs space-y-2 animate-fadeIn max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-brand-dark/80 border border-brand-border/80">
              <div className="flex items-center justify-between font-bold text-white text-[11px]">
                <span>Strictly Necessary</span>
                <span className="text-[9px] text-emerald-400 uppercase">Active</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Authentication & anti-CSRF tokens.</p>
            </div>

            <div className="p-2 rounded-lg bg-brand-dark/80 border border-brand-border/80">
              <div className="flex items-center justify-between font-bold text-white text-[11px]">
                <span>Functional</span>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={e => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                  className="rounded text-brand-yellow focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Workout rest timers & sound cues.</p>
            </div>

            <div className="p-2 rounded-lg bg-brand-dark/80 border border-brand-border/80">
              <div className="flex items-center justify-between font-bold text-white text-[11px]">
                <span>Analytics</span>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={e => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="rounded text-brand-yellow focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Anonymous crash reports. No PII.</p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => saveConsent(preferences)}
              className="py-1 px-3 rounded-lg bg-brand-yellow text-slate-950 font-bold text-xs cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
