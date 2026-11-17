import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, X, Settings2 } from 'lucide-react';

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
    } catch (e) {
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
    <aside aria-label="Privacy and Cookie Consent" className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-5 pointer-events-none animate-slideUp">
      <div className="max-w-3xl mx-auto bg-brand-surface/98 backdrop-blur-xl border border-brand-yellow/30 rounded-2xl p-4 sm:p-5 shadow-2xl pointer-events-auto text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 text-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-yellow/20">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">Privacy & Cookie Consent</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  GDPR & CCPA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                FitTrack PRO stores strictly necessary session and authentication state locally to run your training logs and calorie tracking. We never sell personal data or use third-party advertising trackers.
              </p>
              {onOpenPrivacyPolicy && (
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-xs text-brand-yellow hover:underline font-bold inline-block pt-1 cursor-pointer"
                >
                  Read our full Privacy Policy & Data Retention terms →
                </button>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-stretch gap-2 flex-shrink-0">
            <button
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-brand-yellow/20 text-center"
            >
              Accept All
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-300 text-xs font-bold transition cursor-pointer text-center"
            >
              Essential Only
            </button>
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="py-1.5 px-2 text-[11px] text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Settings2 className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Detailed Preferences Accordion */}
        {showCustomizer && (
          <div className="mt-4 pt-4 border-t border-brand-border space-y-3 animate-fadeIn text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-brand-dark/80 border border-brand-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Strictly Necessary</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Always Active</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Required for user authentication, account security, and anti-CSRF protection.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-brand-dark/80 border border-brand-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Functional</span>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={e => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                    className="rounded border-brand-border text-brand-yellow focus:ring-0 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Stores workout rest timers, audio cues, and display preferences.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-brand-dark/80 border border-brand-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Performance Analytics</span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={e => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="rounded border-brand-border text-brand-yellow focus:ring-0 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Anonymous aggregate app performance and crash telemetry. No PII.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => saveConsent(preferences)}
                className="py-1.5 px-4 rounded-xl bg-brand-yellow text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Save My Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
