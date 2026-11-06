import React, { useState } from 'react';
import { Utensils, Plus, ChevronRight, Info, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIFoodScannerModal } from '../nutrition/AIFoodScannerModal';

export const NutritionQuickSnapshot: React.FC = () => {
  const { mealLogs, setCurrentView } = useApp();
  const [showScanner, setShowScanner] = useState(false);

  const totalCalories = mealLogs.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(mealLogs.reduce((acc, m) => acc + m.proteinG, 0));
  const totalCarbs = Math.round(mealLogs.reduce((acc, m) => acc + m.carbsG, 0));
  const totalFat = Math.round(mealLogs.reduce((acc, m) => acc + m.fatG, 0));

  const targetCalories = 2100;
  const targetProtein = 110;
  const targetCarbs = 230;
  const targetFat = 55;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Indian Nutrition</span>
              <h3 className="text-base font-bold text-white">Daily Macro Snapshot</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScanner(true)}
              className="py-1.5 px-2.5 rounded-lg bg-brand-yellow/15 hover:bg-brand-yellow text-brand-yellow hover:text-slate-950 font-bold border border-brand-yellow/30 text-xs flex items-center gap-1.5 cursor-pointer transition"
              title="Snap meal photo with Gemini Vision"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AI Snap</span>
            </button>

            <button
              onClick={() => setCurrentView('nutrition')}
              className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-hover text-slate-300 border border-brand-border text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log</span>
            </button>
          </div>
        </div>

        {/* Calories Counter */}
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border mb-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {totalCalories} <span className="text-xs font-normal text-slate-400">/ {targetCalories} kcal</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">ICMR-NIN verified estimates & AI meal scans</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-brand-yellow">
              {Math.round((totalCalories / targetCalories) * 100)}%
            </span>
            <div className="text-[10px] text-slate-500">of daily goal</div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="space-y-3">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Protein</span>
              <span className="font-mono text-slate-400">
                <strong className="text-emerald-400 font-bold">{totalProtein}g</strong> / {targetProtein}g
              </span>
            </div>
            <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Carbohydrates</span>
              <span className="font-mono text-slate-400">
                <strong className="text-amber-400 font-bold">{totalCarbs}g</strong> / {targetCarbs}g
              </span>
            </div>
            <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Healthy Fats</span>
              <span className="font-mono text-slate-400">
                <strong className="text-rose-400 font-bold">{totalFat}g</strong> / {targetFat}g
              </span>
            </div>
            <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalFat / targetFat) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Snap photo anytime to log macros</span>
        </span>
        <button
          onClick={() => setCurrentView('nutrition')}
          className="text-brand-yellow font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View Diet Log</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <AIFoodScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};
