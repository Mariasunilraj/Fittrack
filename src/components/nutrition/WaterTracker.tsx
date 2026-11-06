import React from 'react';
import { Droplets, Plus, Minus, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaterTracker: React.FC = () => {
  const { waterLog, addWater } = useApp();

  const pct = Math.min(100, Math.round((waterLog.amountMl / (waterLog.targetMl || 3000)) * 100));

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hydration Log</span>
            <h3 className="text-base font-bold text-white">Daily Water Intake</h3>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
          {pct}%
        </span>
      </div>

      <div className="text-center my-3">
        <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
          {(waterLog.amountMl / 1000).toFixed(2)}{' '}
          <span className="text-base font-normal text-slate-400">/ {(waterLog.targetMl / 1000).toFixed(1)} Liters</span>
        </div>
        <div className="w-full bg-brand-dark rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-brand-border/60">
        <button
          onClick={() => addWater(250)}
          className="py-2.5 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-xs font-bold text-sky-300 flex items-center justify-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250ml Glass</span>
        </button>

        <button
          onClick={() => addWater(500)}
          className="py-2.5 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-xs font-bold text-sky-300 flex items-center justify-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+500ml Bottle</span>
        </button>

        <button
          onClick={() => addWater(-250)}
          className="py-2.5 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-xs font-semibold text-slate-400 flex items-center justify-center gap-1 transition cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      </div>
    </div>
  );
};
