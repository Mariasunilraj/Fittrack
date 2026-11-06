import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  BatteryCharging,
  Plus,
  Scale,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { PersonalRecord, TrainingDiscipline } from '../../types';

const WEIGHT_HISTORY = [
  { date: '10/01', weight: 75.2 },
  { date: '10/08', weight: 74.8 },
  { date: '10/15', weight: 74.4 },
  { date: '10/22', weight: 74.0 },
  { date: '10/29', weight: 73.8 },
  { date: '11/05', weight: 73.5 }
];

export const ProgressAnalytics: React.FC = () => {
  const {
    profile,
    personalRecords,
    addPersonalRecord,
    deletePersonalRecord,
    recoveryLogs,
    logRecovery,
    showToast
  } = useApp();
  const [showPrModal, setShowPrModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // New PR Form
  const [exName, setExName] = useState('');
  const [prType, setPrType] = useState<'1RM' | 'Max Reps' | 'Hold Time' | 'Speed'>('1RM');
  const [prValue, setPrValue] = useState('');
  const [prDiscipline, setPrDiscipline] = useState<TrainingDiscipline>('weightlifting');

  // Recovery Form
  const [sleepHours, setSleepHours] = useState(7.5);
  const [soreness, setSoreness] = useState(3);
  const [energy, setEnergy] = useState(8);
  const [recNotes, setRecNotes] = useState('');

  // BMI rough screening calculation
  const heightM = profile.heightCm / 100;
  const bmi = (profile.currentWeightKg / (heightM * heightM)).toFixed(1);

  const handleSavePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName || !prValue) return;

    addPersonalRecord({
      exerciseName: exName,
      recordType: prType,
      value: prValue,
      discipline: prDiscipline
    });
    setShowPrModal(false);
    setExName('');
    setPrValue('');
  };

  const handleDeletePr = (id: string, name: string, value: string) => {
    if (window.confirm(`Delete personal record "${name}" (${value})?`)) {
      deletePersonalRecord(id);
    }
  };

  const handleSaveRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    logRecovery({
      sleepHours,
      sorenessRating: soreness,
      energyRating: energy,
      notes: recNotes
    });
    setShowRecoveryModal(false);
  };

  const latestRec = recoveryLogs[0] || { sleepHours: 7.5, sorenessRating: 3, energyRating: 8 };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
            Long-Term Fitness Trajectory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Progress & Recovery
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Holistic tracking of strength development, calisthenics records, body trends, and CNS recovery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <span>Log Daily Recovery</span>
          </button>

          <button
            onClick={() => setShowPrModal(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-yellow/15 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Personal Record</span>
          </button>
        </div>
      </div>

      {/* Grid: Weight Trend & Recovery Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Trajectory Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Body Composition Trend
              </span>
              <h3 className="text-base font-bold text-white">Body Weight (kg)</h3>
            </div>
            <div className="text-xs font-mono text-slate-300">
              Current: <strong className="text-brand-yellow text-sm font-bold">{profile.currentWeightKg} kg</strong> (Target: {profile.targetWeightKg} kg)
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEIGHT_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252e3e" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141821',
                    borderColor: '#252e3e',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} kg`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#e2f163"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#e2f163', stroke: '#0c0f14', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            Non-judgmental trend tracking. Healthy weight shifts occur gradually over weeks, not days.
          </p>
        </div>

        {/* Recovery Score & BMI Screening */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Recovery Status
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BatteryCharging className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Last Night's Sleep:</span>
                <span className="font-bold text-white">{latestRec.sleepHours} hours</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Muscle Soreness:</span>
                <span className="font-bold text-white">{latestRec.sorenessRating}/10</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Energy Level:</span>
                <span className="font-bold text-emerald-400">{latestRec.energyRating}/10</span>
              </div>
            </div>

            {latestRec.notes && (
              <p className="text-[11px] text-slate-400 italic pt-2 border-t border-brand-border/60">
                "{latestRec.notes}"
              </p>
            )}
          </div>

          {/* BMI Rough Screening */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-xs space-y-1.5 shadow-md">
            <div className="flex items-center justify-between font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-brand-yellow" />
                <span>BMI Estimate: {bmi}</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-dark text-slate-300">
                Screening Metric
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              BMI does not distinguish between muscle mass and fat tissue. FitTrack provides this strictly as a baseline reference without clinical claims.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Records (PRs) Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
              Hall of Fame
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">Personal Records & Milestones</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{personalRecords.length} records documented</span>
            <button
              onClick={() => setShowPrModal(true)}
              className="py-1 px-3 rounded-lg bg-brand-yellow text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-brand-yellowDark transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log PR</span>
            </button>
          </div>
        </div>

        {personalRecords.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-brand-dark/50 border border-brand-border space-y-2">
            <Award className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No personal records documented yet.</p>
            <button
              onClick={() => setShowPrModal(true)}
              className="py-1.5 px-4 rounded-xl bg-brand-yellow text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Log First PR
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {personalRecords.map(pr => (
              <div
                key={pr.id}
                className="p-4 rounded-xl bg-brand-card border border-brand-border flex flex-col justify-between hover:border-slate-500 transition group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-dark text-brand-yellow">
                      {pr.recordType}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">{pr.date}</span>
                      {/* DELETE PERSONAL RECORD BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleDeletePr(pr.id, pr.exerciseName, pr.value)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title={`Delete PR for "${pr.exerciseName}" (${pr.value})`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xl font-black text-white font-mono tracking-tight">{pr.value}</div>
                  <p className="text-xs text-slate-300 font-semibold mt-1 truncate">{pr.exerciseName}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>{pr.discipline}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePr(pr.id, pr.exerciseName, pr.value)}
                    className="text-slate-500 hover:text-rose-400 font-bold text-[10px] lowercase flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add PR Modal */}
      {showPrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-white text-lg">Log New Personal Record</h3>
            <form onSubmit={handleSavePr} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weighted Pull-Up, Barbell Squat"
                  value={exName}
                  onChange={e => setExName(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Record Metric
                  </label>
                  <select
                    value={prType}
                    onChange={e => setPrType(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="1RM">1 Rep Max (Weight)</option>
                    <option value="Max Reps">Max Reps</option>
                    <option value="Hold Time">Hold Time (Seconds)</option>
                    <option value="Speed">Pacing / Speed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Record Value
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 kg, 20 reps"
                    value={prValue}
                    onChange={e => setPrValue(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Discipline
                </label>
                <select
                  value={prDiscipline}
                  onChange={e => setPrDiscipline(e.target.value as any)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
                >
                  <option value="calisthenics">Calisthenics</option>
                  <option value="weightlifting">Weightlifting</option>
                  <option value="gym">Gym Resistance</option>
                  <option value="taekwondo">Taekwondo</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setShowPrModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-yellow text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-yellow/15"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-white text-lg">Daily Recovery Check-In</h3>
            <form onSubmit={handleSaveRecovery} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Sleep Duration: {sleepHours} Hours
                </label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="w-full accent-[#e2f163] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Muscle Soreness: {soreness}/10 ({soreness <= 3 ? 'Fresh' : soreness <= 6 ? 'Mild DOMS' : 'Heavy Fatigue'})
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={soreness}
                  onChange={e => setSoreness(Number(e.target.value))}
                  className="w-full accent-[#e2f163] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Energy Level: {energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={e => setEnergy(Number(e.target.value))}
                  className="w-full accent-[#e2f163] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Recovery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={recNotes}
                  onChange={e => setRecNotes(e.target.value)}
                  placeholder="e.g. Shoulders felt relaxed after 90/90 mobility routine."
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-yellow text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-yellow/15"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
