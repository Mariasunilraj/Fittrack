import {
  UserProfile,
  WorkoutSession,
  MealLogItem,
  WaterLog,
  RecoveryLog,
  PersonalRecord,
  TaekwondoSession,
  WeightLogEntry
} from '../types';
import {
  INITIAL_USER_PROFILE,
  DEFAULT_GUEST_PROFILE,
  DEMO_ATHLETE_PROFILE,
  INITIAL_WORKOUT_PLANS,
  INITIAL_MEAL_LOGS,
  INITIAL_WATER_LOG,
  INITIAL_RECOVERY_LOG,
  INITIAL_PRS,
  INITIAL_TKD_SESSIONS
} from '../data/defaultUserData';

const STORAGE_KEYS = {
  USER_PROFILE: 'fittrack_profile',
  IS_AUTHENTICATED: 'fittrack_is_authenticated',
  REGISTERED_USERS: 'fittrack_registered_users',
  WORKOUT_PLANS: 'fittrack_workout_plans',
  MEAL_LOGS: 'fittrack_meal_logs',
  WATER_LOG: 'fittrack_water_log',
  RECOVERY_LOGS: 'fittrack_recovery_logs',
  PRS: 'fittrack_prs',
  TKD_SESSIONS: 'fittrack_tkd_sessions',
  WEIGHT_HISTORY: 'fittrack_weight_history',
  SUPABASE_CONFIG: 'fittrack_supabase_config',
  GEMINI_API_KEY: 'fittrack_gemini_key'
};

export const INITIAL_DEMO_WEIGHT_HISTORY: WeightLogEntry[] = [
  {
    id: 'wh_init_demo',
    userId: 'usr_sunilraj_001',
    date: '2026-11-01',
    weightKg: 76.0,
    notes: 'Account Start (Initial Baseline)',
    isMondayWeighIn: false
  },
  {
    id: 'wh_demo_w1',
    userId: 'usr_sunilraj_001',
    date: '2026-11-02',
    weightKg: 75.6,
    notes: 'Week 1 Monday Weigh-In',
    isMondayWeighIn: true
  },
  {
    id: 'wh_demo_w2',
    userId: 'usr_sunilraj_001',
    date: '2026-11-09',
    weightKg: 75.0,
    notes: 'Week 2 Monday Weigh-In',
    isMondayWeighIn: true
  },
  {
    id: 'wh_demo_w3',
    userId: 'usr_sunilraj_001',
    date: '2026-11-16',
    weightKg: 74.5,
    notes: 'Week 3 Monday Weigh-In',
    isMondayWeighIn: true
  },
  {
    id: 'wh_demo_current',
    userId: 'usr_sunilraj_001',
    date: '2026-11-18',
    weightKg: 74.5,
    notes: 'Nov 18, 2026 Checkpoint (Today)',
    isMondayWeighIn: false
  }
];

export const storageService = {
  isAuthenticated(): boolean {
    const status = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return status === 'true';
  },

  setAuthenticated(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, status ? 'true' : 'false');
  },

  clearSession(): void {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'false');
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  getRegisteredUsers(): Record<string, { profile: UserProfile; passwordHash: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      let users: Record<string, { profile: UserProfile; passwordHash: string }> = data ? JSON.parse(data) : {};

      // Purge all deprecated / outdated test accounts
      delete users['athlete@fittrack.in'];
      delete users['demo@fittrack.in'];
      delete users['arjun@fittrack.in'];

      // Ensure the official primary account for F.MARIA SUNIL RAJ is permanently registered
      users['mariasunilraj8@gmail.com'] = {
        profile: { ...DEMO_ATHLETE_PROFILE },
        passwordHash: 'REDACTED_SECRET'
      };

      return users;
    } catch {
      return {
        'mariasunilraj8@gmail.com': {
          profile: { ...DEMO_ATHLETE_PROFILE },
          passwordHash: 'REDACTED_SECRET'
        }
      };
    }
  },

  saveRegisteredUser(email: string, passwordHash: string, profile: UserProfile): void {
    const users = this.getRegisteredUsers();
    users[email.toLowerCase().trim()] = { profile, passwordHash };
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  },

  findRegisteredUser(email: string): { profile: UserProfile; passwordHash: string } | null {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (cleanEmail === 'mariasunilraj8@gmail.com') {
      return {
        profile: { ...DEMO_ATHLETE_PROFILE },
        passwordHash: 'REDACTED_SECRET'
      };
    }
    const users = this.getRegisteredUsers();
    return users[cleanEmail] || null;
  },

  getProfile(): UserProfile {
    // If not authenticated, always return guest profile
    if (!this.isAuthenticated()) {
      return DEFAULT_GUEST_PROFILE;
    }

    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) {
      return DEMO_ATHLETE_PROFILE;
    }
    try {
      const parsed = JSON.parse(data);
      // Ensure deprecated demo profile for 'Arjun Sharma' or old 'athlete@fittrack.in' is upgraded to official F.MARIA SUNIL RAJ
      if (
        parsed.displayName === 'Arjun Sharma' ||
        parsed.email?.includes('arjun') ||
        parsed.email === 'athlete@fittrack.in' ||
        parsed.displayName === 'Sunil Raj'
      ) {
        this.saveProfile(DEMO_ATHLETE_PROFILE);
        return DEMO_ATHLETE_PROFILE;
      }
      return {
        ...DEMO_ATHLETE_PROFILE,
        ...parsed,
        startingWeightKg: parsed.startingWeightKg || parsed.currentWeightKg || DEMO_ATHLETE_PROFILE.startingWeightKg || 76.0,
        createdAt: parsed.createdAt || DEMO_ATHLETE_PROFILE.createdAt || '2026-11-01',
        primaryGoals: Array.isArray(parsed.primaryGoals) && parsed.primaryGoals.length > 0
          ? parsed.primaryGoals
          : DEMO_ATHLETE_PROFILE.primaryGoals,
        preferredDisciplines: Array.isArray(parsed.preferredDisciplines) && parsed.preferredDisciplines.length > 0
          ? parsed.preferredDisciplines
          : DEMO_ATHLETE_PROFILE.preferredDisciplines,
        equipment: Array.isArray(parsed.equipment)
          ? parsed.equipment
          : DEMO_ATHLETE_PROFILE.equipment
      };
    } catch {
      return DEFAULT_GUEST_PROFILE;
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

  getGeminiApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  },

  saveGeminiApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
  },

  getWeightHistory(userId?: string): WeightLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
      if (!data) {
        return INITIAL_DEMO_WEIGHT_HISTORY;
      }
      const parsed: WeightLogEntry[] = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return INITIAL_DEMO_WEIGHT_HISTORY;
      }
      if (userId) {
        const userSpecific = parsed.filter(entry => entry.userId === userId);
        return userSpecific.length > 0 ? userSpecific : parsed;
      }
      return parsed;
    } catch {
      return INITIAL_DEMO_WEIGHT_HISTORY;
    }
  },

  saveWeightHistory(history: WeightLogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(history));
  },

  addWeightEntry(weightKg: number, date?: string, userId?: string, notes?: string): WeightLogEntry[] {
    const history = this.getWeightHistory(userId);
    const effectiveDate = date || new Date().toISOString().split('T')[0];
    const d = new Date(effectiveDate);
    const isMonday = d.getDay() === 1;

    const newEntry: WeightLogEntry = {
      id: `wh_${Date.now()}`,
      userId: userId || 'current',
      date: effectiveDate,
      weightKg: Number(weightKg.toFixed(1)),
      notes: notes || (isMonday ? 'Weekly Monday Weigh-In' : 'Weekly Weigh-In'),
      isMondayWeighIn: isMonday
    };

    const updated = [...history.filter(e => e.date !== effectiveDate), newEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.saveWeightHistory(updated);
    return updated;
  },

  seedInitialWeightForUser(profile: UserProfile): WeightLogEntry[] {
    const startDate = profile.createdAt || new Date().toISOString().split('T')[0];
    const startWeight = profile.startingWeightKg || profile.currentWeightKg || 74.5;
    const initialEntry: WeightLogEntry = {
      id: `wh_start_${profile.id || Date.now()}`,
      userId: profile.id,
      date: startDate,
      weightKg: Number(startWeight.toFixed(1)),
      notes: 'Account Start (Initial Weight)',
      isMondayWeighIn: new Date(startDate).getDay() === 1
    };
    const initialList = [initialEntry];
    this.saveWeightHistory(initialList);
    return initialList;
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
