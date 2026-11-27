import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutSession,
  PlannedExercise,
  MealLogItem,
  WaterLog,
  RecoveryLog,
  PersonalRecord,
  TaekwondoSession,
  WeightLogEntry
} from '../types';
import { storageService } from '../services/storage';
import { neonService } from '../services/neonService';
import { resendService } from '../services/resendService';
import { DEFAULT_GUEST_PROFILE, DEMO_ATHLETE_PROFILE } from '../data/defaultUserData';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  createSession,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit
} from '../utils/security';

export type AppView = 'dashboard' | 'training' | 'exercises' | 'nutrition' | 'taekwondo' | 'progress' | 'settings' | 'auth';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (
    data: Partial<UserProfile> & { displayName: string; email: string },
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  workoutPlans: WorkoutSession[];
  activeWorkoutSession: WorkoutSession | null;
  startWorkout: (session: WorkoutSession) => void;
  finishActiveWorkout: (completedSession: WorkoutSession) => void;
  cancelActiveWorkout: () => void;
  addWorkoutPlan: (plan: WorkoutSession) => void;
  deleteWorkoutPlan: (planId: string) => void;
  deleteExerciseFromPlan: (planId: string, exerciseId: string) => void;
  addExerciseToPlan: (planId: string, exercise: PlannedExercise) => void;
  updateWorkoutPlan: (updatedPlan: WorkoutSession) => void;
  mealLogs: MealLogItem[];
  addMealLog: (meal: Omit<MealLogItem, 'id' | 'userId' | 'date'>) => void;
  deleteMealLog: (id: string) => void;
  waterLog: WaterLog;
  addWater: (amountMl: number) => void;
  recoveryLogs: RecoveryLog[];
  logRecovery: (recovery: Omit<RecoveryLog, 'id' | 'userId' | 'date'>) => void;
  personalRecords: PersonalRecord[];
  addPersonalRecord: (pr: Omit<PersonalRecord, 'id' | 'date'>) => void;
  deletePersonalRecord: (id: string) => void;
  taekwondoSessions: TaekwondoSession[];
  addTaekwondoSession: (session: Omit<TaekwondoSession, 'id' | 'userId'>) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  weightHistory: WeightLogEntry[];
  logWeight: (weightKg: number, date?: string, notes?: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storageService.isAuthenticated());
  const [currentView, setCurrentViewState] = useState<AppView>(() => storageService.isAuthenticated() ? 'dashboard' : 'auth');

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  };
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutSession[]>(() => storageService.getWorkoutPlans());
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<WorkoutSession | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>(() => storageService.getMealLogs());
  const [waterLog, setWaterLog] = useState<WaterLog>(() => storageService.getWaterLog());
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLog[]>(() => storageService.getRecoveryLogs());
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => storageService.getPRs());
  const [taekwondoSessions, setTaekwondoSessions] = useState<TaekwondoSession[]>(() => storageService.getTkdSessions());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightLogEntry[]>(() => storageService.getWeightHistory());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const loginUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // 1. Rate limiter check (anti-brute force)
    const rateCheck = checkLoginRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Account temporarily locked due to too many failed attempts. Please retry in ${rateCheck.remainingSeconds} seconds.`
      };
    }

    // 2. Lookup registered user (No hardcoded bypasses)
    const userRecord = storageService.findRegisteredUser(cleanEmail);
    if (!userRecord) {
      const failResult = recordFailedLoginAttempt(cleanEmail);
      if (failResult.locked) {
        return {
          success: false,
          error: `Too many failed attempts. Account locked for ${failResult.remainingSeconds} seconds.`
        };
      }
      return { success: false, error: 'Invalid email or password.' };
    }

    // 3. Cryptographic password verification (PBKDF2-SHA256 with user's unique salt)
    const isValid = await verifyPassword(cleanPassword, userRecord.passwordHash, userRecord.salt);
    if (!isValid) {
      const failResult = recordFailedLoginAttempt(cleanEmail);
      if (failResult.locked) {
        return {
          success: false,
          error: `Too many failed attempts. Account locked for ${failResult.remainingSeconds} seconds.`
        };
      }
      return {
        success: false,
        error: `Invalid email or password. (${failResult.remainingAttempts} attempts remaining)`
      };
    }

    // 4. Success! Reset rate limit counter
    resetLoginRateLimit(cleanEmail);

    // 5. Generate secure cryptographically signed session
    const session = await createSession(userRecord.profile.id, cleanEmail);
    storageService.setSession(session);
    storageService.saveProfile(userRecord.profile);

    setProfile(userRecord.profile);
    setIsAuthenticated(true);
    const userHistory = storageService.getWeightHistory(userRecord.profile.id);
    setWeightHistory(userHistory);
    showToast(`Welcome back, ${userRecord.profile.displayName}!`);
    setCurrentView('dashboard');
    return { success: true };
  };

  const registerUser = async (
    data: Partial<UserProfile> & { displayName: string; email: string },
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (cleanPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    // Check if account already exists
    const existing = storageService.findRegisteredUser(cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    // Generate unique salt and PBKDF2 hash for this user
    const salt = generateSalt(16);
    const passwordHash = await hashPassword(cleanPassword, salt);

    const initialWeight = data.currentWeightKg || 74.5;
    const goalWeight = data.targetWeightKg || 70.0;
    const createdDate = data.createdAt || new Date().toISOString().split('T')[0];

    const newProfile: UserProfile = {
      ...DEFAULT_GUEST_PROFILE,
      ...data,
      email: cleanEmail,
      startingWeightKg: data.startingWeightKg || initialWeight,
      currentWeightKg: initialWeight,
      targetWeightKg: goalWeight,
      createdAt: createdDate,
      id: `usr_${Date.now()}`
    };

    // Save with real password hash & salt (NO 'registered' or 'default' placeholder strings!)
    storageService.saveRegisteredUser(cleanEmail, passwordHash, salt, newProfile);

    // Create secure cryptographic session
    const session = await createSession(newProfile.id, cleanEmail);
    storageService.setSession(session);
    storageService.saveProfile(newProfile);

    const initialHistory = storageService.seedInitialWeightForUser(newProfile);
    setWeightHistory(initialHistory);
    setProfile(newProfile);
    setIsAuthenticated(true);

    // Asynchronously sync to Neon Database and dispatch welcome email via Resend
    neonService.syncProfile(newProfile).catch(() => {});
    if (newProfile.email) {
      resendService.sendWelcomeEmail({
        athleteName: newProfile.displayName,
        athleteEmail: newProfile.email,
        ageBand: newProfile.ageBand,
        primaryDiscipline: newProfile.preferredDisciplines?.[0] || 'calisthenics',
        startingWeightKg: newProfile.startingWeightKg || newProfile.currentWeightKg,
        targetWeightKg: newProfile.targetWeightKg || 70.0
      }).catch(() => {});
    }

    showToast(`Welcome to FitTrack, ${newProfile.displayName}!`);
    setCurrentView('dashboard');
    return { success: true };
  };

  const logoutUser = () => {
    storageService.clearSession();
    setIsAuthenticated(false);
    setProfile(DEFAULT_GUEST_PROFILE);
    setWeightHistory(storageService.getWeightHistory());
    setCurrentView('auth');
    showToast('Signed out of FitTrack');
  };

  const logWeight = (weightKg: number, date?: string, notes?: string) => {
    const updatedHistory = storageService.addWeightEntry(weightKg, date, profile.id, notes);
    setWeightHistory(updatedHistory);
    const updatedProfile: UserProfile = {
      ...profile,
      currentWeightKg: Number(weightKg.toFixed(1))
    };
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    const effectiveDate = date || new Date().toISOString().split('T')[0];
    const isMonday = new Date(effectiveDate).getDay() === 1;

    // Asynchronously sync weigh-in record to Neon Serverless PostgreSQL
    neonService.logWeighIn(profile.id, weightKg, profile.targetWeightKg || 70.0, notes).catch(() => {});

    // If Monday weigh-in, trigger Resend notification
    if (isMonday && profile.email) {
      resendService.sendMondayWeighInReminder({
        athleteName: profile.displayName,
        athleteEmail: profile.email,
        currentWeightKg: Number(weightKg.toFixed(1)),
        targetWeightKg: Number((profile.targetWeightKg || 70.0).toFixed(1)),
        accountStartDate: profile.createdAt || '2026-11-01'
      }).catch(() => {});
    }

    showToast(`Weekly weigh-in saved: ${weightKg.toFixed(1)} kg ${isMonday ? '(Monday Check-In)' : ''}`);
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
    showToast('Profile updated successfully!');
  };

  const startWorkout = (session: WorkoutSession) => {
    // Clone session with clean completion statuses
    const freshSession: WorkoutSession = JSON.parse(JSON.stringify(session));
    setActiveWorkoutSession(freshSession);
  };

  const finishActiveWorkout = (completedSession: WorkoutSession) => {
    const updatedPlans = workoutPlans.map(p =>
      p.id === completedSession.id ? { ...p, isCompleted: true, completedAt: new Date().toISOString() } : p
    );
    setWorkoutPlans(updatedPlans);
    storageService.saveWorkoutPlans(updatedPlans);
    setActiveWorkoutSession(null);
    showToast('🎉 Workout session completed and logged!');
  };

  const cancelActiveWorkout = () => {
    setActiveWorkoutSession(null);
  };

  const addWorkoutPlan = (plan: WorkoutSession) => {
    const updated = [plan, ...workoutPlans];
    setWorkoutPlans(updated);
    storageService.saveWorkoutPlans(updated);
    showToast('New training plan added!');
  };

  const deleteWorkoutPlan = (planId: string) => {
    const updated = workoutPlans.filter(p => p.id !== planId);
    setWorkoutPlans(updated);
    storageService.saveWorkoutPlans(updated);
    showToast('Workout routine removed.');
  };

  const deleteExerciseFromPlan = (planId: string, exerciseId: string) => {
    const updated = workoutPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          exercises: plan.exercises.filter(ex => ex.id !== exerciseId && ex.exerciseId !== exerciseId)
        };
      }
      return plan;
    });
    setWorkoutPlans(updated);
    storageService.saveWorkoutPlans(updated);
    showToast('Technique removed from workout.');
  };

  const addExerciseToPlan = (planId: string, exercise: PlannedExercise) => {
    const updated = workoutPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          exercises: [...plan.exercises, exercise]
        };
      }
      return plan;
    });
    setWorkoutPlans(updated);
    storageService.saveWorkoutPlans(updated);
    showToast(`Added ${exercise.name} to workout!`);
  };

  const updateWorkoutPlan = (updatedPlan: WorkoutSession) => {
    const exists = workoutPlans.some(p => p.id === updatedPlan.id);
    const updated = exists
      ? workoutPlans.map(p => (p.id === updatedPlan.id ? updatedPlan : p))
      : [updatedPlan, ...workoutPlans];
    setWorkoutPlans(updated);
    storageService.saveWorkoutPlans(updated);
  };

  const addMealLog = (mealData: Omit<MealLogItem, 'id' | 'userId' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newMeal: MealLogItem = {
      ...mealData,
      id: `meal_${Date.now()}`,
      userId: profile.id,
      date: today
    };
    const updated = [newMeal, ...mealLogs];
    setMealLogs(updated);
    storageService.saveMealLogs(updated);
    showToast(`Logged ${newMeal.foodName} (${newMeal.calories} kcal)`);
  };

  const deleteMealLog = (id: string) => {
    const updated = mealLogs.filter(m => m.id !== id);
    setMealLogs(updated);
    storageService.saveMealLogs(updated);
    showToast('Meal removed');
  };

  const addWater = (amountMl: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updated: WaterLog = {
      ...waterLog,
      date: today,
      amountMl: Math.max(0, waterLog.amountMl + amountMl)
    };
    setWaterLog(updated);
    storageService.saveWaterLog(updated);
    if (amountMl > 0) {
      showToast(`+${amountMl}ml water logged. Stay hydrated! 💧`);
    }
  };

  const logRecovery = (recoveryData: Omit<RecoveryLog, 'id' | 'userId' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: RecoveryLog = {
      ...recoveryData,
      id: `rec_${Date.now()}`,
      userId: profile.id,
      date: today
    };
    const updated = [newLog, ...recoveryLogs];
    setRecoveryLogs(updated);
    storageService.saveRecoveryLogs(updated);
    showToast('Recovery status updated!');
  };

  const addPersonalRecord = (prData: Omit<PersonalRecord, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newPr: PersonalRecord = {
      ...prData,
      id: `pr_${Date.now()}`,
      date: today
    };
    const updated = [newPr, ...personalRecords];
    setPersonalRecords(updated);
    storageService.savePRs(updated);
    showToast(`🔥 New Personal Record logged: ${newPr.value} in ${newPr.exerciseName}!`);
  };

  const deletePersonalRecord = (id: string) => {
    const targetPr = personalRecords.find(p => p.id === id);
    const updated = personalRecords.filter(p => p.id !== id);
    setPersonalRecords(updated);
    storageService.savePRs(updated);
    showToast(`🗑️ Personal Record ${targetPr ? `"${targetPr.exerciseName}" (${targetPr.value})` : ''} deleted.`);
  };

  const addTaekwondoSession = (sessionData: Omit<TaekwondoSession, 'id' | 'userId'>) => {
    const newSession: TaekwondoSession = {
      ...sessionData,
      id: `tkd_${Date.now()}`,
      userId: profile.id
    };
    const updated = [newSession, ...taekwondoSessions];
    setTaekwondoSessions(updated);
    storageService.saveTkdSessions(updated);
    showToast('Taekwondo practice session logged!');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
        profile,
        updateProfile,
        workoutPlans,
        activeWorkoutSession,
        startWorkout,
        finishActiveWorkout,
        cancelActiveWorkout,
        addWorkoutPlan,
        deleteWorkoutPlan,
        deleteExerciseFromPlan,
        addExerciseToPlan,
        updateWorkoutPlan,
        mealLogs,
        addMealLog,
        deleteMealLog,
        waterLog,
        addWater,
        recoveryLogs,
        logRecovery,
        personalRecords,
        addPersonalRecord,
        deletePersonalRecord,
        taekwondoSessions,
        addTaekwondoSession,
        showOnboarding,
        setShowOnboarding,
        weightHistory,
        logWeight,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
