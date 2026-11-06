import React from 'react';
import { Dumbbell, Clock, Play, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TodaySessionCard: React.FC = () => {
  const { workoutPlans, startWorkout, setCurrentView } = useApp();
  const session = workoutPlans[0];

  if (!session) {
    return (
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border text-center">
        <Dumbbell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h3 className="font-bold text-white text-base">No session planned for today</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Select an exercise template or generate an AI plan.</p>
        <button
          onClick={() => setCurrentView('training')}
          className="px-4 py-2 bg-brand-yellow text-slate-950 rounded-xl font-bold text-xs"
        >
          Open Workout Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
              {session.discipline}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {session.durationMinutes} mins
            </span>
          </div>

          {session.isCompleted ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-400">Scheduled for Today</span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">{session.title}</h3>

        <div className="mt-4 space-y-2">
          {session.exercises.map((ex, idx) => (
            <div
              key={ex.id || idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-brand-card/80 border border-brand-border/60 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-brand-dark flex items-center justify-center font-bold text-slate-400 text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-200">{ex.name}</span>
              </div>
              <div className="text-slate-400 font-mono">
                {ex.sets} sets {ex.targetReps ? `× ${ex.targetReps} reps` : ex.targetHoldSeconds ? `× ${ex.targetHoldSeconds}s hold` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentView('training')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition cursor-pointer"
        >
          <span>View Weekly Routine</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => startWorkout(session)}
          className={`py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md ${
            session.isCompleted
              ? 'bg-brand-card hover:bg-brand-hover text-slate-200 border border-brand-border'
              : 'bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 shadow-brand-yellow/15'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{session.isCompleted ? 'Repeat Session' : 'Launch Workout Tracker'}</span>
        </button>
      </div>
    </div>
  );
};
