// ====================================================================
// FitTrack PRO — Clerk Authentication Integration
// Enterprise User Identity, OAuth, Multi-Factor Auth, and Session Gating
// ====================================================================

export interface ClerkAuthConfig {
  publishableKey: string;
  isConfigured: boolean;
}

const STORAGE_KEYS = {
  CLERK_CONFIG: 'fittrack_clerk_config'
};

export const clerkAuthService = {
  getPublishableKey(): string {
    const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
    if (envKey) return envKey;

    try {
      const local = localStorage.getItem(STORAGE_KEYS.CLERK_CONFIG);
      return local || '';
    } catch {
      return '';
    }
  },

  isConfigured(): boolean {
    const key = this.getPublishableKey();
    return Boolean(key && key.startsWith('pk_') && !key.includes('placeholder'));
  },

  savePublishableKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.CLERK_CONFIG, key.trim());
  },

  // Map Clerk User Object into FitTrack UserProfile
  mapClerkUserToProfile(clerkUser: any) {
    if (!clerkUser) return null;

    const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'Athlete';

    return {
      id: clerkUser.id,
      email,
      displayName: fullName,
      ageBand: '18-29' as const,
      heightCm: 175,
      startingWeightKg: 76.0,
      currentWeightKg: 74.5,
      targetWeightKg: 70.0,
      experienceLevel: 'intermediate' as const,
      primaryGoals: ['Build Functional Strength', 'Calisthenics Skills', 'Improve Flexibility & Martial Arts', 'Healthy Indian Diet'],
      trainingAccess: 'both' as const,
      equipment: ['Pull-Up Bar', 'Dumbbells (5-25kg)', 'Resistance Bands', 'Yoga Mat', 'Gym Access'],
      preferredDisciplines: ['calisthenics', 'gym', 'taekwondo', 'mobility'] as any[],
      region: 'south-indian' as const,
      foodPreference: 'non-vegetarian' as const,
      allergies: [],
      medicalNotes: 'Age 20. Peak athletic conditioning, ready for hybrid athletic training.',
      hasAcceptedDisclaimer: true,
      createdAt: '2026-11-01'
    };
  }
};
