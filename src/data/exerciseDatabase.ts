import { ExerciseItem } from '../types';

export const EXERCISE_DATABASE: ExerciseItem[] = [
  // --- CALISTHENICS & BODYWEIGHT PROGRESSION ---
  {
    id: 'cal-pushup-1',
    name: 'Incline Push-Up (Bench / Wall)',
    discipline: 'calisthenics',
    targetMuscles: ['Chest', 'Anterior Deltoids', 'Triceps'],
    secondaryMuscles: ['Core'],
    equipment: 'Bench or Sturdy Elevated Surface',
    difficulty: 'beginner',
    instructions: [
      'Place hands slightly wider than shoulder-width on an elevated surface.',
      'Maintain a rigid straight plank line from head to heels with engaged glutes and brace your core.',
      'Lower chest under control until it grazes the edge of the surface.',
      'Press firmly through whole palms to lockout, keeping shoulders protracted at top.'
    ],
    breathingCues: 'Inhale on the descent; exhale powerfully as you push up.',
    safetyNotes: 'Avoid flaring elbows out 90 degrees; keep them tucked at a 45-degree angle to protect shoulder joints.',
    regressions: 'Wall Push-Up (higher incline reduces bodyweight load to ~30%).',
    progressions: 'Standard Floor Push-Up or Decline Push-Up.',
    caloriesBurnEstimatePerHour: 280,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cal-pushup-2',
    name: 'Standard Push-Up',
    discipline: 'calisthenics',
    targetMuscles: ['Chest', 'Triceps', 'Front Deltoids'],
    secondaryMuscles: ['Core', 'Serratus Anterior'],
    equipment: 'Bodyweight / Exercise Mat',
    difficulty: 'intermediate',
    instructions: [
      'Start in a high plank position with hands under or slightly wider than shoulders.',
      'Maintain neutral spine, tight abs, and squeezed glutes.',
      'Lower torso until chest is 2-3 cm off the floor with elbows at ~45 degrees.',
      'Push the ground away explosively to complete rep.'
    ],
    breathingCues: 'Inhale while lowering; exhale forcefully on the ascent.',
    safetyNotes: 'Do not allow lower back to sag or hips to hike up.',
    regressions: 'Knee Push-Up or Incline Push-Up.',
    progressions: 'Diamond Push-Up, Archer Push-Up, or Weighted Push-Up.',
    caloriesBurnEstimatePerHour: 340,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cal-pullup-1',
    name: 'Inverted Australian Bodyweight Row',
    discipline: 'calisthenics',
    targetMuscles: ['Upper Back', 'Lats', 'Rhomboids', 'Biceps'],
    secondaryMuscles: ['Posterior Delts', 'Grip'],
    equipment: 'Low Bar, Smith Machine, or Suspension Straps',
    difficulty: 'beginner',
    instructions: [
      'Hang underneath a waist-height bar with heels grounded and arms fully extended.',
      'Keep body in a rigid bridge line from head to ankles.',
      'Pull chest up until sternum touches the bar, squeezing shoulder blades together.',
      'Lower slowly with full eccentric control.'
    ],
    breathingCues: 'Exhale as you pull towards the bar; inhale as you lower.',
    safetyNotes: 'Keep cervical spine neutral; do not crane your neck forward to reach the bar.',
    regressions: 'Raise bar higher or bend knees at 90 degrees.',
    progressions: 'Standard Pull-Up, Feet-Elevated Rows.',
    caloriesBurnEstimatePerHour: 320,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cal-pullup-2',
    name: 'Pull-Up (Strict Overhand)',
    discipline: 'calisthenics',
    targetMuscles: ['Latissimus Dorsi', 'Upper Back', 'Biceps'],
    secondaryMuscles: ['Forearms', 'Core'],
    equipment: 'Pull-Up Bar',
    difficulty: 'intermediate',
    instructions: [
      'Grip the bar overhand slightly wider than shoulder-width.',
      'Hang in a dead hang, engage scaps by depressing shoulders down and back.',
      'Drive elbows down towards hips until chin clears above the bar without swinging.',
      'Control descent back down into full active hang.'
    ],
    breathingCues: 'Exhale while driving upward; inhale on controlled descent.',
    safetyNotes: 'Avoid kipping or aggressive jerking at bottom lockout.',
    regressions: 'Resistance band assisted pull-ups or negative slow eccentrics.',
    progressions: 'L-Sit Pull-Ups or Weighted Pull-Ups.',
    caloriesBurnEstimatePerHour: 400,
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cal-dip-1',
    name: 'Parallel Bar Dips',
    discipline: 'calisthenics',
    targetMuscles: ['Triceps', 'Lower Chest', 'Anterior Deltoids'],
    secondaryMuscles: ['Core'],
    equipment: 'Parallel Bars or Dip Station',
    difficulty: 'intermediate',
    instructions: [
      'Support bodyweight on parallel bars with arms locked and shoulders depressed.',
      'Lean slightly forward (15 degrees) to target chest, or stay upright for triceps.',
      'Lower torso until elbows reach 90 degrees.',
      'Push back up to full lockout.'
    ],
    breathingCues: 'Inhale during descent; exhale during the push.',
    safetyNotes: 'Do not dip deeper than comfortable shoulder flexibility allows.',
    regressions: 'Bench Dips or Band-Assisted Dips.',
    progressions: 'Ring Dips or Weighted Dips.',
    caloriesBurnEstimatePerHour: 360,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cal-plank-1',
    name: 'Hollow Body Hold',
    discipline: 'calisthenics',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondaryMuscles: ['Hip Flexors', 'Quadriceps'],
    equipment: 'Bodyweight / Mat',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on back and press lumbar spine firmly into the floor (zero arch).',
      'Lift shoulder blades and feet 6-8 inches off the ground.',
      'Extend arms overhead, hugging ears with biceps.',
      'Hold position with continuous abdominal compression.'
    ],
    breathingCues: 'Breathe shallowly through the nose while maintaining full core brace.',
    safetyNotes: 'If lower back peels off the floor, immediately bend knees to scale down.',
    regressions: 'Tuck Hollow Hold (knees bent towards chest).',
    progressions: 'Hollow Body Rocks.',
    caloriesBurnEstimatePerHour: 250,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
  },

  // --- GYM RESISTANCE & WEIGHTLIFTING ---
  {
    id: 'gym-squat-1',
    name: 'Barbell Back Squat',
    discipline: 'weightlifting',
    targetMuscles: ['Quadriceps', 'Glutes', 'Adductors'],
    secondaryMuscles: ['Hamstrings', 'Erector Spinae', 'Core'],
    equipment: 'Barbell & Squat Rack',
    difficulty: 'intermediate',
    instructions: [
      'Rest barbell securely across upper traps (high bar) or rear delts (low bar).',
      'Step back with feet shoulder-width apart, toes flared slightly out (15-30 deg).',
      'Take a deep belly breath into belt, brace core, and break at hips and knees simultaneously.',
      'Descend until hip crease is at or below parallel with knees.',
      'Drive through midfoot and heels back to upright position.'
    ],
    breathingCues: 'Inhale & brace at top; descend and hold; exhale through sticking point on way up.',
    safetyNotes: 'Always set safety spotter arms to appropriate height. Keep knees tracking over toes.',
    regressions: 'Goblet Squat with dumbbell, Box Squats.',
    progressions: 'Pause Squats, Front Squats, Heavier progressive loading.',
    caloriesBurnEstimatePerHour: 480,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gym-bench-1',
    name: 'Barbell Flat Bench Press',
    discipline: 'weightlifting',
    targetMuscles: ['Pectoralis Major', 'Triceps'],
    secondaryMuscles: ['Anterior Deltoid'],
    equipment: 'Barbell, Weight Plates, Flat Bench',
    difficulty: 'intermediate',
    instructions: [
      'Lie on bench with eyes directly under the racked bar. Plant feet flat on floor.',
      'Retract and pinch shoulder blades together, creating a stable upper back arch.',
      'Grip bar slightly wider than shoulder width.',
      'Unrack, bring bar under control down to mid-sternum with elbows at ~60-75 degrees.',
      'Press barbell back up in a slight diagonal arc over shoulders.'
    ],
    breathingCues: 'Inhale deep into diaphragm as bar lowers; exhale as you press.',
    safetyNotes: 'Always use a spotter or safety pins for heavy attempts. Never use thumbless grip without experience.',
    regressions: 'Dumbbell Bench Press, Push-Ups.',
    progressions: 'Pause Bench Press, Incline Barbell Bench Press.',
    caloriesBurnEstimatePerHour: 390,
    imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gym-deadlift-1',
    name: 'Conventional Barbell Deadlift',
    discipline: 'weightlifting',
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
    secondaryMuscles: ['Lats', 'Traps', 'Forearms', 'Core'],
    equipment: 'Barbell & Bumper Plates',
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width apart, barbell over midfoot (~1 inch from shins).',
      'Hinge at hips, bend knees, and grip bar outside legs.',
      'Pull slack out of the bar, pull shoulder blades back and engage lats.',
      'Drive floor away with legs while keeping chest tall until standing erect.',
      'Hinge back down under control.'
    ],
    breathingCues: 'Big valsalva brace at setup; hold during lift; exhale once past lockout.',
    safetyNotes: 'Do not round the lower lumbar spine under heavy loads.',
    regressions: 'Kettlebell Romanian Deadlift, Trap Bar Deadlift.',
    progressions: 'Deficit Deadlifts, Snatch-Grip Deadlifts.',
    caloriesBurnEstimatePerHour: 520,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gym-ohp-1',
    name: 'Overhead Barbell Military Press',
    discipline: 'weightlifting',
    targetMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps', 'Upper Traps', 'Core'],
    equipment: 'Barbell & Rack',
    difficulty: 'intermediate',
    instructions: [
      'Rest bar on front deltoids and clavicle with elbows slightly in front of bar.',
      'Squeeze glutes and thighs tight, brace core.',
      'Press straight up, moving head slightly back to clear bar path, then bringing head through at lockout.',
      'Lower bar with control back to collarbone.'
    ],
    breathingCues: 'Inhale and brace at bottom; exhale as bar clears forehead towards lockout.',
    safetyNotes: 'Avoid excessive lumbar arching; maintain glute tension.',
    regressions: 'Seated Dumbbell Shoulder Press.',
    progressions: 'Push Press, Behind the Neck Press.',
    caloriesBurnEstimatePerHour: 350,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gym-db-curl-1',
    name: 'Incline Dumbbell Bicep Curl',
    discipline: 'gym',
    targetMuscles: ['Biceps Brachii (Long Head)'],
    secondaryMuscles: ['Brachialis', 'Forearms'],
    equipment: 'Adjustable Bench (45-60 deg) & Dumbbells',
    difficulty: 'beginner',
    instructions: [
      'Sit back on incline bench with dumbbells hanging at arm’s length with palms forward.',
      'Keep upper arms pinned back and curl dumbbells up while supinating wrists.',
      'Squeeze peak contraction for 1 second, then lower slowly over 3 seconds.'
    ],
    breathingCues: 'Exhale during the curl; inhale on the downward eccentric.',
    safetyNotes: 'Do not swing or use momentum; isolate the bicep stretch.',
    regressions: 'Standing Alternating Dumbbell Curls.',
    progressions: 'Spider Curls or Preacher Curls.',
    caloriesBurnEstimatePerHour: 220,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
  },

  // --- TAEKWONDO MARTIAL ARTS & CONDITIONING ---
  {
    id: 'tkd-kick-1',
    name: 'Ap Chagi (Front Snap Kick)',
    discipline: 'taekwondo',
    targetMuscles: ['Hip Flexors', 'Quadriceps', 'Core'],
    secondaryMuscles: ['Calves', 'Glutes'],
    equipment: 'Kicking Target / Heavy Bag / Mirror',
    difficulty: 'beginner',
    instructions: [
      'Adopt a balanced sparring stance (Gyeorugi Junbi) with hands guarding chin.',
      'Chamber rear knee high toward chest with toes pulled back (striking with ball of foot / ap chook).',
      'Snap lower leg out forcefully through target.',
      'Re-chamber knee immediately before returning foot under control.'
    ],
    breathingCues: 'Sharp exhaling "Kihap" at the point of extension.',
    safetyNotes: 'Never hyperextend knee joint in empty air; snap with control.',
    regressions: 'Low knee lift and slow extension at waist level.',
    progressions: 'Jumping Front Kick (Ttwieo Ap Chagi).',
    caloriesBurnEstimatePerHour: 420,
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tkd-kick-2',
    name: 'Dollyo Chagi (Roundhouse / Turning Kick)',
    discipline: 'taekwondo',
    targetMuscles: ['Obliques', 'Gluteus Medius', 'Quadriceps'],
    secondaryMuscles: ['Adductors', 'Calves'],
    equipment: 'Kicking Paddle or Bag',
    difficulty: 'intermediate',
    instructions: [
      'From fighting stance, lift back leg into knee chamber while pivoting standing base foot 180 degrees.',
      'Turn hips completely over horizontally.',
      'Whip lower leg out with instep (baldeung) striking the target.',
      'Re-chamber swiftly and land back into balance.'
    ],
    breathingCues: 'Exhale sharply with explosive hip turn.',
    safetyNotes: 'Base foot must pivot properly to relieve torsional stress on standing knee.',
    regressions: 'Wall-assisted balance roundhouse drills.',
    progressions: '360 Tornado Kick (Narae Chagi).',
    caloriesBurnEstimatePerHour: 500,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tkd-poomsae-1',
    name: 'Taegeuk Il Jang (Form 1 - Keon)',
    discipline: 'taekwondo',
    targetMuscles: ['Total Body Conditioning', 'Legs', 'Shoulders'],
    secondaryMuscles: ['Core Stability', 'Mind-Body Coordination'],
    equipment: 'Open Floor Space / Dobok',
    difficulty: 'beginner',
    instructions: [
      'Represents Heaven and Light; 18 movements for 8th Gup (Yellow Belt).',
      'Features Walking Stance (Ap Seogi) and Forward Stance (Ap Kubi).',
      'Low Block (Arae Makki), Middle Punch (Momtong Jireugi), and Middle Block (Momtong An Makki).',
      'Perform each move with crisp snapshot finish and correct eye focus.'
    ],
    breathingCues: 'Inhale during preparation; crisp exhale upon block/punch completion.',
    safetyNotes: 'Maintain low center of gravity; verify stable footing without slippery socks.',
    regressions: 'Practice individual stances and blocks separately.',
    progressions: 'Taegeuk Ee Jang through Pal Jang.',
    caloriesBurnEstimatePerHour: 320,
    imageUrl: 'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tkd-footwork-1',
    name: 'Fast Footwork & Step-In Sliding Drills',
    discipline: 'taekwondo',
    targetMuscles: ['Calves', 'Achilles Tendons', 'Hamstrings'],
    secondaryMuscles: ['Cardiovascular System', 'Reaction Time'],
    equipment: 'Agility Ladder or Open Mat Space',
    difficulty: 'intermediate',
    instructions: [
      'Stay light on balls of feet with knees slightly soft in fighting stance.',
      'Drill fast forward slide (Bballinbal), switch step, and diagonal evasion.',
      'Maintain constant rhythmic bounce without letting heels thump.',
      'Cycle 3-minute rounds simulating sparring rounds.'
    ],
    breathingCues: 'Controlled rhythmic breathing matching foot pulse.',
    safetyNotes: 'Proper warm up of ankles and calf muscles essential.',
    regressions: 'Static switch drills at relaxed tempo.',
    progressions: 'Shadow sparring with random audio or visual cues.',
    caloriesBurnEstimatePerHour: 450,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },

  // --- MOBILITY, FLEXIBILITY & CARDIO ---
  {
    id: 'mob-hips-1',
    name: '90/90 Hip Mobility Flow',
    discipline: 'mobility',
    targetMuscles: ['Hip Internal & External Rotators', 'Glutes', 'Piriformis'],
    secondaryMuscles: ['Lower Back'],
    equipment: 'Exercise Mat',
    difficulty: 'beginner',
    instructions: [
      'Sit on floor with lead leg bent 90 degrees in front and trail leg bent 90 degrees out to the side.',
      'Sit tall without rounding back.',
      'Hinge forward over lead shin for 30 seconds for glute stretch.',
      'Rotate tall and transition knees across without hands touching floor if possible.'
    ],
    breathingCues: 'Deep, slow diaphragmatic breaths (4s inhale, 6s exhale).',
    safetyNotes: 'Do not force rotation if pinching or knee pain occurs.',
    regressions: 'Place hands on floor behind for upper body support.',
    progressions: '90/90 Hip Lift and Hover.',
    caloriesBurnEstimatePerHour: 150,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mob-hamstrings-1',
    name: 'Dynamic Leg Swings (Front-to-Back & Lateral)',
    discipline: 'mobility',
    targetMuscles: ['Hamstrings', 'Hip Flexors', 'Adductors'],
    secondaryMuscles: ['Abductors'],
    equipment: 'Wall or Stable Pole for Support',
    difficulty: 'beginner',
    instructions: [
      'Hold onto wall for light balance.',
      'Swing leg forward and backward rhythmically like a pendulum with relaxed knee.',
      'Gradually increase height with each swing without tilting pelvis.',
      'Switch to side-to-side swings across body.'
    ],
    breathingCues: 'Smooth continuous breathing.',
    safetyNotes: 'Never kick forcefully into cold, stiff muscles; build amplitude smoothly.',
    regressions: 'Gentle stationary standing toe touches.',
    progressions: 'Active Taekwondo high kick holds.',
    caloriesBurnEstimatePerHour: 200,
    imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80'
  }
];
