export interface TaekwondoPoomsae {
  id: string;
  name: string;
  koreanName: string;
  belt: string;
  meaning: string;
  movementsCount: number;
  keyTechniques: string[];
  safetyTips: string;
}

export const POOMSAE_DATABASE: TaekwondoPoomsae[] = [
  {
    id: 'tkd-taegeuk-1',
    name: 'Taegeuk 1 (Il Jang)',
    koreanName: '태극 1장',
    belt: 'Yellow Belt (8th Gup)',
    meaning: 'Represents "Keon" (Heaven and Light). Pure beginning and the source of creation.',
    movementsCount: 18,
    keyTechniques: [
      'Ap Seogi (Walking Stance)',
      'Ap Kubi (Forward Long Stance)',
      'Arae Makki (Low Block)',
      'Momtong Jireugi (Middle Punch)',
      'Momtong An Makki (Inside Middle Block)',
      'Ap Chagi (Front Snap Kick)'
    ],
    safetyTips: 'Keep eyes focused in the direction of technique. Do not over-extend knees when stepping into forward stance.'
  },
  {
    id: 'tkd-taegeuk-2',
    name: 'Taegeuk 2 (Ee Jang)',
    koreanName: '태극 2장',
    belt: 'Yellow-Green Belt (7th Gup)',
    meaning: 'Represents "Tae" (Lake / Joyfulness). Firm inside, gentle outside.',
    movementsCount: 18,
    keyTechniques: [
      'Olgul Jireugi (High Punch)',
      'Arae Makki with counter punch',
      'Ap Chagi followed immediately by high punch',
      'Smooth continuous weight transitions'
    ],
    safetyTips: 'Maintain ankle stability upon landing from front kick before unleashing upper punch.'
  },
  {
    id: 'tkd-taegeuk-3',
    name: 'Taegeuk 3 (Sam Jang)',
    koreanName: '태극 3장',
    belt: 'Green Belt (6th Gup)',
    meaning: 'Represents "Ri" (Fire and Sun). Passion, enthusiasm, and variable rhythm.',
    movementsCount: 20,
    keyTechniques: [
      'Sonnal Mok Chigi (Knife-hand Neck Strike)',
      'Hansonnal Momtong Makki (Single Knife-hand Block)',
      'Consecutive double punches',
      'Dwit Kubi (Back Stance / L-Stance)'
    ],
    safetyTips: 'Back stance places 70% weight on the rear leg; avoid inward knee collapse.'
  },
  {
    id: 'tkd-taegeuk-4',
    name: 'Taegeuk 4 (Sa Jang)',
    koreanName: '태극 4장',
    belt: 'Green-Blue Belt (5th Gup)',
    meaning: 'Represents "Jin" (Thunder). Bravery, majesty and stillness amid turbulence.',
    movementsCount: 20,
    keyTechniques: [
      'Sonnal Momtong Makki (Double Knife-hand Block)',
      'Pyeon Sonson Kkeut Jireugi (Spear-finger Thrust)',
      'Jebi Poom Mok Chigi (Swallow-form Neck Strike)',
      'Yop Chagi (Side Kick)'
    ],
    safetyTips: 'Side kick requires complete pivot of base foot to protect standing hip and knee joint.'
  }
];

export const TAEKWONDO_BELT_RANKS = [
  'White Belt (10th Gup)',
  'Yellow Stripe (9th Gup)',
  'Yellow Belt (8th Gup)',
  'Green Stripe (7th Gup)',
  'Green Belt (6th Gup)',
  'Blue Stripe (5th Gup)',
  'Blue Belt (4th Gup)',
  'Red Stripe (3rd Gup)',
  'Red Belt (2nd Gup)',
  'Black Stripe (1st Gup)',
  '1st Dan Black Belt (Il Dan)',
  '2nd Dan Black Belt (Ee Dan)'
];
