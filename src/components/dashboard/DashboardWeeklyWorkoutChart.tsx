import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Clock,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DashboardWeeklyWorkoutChart: React.FC = () => {
  const { setCurrentView } = useApp();

  // Weekly workout data across the 7 days with breakdown by discipline
  const weeklyWorkoutData = [
    {
      day: 'Mon',
      calisthenics: 45,
      taekwondo: 0,
      gym: 0,
      totalMinutes: 45,
      details: 'Calisthenics Pull-Up & Core Ladder (45m)'
    },
    {
      day: 'Tue',
      calisthenics: 0,
      taekwondo: 0,
      gym: 55,
      totalMinutes: 55,
      details: 'Gym Barbell Squat & Deadlift Power (55m)'
    },
    {
      day: 'Wed',
      calisthenics: 30,
      taekwondo: 0,
      gym: 0,
      totalMinutes: 30,
      details: 'Calisthenics Push & Mobility Flow (30m)'
    },
    {
      day: 'Thu',
      calisthenics: 0,
      taekwondo: 60,
      gym: 0,
      totalMinutes: 60,
      details: 'Taekwondo Poomsae & Dollyo Chagi (60m)'
    },
    {
      day: 'Fri',
      calisthenics: 45,
      taekwondo: 0,
      gym: 0,
      totalMinutes: 45,
      details: 'Calisthenics Dips & Muscle Progressions (45m)'
    },
    {
      day: 'Sat',
      calisthenics: 0,
      taekwondo: 0,
      gym: 60,
      totalMinutes: 60,
      details: 'Gym Upper Body Hypertrophy (60m)'
    },
    {
      day: 'Sun',
      calisthenics: 0,
      taekwondo: 0,
      gym: 0,
      totalMinutes: 0,
      details: 'Active Rest Day & Joint Mobility'
    }
  ];

  const totalWeeklyMinutes = weeklyWorkoutData.reduce((acc, d) => acc + d.totalMinutes, 0);
  const targetWeeklyMinutes = 250;
  const calisMinutes = weeklyWorkoutData.reduce((acc, d) => acc + d.calisthenics, 0);
  const tkdMinutes = weeklyWorkoutData.reduce((acc, d) => acc + d.taekwondo, 0);
  const gymMinutes = weeklyWorkoutData.reduce((acc, d) => acc + d.gym, 0);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
              Weekly Consistency Tracker
            </span>
            <span className="text-xs text-slate-400">Monday to Sunday Breakdown</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-yellow" />
            <span>Workouts Done in the Whole Week (Duration & Splits)</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Active Volume</span>
            <div className="text-xl sm:text-2xl font-black text-brand-yellow font-mono">
              {totalWeeklyMinutes}{' '}
              <span className="text-xs text-slate-400 font-normal">/ {targetWeeklyMinutes} mins</span>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Target Met 🎉
          </span>
        </div>
      </div>

      {/* Discipline Breakdown Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 rounded-xl bg-brand-dark/70 border border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#e2f163]" />
            <span className="font-semibold text-slate-300">Calisthenics:</span>
          </div>
          <span className="font-mono font-bold text-white text-xs">{calisMinutes} mins</span>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-brand-dark/70 border border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]" />
            <span className="font-semibold text-slate-300">Taekwondo:</span>
          </div>
          <span className="font-mono font-bold text-white text-xs">{tkdMinutes} mins</span>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-brand-dark/70 border border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]" />
            <span className="font-semibold text-slate-300">Gym & Lifts:</span>
          </div>
          <span className="font-mono font-bold text-white text-xs">{gymMinutes} mins</span>
        </div>
      </div>

      {/* Main Weekly Stacked Bar Graph */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyWorkoutData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252e3e" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="m" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141821',
                borderColor: '#252e3e',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any) => [
                `${value} minutes`,
                name === 'calisthenics' ? 'Calisthenics' : name === 'taekwondo' ? 'Taekwondo' : 'Gym Resistance'
              ]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return `${label} — ${item?.details || 'Rest'}`;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-slate-300 font-medium capitalize">
                  {value === 'calisthenics' ? 'Calisthenics' : value === 'taekwondo' ? 'Taekwondo' : 'Gym Resistance'}
                </span>
              )}
            />
            <Bar dataKey="calisthenics" name="calisthenics" stackId="a" fill="#e2f163" radius={[0, 0, 0, 0]} />
            <Bar dataKey="taekwondo" name="taekwondo" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="gym" name="gym" stackId="a" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Notes */}
      <div className="pt-3 border-t border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-yellow" />
          <span>
            Consistency Score:{' '}
            <strong className="text-emerald-400 font-bold">6/7 Days Trained (86%)</strong>
          </span>
        </div>

        <button
          onClick={() => setCurrentView('progress')}
          className="text-brand-yellow font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>View Detailed PRs & Analytics</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
