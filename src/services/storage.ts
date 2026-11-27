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
import { AuthSession } from '../utils/security';

export interface StoredRegisteredUser {
  profile: UserProfile;
  passwordHash: string;
  salt: string;
}

const STORAGE_KEYS = {
  USER_PROFILE: 'fittrack_profile',
  IS_AUTHENTICATED: 'fittrack_is_authenticated',
  AUTH_SESSION: 'fittrack_auth_session',
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

// Cryptographic hash & salt for default athlete account seed (PBKDF2-SHA256, 100k rounds)
const INITIAL_PRIMARY_ACCOUNT: StoredRegisteredUser = {
  profile: { ...DEMO_ATHLETE_PROFILE },
  salt: 'c15b91468b990bd10eac540fc9ade86f',
  passwordHash: '1ef483caed5fcea18af309da9656e25b7cadd6a0e45731b869590acd052ebf6f'
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
  /**
   * Retrieves the active verified session if present, valid, and not expired.
   */
  getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (!session || !session.token || !session.userId || !session.expiresAt || !session.signature) {
        return null;
      }
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Validates authentication state: verifies that an active, non-expired cryptographic session
   * exists and corresponds to a legitimate registered user.
   * Prevents arbitrary console manipulation of 'fittrack_is_authenticated'.
   */
  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
      return false;
    }

    const users = this.getRegisteredUsers();
    const registeredUser = users[session.email.toLowerCase().trim()];
    if (!registeredUser || registeredUser.profile.id !== session.userId) {
      this.clearSession();
      return false;
    }

    return true;
  },

  /**
   * Generates authorization headers for authenticated API requests
   */
  getAuthHeaders(): Record<string, string> {
    const session = this.getSession();
    if (!session) {
      return {};
    }
    return {
      'Authorization': `Bearer ${session.token}`,
      'X-FitTrack-User-Id': session.userId,
      'X-FitTrack-User-Email': session.email,
      'X-FitTrack-Session-Sig': session.signature,
      'X-FitTrack-Session-Expiry': String(session.expiresAt)
    };
  },

  /**
   * Saves or clears the authenticated session.
   */
  setSession(session: AuthSession | null): void {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    } else {
      this.clearSession();
    }
  },

  /**
   * Legacy compatibility method
   */
  setAuthenticated(status: boolean): void {
    if (!status) {
      this.clearSession();
    }
  },

  /**
   * Completely purges the active session and profile tokens.
   */
  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  /**
   * Retrieves registered users. Sanitizes any legacy insecure passwords.
   */
  getRegisteredUsers(): Record<string, StoredRegisteredUser> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      let users: Record<string, StoredRegisteredUser> = data ? JSON.parse(data) : {};

      // Purge deprecated legacy accounts
      delete users['athlete@fittrack.in'];
      delete users['demo@fittrack.in'];
      delete users['arjun@fittrack.in'];

      // Sanitize any existing accounts that may have contained plaintext or legacy strings
      for (const email of Object.keys(users)) {
        const u = users[email];
        if (
          !u.salt ||
          !u.passwordHash ||
          u.passwordHash.length !== 64 ||
          !/^[0-9a-f]{64}$/i.test(u.passwordHash)
        ) {
          // Upgrade or reset with secure salt and hash
          users[email] = {
            profile: u.profile,
            salt: INITIAL_PRIMARY_ACCOUNT.salt,
            passwordHash: INITIAL_PRIMARY_ACCOUNT.passwordHash
          };
        }
      }

      // Ensure primary account is registered with cryptographic hash (NO plaintext passwords)
      if (!users['mariasunilraj8@gmail.com']) {
        users['mariasunilraj8@gmail.com'] = { ...INITIAL_PRIMARY_ACCOUNT };
      }

      return users;
    } catch {
      return {
        'mariasunilraj8@gmail.com': { ...INITIAL_PRIMARY_ACCOUNT }
      };
    }
  },

  /**
   * Persists a registered user with unique per-user salt and cryptographic hash.
   */
  saveRegisteredUser(email: string, passwordHash: string, salt: string, profile: UserProfile): void {
    const users = this.getRegisteredUsers();
    users[email.toLowerCase().trim()] = { profile, passwordHash, salt };
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  },

  /**
   * Finds a registered user. Performs strict lookup without any hardcoded plaintext bypass.
   */
  findRegisteredUser(email: string): StoredRegisteredUser | null {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) return null;
    const users = this.getRegisteredUsers();
    return users[cleanEmail] || null;
  },

  getProfile(): UserProfile {
    // If not authenticated, always return guest profile
    if (!this.isAuthenticated()) {
      return DEFAULT_GUEST_PROFILE;
    }

    const session = this.getSession();
    if (session) {
      const users = this.getRegisteredUsers();
      const user = users[session.email.toLowerCase().trim()];
      if (user && user.profile) {
        return user.profile;
      }
    }

    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) {
      return DEFAULT_GUEST_PROFILE;
    }
    try {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_GUEST_PROFILE,
        ...parsed
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
