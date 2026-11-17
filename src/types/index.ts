// FitTrack Domain Types

export type AgeBand = '18-29' | '30-39' | '40-49' | '50-59' | '60+';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingDiscipline = 'calisthenics' | 'gym' | 'weightlifting' | 'taekwondo' | 'mobility' | 'cardio';
export type FoodPreference = 'vegetarian' | 'eggetarian' | 'non-vegetarian' | 'vegan';
export type UnitSystem = 'metric' | 'imperial';
export type IndianRegion = 'all' | 'south-indian' | 'north-indian' | 'east-indian' | 'west-indian';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  ageBand: AgeBand;
  heightCm: number;
  startingWeightKg?: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  experienceLevel: ExperienceLevel;
  primaryGoals: string[];
  trainingAccess: 'home' | 'gym' | 'both' | 'dojang';
  equipment: string[];
  preferredDisciplines: TrainingDiscipline[];
  region: IndianRegion;
  foodPreference: FoodPreference;
  allergies: string[];
  medicalNotes?: string;
  hasAcceptedDisclaimer: boolean;
  createdAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  discipline: TrainingDiscipline;
  targetMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  difficulty: ExperienceLevel;
  instructions: string[];
  breathingCues: string;
  safetyNotes: string;
  regressions?: string;
  progressions?: string;
  contraindications?: string;
  caloriesBurnEstimatePerHour?: number;
  imageUrl?: string;
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  name: string;
  discipline: TrainingDiscipline;
  sets: number;
  targetReps?: number;
  targetHoldSeconds?: number;
  targetWeightKg?: number;
  restSeconds: number;
  completedSets?: CompletedSet[];
  imageUrl?: string;
}

export interface CompletedSet {
  setNumber: number;
  reps?: number;
  loadKg?: number;
  holdSeconds?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  title: string;
  discipline: TrainingDiscipline;
  scheduledDay: string; // 'Monday', 'Tuesday', etc.
  durationMinutes: number;
  exercises: PlannedExercise[];
  isCompleted?: boolean;
  completedAt?: string;
  rpe?: number;
  notes?: string;
}

export interface WorkoutLogEntry {
  id: string;
  userId: string;
  sessionId?: string;
  title: string;
  discipline: TrainingDiscipline;
  date: string; // ISO date
  durationMinutes: number;
  exercisesCompleted: {
    exerciseName: string;
    sets: CompletedSet[];
  }[];
  rpe: number;
  notes?: string;
}

export interface IndianFoodItem {
  id: string;
  name: string;
  regionalCategory: 'South Indian' | 'North Indian' | 'Street Food / Snack' | 'Healthy Staple' | 'High Protein' | 'Millet & Traditional';
  servingDescription: string;
  servingUnit: string; // e.g. "1 medium katori", "2 pieces", "1 cup"
  gramsPerServing: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  foodType: FoodPreference;
  source: string; // "ICMR-NIN" or "Verified Lab Estimates"
}

export interface MealLogItem {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  portions: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  date: string; // YYYY-MM-DD
}

export interface WaterLog {
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  targetMl: number;
}

export interface TaekwondoSession {
  id: string;
  userId: string;
  date: string;
  durationMinutes: number;
  focusArea: 'poomsae' | 'kicking-drills' | 'footwork' | 'supervised-sparring' | 'conditioning' | 'flexibility';
  beltRank: string;
  instructorNotes?: string;
  rpe: number;
  gearChecklistCompleted: boolean;
}

export interface WeightLogEntry {
  id: string;
  userId: string;
  date: string; // ISO format 'YYYY-MM-DD'
  weightKg: number;
  notes?: string;
  isMondayWeighIn?: boolean;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  notes?: string;
}

export interface RecoveryLog {
  id: string;
  userId: string;
  date: string;
  sleepHours: number;
  sorenessRating: number; // 1 (fresh) to 10 (extremely sore)
  energyRating: number; // 1 (exhausted) to 10 (peaked)
  stressRating?: number;
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  recordType: '1RM' | 'Max Reps' | 'Hold Time' | 'Speed';
  value: string; // e.g. "95 kg", "25 reps", "120s"
  date: string;
  discipline: TrainingDiscipline;
}
