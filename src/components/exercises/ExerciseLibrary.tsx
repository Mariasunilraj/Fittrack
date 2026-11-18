import React, { useState } from 'react';
import { Search, Filter, BookOpen, Dumbbell, Shield, Activity, ChevronRight, Info, Sparkles } from 'lucide-react';
import { EXERCISE_DATABASE } from '../../data/exerciseDatabase';
import { ExerciseItem, TrainingDiscipline, ExperienceLevel } from '../../types';
import { ExerciseDetailModal } from './ExerciseDetailModal';

export const ExerciseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline = selectedDiscipline === 'all' || ex.discipline === selectedDiscipline;
    const matchesDifficulty = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;

    return matchesSearch && matchesDiscipline && matchesDifficulty;
  });

  return (
    <div className="space-y-6 pb-nav-safe animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              Biomechanics & Kinetic Index
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Form-Accurate Vectors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#ccff00]" />
            <span>Exercise Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Curated movements across calisthenics ladders, barbell power lifts, martial arts mechanics, and mobility.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Offline Biomechanics</span>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, muscle group (e.g. chest, lats, glutes), or equipment..."
            className="w-full pl-11 pr-4 py-3 bg-[#141923] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#ccff00] transition shadow-sm min-h-[44px]"
          />
        </div>

        {/* Discipline Filters & Difficulty */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Movements' },
              { id: 'calisthenics', label: 'Calisthenics' },
              { id: 'gym', label: 'Gym Resistance' },
              { id: 'weightlifting', label: 'Weightlifting' },
              { id: 'taekwondo', label: 'Taekwondo' },
              { id: 'mobility', label: 'Mobility' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedDiscipline(tab.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex-shrink-0 active:scale-95 touch-manipulation ${
                  selectedDiscipline === tab.id
                    ? 'bg-[#ccff00] text-slate-950 border-[#ccff00] font-black shadow-md shadow-[#ccff00]/20'
                    : 'bg-[#141923] border-slate-700 text-slate-200 hover:text-white hover:border-[#ccff00]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="self-end sm:self-auto flex-shrink-0">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 bg-[#141923] border border-slate-600 rounded-xl text-xs font-bold text-slate-100 focus:outline-none focus:border-[#ccff00] shadow-sm cursor-pointer"
            >
              <option value="all">Any Difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-brand-surface border border-brand-border">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="font-bold text-white text-base">No movements found</h3>
          <p className="text-xs text-slate-300 mt-1">Try clearing your search query or discipline filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map(ex => (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="p-4 rounded-2xl bg-brand-surface border border-slate-700/80 hover:border-[#ccff00]/60 transition-all cursor-pointer flex flex-col justify-between shadow-lg group hover:shadow-xl hover:shadow-[#ccff00]/5"
            >
              <div>
                {/* Exercise Biomechanical Diagram with Overlay Badges */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-[#0a0d14] border border-brand-border">
                  {ex.imageUrl ? (
                    <img
                      src={ex.imageUrl}
                      alt={ex.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#ccff00]/40 text-[#ccff00] shadow-md">
                      {ex.discipline}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-extrabold capitalize px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-slate-600 shadow-md">
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-200">
                    <span className="font-semibold bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-slate-700/80 text-slate-200 max-w-[190px] truncate">
                      {ex.equipment}
                    </span>
                    {ex.caloriesBurnEstimatePerHour && (
                      <span className="font-mono text-[#ccff00] font-bold text-[10px] bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#ccff00]/30">
                        ~{ex.caloriesBurnEstimatePerHour} kcal/h
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-[#ccff00] transition leading-snug">
                  {ex.name}
                </h3>

                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {ex.instructions[0]}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ex.targetMuscles.map(m => (
                    <span
                      key={m}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#141923] text-slate-200 font-semibold border border-slate-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/80 flex items-center justify-between text-xs text-slate-300">
                <span className="text-xs text-slate-300 font-medium">Kinetic Form Guide</span>
                <span className="min-h-[32px] px-2.5 py-1 rounded-lg bg-[#ccff00]/15 hover:bg-[#ccff00] text-[#ccff00] hover:text-slate-950 font-bold text-xs flex items-center gap-1 group-hover:scale-105 transition border border-[#ccff00]/30 shadow-sm">
                  <span>View Technique</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeExercise && (
        <ExerciseDetailModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
        />
      )}
    </div>
  );
};
