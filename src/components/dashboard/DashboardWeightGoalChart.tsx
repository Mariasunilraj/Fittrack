import React, { useState, useMemo } from 'react';
import {
  Scale,
  TrendingDown,
  Target,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp
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
  const [newWeightInput, setNewWeightInput] = useState(String(profile.currentWeightKg || 74.5));

  // Date formatters
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return 'Nov 01, 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return 'Nov 01';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const accountStartDateStr = profile.createdAt || '2026-11-01';
  const accountStartDateFormatted = formatDisplayDate(accountStartDateStr);
  const accountStartShort = formatShortDate(accountStartDateStr);

  const currentWeight = Number((profile.currentWeightKg || 74.5).toFixed(1));
  const targetWeight = Number((profile.targetWeightKg || 70.0).toFixed(1));
  const startingWeight = Number((profile.startingWeightKg || (currentWeight > targetWeight ? currentWeight + 1.5 : currentWeight - 1.5)).toFixed(1));
  const weightDifference = Number((currentWeight - targetWeight).toFixed(1));

  // Unified dynamic trajectory data points for both existing accounts and newly created accounts
  const weightData = useMemo(() => {
    // If starting weight equals current weight (e.g. brand new user registration)
    if (Math.abs(startingWeight - currentWeight) < 0.2) {
      const totalDelta = targetWeight - currentWeight;
      return [
        {
          date: `Start (${accountStartShort})`,
          weight: startingWeight,
          target: targetWeight,
          label: 'Account Start'
        },
        {
          date: 'Week 2 Checkpoint',
          weight: Number((currentWeight + totalDelta * 0.25).toFixed(1)),
          target: targetWeight,
          label: 'Phase 1 Target'
        },
        {
          date: 'Week 4 Checkpoint',
          weight: Number((currentWeight + totalDelta * 0.50).toFixed(1)),
          target: targetWeight,
          label: 'Midway Milestone'
        },
        {
          date: 'Week 6 Checkpoint',
          weight: Number((currentWeight + totalDelta * 0.75).toFixed(1)),
          target: targetWeight,
          label: 'Phase 3 Target'
        },
        {
          date: 'Goal Target',
          weight: targetWeight,
          target: targetWeight,
          label: 'Target Goal'
        }
      ];
    }

    // Existing account with progression from starting weight to current weight
    const progressDelta = currentWeight - startingWeight;
    const remainingDelta = targetWeight - currentWeight;

    return [
      {
        date: `Start (${accountStartShort})`,
        weight: startingWeight,
        target: targetWeight,
        label: 'Account Start'
      },
      {
        date: 'Progress Milestone',
        weight: Number((startingWeight + progressDelta * 0.5).toFixed(1)),
        target: targetWeight,
        label: 'Progress Checkpoint'
      },
      {
        date: 'Today',
        weight: currentWeight,
        target: targetWeight,
        label: 'Current Weight'
      },
      {
        date: 'Phase 2 Target',
        weight: Number((currentWeight + remainingDelta * 0.5).toFixed(1)),
        target: targetWeight,
        label: 'Next Checkpoint'
      },
      {
        date: 'Goal Target',
        weight: targetWeight,
        target: targetWeight,
        label: 'Target Goal'
      }
    ];
  }, [startingWeight, currentWeight, targetWeight, accountStartShort]);

  // Safe Y-Axis boundaries
  const minWeight = Math.min(startingWeight, currentWeight, targetWeight);
  const maxWeight = Math.max(startingWeight, currentWeight, targetWeight);

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-brand-border/70 pb-4">
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

        {/* Unified Badges: Account Start Date, Current Weight, Target Goal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full lg:w-auto">
          {/* Badge 1: Account Start Date */}
          <div className="p-2.5 px-3.5 rounded-xl bg-brand-card border border-brand-border text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>Account Start Date</span>
            </span>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-1">
              {accountStartDateFormatted}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Start: <span className="font-semibold text-slate-200">{startingWeight} kg</span>
            </div>
          </div>

          {/* Badge 2: Current Weight */}
          <div className="p-2.5 px-3.5 rounded-xl bg-brand-card border border-brand-border text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Weight
            </span>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              {currentWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {startingWeight !== currentWeight
                ? `${Math.abs(Number((startingWeight - currentWeight).toFixed(1)))} kg ${startingWeight > currentWeight ? 'shed' : 'gained'}`
                : 'Active Baseline'}
            </div>
          </div>

          {/* Badge 3: Target to Achieve */}
          <div className="col-span-2 sm:col-span-1 p-2.5 px-3.5 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-yellow flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-brand-yellow" />
              <span>Target to Achieve</span>
            </span>
            <div className="text-lg sm:text-xl font-black text-brand-yellow font-mono mt-0.5">
              {targetWeight} <span className="text-xs text-brand-yellow/80 font-normal">kg</span>
            </div>
            <div className="text-[10px] text-brand-yellow/80 font-semibold mt-0.5">
              {weightDifference > 0
                ? `${weightDifference} kg to shed`
                : weightDifference < 0
                ? `${Math.abs(weightDifference)} kg to gain`
                : 'Goal Hit! 🎉'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Strip: Quick Weigh-In Trigger */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Progression from Account Start Date towards your Target Goal:
        </span>
        <button
          onClick={() => setShowLogInput(!showLogInput)}
          className="p-2 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-yellow" />
          <span>Log Today's Weight</span>
        </button>
      </div>

      {/* Quick Weight Log Inline Form */}
      {showLogInput && (
        <form onSubmit={handleUpdateWeight} className="p-3.5 rounded-xl bg-brand-dark/95 border border-brand-yellow/30 flex flex-wrap items-center gap-3 animate-fadeIn">
          <span className="text-xs text-slate-300 font-medium">New Weight:</span>
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
            className="py-1.5 px-4 bg-brand-yellow hover:bg-[#cbe034] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm transition"
          >
            Update Weight
          </button>
          <button
            type="button"
            onClick={() => setShowLogInput(false)}
            className="text-xs text-slate-400 hover:text-white ml-auto cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Trajectory Graph */}
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
              domain={[Math.floor(minWeight - 2), Math.ceil(maxWeight + 2)]}
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
              formatter={(val: any) => [`${val} kg`, 'Trajectory Weight']}
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
              {weightDifference > 0
                ? `${weightDifference} kg to shed to reach target goal`
                : weightDifference < 0
                ? `${Math.abs(weightDifference)} kg to gain to reach target goal`
                : 'Goal weight achieved! 🎉'}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Account Started: <strong className="text-slate-200">{accountStartDateFormatted}</strong></span>
        </span>
      </div>
    </div>
  );
};
