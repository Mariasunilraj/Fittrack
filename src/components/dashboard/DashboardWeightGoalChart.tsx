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
  TrendingUp,
  Bell,
  Clock
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
  const { profile, showToast, weightHistory, logWeight } = useApp();
  const [showLogInput, setShowLogInput] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(String(profile.currentWeightKg || 74.5));
  const [logDateInput, setLogDateInput] = useState(() => new Date().toISOString().split('T')[0]);

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
  const startingWeight = Number((profile.startingWeightKg || 76.0).toFixed(1));
  const weightDifference = Number((currentWeight - targetWeight).toFixed(1));

  // Monday Weigh-In Calculation & Schedule Reminder
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isTodayMonday = dayOfWeek === 1;

  // Next upcoming Monday date
  const nextMondayFormatted = useMemo(() => {
    const d = new Date(today);
    const diff = dayOfWeek === 1 ? 0 : (1 - dayOfWeek + 7) % 7;
    d.setDate(today.getDate() + (diff === 0 ? 7 : diff));
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, [dayOfWeek]);

  // Strict Real User Data Points (NO synthetic or fake checkpoints!)
  // The points ONLY move and appear when the user actually updates their weight weekly
  const chartData = useMemo(() => {
    const rawHistory = Array.isArray(weightHistory) ? [...weightHistory] : [];
    
    // Sort chronologically
    const sorted = rawHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sorted.length === 0) {
      // Single start point for fresh accounts
      return [
        {
          date: `Start (${accountStartShort})`,
          fullDate: accountStartDateFormatted,
          weight: startingWeight,
          target: targetWeight,
          label: 'Account Start',
          isMonday: new Date(accountStartDateStr).getDay() === 1
        }
      ];
    }

    return sorted.map((entry, idx) => {
      const isStart = idx === 0;
      const shortD = formatShortDate(entry.date);
      const isMonday = entry.isMondayWeighIn ?? (new Date(entry.date).getDay() === 1);
      const isToday = entry.date === new Date().toISOString().split('T')[0] || entry.date === '2026-11-18';
      
      let dateLabel = shortD;
      if (isStart) {
        dateLabel = `Start (${shortD})`;
      } else if (isToday) {
        dateLabel = `Today (${shortD})`;
      } else if (isMonday) {
        dateLabel = `Mon (${shortD})`;
      }

      return {
        date: dateLabel,
        fullDate: formatDisplayDate(entry.date),
        weight: Number(entry.weightKg.toFixed(1)),
        target: targetWeight,
        label: entry.notes || (isStart ? 'Account Start' : isToday ? 'Nov 18 Checkpoint' : isMonday ? 'Monday Weigh-In' : 'Weigh-In'),
        isMonday
      };
    });
  }, [weightHistory, accountStartShort, accountStartDateFormatted, startingWeight, targetWeight, accountStartDateStr]);

  // Safe Y-Axis boundaries based on real recorded weights and target
  const weightsList = chartData.map(d => d.weight).concat([startingWeight, currentWeight, targetWeight]);
  const minWeight = Math.min(...weightsList);
  const maxWeight = Math.max(...weightsList);

  const handleUpdateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (isNaN(val) || val <= 30 || val >= 300) {
      showToast('Please enter a valid weight between 30kg and 300kg.');
      return;
    }

    const effectiveDate = logDateInput || new Date().toISOString().split('T')[0];
    const isMon = new Date(effectiveDate).getDay() === 1;
    const noteText = isMon ? 'Monday Weekly Weigh-In' : 'Weekly Weigh-In';

    logWeight(val, effectiveDate, noteText);
    setShowLogInput(false);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-xl space-y-4">
      {/* Top Header: Current Weight vs Goal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 border-b border-brand-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              Weekly Milestone Tracker
            </span>
            <span className="text-xs text-slate-400 font-medium">Real Weekly Logs Only</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#ccff00]" />
            <span>Current Weight vs Target Goal</span>
          </h2>
        </div>

        {/* Badges: Account Start Date, Current Weight, Target Goal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full lg:w-auto">
          {/* Badge 1: Account Start Date */}
          <div className="p-3 px-3.5 rounded-xl bg-brand-card border border-brand-border text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Account Start Date</span>
            </span>
            <div className="text-sm font-black text-white font-mono mt-1">
              {accountStartDateFormatted}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">
              Start: <span className="font-semibold text-slate-200">{startingWeight} kg</span>
            </div>
          </div>

          {/* Badge 2: Current Weight */}
          <div className="p-3 px-3.5 rounded-xl bg-brand-card border border-brand-border text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Current Weight
            </span>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              {currentWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">
              {startingWeight !== currentWeight
                ? `${Math.abs(Number((startingWeight - currentWeight).toFixed(1)))} kg ${startingWeight > currentWeight ? 'shed' : 'gained'}`
                : 'Account Baseline'}
            </div>
          </div>

          {/* Badge 3: Target to Achieve */}
          <div className="col-span-2 sm:col-span-1 p-3 px-3.5 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00] flex items-center justify-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>Target to Achieve</span>
            </span>
            <div className="text-lg sm:text-xl font-black text-[#ccff00] font-mono mt-0.5">
              {targetWeight} <span className="text-xs text-[#ccff00]/80 font-normal">kg</span>
            </div>
            <div className="text-xs text-[#ccff00] font-bold mt-0.5">
              {weightDifference > 0
                ? `${weightDifference} kg to shed`
                : weightDifference < 0
                ? `${Math.abs(weightDifference)} kg to gain`
                : 'Goal Hit! 🎉'}
            </div>
          </div>
        </div>
      </div>

      {/* Monday Weekly Weigh-In Reminder Strip */}
      <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isTodayMonday
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-100 shadow-lg shadow-amber-500/10'
          : 'bg-brand-card/90 border-brand-border text-slate-300'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5 sm:mt-0 ${
            isTodayMonday ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'bg-brand-surface text-[#ccff00] border border-[#ccff00]/30'
          }`}>
            {isTodayMonday ? '🔔' : '📅'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">
                {isTodayMonday ? 'Weekly Weigh-In Day: Today is Monday!' : 'Weekly Weigh-In Day: Every Monday'}
              </span>
              {isTodayMonday ? (
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Active Reminder
                </span>
              ) : (
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next: {nextMondayFormatted}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isTodayMonday
                ? 'Step on your scale this Monday morning and log your weekly weight. The milestone point will advance with your entry.'
                : 'FitTrack logs genuine weekly checkpoints every Monday. No artificial checkpoints are shown—points only advance when you log.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowLogInput(true);
            setNewWeightInput(String(currentWeight));
          }}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap shadow-md self-start sm:self-auto active:scale-95 touch-manipulation ${
            isTodayMonday
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
              : 'bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black shadow-[#ccff00]/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isTodayMonday ? 'Log Monday Weigh-In' : 'Log Weekly Weight'}</span>
        </button>
      </div>

      {/* Quick Weight Log Inline Form */}
      {showLogInput && (
        <form onSubmit={handleUpdateWeight} className="p-4 rounded-xl bg-brand-dark/95 border border-brand-yellow/40 flex flex-wrap items-center gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">Log Date:</span>
            <input
              type="date"
              value={logDateInput}
              onChange={e => setLogDateInput(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-card border border-brand-border rounded-lg text-white font-mono text-xs focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">Weight:</span>
            <input
              type="number"
              step="0.1"
              value={newWeightInput}
              onChange={e => setNewWeightInput(e.target.value)}
              className="w-24 px-3 py-1.5 bg-brand-card border border-brand-border rounded-lg text-white font-mono text-sm text-center focus:outline-none focus:border-brand-yellow"
              placeholder="74.5"
            />
            <span className="text-xs text-slate-400 font-medium">kg</span>
          </div>

          <button
            type="submit"
            className="py-1.5 px-4 bg-brand-yellow hover:bg-[#cbe034] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm transition"
          >
            Save Weekly Log
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

      {/* Main Trajectory Graph: Strictly Actual Logged Points */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
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
              formatter={(val: any, _name: any, item: any) => [
                `${val} kg (${item.payload.label || 'Logged'})`,
                item.payload.fullDate || 'Date'
              ]}
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
              dot={{ r: 5, fill: '#e2f163', stroke: '#0c0f14', strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Helper notice if only 1 point is logged so far */}
      {chartData.length === 1 && (
        <div className="p-2.5 rounded-xl bg-brand-card/50 border border-brand-border text-center text-xs text-slate-400">
          📍 <span className="font-semibold text-slate-200">Account baseline recorded:</span>{' '}
          Your progress line will advance when you complete your weekly weigh-in on Monday!
        </div>
      )}

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
