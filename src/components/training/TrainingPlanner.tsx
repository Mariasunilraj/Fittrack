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
  AlertCircle
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
        userId: 'usr_demo_001',
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
        userId: 'usr_demo_001',
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
      userId: 'usr_demo_001',
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

  // Deletion of an entire workout
  const handleDeleteWorkout = (session: WorkoutSession) => {
    if (window.confirm(`Delete "${session.title}" from your ${selectedDay} schedule?`)) {
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
    }
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
      userId: 'usr_demo_001',
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
    <div className="space-y-7 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
              Daily Training Routine
            </span>
            <span className="text-xs text-slate-400">Workout & Technique Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-brand-yellow" />
            <span>Workout</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organized across three sub-heads: <strong className="text-brand-yellow">Calisthenics (Calis)</strong>, <strong className="text-rose-400">Taekwondo</strong>, and <strong className="text-sky-400">Gym</strong>. Use the delete buttons to remove workouts or individual techniques anytime.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setCurrentView('ai-coach')}
            className="py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            <span>AI Routine</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-brand-yellow/15 transition cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* 2. Day of Week Selector */}
      <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border shadow-lg space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-yellow" />
            <span>Select Day of Schedule:</span>
          </span>
          <span className="text-slate-400">
            Viewing: <strong className="text-brand-yellow">{selectedDay}</strong>
            {selectedDay.toLowerCase() === todayDayName.toLowerCase() && ' (Today)'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {daysOfWeek.map(day => {
            const isSelected = selectedDay.toLowerCase() === day.toLowerCase();
            const isToday = day.toLowerCase() === todayDayName.toLowerCase();
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`py-2.5 px-2 rounded-xl text-center text-xs font-bold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-md shadow-brand-yellow/15'
                    : 'bg-brand-card text-slate-300 border-brand-border hover:border-slate-500'
                }`}
              >
                <div className="leading-tight">{day.slice(0, 3)}</div>
                {isToday && (
                  <span
                    className={`text-[9px] uppercase font-black block mt-0.5 ${
                      isSelected ? 'text-slate-950' : 'text-brand-yellow'
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-Heads Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubheadFilter('all')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border ${
            activeSubheadFilter === 'all'
              ? 'bg-brand-yellow text-slate-950 border-brand-yellow'
              : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
          }`}
        >
          All 3 Sub-Heads (Full View)
        </button>

        <button
          onClick={() => setActiveSubheadFilter('calisthenics')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
            activeSubheadFilter === 'calisthenics'
              ? 'bg-brand-yellow text-slate-950 border-brand-yellow'
              : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
          }`}
        >
          <span>🤸</span>
          <span>1. Calisthenics (Calis)</span>
        </button>

        <button
          onClick={() => setActiveSubheadFilter('taekwondo')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
            activeSubheadFilter === 'taekwondo'
              ? 'bg-brand-yellow text-slate-950 border-brand-yellow'
              : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
          }`}
        >
          <span>🥋</span>
          <span>2. Taekwondo</span>
        </button>

        <button
          onClick={() => setActiveSubheadFilter('gym')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
            activeSubheadFilter === 'gym'
              ? 'bg-brand-yellow text-slate-950 border-brand-yellow'
              : 'bg-brand-surface border-brand-border text-slate-400 hover:text-white'
          }`}
        >
          <span>🏋️</span>
          <span>3. Gym</span>
        </button>
      </div>

      {/* 4. THE THREE SUB-HEADS WITH SCHEDULE FOR THE DAY & DELETE BUTTONS */}
      <div className="space-y-8">
        {/* ======================================================== */}
        {/* SUB-HEAD 1: CALISTHENICS (CALIS) SCHEDULE               */}
        {/* ======================================================== */}
        {(activeSubheadFilter === 'all' || activeSubheadFilter === 'calisthenics') && (
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xl space-y-5 animate-fadeIn">
            {/* Subhead Header with Delete Workout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shadow-brand-yellow/20 flex-shrink-0">
                  🤸
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
                      Sub-Head 1
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Bodyweight Mastery</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    Calisthenics (Calis) — Schedule for {selectedDay}
                  </h2>
                </div>
              </div>

              {/* Workout Control Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-brand-card px-2.5 py-1.5 rounded-xl border border-brand-border">
                  <Clock className="w-3.5 h-3.5 text-brand-yellow" />
                  {calisSession.durationMinutes}m
                </span>

                {/* DELETE WORKOUT BUTTON */}
                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(calisSession)}
                  className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Delete this Calisthenics workout routine"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Delete Workout</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetDiscipline('calisthenics')}
                  className="p-2 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-400 hover:text-white transition cursor-pointer"
                  title="Restore default Calisthenics schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {calisSession.exercises.length > 0 && (
                  <button
                    onClick={() => startWorkout(calisSession)}
                    className="py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Focus Banner */}
            <div className="p-3.5 rounded-xl bg-brand-card/80 border border-brand-border flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-brand-yellow font-bold uppercase text-[10px] tracking-wider block">
                  Routine Focus:
                </span>
                <span className="font-bold text-white text-sm">{calisSession.title}</span>
              </div>
              <button
                type="button"
                onClick={() => openTechniquePicker(calisSession)}
                className="py-1 px-3 rounded-lg bg-brand-yellow/15 hover:bg-brand-yellow text-brand-yellow hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-brand-yellow/30"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Technique</span>
              </button>
            </div>

            {/* Exercises / Techniques with Delete Button for each */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 block">
                  Techniques & Exercises ({calisSession.exercises.length}):
                </span>
                <span className="text-[11px] text-slate-500">
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
                    className="py-1.5 px-4 rounded-xl bg-brand-yellow text-slate-950 font-bold text-xs"
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
                        className="p-3.5 sm:p-4 rounded-xl bg-brand-dark/80 border border-brand-border flex items-center justify-between gap-3 hover:border-slate-500 transition group"
                      >
                        <div className="flex items-center gap-3 truncate pr-2">
                          {photo ? (
                            <img
                              src={photo}
                              alt={ex.name}
                              className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0 shadow-sm"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center font-bold text-brand-yellow text-[10px] flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="space-y-0.5 truncate">
                            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{ex.name}</h4>
                            <p className="text-[11px] text-slate-400">
                              Rest: <strong className="text-slate-300">{ex.restSeconds}s</strong> • {ex.sets} sets {ex.targetReps ? `× ${ex.targetReps} reps` : ex.targetHoldSeconds ? `× ${ex.targetHoldSeconds}s hold` : ''}
                            </p>
                          </div>
                        </div>

                        {/* DELETE TECHNIQUE BUTTON */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnique(calisSession, ex.id, ex.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
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
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xl space-y-5 animate-fadeIn">
            {/* Subhead Header with Delete Workout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-rose-500/20 flex-shrink-0">
                  🥋
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Sub-Head 2
                    </span>
                    <span className="text-xs text-slate-400 font-bold">World Taekwondo (WT)</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    Taekwondo — Schedule for {selectedDay}
                  </h2>
                </div>
              </div>

              {/* Workout Control Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-brand-card px-2.5 py-1.5 rounded-xl border border-brand-border">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  {tkdSession.durationMinutes} mins
                </span>

                {/* DELETE WORKOUT BUTTON */}
                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(tkdSession)}
                  className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Delete this Taekwondo workout routine"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Delete Workout</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetDiscipline('taekwondo')}
                  className="p-2 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-400 hover:text-white transition cursor-pointer"
                  title="Restore default Taekwondo schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {tkdSession.exercises.length > 0 && (
                  <button
                    onClick={() => startWorkout(tkdSession)}
                    className="py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition cursor-pointer hover:scale-[1.02]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Focus Banner */}
            <div className="p-3.5 rounded-xl bg-brand-card/80 border border-brand-border flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-rose-400 font-bold uppercase text-[10px] tracking-wider block">
                  Routine Focus:
                </span>
                <span className="font-bold text-white text-sm">{tkdSession.title}</span>
              </div>
              <button
                type="button"
                onClick={() => openTechniquePicker(tkdSession)}
                className="py-1 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-rose-500/30"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Technique</span>
              </button>
            </div>

            {/* Exercises / Techniques with Delete Button for each */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 block">
                  Techniques & Kicks ({tkdSession.exercises.length}):
                </span>
                <span className="text-[11px] text-slate-500">
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
                    className="py-1.5 px-4 rounded-xl bg-rose-500 text-white font-bold text-xs"
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
                        className="p-3.5 sm:p-4 rounded-xl bg-brand-dark/80 border border-brand-border flex items-center justify-between gap-3 hover:border-slate-500 transition group"
                      >
                        <div className="flex items-center gap-3 truncate pr-2">
                          {photo ? (
                            <img
                              src={photo}
                              alt={ex.name}
                              className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0 shadow-sm"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center font-bold text-rose-400 text-[10px] flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="space-y-0.5 truncate">
                            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{ex.name}</h4>
                            <p className="text-[11px] text-slate-400">
                              Rest: <strong className="text-slate-300">{ex.restSeconds}s</strong> • {ex.sets} sets {ex.targetReps ? `× ${ex.targetReps} reps` : 'Poomsae pattern'}
                            </p>
                          </div>
                        </div>

                        {/* DELETE TECHNIQUE BUTTON */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnique(tkdSession, ex.id, ex.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
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
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xl space-y-5 animate-fadeIn">
            {/* Subhead Header with Delete Workout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shadow-sky-500/20 flex-shrink-0">
                  🏋️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      Sub-Head 3
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Resistance & Hypertrophy</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    Gym — Schedule for {selectedDay}
                  </h2>
                </div>
              </div>

              {/* Workout Control Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-brand-card px-2.5 py-1.5 rounded-xl border border-brand-border">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  {gymSession.durationMinutes} mins
                </span>

                {/* DELETE WORKOUT BUTTON */}
                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(gymSession)}
                  className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Delete this Gym workout routine"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Delete Workout</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetDiscipline('gym')}
                  className="p-2 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-400 hover:text-white transition cursor-pointer"
                  title="Restore default Gym schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {gymSession.exercises.length > 0 && (
                  <button
                    onClick={() => startWorkout(gymSession)}
                    className="py-2.5 px-4 rounded-xl bg-sky-400 hover:bg-sky-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-400/20 transition cursor-pointer hover:scale-[1.02]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Focus Banner */}
            <div className="p-3.5 rounded-xl bg-brand-card/80 border border-brand-border flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-sky-400 font-bold uppercase text-[10px] tracking-wider block">
                  Routine Focus:
                </span>
                <span className="font-bold text-white text-sm">{gymSession.title}</span>
              </div>
              <button
                type="button"
                onClick={() => openTechniquePicker(gymSession)}
                className="py-1 px-3 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-sky-500/30"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Technique</span>
              </button>
            </div>

            {/* Exercises / Techniques with Delete Button for each */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 block">
                  Techniques & Lifts ({gymSession.exercises.length}):
                </span>
                <span className="text-[11px] text-slate-500">
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
                    className="py-1.5 px-4 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs"
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
                        className="p-3.5 sm:p-4 rounded-xl bg-brand-dark/80 border border-brand-border flex items-center justify-between gap-3 hover:border-slate-500 transition group"
                      >
                        <div className="flex items-center gap-3 truncate pr-2">
                          {photo ? (
                            <img
                              src={photo}
                              alt={ex.name}
                              className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0 shadow-sm"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center font-bold text-sky-400 text-[10px] flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="space-y-0.5 truncate">
                            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{ex.name}</h4>
                            <p className="text-[11px] text-slate-400">
                              Rest: <strong className="text-slate-300">{ex.restSeconds}s</strong> • {ex.sets} sets × {ex.targetReps} reps {ex.targetWeightKg ? `@ ${ex.targetWeightKg}kg` : ''}
                            </p>
                          </div>
                        </div>

                        {/* DELETE TECHNIQUE BUTTON */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnique(gymSession, ex.id, ex.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
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
          <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">Add Technique to Schedule</h3>
                <p className="text-xs text-slate-400">Choose a technique to add to your {selectedDay} workout.</p>
              </div>
              <button
                type="button"
                onClick={() => setPickingForSessionId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {EXERCISE_DATABASE.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => handleSelectTechniqueToAdd(ex)}
                  className="p-3 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border flex items-center justify-between cursor-pointer transition group gap-3"
                >
                  <div className="flex items-center gap-3 truncate">
                    {ex.imageUrl ? (
                      <img
                        src={ex.imageUrl}
                        alt={ex.name}
                        className="w-12 h-12 rounded-lg object-cover border border-brand-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-brand-dark flex items-center justify-center text-xs font-bold text-brand-yellow flex-shrink-0">
                        {ex.discipline.slice(0, 3)}
                      </div>
                    )}
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white group-hover:text-brand-yellow truncate">
                          {ex.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-brand-dark text-brand-yellow flex-shrink-0">
                          {ex.discipline}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        Target: {ex.targetMuscles.join(', ')} • {ex.equipment}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="py-1 px-2.5 rounded-lg bg-brand-yellow text-slate-950 font-bold text-xs flex items-center gap-1 group-hover:scale-105 transition flex-shrink-0"
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
                    { id: 'calisthenics', label: 'Calisthenics', icon: '🤸' },
                    { id: 'taekwondo', label: 'Taekwondo', icon: '🥋' },
                    { id: 'gym', label: 'Gym', icon: '🏋️' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAddDisciplineTarget(item.id as TrainingDiscipline)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        addDisciplineTarget === item.id
                          ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-sm'
                          : 'bg-brand-dark border-brand-border text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
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
                  className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow"
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
                  className="w-full accent-[#e2f163] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-yellow text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-brand-yellow/15 cursor-pointer hover:bg-brand-yellowDark"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
