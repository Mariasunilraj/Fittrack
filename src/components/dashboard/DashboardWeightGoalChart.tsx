import React, { useState } from 'react';
import {
  Scale,
  TrendingDown,
  Target,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DashboardWeightGoalChart: React.FC = () => {
  const { profile, updateProfile, showToast } = useApp();
  const [showLogInput, setShowLogInput] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(String(profile.currentWeightKg));

  const currentWeight = profile.currentWeightKg || 73.5;
  const targetWeight = profile.targetWeightKg || 71.0;
  const weightDifference = Number((currentWeight - targetWeight).toFixed(1));

  // Dynamic historical weight points leading up to current and projecting to target
  const weightData = [
    { date: 'Oct 08', weight: 75.0, target: targetWeight },
    { date: 'Oct 15', weight: 74.6, target: targetWeight },
    { date: 'Oct 22', weight: 74.2, target: targetWeight },
    { date: 'Oct 29', weight: 73.8, target: targetWeight },
    { date: 'Today', weight: currentWeight, target: targetWeight },
    { date: 'Goal Target', weight: targetWeight, target: targetWeight }
  ];

  const handleUpdateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (isNaN(val) || val <= 30 || val >= 300) {
      showToast('Please enter a valid weight between 30kg and 300kg.');
      return;
    }
    updateProfile({
      ...profile,
      currentWeightKg: val
    });
    setShowLogInput(false);
    showToast(`Current weight updated to ${val} kg!`);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-xl space-y-4">
      {/* Top Header: Current Weight vs Goal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
              Trajectory & Goal
            </span>
            <span className="text-xs text-slate-400">Body Composition Analytics</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-yellow" />
            <span>Current Weight vs Target Goal</span>
          </h2>
        </div>

        {/* Current vs Target Value Badges */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="p-2.5 px-3.5 rounded-xl bg-brand-card border border-brand-border text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Weight
            </span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {currentWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
            </div>
          </div>

          <div className="p-2.5 px-3.5 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-yellow block">
              Target to Achieve
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-yellow font-mono mt-0.5">
              {targetWeight} <span className="text-xs text-brand-yellow/80 font-normal">kg</span>
            </div>
          </div>

          <button
            onClick={() => setShowLogInput(!showLogInput)}
            className="col-span-2 sm:col-auto p-2.5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
            title="Log new weigh-in"
          >
            <Plus className="w-4 h-4 text-brand-yellow" />
            <span>Log Weigh-in</span>
          </button>
        </div>
      </div>

      {/* Quick Weight Log Inline Form */}
      {showLogInput && (
        <form onSubmit={handleUpdateWeight} className="p-3 rounded-xl bg-brand-dark/90 border border-brand-yellow/30 flex items-center gap-3 animate-fadeIn">
          <span className="text-xs text-slate-300 font-medium">Log Today's Weigh-in:</span>
          <input
            type="number"
            step="0.1"
            value={newWeightInput}
            onChange={e => setNewWeightInput(e.target.value)}
            className="w-24 px-3 py-1.5 bg-brand-card border border-brand-border rounded-lg text-white font-mono text-sm text-center focus:outline-none focus:border-brand-yellow"
          />
          <span className="text-xs text-slate-400">kg</span>
          <button
            type="submit"
            className="py-1.5 px-4 bg-brand-yellow text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm hover:bg-brand-yellowDark"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setShowLogInput(false)}
            className="text-xs text-slate-400 hover:text-white ml-auto"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Graph */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weightData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e2f163" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#e2f163" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252e3e" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              domain={[Math.floor(targetWeight - 2), Math.ceil(currentWeight + 2)]}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              unit=" kg"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141821',
                borderColor: '#252e3e',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px'
              }}
              formatter={(val: any) => [`${val} kg`, 'Body Weight']}
            />
            <ReferenceLine
              y={targetWeight}
              stroke="#e2f163"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `Target Goal: ${targetWeight} kg`,
                fill: '#e2f163',
                fontSize: 11,
                position: 'insideBottomRight'
              }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#e2f163"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#weightGrad)"
              dot={{ r: 4, fill: '#e2f163', stroke: '#0c0f14', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-3 border-t border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-yellow" />
          <span>
            Goal Status:{' '}
            <strong className="text-white font-bold">
              {weightDifference > 0 ? `${weightDifference} kg to shed to reach target goal` : weightDifference < 0 ? `${Math.abs(weightDifference)} kg to gain to reach target goal` : 'Goal weight achieved! 🎉'}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Target Date: Dec 31 • Steady weekly pacing (~0.3-0.5 kg/wk)
        </span>
      </div>
    </div>
  );
};
