import React, { useState } from 'react';
import {
  Utensils,
  Droplets,
  Trash2,
  ShieldAlert,
  Sparkles,
  Plus,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IndianFoodSearch } from './IndianFoodSearch';
import { WaterTracker } from './WaterTracker';
import { AIFoodScannerModal } from './AIFoodScannerModal';

export const NutritionTracker: React.FC = () => {
  const { mealLogs, deleteMealLog, setCurrentView } = useApp();
  const [showScannerModal, setShowScannerModal] = useState(false);

  const totalCalories = mealLogs.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(mealLogs.reduce((acc, m) => acc + m.proteinG, 0));
  const totalCarbs = Math.round(mealLogs.reduce((acc, m) => acc + m.carbsG, 0));
  const totalFat = Math.round(mealLogs.reduce((acc, m) => acc + m.fatG, 0));
  const totalFiber = Math.round(mealLogs.reduce((acc, m) => acc + m.fiberG, 0));

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header with AI Scanner Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
            Indian Food & Hydration Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Nutrition Diary
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            AI food photo analysis with Gemini Vision, verified ICMR-NIN household portions, and hydration.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Main AI Food Scanner Button */}
          <button
            onClick={() => setShowScannerModal(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Meal Photo (AI)</span>
          </button>
        </div>
      </div>

      {/* AI Food Scanner Feature Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-surface via-brand-card to-[#192231] border border-brand-yellow/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow text-slate-950 flex items-center justify-center font-bold shadow-md shadow-brand-yellow/20 flex-shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Snap or Upload Any Indian Meal Photo
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
                Gemini Vision Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Take a photo or upload an image. AI automatically calculates estimated calories, protein, carbs, and fat in 1-click.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowScannerModal(true)}
          className="py-2.5 px-5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-yellow/50 text-brand-yellow font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Scanner</span>
        </button>
      </div>

      {/* Top Grid: Macro Breakdown & Water */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macro Card */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Macro Totals
            </span>
            <span className="text-xs text-brand-yellow font-bold">2,100 kcal Target</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-brand-card border border-brand-border">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Calories</span>
              <div className="text-2xl font-black text-white mt-1">{totalCalories}</div>
              <span className="text-[10px] text-slate-500">kcal logged</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">Protein</span>
              <div className="text-2xl font-black text-emerald-300 mt-1">{totalProtein}g</div>
              <span className="text-[10px] text-slate-400">Goal: 110g</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[11px] font-bold text-amber-400 uppercase">Carbs</span>
              <div className="text-2xl font-black text-amber-300 mt-1">{totalCarbs}g</div>
              <span className="text-[10px] text-slate-400">Goal: 230g</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
              <span className="text-[11px] font-bold text-rose-400 uppercase">Fats</span>
              <div className="text-2xl font-black text-rose-300 mt-1">{totalFat}g</div>
              <span className="text-[10px] text-slate-400">Goal: 55g</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border/60 flex items-center justify-between text-xs text-slate-400">
            <span>Dietary Fiber Intake: <strong className="text-slate-200">{totalFiber}g</strong> (Target: 30g)</span>
            <span className="text-[11px] text-slate-500">Source: ICMR-NIN Composition Tables</span>
          </div>
        </div>

        {/* Water Tracker */}
        <WaterTracker />
      </div>

      {/* Main Two Column Layout: Food Logger & Today's Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Search & Quick Add */}
        <IndianFoodSearch />

        {/* Logged Meals List */}
        <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4 shadow-lg">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Entries
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">Logged Food Diary</h3>
          </div>

          {mealLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-brand-card/50 border border-brand-border">
              <Utensils className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No meals logged for today yet. Use the camera scanner or search to add items.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {mealTypes.map(mType => {
                const mealsOfType = mealLogs.filter(m => m.mealType === mType);
                if (mealsOfType.length === 0) return null;

                return (
                  <div key={mType} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-brand-border pb-1">
                      <span className="capitalize">{mType}</span>
                      <span className="font-mono text-brand-yellow font-normal">
                        {mealsOfType.reduce((acc, m) => acc + m.calories, 0)} kcal
                      </span>
                    </div>

                    {mealsOfType.map(meal => (
                      <div
                        key={meal.id}
                        className="p-3 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-white">
                            {meal.foodName} <span className="text-slate-400 font-normal">({meal.portions}x portion)</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {meal.calories} kcal • P: {meal.proteinG}g | C: {meal.carbsG}g | F: {meal.fatG}g
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMealLog(meal.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-brand-dark transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Scientific Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2 mt-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Nutritional Note:</strong> Indian recipes vary based on oil, tadka ghee, and preparation. Values are estimates, not guaranteed facts. Consult a registered dietitian for clinical dietary conditions.
            </p>
          </div>
        </div>
      </div>

      {/* AI Food Photo Scanner Modal */}
      <AIFoodScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
      />
    </div>
  );
};
