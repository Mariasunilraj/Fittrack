import React from 'react';
import { X, ShieldAlert, Award, Activity, Wind, AlertCircle, PlayCircle } from 'lucide-react';
import { ExerciseItem } from '../../types';

interface ExerciseDetailModalProps {
  exercise: ExerciseItem;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Hero Photo Banner or Header */}
        {exercise.imageUrl ? (
          <div className="relative w-full h-52 sm:h-64 bg-brand-dark overflow-hidden flex-shrink-0">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/30 to-black/60" />

            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer z-10"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3.5 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow text-slate-950 font-bold shadow">
                    {exercise.discipline}
                  </span>
                  <span className="text-xs text-white/90 font-semibold capitalize bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                    {exercise.difficulty}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-tight">
                  {exercise.name}
                </h2>
              </div>
              {exercise.caloriesBurnEstimatePerHour && (
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-brand-yellow bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-yellow/30">
                  <span>🔥 ~{exercise.caloriesBurnEstimatePerHour} kcal/hr</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-6 py-5 border-b border-brand-border bg-brand-card flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                  {exercise.discipline}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  Level: <strong className="text-slate-200">{exercise.difficulty}</strong>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{exercise.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-brand-hover transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          {/* Target Muscles & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-brand-dark/80 border border-brand-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Primary Target Muscles
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {exercise.targetMuscles.map(m => (
                  <span
                    key={m}
                    className="text-xs px-2 py-0.5 rounded-md bg-brand-card border border-brand-border text-brand-yellow font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-dark/80 border border-brand-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Required Equipment
              </span>
              <p className="text-xs text-slate-200 font-medium mt-1">{exercise.equipment}</p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-yellow" />
              <span>Step-by-Step Execution</span>
            </h3>
            <ol className="space-y-2">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-brand-card border border-brand-border flex items-center justify-center font-bold text-brand-yellow text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Breathing Cues */}
          {exercise.breathingCues && (
            <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 text-sky-200">
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Breathing Pattern & Core Intra-abdominal Pressure</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise.breathingCues}</p>
            </div>
          )}

          {/* Regressions & Progressions Ladder */}
          {(exercise.regressions || exercise.progressions) && (
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Progression Ladder & Scaling
              </span>
              {exercise.regressions && (
                <div className="text-xs text-slate-400">
                  <strong className="text-amber-400 font-semibold">Regression (Easier): </strong>
                  {exercise.regressions}
                </div>
              )}
              {exercise.progressions && (
                <div className="text-xs text-slate-400">
                  <strong className="text-emerald-400 font-semibold">Progression (Harder): </strong>
                  {exercise.progressions}
                </div>
              )}
            </div>
          )}

          {/* Safety & Joint Health Notes */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Safety Precaution & Form Warnings</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{exercise.safetyNotes}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-border bg-brand-card flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
