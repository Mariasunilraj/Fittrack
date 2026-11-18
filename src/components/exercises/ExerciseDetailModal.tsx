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
      <div className="relative w-full max-w-2xl bg-[#0f141f] border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Hero Photo / Biomechanical Banner */}
        {exercise.imageUrl ? (
          <div className="relative w-full h-52 sm:h-64 bg-[#0a0d14] overflow-hidden flex-shrink-0 border-b border-slate-700/80">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f141f] via-transparent to-black/60 pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 min-h-[44px] min-w-[44px] p-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md transition cursor-pointer z-10 flex items-center justify-center border border-slate-700 active:scale-95"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00] text-slate-950 font-bold shadow-md">
                    {exercise.discipline}
                  </span>
                  <span className="text-xs text-white font-bold capitalize bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-slate-700">
                    {exercise.difficulty}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-tight">
                  {exercise.name}
                </h2>
              </div>
              {exercise.caloriesBurnEstimatePerHour && (
                <div className="hidden sm:flex items-center gap-1 text-xs font-black text-[#ccff00] bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#ccff00]/30">
                  <span>🔥 ~{exercise.caloriesBurnEstimatePerHour} kcal/hr</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-6 py-5 border-b border-slate-700 bg-brand-card flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                  {exercise.discipline}
                </span>
                <span className="text-xs text-slate-300 capitalize">
                  Level: <strong className="text-white font-bold">{exercise.difficulty}</strong>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{exercise.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-sm safe-area-bottom">
          {/* Target Muscles & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141923] border border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Primary Target Muscles
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {exercise.targetMuscles.map(m => (
                  <span
                    key={m}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-[#1a2332] border border-[#ccff00]/30 text-[#ccff00] font-bold"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141923] border border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Required Equipment
              </span>
              <p className="text-xs text-slate-100 font-semibold mt-1">{exercise.equipment}</p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccff00] mb-2.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#ccff00]" />
              <span>Step-by-Step Biomechanical Execution</span>
            </h3>
            <ol className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed bg-[#141923]/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#ccff00] text-slate-950 flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Breathing Cues */}
          {exercise.breathingCues && (
            <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/40 text-sky-200">
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Breathing Pattern & Intra-Abdominal Pressure (IAP)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{exercise.breathingCues}</p>
            </div>
          )}

          {/* Regressions & Progressions Ladder */}
          {(exercise.regressions || exercise.progressions) && (
            <div className="p-4 rounded-xl bg-[#141923] border border-slate-700 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                Progression Ladder & Scaling
              </span>
              {exercise.regressions && (
                <div className="text-xs text-slate-300">
                  <strong className="text-amber-400 font-bold">Regression (Easier): </strong>
                  {exercise.regressions}
                </div>
              )}
              {exercise.progressions && (
                <div className="text-xs text-slate-300">
                  <strong className="text-emerald-400 font-bold">Progression (Harder): </strong>
                  {exercise.progressions}
                </div>
              )}
            </div>
          )}

          {/* Safety & Joint Health Notes */}
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Safety Precaution & Form Warnings</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">{exercise.safetyNotes}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-700 bg-brand-card flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md shadow-[#ccff00]/20 active:scale-95 touch-manipulation"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
