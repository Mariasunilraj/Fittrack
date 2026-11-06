import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Plus,
  Flame,
  Award,
  ShieldAlert,
  Dumbbell,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutSession, PlannedExercise, CompletedSet } from '../../types';
import { useApp } from '../../context/AppContext';
import { RestTimer } from './RestTimer';
import { EXERCISE_DATABASE } from '../../data/exerciseDatabase';

interface LiveWorkoutModalProps {
  session: WorkoutSession;
  onClose: () => void;
}

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({ session, onClose }) => {
  const { finishActiveWorkout, showToast, addPersonalRecord } = useApp();
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(() => JSON.parse(JSON.stringify(session)));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionRpe, setSessionRpe] = useState(7);
  const [sessionNotes, setSessionNotes] = useState('');
  const [activeRestSeconds, setActiveRestSeconds] = useState<number | null>(null);

  // Stopwatch timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatStopwatch = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggleSet = (exIndex: number, setIndex: number) => {
    const updated = { ...currentSession };
    const ex = updated.exercises[exIndex];
    if (!ex.completedSets) {
      ex.completedSets = Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: ex.targetReps || 10,
        loadKg: ex.targetWeightKg || 0,
        completed: false
      }));
    }

    const setItem = ex.completedSets[setIndex];
    const willBeCompleted = !setItem.completed;
    setItem.completed = willBeCompleted;

    setCurrentSession(updated);

    if (willBeCompleted) {
      showToast(`Set ${setIndex + 1} completed!`);
      // Trigger rest timer
      setActiveRestSeconds(ex.restSeconds || 60);
    }
  };

  const updateSetValues = (exIndex: number, setIndex: number, field: 'reps' | 'loadKg', value: number) => {
    const updated = { ...currentSession };
    const ex = updated.exercises[exIndex];
    if (ex.completedSets && ex.completedSets[setIndex]) {
      ex.completedSets[setIndex][field] = value;
      setCurrentSession(updated);
    }
  };

  const handleFinish = () => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // confetti fallback
    }

    finishActiveWorkout({
      ...currentSession,
      rpe: sessionRpe,
      notes: sessionNotes,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60))
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header with Stopwatch */}
        <div className="px-6 py-4 border-b border-brand-border bg-brand-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center">
              <Dumbbell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-yellow text-slate-950">
                  Live Session
                </span>
                <span className="text-xs text-slate-400 capitalize">{currentSession.discipline}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{currentSession.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400">Duration</div>
              <div className="text-xl font-black font-mono text-brand-yellow">
                {formatStopwatch(elapsedSeconds)}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-brand-hover transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exercises List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {currentSession.exercises.map((ex, exIdx) => {
            const completedSets = ex.completedSets || Array.from({ length: ex.sets }, (_, i) => ({
              setNumber: i + 1,
              reps: ex.targetReps || 8,
              loadKg: ex.targetWeightKg || 0,
              completed: false
            }));

            const photoUrl =
              ex.imageUrl ||
              EXERCISE_DATABASE.find(item => item.name.toLowerCase() === ex.name.toLowerCase())?.imageUrl;

            return (
              <div key={ex.id || exIdx} className="p-4 sm:p-5 rounded-2xl bg-brand-card border border-brand-border space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={ex.name}
                        className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center font-bold text-xs text-brand-yellow flex-shrink-0">
                        {exIdx + 1}
                      </span>
                    )}
                    <div>
                      <div className="text-[10px] font-bold text-brand-yellow uppercase tracking-wider">
                        Movement #{exIdx + 1}
                      </div>
                      <h3 className="font-bold text-white text-base leading-tight">{ex.name}</h3>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium text-right flex-shrink-0">
                    Rest Target: <strong className="text-slate-200">{ex.restSeconds}s</strong>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
                    <span className="col-span-2">Set</span>
                    <span className="col-span-4">Load (kg)</span>
                    <span className="col-span-4">Reps / Secs</span>
                    <span className="col-span-2 text-right">Done</span>
                  </div>

                  {completedSets.map((setItem, setIdx) => (
                    <div
                      key={setIdx}
                      className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border transition ${
                        setItem.completed
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-brand-dark/70 border-brand-border text-slate-300'
                      }`}
                    >
                      <span className="col-span-2 font-bold text-xs pl-2">#{setItem.setNumber}</span>

                      <div className="col-span-4 flex items-center gap-1">
                        <input
                          type="number"
                          value={setItem.loadKg || ''}
                          placeholder="BW"
                          onChange={e => updateSetValues(exIdx, setIdx, 'loadKg', Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-brand-surface border border-brand-border rounded-lg text-xs font-mono text-center text-white focus:outline-none focus:border-brand-yellow"
                        />
                        <span className="text-[10px] text-slate-400">kg</span>
                      </div>

                      <div className="col-span-4 flex items-center gap-1">
                        <input
                          type="number"
                          value={setItem.reps || ''}
                          placeholder="8"
                          onChange={e => updateSetValues(exIdx, setIdx, 'reps', Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-brand-surface border border-brand-border rounded-lg text-xs font-mono text-center text-white focus:outline-none focus:border-brand-yellow"
                        />
                        <span className="text-[10px] text-slate-400">reps</span>
                      </div>

                      <div className="col-span-2 flex justify-end pr-1">
                        <button
                          type="button"
                          onClick={() => handleToggleSet(exIdx, setIdx)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            setItem.completed
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-brand-hover text-slate-400 hover:text-white hover:bg-brand-border'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Effort (RPE) & Notes */}
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
              <span>Rate of Perceived Exertion (RPE): {sessionRpe}/10</span>
              <span className="text-brand-yellow font-normal lowercase">
                {sessionRpe <= 6 ? 'easy / warm' : sessionRpe <= 8 ? 'solid working effort' : 'high intensity'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sessionRpe}
              onChange={e => setSessionRpe(Number(e.target.value))}
              className="w-full accent-[#e2f163] cursor-pointer"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Session Notes & Form Feelings (Optional)
              </label>
              <textarea
                rows={2}
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="e.g. Pull-ups felt strict and controlled today. Maintained clean hollow body on final set."
                className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-brand-border bg-brand-card flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel Session
          </button>

          <button
            onClick={handleFinish}
            className="py-3 px-6 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish & Log Workout</span>
          </button>
        </div>
      </div>

      {/* Floating Rest Timer */}
      {activeRestSeconds !== null && (
        <RestTimer
          initialSeconds={activeRestSeconds}
          onClose={() => setActiveRestSeconds(null)}
        />
      )}
    </div>
  );
};
