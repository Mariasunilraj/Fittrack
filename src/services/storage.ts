import {
  UserProfile,
  WorkoutSession,
  MealLogItem,
  WaterLog,
  RecoveryLog,
  PersonalRecord,
  TaekwondoSession,
  AIChatMessage
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_WORKOUT_PLANS,
  INITIAL_MEAL_LOGS,
  INITIAL_WATER_LOG,
  INITIAL_RECOVERY_LOG,
  INITIAL_PRS,
  INITIAL_TKD_SESSIONS
} from '../data/defaultUserData';

const STORAGE_KEYS = {
  USER_PROFILE: 'fittrack_profile',
  WORKOUT_PLANS: 'fittrack_workout_plans',
  MEAL_LOGS: 'fittrack_meal_logs',
  WATER_LOG: 'fittrack_water_log',
  RECOVERY_LOGS: 'fittrack_recovery_logs',
  PRS: 'fittrack_prs',
  TKD_SESSIONS: 'fittrack_tkd_sessions',
  AI_CHAT_HISTORY: 'fittrack_ai_chat',
  SUPABASE_CONFIG: 'fittrack_supabase_config',
  GEMINI_API_KEY: 'fittrack_gemini_key'
};

export const storageService = {
  getProfile(): UserProfile {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      return INITIAL_USER_PROFILE;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USER_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getWorkoutPlans(): WorkoutSession[] {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_PLANS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(INITIAL_WORKOUT_PLANS));
      return INITIAL_WORKOUT_PLANS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_WORKOUT_PLANS;
    }
  },

  saveWorkoutPlans(plans: WorkoutSession[]): void {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(plans));
  },

  getMealLogs(): MealLogItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(INITIAL_MEAL_LOGS));
      return INITIAL_MEAL_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MEAL_LOGS;
    }
  },

  saveMealLogs(meals: MealLogItem[]): void {
    localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(meals));
  },

  getWaterLog(): WaterLog {
    const data = localStorage.getItem(STORAGE_KEYS.WATER_LOG);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WATER_LOG, JSON.stringify(INITIAL_WATER_LOG));
      return INITIAL_WATER_LOG;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_WATER_LOG;
    }
  },

  saveWaterLog(water: WaterLog): void {
    localStorage.setItem(STORAGE_KEYS.WATER_LOG, JSON.stringify(water));
  },

  getRecoveryLogs(): RecoveryLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.RECOVERY_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RECOVERY_LOGS, JSON.stringify([INITIAL_RECOVERY_LOG]));
      return [INITIAL_RECOVERY_LOG];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [INITIAL_RECOVERY_LOG];
    }
  },

  saveRecoveryLogs(logs: RecoveryLog[]): void {
    localStorage.setItem(STORAGE_KEYS.RECOVERY_LOGS, JSON.stringify(logs));
  },

  getPRs(): PersonalRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(INITIAL_PRS));
      return INITIAL_PRS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PRS;
    }
  },

  savePRs(prs: PersonalRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(prs));
  },

  getTkdSessions(): TaekwondoSession[] {
    const data = localStorage.getItem(STORAGE_KEYS.TKD_SESSIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TKD_SESSIONS, JSON.stringify(INITIAL_TKD_SESSIONS));
      return INITIAL_TKD_SESSIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TKD_SESSIONS;
    }
  },

  saveTkdSessions(sessions: TaekwondoSession[]): void {
    localStorage.setItem(STORAGE_KEYS.TKD_SESSIONS, JSON.stringify(sessions));
  },

  getAIChatHistory(): AIChatMessage[] {
    const data = localStorage.getItem(STORAGE_KEYS.AI_CHAT_HISTORY);
    if (!data) {
      const welcomeMsg: AIChatMessage = {
        id: 'msg_welcome',
        sender: 'assistant',
        content: `Namaste Arjun! 🙏 I'm your FitTrack AI Coach. I can help adapt your calisthenics ladders, estimate macros for regional Indian home-cooked meals, structure your Taekwondo poomsae conditioning, or answer fitness and recovery questions safely. What are we focusing on today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return [welcomeMsg];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveAIChatHistory(history: AIChatMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.AI_CHAT_HISTORY, JSON.stringify(history));
  },

  getGeminiApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  },

  saveGeminiApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
  },

  exportAllData(): string {
    const fullDump = {
      profile: this.getProfile(),
      workoutPlans: this.getWorkoutPlans(),
      mealLogs: this.getMealLogs(),
      waterLog: this.getWaterLog(),
      recoveryLogs: this.getRecoveryLogs(),
      personalRecords: this.getPRs(),
      taekwondoSessions: this.getTkdSessions(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(fullDump, null, 2);
  },

  resetAllData(): void {
    localStorage.clear();
  }
};
