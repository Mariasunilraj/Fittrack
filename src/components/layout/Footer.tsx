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
    <footer className="w-full border-t border-brand-border/60 bg-brand-surface/70 backdrop-blur-sm py-2.5 sm:py-3.5 px-3 sm:px-6 mt-auto text-[11px] text-slate-400 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & Small Encryption Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center font-black text-[9px]">
            FT
          </div>
          <span className="font-bold text-slate-300">FitTrack PRO</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono">
            <Lock className="w-2.5 h-2.5" />
            <span>TLS 1.3</span>
          </span>
        </div>

        {/* Center: Legal & Privacy Links */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px]">
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="hover:text-brand-yellow transition cursor-pointer flex items-center gap-1 py-1 active:scale-95"
          >
            <ShieldCheck className="w-3 h-3 text-brand-yellow" />
            <span>Privacy Policy</span>
          </button>

          <span className="text-slate-600">•</span>

          <button
            type="button"
            onClick={onOpenCookiePreferences}
            className="hover:text-brand-yellow transition cursor-pointer flex items-center gap-1 py-1 active:scale-95"
          >
            <Cookie className="w-3 h-3 text-amber-400" />
            <span>Cookie Preferences</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="hidden sm:inline-flex hover:text-brand-yellow transition cursor-pointer items-center gap-1 py-1 active:scale-95"
          >
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>Data Rights</span>
          </button>
        </div>

        {/* Right: Data Minimization */}
        <div className="hidden sm:block text-[10px] text-slate-500">
          Zero Ad Trackers • Encrypted Data
        </div>
      </div>
    </footer>
  );
};
