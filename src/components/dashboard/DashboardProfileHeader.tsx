import React from 'react';
import { User, Calendar, Edit3, Sparkles, Shield, Award, Target, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardProfileHeader: React.FC = () => {
  const { profile, setShowOnboarding, setCurrentView } = useApp();

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-surface via-brand-card to-[#192231] border border-brand-border p-5 sm:p-7 shadow-2xl">
      {/* Decorative accent glow */}
      <div className="absolute -right-20 -top-20 w-56 h-56 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: User Avatar, Name, Age, and Meta */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-yellow via-amber-400 to-brand-yellow text-slate-950 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl shadow-brand-yellow/20 border-2 border-brand-yellow/40">
              {profile.displayName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-slate-950 border border-brand-yellow/50 text-[10px] font-black text-brand-yellow uppercase tracking-wider">
              PRO
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.displayName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-black">
                Age: {profile.ageBand}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="capitalize font-semibold text-slate-200">
                Tier: <strong className="text-brand-yellow">{profile.experienceLevel}</strong>
              </span>
              <span>•</span>
              <span className="capitalize text-slate-300">
                Diet: <strong className="text-emerald-400">{profile.foodPreference}</strong>
              </span>
              <span>•</span>
              <span className="capitalize text-slate-300">
                Region: <strong className="text-amber-400">{profile.region}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{todayDateFormatted}</span>
              <span>•</span>
              <span className="text-slate-400 truncate max-w-xs">
                Goal: {profile.primaryGoals[0] || 'Build Functional Strength & Hybrid Mastery'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => setShowOnboarding(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-xs font-bold text-slate-200 flex items-center gap-1.5 transition cursor-pointer hover:border-slate-500 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setCurrentView('ai-coach')}
            className="py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
