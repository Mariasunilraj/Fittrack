import React from 'react';
import { ShieldCheck, Lock, FileText, Cookie } from 'lucide-react';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenCookiePreferences: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyPolicy,
  onOpenCookiePreferences
}) => {
  return (
    <footer className="w-full border-t border-brand-border/60 bg-brand-surface/60 backdrop-blur-sm py-6 px-4 mt-auto text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Encryption Notice */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center font-black text-[10px]">
            FT
          </div>
          <div>
            <span className="font-bold text-white">FitTrack PRO</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>TLS 1.3 / HTTPS Enforced</span>
            </span>
          </div>
        </div>

        {/* Center: Legal & Privacy Links (Touch targets 44px min height) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="hover:text-brand-yellow transition cursor-pointer flex items-center gap-1.5 py-2 px-1 min-h-[44px] active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Privacy Policy</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={onOpenCookiePreferences}
            className="hover:text-brand-yellow transition cursor-pointer flex items-center gap-1.5 py-2 px-1 min-h-[44px] active:scale-95"
          >
            <Cookie className="w-3.5 h-3.5 text-amber-400" />
            <span>Cookie Preferences</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="hover:text-brand-yellow transition cursor-pointer flex items-center gap-1.5 py-2 px-1 min-h-[44px] active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>User Data Rights</span>
          </button>
        </div>

        {/* Right: Copyright & Data Minimization Badge */}
        <div className="text-[11px] text-slate-400 text-center sm:text-right">
          <span>Data Minimization • Zero Third-Party Ad Trackers</span>
        </div>
      </div>
    </footer>
  );
};
