import React, { useState } from 'react';
import {
  Dumbbell,
  Shield,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  Layers,
  Sparkles,
  Trash2,
  AlertCircle,
  Swords,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutSession, TrainingDiscipline } from '../../types';
import { EXERCISE_DATABASE } from '../../data/exerciseDatabase';

export const DashboardTodayWorkoutPlan: React.FC = () => {
  const {
    workoutPlans,
    startWorkout,
    deleteWorkoutPlan,
    deleteExerciseFromPlan,
    updateWorkoutPlan,
    setCurrentView,
    showToast
  } = useApp();

  const [selectedDiscipline, setSelectedDiscipline] = useState<'calisthenics' | 'taekwondo' | 'gym'>('calisthenics');

  // Find or provide rich sessions for each of the 3 disciplines for today
  const calisSession: WorkoutSession = workoutPlans.find(p => p.discipline === 'calisthenics') || {
    id: 'ws_today_calis',
    userId: 'usr_sunilraj_001',
    title: 'Calisthenics Strength & Pull-Up Ladder',
    discipline: 'calisthenics',
    scheduledDay: 'Today',
    durationMinutes: 45,
    exercises: [
      { id: 'c1', exerciseId: 'cal-pullup-2', name: 'Strict Overhand Pull-Up', discipline: 'calisthenics', sets: 4, targetReps: 8, restSeconds: 90 },
      { id: 'c2', exerciseId: 'cal-dip-1', name: 'Parallel Bar Dips', discipline: 'calisthenics', sets: 3, targetReps: 12, restSeconds: 75 },
      { id: 'c3', exerciseId: 'cal-pushup-2', name: 'Standard Push-Up (Deficit)', discipline: 'calisthenics', sets: 3, targetReps: 15, restSeconds: 60 },
      { id: 'c4', exerciseId: 'cal-plank-1', name: 'Hollow Body Hold', discipline: 'calisthenics', sets: 3, targetHoldSeconds: 45, restSeconds: 60 }
    ]
  };

  const tkdSession: WorkoutSession = workoutPlans.find(p => p.discipline === 'taekwondo') || {
    id: 'ws_today_tkd',
    userId: 'usr_sunilraj_001',
    title: 'Taekwondo Poomsae & Dynamic Kick Drills',
    discipline: 'taekwondo',
    scheduledDay: 'Today',
    durationMinutes: 60,
    exercises: [
      { id: 't1', exerciseId: 'tkd-poomsae-1', name: 'Taegeuk 1 & 3 Forms (Poomsae)', discipline: 'taekwondo', sets: 4, targetReps: 2, restSeconds: 60 },
      { id: 't2', exerciseId: 'tkd-kick-2', name: 'Dollyo Chagi (Turning Kick Pad Drills)', discipline: 'taekwondo', sets: 5, targetReps: 20, restSeconds: 45 },
      { id: 't3', exerciseId: 'tkd-kick-1', name: 'Ap Chagi (Front Snap Kick Chambering)', discipline: 'taekwondo', sets: 4, targetReps: 15, restSeconds: 45 },
      { id: 't4', exerciseId: 'tkd-footwork-1', name: 'Fast Footwork & Sliding Evasion', discipline: 'taekwondo', sets: 3, targetReps: 12, restSeconds: 45 }
    ]
  };

  const gymSession: WorkoutSession = workoutPlans.find(p => p.discipline === 'gym' || p.discipline === 'weightlifting') || {
    id: 'ws_today_gym',
    userId: 'usr_sunilraj_001',
    title: 'Gym Resistance & Barbell Power',
    discipline: 'gym',
    scheduledDay: 'Today',
    durationMinutes: 50,
    exercises: [
      { id: 'g1', exerciseId: 'gym-squat-1', name: 'Barbell Back Squat', discipline: 'weightlifting', sets: 4, targetReps: 6, targetWeightKg: 85, restSeconds: 120 },
      { id: 'g2', exerciseId: 'gym-deadlift-1', name: 'Conventional Barbell Deadlift', discipline: 'weightlifting', sets: 3, targetReps: 5, targetWeightKg: 110, restSeconds: 150 },
      { id: 'g3', exerciseId: 'gym-bench-1', name: 'Barbell Flat Bench Press', discipline: 'weightlifting', sets: 4, targetReps: 8, targetWeightKg: 75, restSeconds: 90 },
      { id: 'g4', exerciseId: 'gym-db-curl-1', name: 'Incline Dumbbell Bicep Curl', discipline: 'gym', sets: 3, targetReps: 12, targetWeightKg: 14, restSeconds: 60 }
    ]
  };

  const activeSessionMap = {
    calisthenics: calisSession,
    taekwondo: tkdSession,
    gym: gymSession
  };

  const currentSession = activeSessionMap[selectedDiscipline];

  const handleDeleteWorkout = () => {
    if (window.confirm(`Delete today's ${currentSession.title}?`)) {
      const existing = workoutPlans.find(p => p.id === currentSession.id);
      if (existing) {
        deleteWorkoutPlan(currentSession.id);
      } else {
        updateWorkoutPlan({
          ...currentSession,
          exercises: []
        });
      }
      showToast(`Removed "${currentSession.title}"`);
    }
  };

  const handleDeleteTechnique = (exId: string, exName: string) => {
    const existing = workoutPlans.find(p => p.id === currentSession.id);
    if (existing) {
      deleteExerciseFromPlan(currentSession.id, exId);
    } else {
      const updatedExercises = currentSession.exercises.filter(
        ex => ex.id !== exId && ex.exerciseId !== exId
      );
      updateWorkoutPlan({
        ...currentSession,
        exercises: updatedExercises
      });
      showToast(`Deleted "${exName}" from today's plan.`);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
              Today's Session Schedule
            </span>
            <span className="text-xs text-slate-400">Multi-Discipline Hybrid Plan</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-yellow" />
            <span>Today's Workout Plan: Calisthenics, Taekwondo & Gym</span>
          </h2>
        </div>

        <button
          onClick={() => setCurrentView('training')}
          className="text-xs font-semibold text-brand-yellow hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Full Weekly Schedule</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Discipline Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-brand-dark/80 border border-brand-border">
        <button
          type="button"
          onClick={() => setSelectedDiscipline('calisthenics')}
          className={`min-h-[44px] py-2.5 px-2 sm:px-4 rounded-xl text-center font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
            selectedDiscipline === 'calisthenics'
              ? 'bg-[#ccff00] text-slate-950 shadow-md shadow-[#ccff00]/15 font-black'
              : 'text-slate-400 hover:text-white hover:bg-brand-card'
          }`}
        >
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
          <span>Calisthenics</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedDiscipline('taekwondo')}
          className={`min-h-[44px] py-2.5 px-2 sm:px-4 rounded-xl text-center font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
            selectedDiscipline === 'taekwondo'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-black'
              : 'text-slate-400 hover:text-white hover:bg-brand-card'
          }`}
        >
          <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
          <span>Taekwondo</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedDiscipline('gym')}
          className={`min-h-[44px] py-2.5 px-2 sm:px-4 rounded-xl text-center font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
            selectedDiscipline === 'gym'
              ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20 font-black'
              : 'text-slate-400 hover:text-white hover:bg-brand-card'
          }`}
        >
          <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
          <span>Gym & Lifts</span>
        </button>
      </div>

      {/* Selected Workout Card Details */}
      <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-dark text-brand-yellow">
                {currentSession.discipline}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {currentSession.durationMinutes} minutes
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
              {currentSession.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {currentSession.isCompleted ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="text-xs text-brand-yellow font-semibold">
                Ready to Launch
              </span>
            )}

            {/* DELETE WORKOUT BUTTON */}
            <button
              type="button"
              onClick={handleDeleteWorkout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer border border-transparent hover:border-rose-500/30"
              title="Delete this workout routine"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Exercise Checklist with Delete Technique buttons */}
        {currentSession.exercises.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-brand-dark/50 border border-brand-border space-y-1">
            <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">All techniques removed from this routine.</p>
            <button
              onClick={() => setCurrentView('training')}
              className="text-xs text-brand-yellow font-bold hover:underline"
            >
              Open Workout planner to add techniques
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentSession.exercises.map((ex, idx) => {
              const photo =
                ex.imageUrl ||
                EXERCISE_DATABASE.find(
                  item => item.name.toLowerCase() === ex.name.toLowerCase() || item.id === ex.exerciseId
                )?.imageUrl;

              return (
                <div
                  key={ex.id || idx}
                  className="p-3 rounded-xl bg-brand-dark/80 border border-brand-border flex items-center justify-between text-xs hover:border-slate-500 transition group"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {photo ? (
                      <img
                        src={photo}
                        alt={ex.name}
                        className="w-10 h-10 rounded-lg object-cover border border-brand-border flex-shrink-0"
                      />
                    ) : (
                      <span className="w-6 h-6 rounded-md bg-brand-card flex items-center justify-center font-bold text-brand-yellow text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{ex.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {ex.sets} sets {ex.targetReps ? `× ${ex.targetReps} reps` : ex.targetHoldSeconds ? `× ${ex.targetHoldSeconds}s` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* DELETE TECHNIQUE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTechnique(ex.id, ex.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                      title={`Delete technique "${ex.name}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Rest Target: <strong className="text-slate-200">60-90s</strong> between working sets
          </span>

          {currentSession.exercises.length > 0 && (
            <button
              onClick={() => startWorkout(currentSession)}
              className="py-2.5 px-6 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Tracker & Rest Timer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
