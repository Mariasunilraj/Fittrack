import React, { useState } from 'react';
import { Search, Filter, BookOpen, Dumbbell, Shield, Activity, ChevronRight, Info } from 'lucide-react';
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
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
            Biomechanics & Technique Index
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Exercise Library
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Curated movements across calisthenics ladders, barbell power lifts, martial arts mechanics, and mobility.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Calisthenics & Gym APIs Synced</span>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, muscle group (e.g. chest, lats, glutes), or equipment..."
            className="w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-yellow transition shadow-sm"
          />
        </div>

        {/* Discipline Filters */}
        <div className="flex flex-wrap items-center gap-2">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                selectedDiscipline === tab.id
                  ? 'bg-brand-yellow text-slate-950 border-brand-yellow font-bold shadow-sm'
                  : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Difficulty Dropdown */}
          <div className="ml-auto">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 bg-brand-surface border border-brand-border rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-yellow"
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
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or discipline filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map(ex => (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="p-4 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-yellow/50 transition cursor-pointer flex flex-col justify-between shadow-md group"
            >
              <div>
                {/* Exercise Photo with Overlay Badges */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-brand-dark/90 border border-brand-border/60">
                  {ex.imageUrl ? (
                    <img
                      src={ex.imageUrl}
                      alt={ex.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-black/40 pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-brand-yellow/30 text-brand-yellow shadow-sm">
                      {ex.discipline}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-bold capitalize px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-slate-200 border border-brand-border shadow-sm">
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                    <span className="truncate max-w-[170px] font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      {ex.equipment}
                    </span>
                    {ex.caloriesBurnEstimatePerHour && (
                      <span className="font-mono text-brand-yellow font-bold text-[10px] bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-brand-yellow/20">
                        ~{ex.caloriesBurnEstimatePerHour} kcal/h
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-brand-yellow transition leading-snug">
                  {ex.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {ex.instructions[0]}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ex.targetMuscles.map(m => (
                    <span
                      key={m}
                      className="text-[10px] px-2 py-0.5 rounded bg-brand-dark/80 text-slate-300 font-medium border border-brand-border/60"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-500">Form Instructions & Bio-cues</span>
                <span className="text-brand-yellow font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition">
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
