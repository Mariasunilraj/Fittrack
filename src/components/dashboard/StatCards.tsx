import React from 'react';
import { Flame, Clock, Droplets, BatteryCharging, Trophy, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StatCards: React.FC = () => {
  const { waterLog, recoveryLogs, personalRecords, setCurrentView } = useApp();
  const latestRecovery = recoveryLogs[0] || { sleepHours: 7.5, sorenessRating: 3, energyRating: 8 };
  const latestPR = personalRecords[0];

  // Calculate water percentage
  const waterPct = Math.min(100, Math.round((waterLog.amountMl / (waterLog.targetMl || 3000)) * 100));

  // Recovery score from 1-100 based on sleep & energy
  const recoveryScore = Math.min(100, Math.round(((latestRecovery.sleepHours / 8) * 50) + (latestRecovery.energyRating * 5)));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Active Minutes */}
      <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Weekly Activity</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">185 <span className="text-sm font-normal text-slate-400">mins</span></div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span>↑ 18%</span>
            <span className="text-slate-500 font-normal">vs last week</span>
          </p>
        </div>
      </div>

      {/* 2. Hydration */}
      <div
        onClick={() => setCurrentView('nutrition')}
        className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition group"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Hydration</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {(waterLog.amountMl / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">/ {(waterLog.targetMl / 1000).toFixed(1)}L</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${waterPct}%` }} />
          </div>
        </div>
      </div>

      {/* 3. Recovery Readiness */}
      <div
        onClick={() => setCurrentView('progress')}
        className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition group"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Recovery Status</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
            <BatteryCharging className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
            {recoveryScore}%
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {latestRecovery.sleepHours}h sleep • Soreness: {latestRecovery.sorenessRating}/10
          </p>
        </div>
      </div>

      {/* 4. Top Personal Record */}
      <div
        onClick={() => setCurrentView('progress')}
        className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between cursor-pointer hover:border-brand-yellow/50 transition group"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Recent Milestone</span>
          <div className="p-2 rounded-xl bg-brand-yellow/10 text-brand-yellow group-hover:scale-110 transition">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-black text-brand-yellow tracking-tight truncate">
            {latestPR ? latestPR.value : '14 Reps'}
          </div>
          <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
            {latestPR ? latestPR.exerciseName : 'Strict Pull-Ups'}
          </p>
        </div>
      </div>
    </div>
  );
};
