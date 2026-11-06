import React, { useState } from 'react';
import {
  Utensils,
  Camera,
  Plus,
  ChevronRight,
  Droplets,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIFoodScannerModal } from '../nutrition/AIFoodScannerModal';

export const DashboardNutritionPlan: React.FC = () => {
  const { mealLogs, waterLog, addWater, setCurrentView } = useApp();
  const [showScannerModal, setShowScannerModal] = useState(false);

  const totalCalories = mealLogs.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(mealLogs.reduce((acc, m) => acc + m.proteinG, 0));
  const totalCarbs = Math.round(mealLogs.reduce((acc, m) => acc + m.carbsG, 0));
  const totalFat = Math.round(mealLogs.reduce((acc, m) => acc + m.fatG, 0));

  const targetCalories = 2100;
  const targetProtein = 110;
  const targetCarbs = 230;
  const targetFat = 55;

  const plannedDayMeals = [
    {
      meal: 'Breakfast',
      time: '08:30 AM',
      items: 'Steamed Idli (3 pcs) + Sambar + 2 Hard Boiled Eggs',
      calories: 380,
      protein: 19.4
    },
    {
      meal: 'Lunch',
      time: '01:30 PM',
      items: 'Whole Wheat Rotis (3) + Paneer Bhurji + Fresh Curd',
      calories: 520,
      protein: 26.8
    },
    {
      meal: 'Snack',
      time: '05:30 PM',
      items: 'Sprouted Moong Chaat with Lemon & Roasted Makhana',
      calories: 220,
      protein: 11.2
    },
    {
      meal: 'Dinner',
      time: '08:30 PM',
      items: 'Yellow Dal Tadka + Steamed Rice + Palak Sabzi',
      calories: 450,
      protein: 18.5
    }
  ];

  const waterPct = Math.min(100, Math.round((waterLog.amountMl / (waterLog.targetMl || 3000)) * 100));

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              Indian Diet & Macro Plan
            </span>
            <span className="text-xs text-slate-400">ICMR-NIN Calibrated</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-400" />
            <span>Nutrition Plan of the Day</span>
          </h2>
        </div>

        {/* Action Buttons: AI Food Scanner & Full Diary */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowScannerModal(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-brand-yellow/15 transition cursor-pointer hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            <span>AI Snap Food Photo</span>
          </button>

          <button
            onClick={() => setCurrentView('nutrition')}
            className="py-2.5 px-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            <span>Food Diary</span>
          </button>
        </div>
      </div>

      {/* Calories & Macro Snapshot Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-[10px] font-bold uppercase text-slate-400">Calories Consumed</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {totalCalories} <span className="text-xs font-normal text-slate-400">/ {targetCalories}</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-brand-yellow h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-[10px] font-bold uppercase text-emerald-400">Protein Goal</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-0.5">
            {totalProtein}g <span className="text-xs font-normal text-slate-400">/ {targetProtein}g</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-[10px] font-bold uppercase text-amber-400">Carbohydrates</span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
            {totalCarbs}g <span className="text-xs font-normal text-slate-400">/ {targetCarbs}g</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <span className="text-[10px] font-bold uppercase text-rose-400">Healthy Fats</span>
          <div className="text-xl sm:text-2xl font-black text-rose-300 font-mono mt-0.5">
            {totalFat}g <span className="text-xs font-normal text-slate-400">/ {targetFat}g</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-rose-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalFat / targetFat) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Planned Meals of the Day Checklist */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Today's Structured Meal Outline:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plannedDayMeals.map((mealItem, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-brand-card border border-brand-border flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-brand-yellow uppercase">
                    {mealItem.meal}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">({mealItem.time})</span>
                </div>
                <p className="text-xs text-slate-200 font-medium mt-1 leading-snug">
                  {mealItem.items}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono font-bold text-white block">
                  {mealItem.calories} kcal
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {mealItem.protein}g protein
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Hydration & AI Snap Tip */}
      <div className="pt-3 border-t border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-400" />
          <span>
            Hydration: <strong className="text-white font-mono">{(waterLog.amountMl / 1000).toFixed(2)}L</strong> / {(waterLog.targetMl / 1000).toFixed(1)}L ({waterPct}%)
          </span>
          <button
            onClick={() => addWater(250)}
            className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-bold hover:bg-sky-500/30 transition text-[11px] cursor-pointer"
          >
            +250ml
          </button>
        </div>

        <button
          onClick={() => setShowScannerModal(true)}
          className="text-brand-yellow font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Capture Meal Photo with Gemini</span>
        </button>
      </div>

      {/* Food Scanner Modal */}
      <AIFoodScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
      />
    </div>
  );
};
