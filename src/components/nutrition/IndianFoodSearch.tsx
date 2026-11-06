import React, { useState } from 'react';
import { Search, Plus, Check, Info, Sparkles } from 'lucide-react';
import { INDIAN_FOOD_DATABASE } from '../../data/indianFoodDatabase';
import { IndianFoodItem } from '../../types';
import { useApp } from '../../context/AppContext';

export const IndianFoodSearch: React.FC = () => {
  const { addMealLog, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<IndianFoodItem | null>(null);
  const [portions, setPortions] = useState<number>(1);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const filteredFoods = INDIAN_FOOD_DATABASE.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.regionalCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMeal = (food: IndianFoodItem) => {
    addMealLog({
      foodId: food.id,
      foodName: food.name,
      mealType,
      portions,
      calories: Math.round(food.calories * portions),
      proteinG: Number((food.proteinG * portions).toFixed(1)),
      carbsG: Number((food.carbsG * portions).toFixed(1)),
      fatG: Number((food.fatG * portions).toFixed(1)),
      fiberG: Number((food.fiberG * portions).toFixed(1))
    });
    setSelectedFood(null);
    setPortions(1);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4 shadow-lg">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
          Regional Household Portions
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight">
          Log Indian Meals & Snacks
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Standardized household measures (katoris, rotis, idlis) with ICMR-NIN nutritional values.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Indian dishes (e.g. Dosa, Idli, Dal Tadka, Paneer, Roti, Sprouts)..."
          className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-yellow"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {[
          'all',
          'South Indian',
          'North Indian',
          'High Protein',
          'Healthy Staple',
          'Millet & Traditional'
        ].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-brand-yellow text-slate-950 border-brand-yellow font-bold'
                : 'bg-brand-card text-slate-400 border-brand-border hover:border-slate-600'
            }`}
          >
            {cat === 'all' ? 'All Indian Foods' : cat}
          </button>
        ))}
      </div>

      {/* Food Cards List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredFoods.map(food => (
          <div
            key={food.id}
            className="p-3 rounded-xl bg-brand-card/90 border border-brand-border flex items-center justify-between hover:border-slate-600 transition"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{food.name}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-brand-dark text-brand-yellow">
                  {food.foodType}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {food.servingUnit} • <span className="text-white font-mono">{food.calories} kcal</span> (P: {food.proteinG}g | C: {food.carbsG}g | F: {food.fatG}g)
              </p>
            </div>

            <button
              onClick={() => setSelectedFood(food)}
              className="py-1.5 px-3 rounded-lg bg-brand-yellow/15 hover:bg-brand-yellow text-brand-yellow hover:text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select</span>
            </button>
          </div>
        ))}
      </div>

      {/* Portion & Meal Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-white text-base">Add to Today's Diary</h3>
            <div className="p-3 rounded-xl bg-brand-dark border border-brand-border">
              <div className="font-bold text-sm text-brand-yellow">{selectedFood.name}</div>
              <div className="text-xs text-slate-400 mt-1">1 serving = {selectedFood.servingUnit}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Meal Category
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer ${
                      mealType === type
                        ? 'bg-brand-yellow text-slate-950 border-brand-yellow font-bold'
                        : 'bg-brand-card text-slate-400 border-brand-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-400 mb-1.5">
                <span>Portion Multiplier: {portions}x</span>
                <span className="text-white font-mono">
                  {Math.round(selectedFood.calories * portions)} kcal
                </span>
              </div>
              <div className="flex items-center gap-3">
                {[0.5, 1, 1.5, 2, 3].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPortions(p)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      portions === p
                        ? 'bg-brand-yellow text-slate-950 border-brand-yellow'
                        : 'bg-brand-card text-slate-300 border-brand-border'
                    }`}
                  >
                    {p}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/60">
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddMeal(selectedFood)}
                className="px-4 py-2 bg-brand-yellow text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-yellow/15"
              >
                Log Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
