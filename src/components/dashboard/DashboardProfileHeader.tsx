import React from 'react';
import { Calendar, Edit3, Target, Utensils, Globe, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardProfileHeader: React.FC = () => {
  const { profile, setShowOnboarding } = useApp();

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-2">
      {/* Date & Overview Strip (Moved outside profile card to keep card compact) */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#ccff00]" />
          <span>{todayDateFormatted}</span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">Active Training Protocol</span>
      </div>

      {/* Sleek Compact Profile Card: Shows weight chart above the fold */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-surface via-brand-card to-[#192231] border border-brand-border p-3.5 sm:p-4.5 shadow-xl">
        {/* Subtle accent glow */}
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          {/* Avatar & Athlete Meta */}
          <div className="flex items-start sm:items-center gap-3">
            {/* Shrunk Avatar with single header PRO brand presence */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-tr from-[#ccff00] via-amber-400 to-[#ccff00] text-slate-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shadow-[#ccff00]/20 border border-[#ccff00]/40 flex-shrink-0">
              {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  {profile.displayName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold">
                  Age: {profile.ageBand}
                </span>
              </div>

              {/* Chips that cleanly wrap without clipping on phone screens */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded-lg bg-brand-dark/90 border border-brand-border text-slate-200 capitalize font-medium flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#ccff00]" />
                  <span>Tier: <strong className="text-[#ccff00] font-bold">{profile.experienceLevel}</strong></span>
                </span>

                <span className="px-2 py-0.5 rounded-lg bg-brand-dark/90 border border-brand-border text-slate-200 capitalize font-medium flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-emerald-400" />
                  <span>Diet: <strong className="text-emerald-400 font-bold">{profile.foodPreference}</strong></span>
                </span>

                <span className="px-2 py-0.5 rounded-lg bg-brand-dark/90 border border-brand-border text-slate-200 capitalize font-medium flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>Region: <strong className="text-cyan-400 font-bold">{profile.region}</strong></span>
                </span>
              </div>

              {/* Goal: Clean wrapping, no clipping or truncation */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-0.5">
                <Target className="w-3.5 h-3.5 text-[#ccff00] flex-shrink-0" />
                <span className="font-medium text-slate-300">
                  Goal: <strong className="text-white font-semibold">{profile.primaryGoals[0] || 'Build Functional Strength & Hybrid Mastery'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Action */}
          <div className="w-full sm:w-auto flex items-center justify-end flex-shrink-0 pt-1 sm:pt-0">
            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full sm:w-auto min-h-[44px] py-2 px-3.5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border hover:border-slate-500 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
