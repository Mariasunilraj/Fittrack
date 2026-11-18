import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Play,
  Sparkles,
  Dumbbell,
  Shield,
  Clock,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2,
  Trash2,
  RotateCcw,
  PlusCircle,
  X,
  AlertCircle,
  Swords,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutSession, TrainingDiscipline, PlannedExercise } from '../../types';
import { EXERCISE_DATABASE } from '../../data/exerciseDatabase';

export const TrainingPlanner: React.FC = () => {
  const {
    workoutPlans,
    startWorkout,
    addWorkoutPlan,
    deleteWorkoutPlan,
    deleteExerciseFromPlan,
    addExerciseToPlan,
    updateWorkoutPlan,
    setCurrentView,
    showToast
  } = useApp();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState<string>(todayDayName);
  const [activeSubheadFilter, setActiveSubheadFilter] = useState<'all' | 'calisthenics' | 'taekwondo' | 'gym'>('all');

  // Deletion confirmation modal state
  const [sessionToDelete, setSessionToDelete] = useState<WorkoutSession | null>(null);

  // Modal state for adding a custom session
  const [showAddModal, setShowAddModal] = useState(false);
  const [addDisciplineTarget, setAddDisciplineTarget] = useState<TrainingDiscipline>('calisthenics');
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(45);

  // Quick technique picker modal
  const [pickingForSessionId, setPickingForSessionId] = useState<string | null>(null);
  const [pickingDiscipline, setPickingDiscipline] = useState<TrainingDiscipline>('calisthenics');

  // Get or seed default session for a given discipline on the selected day
  const getDisciplineSession = (discipline: 'calisthenics' | 'taekwondo' | 'gym'): WorkoutSession => {
    const existing = workoutPlans.find(
      p =>
        p.scheduledDay?.toLowerCase() === selectedDay.toLowerCase() &&
        (discipline === 'gym' ? (p.discipline === 'gym' || p.discipline === 'weightlifting') : p.discipline === discipline)
    );

    if (existing) return existing;

    // Default template sessions
    if (discipline === 'calisthenics') {
      const defaultSession: WorkoutSession = {
        id: `calis_${selectedDay.toLowerCase()}`,
        userId: 'usr_sunilraj_001',
        title: `${selectedDay} Calisthenics: Pull-Up & Core Ladder`,
        discipline: 'calisthenics',
        scheduledDay: selectedDay,
        durationMinutes: 45,
        exercises: [
          {
            id: `c_${selectedDay}_1`,
            exerciseId: 'cal-pullup-2',
            name: 'Strict Overhand Pull-Up',
            discipline: 'calisthenics',
            sets: 4,
            targetReps: 8,
            restSeconds: 90
          },
          {
            id: `c_${selectedDay}_2`,
            exerciseId: 'cal-dip-1',
            name: 'Parallel Bar Dips',
            discipline: 'calisthenics',
            sets: 3,
            targetReps: 12,
            restSeconds: 75
          },
          {
            id: `c_${selectedDay}_3`,
            exerciseId: 'cal-pushup-2',
            name: 'Standard Push-Up (Deficit Tempo)',
            discipline: 'calisthenics',
            sets: 3,
            targetReps: 15,
            restSeconds: 60
          },
          {
            id: `c_${selectedDay}_4`,
            exerciseId: 'cal-plank-1',
            name: 'Hollow Body Hold',
            discipline: 'calisthenics',
            sets: 3,
            targetHoldSeconds: 45,
            restSeconds: 60
          }
        ]
      };
      return defaultSession;
    }

    if (discipline === 'taekwondo') {
      const defaultSession: WorkoutSession = {
        id: `tkd_${selectedDay.toLowerCase()}`,
        userId: 'usr_sunilraj_001',
        title: `${selectedDay} Taekwondo: Poomsae & Kicking Mechanics`,
        discipline: 'taekwondo',
        scheduledDay: selectedDay,
        durationMinutes: 60,
        exercises: [
          {
            id: `t_${selectedDay}_1`,
            exerciseId: 'tkd-poomsae-1',
            name: 'Taegeuk 1 & 3 Forms (Poomsae Balance)',
            discipline: 'taekwondo',
            sets: 4,
            targetReps: 2,
            restSeconds: 60
          },
          {
            id: `t_${selectedDay}_2`,
            exerciseId: 'tkd-kick-2',
            name: 'Dollyo Chagi (Turning Kick 180° Pivot Drills)',
            discipline: 'taekwondo',
            sets: 5,
            targetReps: 20,
            restSeconds: 45
          },
          {
            id: `t_${selectedDay}_3`,
            exerciseId: 'tkd-kick-1',
            name: 'Ap Chagi (Front Snap Kick Chambering)',
            discipline: 'taekwondo',
            sets: 4,
            targetReps: 15,
            restSeconds: 45
          },
          {
            id: `t_${selectedDay}_4`,
            exerciseId: 'tkd-footwork-1',
            name: 'Fast Footwork & Switch Evasion Sliding',
            discipline: 'taekwondo',
            sets: 3,
            targetReps: 12,
            restSeconds: 45
          }
        ]
      };
      return defaultSession;
    }

    // Default Gym
    const defaultSession: WorkoutSession = {
      id: `gym_${selectedDay.toLowerCase()}`,
      userId: 'usr_sunilraj_001',
      title: `${selectedDay} Gym: Barbell Squat & Deadlift Strength`,
      discipline: 'gym',
      scheduledDay: selectedDay,
      durationMinutes: 50,
      exercises: [
        {
          id: `g_${selectedDay}_1`,
          exerciseId: 'gym-squat-1',
          name: 'Barbell Back Squat',
          discipline: 'weightlifting',
          sets: 4,
          targetReps: 6,
          targetWeightKg: 85,
          restSeconds: 120
        },
        {
          id: `g_${selectedDay}_2`,
          exerciseId: 'gym-deadlift-1',
          name: 'Conventional Barbell Deadlift',
          discipline: 'weightlifting',
          sets: 3,
          targetReps: 5,
          targetWeightKg: 110,
          restSeconds: 150
        },
        {
          id: `g_${selectedDay}_3`,
          exerciseId: 'gym-bench-1',
          name: 'Barbell Flat Bench Press',
          discipline: 'weightlifting',
          sets: 4,
          targetReps: 8,
          targetWeightKg: 75,
          restSeconds: 90
        },
        {
          id: `g_${selectedDay}_4`,
          exerciseId: 'gym-db-curl-1',
          name: 'Incline Dumbbell Bicep Curl',
          discipline: 'gym',
          sets: 3,
          targetReps: 12,
          targetWeightKg: 14,
          restSeconds: 60
        }
      ]
    };
    return defaultSession;
  };

  const calisSession = getDisciplineSession('calisthenics');
  const tkdSession = getDisciplineSession('taekwondo');
  const gymSession = getDisciplineSession('gym');

  // Deletion of an entire workout with safe confirmation modal
  const handleDeleteWorkout = (session: WorkoutSession) => {
    setSessionToDelete(session);
  };

  const confirmDeleteWorkout = (session: WorkoutSession) => {
    // If it exists in state, delete it; if it was default, create an emptied version
    const existing = workoutPlans.find(p => p.id === session.id);
    if (existing) {
      deleteWorkoutPlan(session.id);
    } else {
      // Save empty version
      updateWorkoutPlan({
        ...session,
        exercises: []
      });
    }
    showToast(`Removed "${session.title}" from ${selectedDay}!`);
  };

  // Deletion of an individual technique / exercise
  const handleDeleteTechnique = (session: WorkoutSession, exerciseId: string, exerciseName: string) => {
    // If session is already in workoutPlans
    const existing = workoutPlans.find(p => p.id === session.id);
    if (existing) {
      deleteExerciseFromPlan(session.id, exerciseId);
    } else {
      // First persist session without this exercise
      const updatedExercises = session.exercises.filter(
        ex => ex.id !== exerciseId && ex.exerciseId !== exerciseId
      );
      updateWorkoutPlan({
        ...session,
        exercises: updatedExercises
      });
      showToast(`Deleted technique "${exerciseName}" from workout.`);
    }
  };

  // Open technique picker to add an exercise
  const openTechniquePicker = (session: WorkoutSession) => {
    // Ensure session is registered
    const existing = workoutPlans.find(p => p.id === session.id);
    if (!existing) {
      updateWorkoutPlan(session);
    }
    setPickingForSessionId(session.id);
    setPickingDiscipline(session.discipline);
  };

  // Select an exercise from the database to add to the workout
  const handleSelectTechniqueToAdd = (dbEx: typeof EXERCISE_DATABASE[0]) => {
    if (!pickingForSessionId) return;

    const newEx: PlannedExercise = {
      id: `pe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      exerciseId: dbEx.id,
      name: dbEx.name,
      discipline: dbEx.discipline,
      sets: 3,
      targetReps: 10,
      restSeconds: 60
    };

    addExerciseToPlan(pickingForSessionId, newEx);
    setPickingForSessionId(null);
  };

  // Reset/restore default routine for a discipline
  const handleResetDiscipline = (discipline: 'calisthenics' | 'taekwondo' | 'gym') => {
    const defaultSession = getDisciplineSession(discipline);
    // Remove custom modifications and restore
    deleteWorkoutPlan(defaultSession.id);
    showToast(`Restored default ${discipline} schedule!`);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchingExercises = EXERCISE_DATABASE.filter(ex => ex.discipline === addDisciplineTarget);
    const chosen = matchingExercises.slice(0, 3);

    const newSession: WorkoutSession = {
      id: `ws_${Date.now()}`,
      userId: 'usr_sunilraj_001',
      title: newTitle,
      discipline: addDisciplineTarget,
      scheduledDay: selectedDay,
      durationMinutes: newDuration,
      exercises: chosen.map((ex, idx) => ({
        id: `pe_${Date.now()}_${idx}`,
        exerciseId: ex.id,
        name: ex.name,
        discipline: ex.discipline,
        sets: 3,
        targetReps: 10,
        restSeconds: 60
      }))
    };

    addWorkoutPlan(newSession);
    setShowAddModal(false);
    setNewTitle('');
    showToast(`New ${addDisciplineTarget} routine added for ${selectedDay}!`);
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-nav-safe animate-fadeIn max-w-5xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              Daily Training Routine
            </span>
            <span className="text-xs text-slate-400 font-medium">Technique & Schedule Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-[#ccff00]" />
            <span>Workout</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Daily training across three disciplines: <span className="inline-flex items-center gap-1 font-semibold text-white"><Activity className="w-3.5 h-3.5 text-[#ccff00]" /> Calisthenics</span>, <span className="inline-flex items-center gap-1 font-semibold text-white"><Swords className="w-3.5 h-3.5 text-rose-400" /> Taekwondo</span>, and <span className="inline-flex items-center gap-1 font-semibold text-white"><Dumbbell className="w-3.5 h-3.5 text-sky-400" /> Gym</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="min-h-[44px] py-2.5 px-4 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#ccff00]/20 transition cursor-pointer active:scale-95 touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* 2. Day of Week Selector with Scroll Hint */}
      <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border shadow-lg space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#ccff00]" />
            <span>Select Day of Schedule:</span>
          </span>
          <span className="text-slate-400">
            Viewing: <strong className="text-[#ccff00]">{selectedDay}</strong>
            {selectedDay.toLowerCase() === todayDayName.toLowerCase() && ' (Today)'}
          </span>
        </div>

        <div className="relative">
          <div className="flex sm:grid sm:grid-cols-7 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 pr-8 sm:pr-0">
            {daysOfWeek.map(day => {
              const isSelected = selectedDay.toLowerCase() === day.toLowerCase();
              const isToday = day.toLowerCase() === todayDayName.toLowerCase();
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[44px] py-2 px-2.5 sm:px-2 rounded-xl text-center text-xs font-bold transition cursor-pointer border flex-shrink-0 min-w-[58px] sm:min-w-0 flex-1 sm:flex-initial active:scale-95 touch-manipulation ${
                    isSelected
                      ? 'bg-[#ccff00] text-slate-950 border-[#ccff00] shadow-md shadow-[#ccff00]/20 font-black'
                      : 'bg-brand-card text-slate-300 border-brand-border hover:border-slate-500'
                  }`}
                >
                  <div className="leading-tight">{day.slice(0, 3)}</div>
                  {isToday && (
                    <span
                      className={`text-[9px] uppercase font-black block mt-0.5 ${
                        isSelected ? 'text-slate-950' : 'text-[#ccff00]'
                      }`}
                    >
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Scroll hint fade for mobile */}
          <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-surface to-transparent flex items-center justify-end pr-0.5 text-slate-400">
            <ChevronRight className="w-4 h-4 opacity-70" />
          </div>
        </div>
      </div>

      {/* 3. Sub-Heads Filter Tabs with Scroll Hint & Line Icons */}
      <div className="relative">
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-1 pr-8 sm:pr-0">
          <button
            onClick={() => setActiveSubheadFilter('all')}
            className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex-shrink-0 active:scale-95 touch-manipulation ${
              activeSubheadFilter === 'all'
                ? 'bg-[#ccff00] text-slate-950 border-[#ccff00] font-black'
                : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
            }`}
          >
            All 3 Sub-Heads
          </button>

          <button
            onClick={() => setActiveSubheadFilter('calisthenics')}
            className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 flex-shrink-0 active:scale-95 touch-manipulation ${
              activeSubheadFilter === 'calisthenics'
                ? 'bg-[#ccff00] text-slate-950 border-[#ccff00] font-black'
                : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-[#ccff00]" />
            <span>1. Calisthenics</span>
          </button>

          <button
            onClick={() => setActiveSubheadFilter('taekwondo')}
            className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 flex-shrink-0 active:scale-95 touch-manipulation ${
              activeSubheadFilter === 'taekwondo'
                ? 'bg-rose-500 text-white border-rose-500 font-black'
                : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>2. Taekwondo</span>
          </button>

          <button
            onClick={() => setActiveSubheadFilter('gym')}
            className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 flex-shrink-0 active:scale-95 touch-manipulation ${
              activeSubheadFilter === 'gym'
                ? 'bg-sky-400 text-slate-950 border-sky-400 font-black'
                : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-sky-400" />
            <span>3. Gym</span>
          </button>
        </div>

        {/* Scroll hint fade for subhead tabs */}
        <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0c0f14] to-transparent flex items-center justify-end pr-0.5 text-slate-400">
          <ChevronRight className="w-4 h-4 opacity-70" />
        </div>
      </div>

      {/* 4. THE THREE SUB-HEADS WITH SCHEDULE FOR THE DAY & DELETE BUTTONS */}
      <div className="space-y-8">
        {/* ======================================================== */}
        {/* SUB-HEAD 1: CALISTHENICS (CALIS) SCHEDULE               */}
        {/* ======================================================== */}
        {(activeSubheadFilter === 'all' || activeSubheadFilter === 'calisthenics') && (
          <div className="p-4 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xl space-y-5 animate-fadeIn">
            {/* Subhead Header with Delete Workout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ccff00] text-slate-950 flex items-center justify-center font-black shadow-md shadow-[#ccff00]/20 flex-shrink-0">
                  <Activity className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30">
                      Sub-Head 1
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Bodyweight Mastery</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    Calisthenics
                  </h2>
                </div>
              </div>

              {/* Workout Control Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-brand-card px-2.5 py-2 rounded-xl border border-brand-border min-h-[44px]">
                  <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>{calisSession.durationMinutes}m</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleResetDiscipline('calisthenics')}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 touch-manipulation"
                  title="Restore default Calisthenics schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                  <span>Reset</span>
                </button>

                {/* Safe Delete with Confirmation */}
                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(calisSession)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 border border-rose-500/50 text-rose-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 touch-manipulation"
                  title="Delete this Calisthenics workout routine"
                >
                  <Trash2 className="w-4 h-4 text-rose-300" />
                  <span>Delete</span>
                </button>

                {calisSession.exercises.length > 0 && (
                  <button
                    onClick={() => startWorkout(calisSession)}
                    className="min-h-[44px] py-2 px-4 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-[#ccff00]/20 transition cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Focus Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#141923] border border-slate-700 flex items-center justify-between text-xs gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[#ccff00] font-black uppercase text-[10px] tracking-wider block">
                  Routine Focus:
                </span>
                <span className="font-extrabold text-white text-sm sm:text-base truncate block">{calisSession.title}</span>
              </div>
              <button
                type="button"
                onClick={() => openTechniquePicker(calisSession)}
                className="min-h-[38px] py-1.5 px-3.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#ccff00]/15 transition cursor-pointer flex-shrink-0 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Technique</span>
              </button>
            </div>

            {/* Exercises / Techniques with Delete Button for each */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-300 block">
                  Techniques & Exercises ({calisSession.exercises.length}):
                </span>
                <span className="text-[11px] text-slate-400">
                  Click the trash icon to delete any technique
                </span>
              </div>

              {calisSession.exercises.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-brand-dark/50 border border-brand-border space-y-2">
                  <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No techniques in this Calisthenics schedule.</p>
                  <button
                    type="button"
                    onClick={() => openTechniquePicker(calisSession)}
                    className="min-h-[44px] py-2 px-4 rounded-xl bg-[#ccff00] text-slate-950 font-black text-xs"
                  >
                    + Add Technique
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {calisSession.exercises.map((ex, idx) => {
                    const photo =
                      ex.imageUrl ||
                      EXERCISE_DATABASE.find(
                        item => item.name.toLowerCase() === ex.name.toLowerCase() || item.id === ex.exerciseId
                      )?.imageUrl;

                    return (
                      <div
                        key={ex.id || idx}
                        className="p-3.5 sm:p-4 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 flex items-center justify-between gap-3 transition group shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {photo ? (
                            <img
                              src={photo}
                              alt={ex.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0 shadow-sm bg-[#0a0d14]"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-[#1a2332] border border-[#ccff00]/30 flex items-center justify-center font-black text-[#ccff00] text-xs flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="font-extrabold text-white text-xs sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2" title={ex.name}>{ex.name}</h4>
                            <p className="text-[11px] text-slate-300 font-medium truncate">
                              Rest: <strong className="text-white font-bold">{ex.restSeconds}s</strong> • {ex.sets} sets {ex.targetReps ? `× ${ex.targetReps} reps` : ex.targetHoldSeconds ? `× ${ex.targetHoldSeconds}s hold` : ''}
                            </p>
                          </div>
                        </div>

                        {/* DELETE TECHNIQUE BUTTON */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnique(calisSession, ex.id, ex.name)}
                            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 border border-transparent hover:border-rose-500 transition cursor-pointer flex items-center justify-center"
                            title={`Delete technique "${ex.name}"`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-HEAD 2: TAEKWONDO SCHEDULE                          */}
        {/* ======================================================== */}
        {(activeSubheadFilter === 'all' || activeSubheadFilter === 'taekwondo') && (
          <div className="p-4 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xl space-y-5 animate-fadeIn">
            {/* Subhead Header with Delete Workout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black shadow-md shadow-rose-500/20 flex-shrink-0">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Sub-Head 2
                    </span>
                    <span className="text-xs text-slate-400 font-bold">World Taekwondo (WT)</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    Taekwondo
                  </h2>
                </div>
              </div>

              {/* Workout Control Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-brand-card px-2.5 py-2 rounded-xl border border-brand-border min-h-[44px]">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>{tkdSession.durationMinutes}m</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleResetDiscipline('taekwondo')}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 touch-manipulation"
                  title="Restore default Taekwondo schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                  <span>Reset</span>
                </button>

                {/* Safe Delete with Confirmation */}
                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(tkdSession)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 border border-rose-500/50 text-rose-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 touch-manipulation"
                  title="Delete this Taekwondo workout routine"
                >
                  <Trash2 className="w-4 h-4 text-rose-300" />
                  <span>Delete</span>
                </button>

                {tkdSession.exercises.length > 0 && (
                  <button
                    onClick={() => startWorkout(tkdSession)}
                    className="min-h-[44px] py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Focus Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#141923] border border-slate-700 flex items-center justify-between text-xs gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-rose-400 font-black uppercase text-[10px] tracking-wider block">
                  Routine Focus:
                </span>
                <span className="font-extrabold text-white text-sm sm:text-base truncate block">{tkdSession.title}</span>
              </div>
              <button
                type="button"
                onClick={() => openTechniquePicker(tkdSession)}
                className="min-h-[38px] py-1.5 px-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/15 transition cursor-pointer flex-shrink-0 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Technique</span>
              </button>
            </div>

            {/* Exercises / Techniques with Delete Button for each */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-300 block">
                  Techniques & Kicks ({tkdSession.exercises.length}):
                </span>
                <span className="text-[11px] text-slate-400">
                  Click the trash icon to delete any technique
                </span>
              </div>

              {tkdSession.exercises.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-brand-dark/50 border border-brand-border space-y-2">
                  <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No techniques in this Taekwondo schedule.</p>
                  <button
                    type="button"
                    onClick={() => openTechniquePicker(tkdSession)}
                    className="min-h-[44px] py-2 px-4 rounded-xl bg-rose-500 text-white font-black text-xs"
                  >
                    + Add Technique
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tkdSession.exercises.map((ex, idx) => {
                    const photo =
                      ex.imageUrl ||
                      EXERCISE_DATABASE.find(
                        item => item.name.toLowerCase() === ex.name.toLowerCase() || item.id === ex.exerciseId
                      )?.imageUrl;

                    return (
                      <div
                        key={ex.id || idx}
                        className="p-3.5 sm:p-4 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 flex items-center justify-between gap-3 transition group shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {photo ? (
                            <img
                              src={photo}
                              alt={ex.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0 shadow-sm bg-[#0a0d14]"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-[#1a2332] border border-rose-500/30 flex items-center justify-center font-black text-rose-400 text-xs flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="font-extrabold text-white text-xs sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2" title={ex.name}>{ex.name}</h4>
                            <p className="text-[11px] text-slate-300 font-medium truncate">
                              Rest: <strong className="text-white font-bold">{ex.restSeconds}s</strong> • {ex.sets} sets {ex.targetReps ? `× ${ex.targetReps} reps` : 'Poomsae pattern'}
                            </p>
                          </div>
                        </div>

                        {/* DELETE TECHNIQUE BUTTON */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnique(tkdSession, ex.id, ex.name)}
                            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 border border-transparent hover:border-rose-500 transition cursor-pointer flex items-center justify-center"
                            title={`Delete technique "${ex.name}"`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-HEAD 3: GYM SCHEDULE                                */}
        {/* ======================================================== */}
        {(activeSubheadFilter === 'all' || activeSubheadFilter === 'gym') && (
          <div className="p-4 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xl space-y-5 animate-fadeIn">
            {/* Subhead Header with Delete Workout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-sky-400/20 flex-shrink-0">
                  <Dumbbell className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      Sub-Head 3
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Resistance & Hypertrophy</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    Gym & Strength
                  </h2>
                </div>
              </div>

              {/* Workout Control Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-brand-card px-2.5 py-2 rounded-xl border border-brand-border min-h-[44px]">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{gymSession.durationMinutes}m</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleResetDiscipline('gym')}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 touch-manipulation"
                  title="Restore default Gym schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                  <span>Reset</span>
                </button>

                {/* Safe Delete with Confirmation */}
                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(gymSession)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 border border-rose-500/50 text-rose-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 touch-manipulation"
                  title="Delete this Gym workout routine"
                >
                  <Trash2 className="w-4 h-4 text-rose-300" />
                  <span>Delete</span>
                </button>

                {gymSession.exercises.length > 0 && (
                  <button
                    onClick={() => startWorkout(gymSession)}
                    className="min-h-[44px] py-2 px-4 rounded-xl bg-sky-400 hover:bg-sky-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-400/20 transition cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Focus Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#141923] border border-slate-700 flex items-center justify-between text-xs gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-sky-400 font-black uppercase text-[10px] tracking-wider block">
                  Routine Focus:
                </span>
                <span className="font-extrabold text-white text-sm sm:text-base truncate block">{gymSession.title}</span>
              </div>
              <button
                type="button"
                onClick={() => openTechniquePicker(gymSession)}
                className="min-h-[38px] py-1.5 px-3.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-400/15 transition cursor-pointer flex-shrink-0 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Technique</span>
              </button>
            </div>

            {/* Exercises / Techniques with Delete Button for each */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-300 block">
                  Techniques & Lifts ({gymSession.exercises.length}):
                </span>
                <span className="text-[11px] text-slate-400">
                  Click the trash icon to delete any technique
                </span>
              </div>

              {gymSession.exercises.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-brand-dark/50 border border-brand-border space-y-2">
                  <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No techniques in this Gym schedule.</p>
                  <button
                    type="button"
                    onClick={() => openTechniquePicker(gymSession)}
                    className="min-h-[44px] py-2 px-4 rounded-xl bg-sky-400 text-slate-950 font-black text-xs"
                  >
                    + Add Technique
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gymSession.exercises.map((ex, idx) => {
                    const photo =
                      ex.imageUrl ||
                      EXERCISE_DATABASE.find(
                        item => item.name.toLowerCase() === ex.name.toLowerCase() || item.id === ex.exerciseId
                      )?.imageUrl;

                    return (
                      <div
                        key={ex.id || idx}
                        className="p-3.5 sm:p-4 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 flex items-center justify-between gap-3 transition group shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {photo ? (
                            <img
                              src={photo}
                              alt={ex.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0 shadow-sm bg-[#0a0d14]"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-[#1a2332] border border-sky-400/30 flex items-center justify-center font-black text-sky-400 text-xs flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="font-extrabold text-white text-xs sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2" title={ex.name}>{ex.name}</h4>
                            <p className="text-[11px] text-slate-300 font-medium truncate">
                              Rest: <strong className="text-white font-bold">{ex.restSeconds}s</strong> • {ex.sets} sets × {ex.targetReps} reps {ex.targetWeightKg ? `@ ${ex.targetWeightKg}kg` : ''}
                            </p>
                          </div>
                        </div>

                        {/* DELETE TECHNIQUE BUTTON */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnique(gymSession, ex.id, ex.name)}
                            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 border border-transparent hover:border-rose-500 transition cursor-pointer flex items-center justify-center"
                            title={`Delete technique "${ex.name}"`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Technique Picker Modal */}
      {pickingForSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0f141f] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">Add Technique to Schedule</h3>
                <p className="text-xs text-slate-300">Choose a technique to add to your {selectedDay} workout.</p>
              </div>
              <button
                type="button"
                onClick={() => setPickingForSessionId(null)}
                className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1 safe-area-bottom">
              {EXERCISE_DATABASE.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => handleSelectTechniqueToAdd(ex)}
                  className="p-3 rounded-xl bg-[#141923] hover:bg-[#1a2332] border border-slate-700/80 hover:border-[#ccff00]/50 flex items-center justify-between cursor-pointer transition group gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {ex.imageUrl ? (
                      <img
                        src={ex.imageUrl}
                        alt={ex.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0 bg-[#0a0d14]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#0a0d14] flex items-center justify-center text-xs font-black text-[#ccff00] flex-shrink-0 border border-slate-700">
                        {ex.discipline.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-white group-hover:text-[#ccff00] truncate">
                          {ex.name}
                        </span>
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-black/60 text-[#ccff00] border border-[#ccff00]/30 flex-shrink-0">
                          {ex.discipline}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 truncate font-medium">
                        Target: {ex.targetMuscles.join(', ')} • {ex.equipment}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs flex items-center gap-1 group-hover:scale-105 transition flex-shrink-0 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding a custom session */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-2xl text-slate-100">
            <h2 className="text-xl font-bold text-white mb-1">Add Session to Schedule</h2>
            <p className="text-xs text-slate-400 mb-4">
              Schedule a custom routine under one of the 3 sub-heads for {selectedDay}.
            </p>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Sub-Head Discipline
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'calisthenics', label: 'Calisthenics', icon: Activity, color: 'text-[#ccff00]' },
                    { id: 'taekwondo', label: 'Taekwondo', icon: Swords, color: 'text-rose-400' },
                    { id: 'gym', label: 'Gym', icon: Dumbbell, color: 'text-sky-400' }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAddDisciplineTarget(item.id as TrainingDiscipline)}
                        className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer active:scale-95 touch-manipulation ${
                          addDisciplineTarget === item.id
                            ? 'bg-[#ccff00] text-slate-950 border-[#ccff00] shadow-sm font-black'
                            : 'bg-brand-dark border-brand-border text-slate-300 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${addDisciplineTarget === item.id ? 'text-slate-950' : item.color}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weighted Pull-Ups & L-Sit Ladder"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-[#ccff00] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Duration (Minutes): {newDuration}m
                </label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={newDuration}
                  onChange={e => setNewDuration(Number(e.target.value))}
                  className="w-full accent-[#ccff00] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black rounded-xl text-xs shadow-md shadow-[#ccff00]/20 cursor-pointer active:scale-95 touch-manipulation"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workout Deletion Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Delete Workout Routine?</h3>
                <p className="text-xs text-slate-400 mt-0.5">Are you sure you want to delete this routine?</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-brand-dark/80 p-3 rounded-xl border border-brand-border">
              "{sessionToDelete.title}" will be removed from your {selectedDay} schedule. You can restore the default routine anytime using the Reset button.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDeleteWorkout(sessionToDelete);
                  setSessionToDelete(null);
                }}
                className="min-h-[44px] px-4 py-2 text-xs font-bold text-white rounded-xl bg-rose-600 hover:bg-rose-500 transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
