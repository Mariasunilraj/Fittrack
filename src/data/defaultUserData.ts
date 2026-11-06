import { UserProfile, WorkoutSession, WorkoutLogEntry, MealLogItem, WaterLog, RecoveryLog, PersonalRecord, TaekwondoSession } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_demo_001',
  email: 'arjun.fitness@example.in',
  displayName: 'Arjun Sharma',
  ageBand: '30-39',
  heightCm: 176,
  currentWeightKg: 73.5,
  targetWeightKg: 71.0,
  experienceLevel: 'intermediate',
  primaryGoals: ['Build Functional Strength', 'Calisthenics Skills', 'Improve Flexibility & Martial Arts', 'Healthy Indian Diet'],
  trainingAccess: 'both',
  equipment: ['Pull-Up Bar', 'Dumbbells (5-25kg)', 'Resistance Bands', 'Yoga Mat', 'Gym Access'],
  preferredDisciplines: ['calisthenics', 'gym', 'taekwondo', 'mobility'],
  region: 'south-indian',
  foodPreference: 'eggetarian',
  allergies: [],
  medicalNotes: 'Past minor ankle sprain (rehabilitated). No acute medical conditions.',
  hasAcceptedDisclaimer: true,
  createdAt: '2026-10-01'
};

export const INITIAL_WORKOUT_PLANS: WorkoutSession[] = [
  {
    id: 'ws_today',
    userId: 'usr_demo_001',
    title: 'Upper Body Strength & Pull-Up Ladder',
    discipline: 'calisthenics',
    scheduledDay: 'Today',
    durationMinutes: 45,
    exercises: [
      {
        id: 'pe-1',
        exerciseId: 'cal-pullup-2',
        name: 'Strict Overhand Pull-Up',
        discipline: 'calisthenics',
        sets: 4,
        targetReps: 8,
        restSeconds: 90,
        completedSets: [
          { setNumber: 1, reps: 8, rpe: 7, completed: true },
          { setNumber: 2, reps: 8, rpe: 8, completed: true },
          { setNumber: 3, reps: 7, rpe: 9, completed: false },
          { setNumber: 4, reps: 6, rpe: 9, completed: false }
        ]
      },
      {
        id: 'pe-2',
        exerciseId: 'cal-dip-1',
        name: 'Parallel Bar Dips',
        discipline: 'calisthenics',
        sets: 3,
        targetReps: 12,
        restSeconds: 75,
        completedSets: [
          { setNumber: 1, reps: 12, rpe: 7, completed: false },
          { setNumber: 2, reps: 10, rpe: 8, completed: false },
          { setNumber: 3, reps: 10, rpe: 8, completed: false }
        ]
      },
      {
        id: 'pe-3',
        exerciseId: 'cal-pushup-2',
        name: 'Standard Push-Up (Deficit tempo)',
        discipline: 'calisthenics',
        sets: 3,
        targetReps: 15,
        restSeconds: 60,
        completedSets: [
          { setNumber: 1, reps: 15, rpe: 7, completed: false },
          { setNumber: 2, reps: 14, rpe: 8, completed: false },
          { setNumber: 3, reps: 12, rpe: 9, completed: false }
        ]
      },
      {
        id: 'pe-4',
        exerciseId: 'cal-plank-1',
        name: 'Hollow Body Hold',
        discipline: 'calisthenics',
        sets: 3,
        targetHoldSeconds: 45,
        restSeconds: 60,
        completedSets: [
          { setNumber: 1, holdSeconds: 45, rpe: 8, completed: false },
          { setNumber: 2, holdSeconds: 40, rpe: 9, completed: false },
          { setNumber: 3, holdSeconds: 35, rpe: 9, completed: false }
        ]
      }
    ]
  },
  {
    id: 'ws_tomorrow',
    userId: 'usr_demo_001',
    title: 'Legs, Core & Barbell Squat Session',
    discipline: 'weightlifting',
    scheduledDay: 'Tomorrow',
    durationMinutes: 50,
    exercises: [
      {
        id: 'pe-5',
        exerciseId: 'gym-squat-1',
        name: 'Barbell Back Squat',
        discipline: 'weightlifting',
        sets: 4,
        targetReps: 6,
        targetWeightKg: 85,
        restSeconds: 120
      },
      {
        id: 'pe-6',
        exerciseId: 'gym-deadlift-1',
        name: 'Conventional Barbell Deadlift',
        discipline: 'weightlifting',
        sets: 3,
        targetReps: 5,
        targetWeightKg: 110,
        restSeconds: 150
      }
    ]
  },
  {
    id: 'ws_tkd',
    userId: 'usr_demo_001',
    title: 'Taekwondo Poomsae & Dynamic Kick Drills',
    discipline: 'taekwondo',
    scheduledDay: 'Saturday',
    durationMinutes: 60,
    exercises: [
      {
        id: 'pe-7',
        exerciseId: 'tkd-poomsae-1',
        name: 'Taegeuk Il Jang (Form 1)',
        discipline: 'taekwondo',
        sets: 4,
        targetReps: 1,
        restSeconds: 60
      },
      {
        id: 'pe-8',
        exerciseId: 'tkd-kick-2',
        name: 'Dollyo Chagi (Turning Kick Pad Drills)',
        discipline: 'taekwondo',
        sets: 5,
        targetReps: 20,
        restSeconds: 45
      }
    ]
  }
];

export const INITIAL_MEAL_LOGS: MealLogItem[] = [
  {
    id: 'ml-1',
    userId: 'usr_demo_001',
    foodId: 'food-idli-1',
    foodName: 'Steamed Idli (2 pieces)',
    mealType: 'breakfast',
    portions: 1.5, // 3 idlis
    calories: 195,
    proteinG: 6.8,
    carbsG: 39.0,
    fatG: 1.2,
    fiberG: 3.3,
    date: '2026-11-05'
  },
  {
    id: 'ml-2',
    userId: 'usr_demo_001',
    foodId: 'food-sambar-1',
    foodName: 'Vegetable Sambar',
    mealType: 'breakfast',
    portions: 1,
    calories: 110,
    proteinG: 5.2,
    carbsG: 16.5,
    fatG: 2.5,
    fiberG: 4.1,
    date: '2026-11-05'
  },
  {
    id: 'ml-3',
    userId: 'usr_demo_001',
    foodId: 'food-boiled-egg',
    foodName: 'Hard Boiled Eggs (2)',
    mealType: 'breakfast',
    portions: 2,
    calories: 148,
    proteinG: 12.6,
    carbsG: 0.8,
    fatG: 10.0,
    fiberG: 0,
    date: '2026-11-05'
  },
  {
    id: 'ml-4',
    userId: 'usr_demo_001',
    foodId: 'food-roti-chapati',
    foodName: 'Whole Wheat Roti',
    mealType: 'lunch',
    portions: 3,
    calories: 255,
    proteinG: 9.3,
    carbsG: 52.5,
    fatG: 1.5,
    fiberG: 8.4,
    date: '2026-11-05'
  },
  {
    id: 'ml-5',
    userId: 'usr_demo_001',
    foodId: 'food-paneer-bhurji',
    foodName: 'Paneer Bhurji',
    mealType: 'lunch',
    portions: 1.2,
    calories: 264,
    proteinG: 17.4,
    carbsG: 6.6,
    fatG: 19.2,
    fiberG: 1.8,
    date: '2026-11-05'
  },
  {
    id: 'ml-6',
    userId: 'usr_demo_001',
    foodId: 'food-curd-dahi',
    foodName: 'Fresh Homemade Curd',
    mealType: 'lunch',
    portions: 1,
    calories: 90,
    proteinG: 4.8,
    carbsG: 6.2,
    fatG: 5.2,
    fiberG: 0,
    date: '2026-11-05'
  }
];

export const INITIAL_WATER_LOG: WaterLog = {
  userId: 'usr_demo_001',
  date: '2026-11-05',
  amountMl: 2250,
  targetMl: 3200
};

export const INITIAL_RECOVERY_LOG: RecoveryLog = {
  id: 'rec_01',
  userId: 'usr_demo_001',
  date: '2026-11-05',
  sleepHours: 7.5,
  sorenessRating: 3, // Low-mild soreness
  energyRating: 8, // High energy
  notes: 'Slept soundly. Shoulders feeling rested from previous session.'
};

export const INITIAL_PRS: PersonalRecord[] = [
  {
    id: 'pr-1',
    exerciseName: 'Barbell Back Squat',
    recordType: '1RM',
    value: '115 kg',
    date: '2026-10-24',
    discipline: 'weightlifting'
  },
  {
    id: 'pr-2',
    exerciseName: 'Strict Pull-Ups',
    recordType: 'Max Reps',
    value: '14 reps',
    date: '2026-10-18',
    discipline: 'calisthenics'
  },
  {
    id: 'pr-3',
    exerciseName: 'Hollow Body Hold',
    recordType: 'Hold Time',
    value: '75 seconds',
    date: '2026-10-30',
    discipline: 'calisthenics'
  },
  {
    id: 'pr-4',
    exerciseName: 'Deadlift (Conventional)',
    recordType: '1RM',
    value: '140 kg',
    date: '2026-10-12',
    discipline: 'weightlifting'
  }
];

export const INITIAL_TKD_SESSIONS: TaekwondoSession[] = [
  {
    id: 'tkd_s1',
    userId: 'usr_demo_001',
    date: '2026-11-02',
    durationMinutes: 60,
    focusArea: 'poomsae',
    beltRank: 'Green Belt (6th Gup)',
    instructorNotes: 'Crisp knee chamber on roundhouse kicks. Work on transition timing between Taegeuk 3 stances.',
    rpe: 8,
    gearChecklistCompleted: true
  }
];
