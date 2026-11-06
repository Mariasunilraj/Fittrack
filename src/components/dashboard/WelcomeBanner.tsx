import React from 'react';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WelcomeBanner: React.FC = () => {
  const { profile, workoutPlans, startWorkout, setCurrentView } = useApp();
  const todayWorkout = workoutPlans[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-surface via-brand-card to-[#1d2533] border border-brand-border p-5 sm:p-7 shadow-xl">
      {/* Decorative accent glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Age Band: {profile.ageBand} • {profile.experienceLevel} Tier</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-brand-yellow">{profile.displayName}</span>!
          </h1>

          <p className="text-sm text-slate-400 max-w-xl">
            Today is focused on balanced functional power. You have <strong className="text-slate-200">1 session scheduled</strong> with Indian nutrition and recovery tracking active.
          </p>
        </div>

        {todayWorkout && (
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => startWorkout(todayWorkout)}
              className="py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Start Today's Workout</span>
            </button>
            <button
              onClick={() => setCurrentView('ai-coach')}
              className="py-3 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-200 text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Ask AI Coach</span>
              <ArrowRight className="w-4 h-4 text-brand-yellow" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
