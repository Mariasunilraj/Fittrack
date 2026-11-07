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
  AIChatMessage
} from '../types';
import { storageService } from '../services/storage';
import { DEFAULT_GUEST_PROFILE, DEMO_ATHLETE_PROFILE } from '../data/defaultUserData';
import { askGeminiFitnessCoach } from '../services/geminiAI';

export type AppView = 'dashboard' | 'training' | 'exercises' | 'nutrition' | 'taekwondo' | 'progress' | 'ai-coach' | 'settings' | 'auth';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isAuthenticated: boolean;
  loginUser: (email: string, password?: string, customName?: string) => void;
  registerUser: (data: Partial<UserProfile> & { displayName: string; email: string }) => void;
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
  aiChatHistory: AIChatMessage[];
  isAiThinking: boolean;
  sendAiMessage: (text: string) => Promise<void>;
  clearAiChat: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storageService.isAuthenticated());
  const [currentView, setCurrentView] = useState<AppView>(() => storageService.isAuthenticated() ? 'dashboard' : 'auth');
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutSession[]>(() => storageService.getWorkoutPlans());
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<WorkoutSession | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>(() => storageService.getMealLogs());
  const [waterLog, setWaterLog] = useState<WaterLog>(() => storageService.getWaterLog());
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLog[]>(() => storageService.getRecoveryLogs());
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => storageService.getPRs());
  const [taekwondoSessions, setTaekwondoSessions] = useState<TaekwondoSession[]>(() => storageService.getTkdSessions());
  const [aiChatHistory, setAiChatHistory] = useState<AIChatMessage[]>(() => storageService.getAIChatHistory());
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const loginUser = (email: string, password?: string, customName?: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    let userProfile: UserProfile;

    if (cleanEmail === 'athlete@fittrack.in' || cleanEmail === 'demo@fittrack.in') {
      userProfile = { ...DEMO_ATHLETE_PROFILE };
    } else {
      const existing = storageService.findRegisteredUser(cleanEmail);
      if (existing) {
        userProfile = existing.profile;
      } else {
        const name = customName || (cleanEmail ? cleanEmail.split('@')[0] : 'Athlete');
        userProfile = {
          ...DEFAULT_GUEST_PROFILE,
          id: `usr_${Date.now()}`,
          email: cleanEmail,
          displayName: name.charAt(0).toUpperCase() + name.slice(1)
        };
        storageService.saveRegisteredUser(cleanEmail, password || 'default', userProfile);
      }
    }

    storageService.setAuthenticated(true);
    storageService.saveProfile(userProfile);
    setProfile(userProfile);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${userProfile.displayName}!`);
    setCurrentView('dashboard');
  };

  const registerUser = (data: Partial<UserProfile> & { displayName: string; email: string }) => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const newProfile: UserProfile = {
      ...DEFAULT_GUEST_PROFILE,
      ...data,
      email: cleanEmail,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    storageService.saveRegisteredUser(cleanEmail, 'registered', newProfile);
    storageService.setAuthenticated(true);
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
    setIsAuthenticated(true);
    showToast(`Welcome to FitTrack, ${newProfile.displayName}!`);
    setCurrentView('dashboard');
  };

  const logoutUser = () => {
    storageService.clearSession();
    setIsAuthenticated(false);
    setProfile(DEFAULT_GUEST_PROFILE);
    setCurrentView('auth');
    showToast('Signed out of FitTrack');
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
    showToast('🥋 Taekwondo practice session logged!');
  };

  const sendAiMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...aiChatHistory, userMsg];
    setAiChatHistory(updatedHistory);
    storageService.saveAIChatHistory(updatedHistory);

    setIsAiThinking(true);
    try {
      const formattedHistory = updatedHistory.slice(-6).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.content }]
      }));

      const aiResult = await askGeminiFitnessCoach(userText, profile, formattedHistory);

      const botMsg: AIChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: aiResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalHistory = [...updatedHistory, botMsg];
      setAiChatHistory(finalHistory);
      storageService.saveAIChatHistory(finalHistory);
    } catch (err) {
      const errorMsg: AIChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'assistant',
        content: 'I had trouble processing that request. Please check your network or API settings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatHistory([...updatedHistory, errorMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const clearAiChat = () => {
    storageService.saveAIChatHistory([]);
    setAiChatHistory(storageService.getAIChatHistory());
    showToast('AI conversation reset');
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
        aiChatHistory,
        isAiThinking,
        sendAiMessage,
        clearAiChat,
        showOnboarding,
        setShowOnboarding,
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
