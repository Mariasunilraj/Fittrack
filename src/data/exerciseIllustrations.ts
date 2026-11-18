// Form-Accurate Vector Biomechanical Illustrations for FitTrack PRO
// Replaces generic mismatched external photos with precision kinetic diagrams.
// 100% offline, zero network latency, WCAG AA high-contrast styling.

const createSvgUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

// Base SVG Frame with Biomechanical Grid, Accent Markers & Typography
const wrapSvg = (title: string, subcue: string, badgeText: string, content: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0d14"/>
      <stop offset="100%" stop-color="#141923"/>
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2737" stroke-width="0.75" stroke-opacity="0.6"/>
    </pattern>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="400" height="240" fill="url(#bgGrad)"/>
  <rect width="400" height="240" fill="url(#grid)"/>

  <!-- Top Biomechanical Metric Bar -->
  <rect x="14" y="12" width="372" height="26" rx="6" fill="#141c2b" stroke="#253248" stroke-width="1"/>
  <circle cx="26" cy="25" r="4" fill="#ccff00" filter="url(#neonGlow)"/>
  <text x="36" y="29" fill="#f8fafc" font-size="10" font-family="system-ui, sans-serif" font-weight="800" letter-spacing="0.5">FITTRACK KINETIC FORM</text>
  <rect x="270" y="16" width="110" height="18" rx="4" fill="#ccff00" fill-opacity="0.15" stroke="#ccff00" stroke-opacity="0.3"/>
  <text x="325" y="29" fill="#ccff00" font-size="9" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">${badgeText}</text>

  <!-- Center Biomechanical Illustration Content -->
  <g transform="translate(0, 5)">
    ${content}
  </g>

  <!-- Bottom Form Cue Banner -->
  <rect x="14" y="200" width="372" height="28" rx="6" fill="#0d121c" stroke="#253248" stroke-width="1"/>
  <text x="26" y="218" fill="#e2e8f0" font-size="11" font-family="system-ui, sans-serif" font-weight="700">${title}</text>
  <text x="374" y="218" fill="#94a3b8" font-size="9.5" font-family="system-ui, sans-serif" font-weight="600" text-anchor="end">${subcue}</text>
</svg>
`;

export const EXERCISE_ILLUSTRATIONS: Record<string, string> = {
  // 1. Incline Push-Up
  'cal-pushup-1': createSvgUri(
    wrapSvg(
      'Incline Push-Up',
      '35° Angle • Protracted Lockout',
      'CALISTHENICS',
      `
      <!-- Elevated Bench Surface -->
      <polygon points="40,165 140,165 130,195 30,195" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <line x1="40" y1="165" x2="140" y2="165" stroke="#38bdf8" stroke-width="3"/>
      <text x="85" y="185" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="700" text-anchor="middle">BENCH / ELEVATION</text>

      <!-- Floor Plane -->
      <line x1="20" y1="195" x2="380" y2="195" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>

      <!-- Body Kinetic Line (Rigid 35° Plank) -->
      <line x1="120" y1="155" x2="310" y2="192" stroke="#ccff00" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Torso Silhouette -->
      <line x1="120" y1="155" x2="170" y2="120" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>
      <circle cx="180" cy="115" r="9" fill="#f8fafc"/>
      
      <!-- Arms pressing bench at 45° -->
      <line x1="140" y1="135" x2="120" y2="165" stroke="#f1f5f9" stroke-width="6" stroke-linecap="round"/>
      <!-- Legs and Feet -->
      <line x1="200" y1="165" x2="310" y2="192" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="310" cy="192" r="5" fill="#ccff00"/>

      <!-- Force & Trajectory Vector -->
      <path d="M 125 150 L 145 105" stroke="#ccff00" stroke-width="2.5" fill="none" marker-end="url(#arrow)" filter="url(#neonGlow)"/>
      <polygon points="145,100 138,110 152,108" fill="#ccff00"/>
      <text x="160" y="105" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="800">DRIVE UP</text>

      <!-- Angle Arc -->
      <path d="M 280 192 A 30 30 0 0 0 260 178" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="255" y="172" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="700">35° Incline</text>
      `
    )
  ),

  // 2. Standard Floor Push-Up
  'cal-pushup-2': createSvgUri(
    wrapSvg(
      'Standard Push-Up',
      'Neutral Spine • 45° Elbow Path',
      'CALISTHENICS',
      `
      <!-- Floor Plane -->
      <line x1="30" y1="175" x2="370" y2="175" stroke="#38bdf8" stroke-width="2"/>
      <polygon points="30,175 370,175 370,185 30,185" fill="#1e293b" fill-opacity="0.5"/>

      <!-- Horizontal Plank Line -->
      <line x1="100" y1="150" x2="310" y2="165" stroke="#ccff00" stroke-width="3" stroke-dasharray="6 4"/>

      <!-- Athlete Figure in Bottom Position (Chest 2cm off floor) -->
      <!-- Head -->
      <circle cx="85" cy="142" r="9" fill="#f8fafc"/>
      <!-- Torso -->
      <line x1="95" y1="148" x2="210" y2="156" stroke="#f1f5f9" stroke-width="11" stroke-linecap="round"/>
      <!-- Chest Engagement Aura -->
      <circle cx="125" cy="150" r="14" fill="#f43f5e" fill-opacity="0.25" stroke="#f43f5e" stroke-width="1"/>
      
      <!-- Arm bent at 90° / 45° from torso -->
      <polyline points="120,150 115,130 115,175" fill="none" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="115" cy="175" r="4" fill="#ccff00"/>

      <!-- Legs to Toes -->
      <line x1="210" y1="156" x2="310" y2="170" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="310" cy="172" r="4.5" fill="#ccff00"/>

      <!-- Upward Push Vectors -->
      <path d="M 115 130 L 115 95" stroke="#ccff00" stroke-width="2.5" fill="none" filter="url(#neonGlow)"/>
      <polygon points="115,90 110,100 120,100" fill="#ccff00"/>
      <text x="130" y="100" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="800">PRESS</text>

      <!-- Chest to Floor Clearance -->
      <line x1="125" y1="158" x2="125" y2="175" stroke="#f43f5e" stroke-width="1.5"/>
      <text x="145" y="170" fill="#f43f5e" font-size="9" font-family="sans-serif" font-weight="700">2-3 cm Depth</text>
      `
    )
  ),

  // 3. Inverted Australian Row
  'cal-pullup-1': createSvgUri(
    wrapSvg(
      'Australian Bodyweight Row',
      'Underhand Bar Hang • Sternum to Bar',
      'CALISTHENICS',
      `
      <!-- Low Bar Structure -->
      <rect x="70" y="80" width="10" height="110" fill="#334155"/>
      <line x1="60" y1="90" x2="160" y2="90" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
      <circle cx="110" cy="90" r="6" fill="#38bdf8"/>

      <!-- Floor Plane -->
      <line x1="30" y1="190" x2="370" y2="190" stroke="#334155" stroke-width="1.5"/>

      <!-- Athlete Body Hanging Underneath Bar -->
      <!-- Arms gripping bar -->
      <line x1="110" y1="90" x2="125" y2="135" stroke="#f1f5f9" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Head & Torso -->
      <circle cx="105" cy="148" r="9" fill="#f8fafc"/>
      <line x1="118" y1="145" x2="230" y2="168" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>
      
      <!-- Back / Lats Activation -->
      <ellipse cx="150" cy="150" rx="18" ry="8" fill="#ccff00" fill-opacity="0.3" stroke="#ccff00" stroke-width="1"/>

      <!-- Legs straight to heels on floor -->
      <line x1="230" y1="168" x2="310" y2="188" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="310" cy="188" r="5" fill="#38bdf8"/>

      <!-- Pull Up Vector to Sternum -->
      <path d="M 135 135 L 120 100" stroke="#ccff00" stroke-width="2.5" fill="none" filter="url(#neonGlow)"/>
      <polygon points="118,95 116,106 126,102" fill="#ccff00"/>
      <text x="145" y="105" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="800">RETRACT & PULL</text>
      `
    )
  ),

  // 4. Strict Overhand Pull-Up
  'cal-pullup-2': createSvgUri(
    wrapSvg(
      'Strict Overhand Pull-Up',
      'Chin Over Bar • Full Deadhang to Lockout',
      'CALISTHENICS',
      `
      <!-- Overhead Bar Support -->
      <line x1="70" y1="55" x2="330" y2="55" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
      <line x1="80" y1="40" x2="80" y2="70" stroke="#1e293b" stroke-width="4"/>
      <line x1="320" y1="40" x2="320" y2="70" stroke="#1e293b" stroke-width="4"/>

      <!-- Athlete Figure at Top of Pull-Up -->
      <!-- Hands on Bar -->
      <circle cx="170" cy="55" r="5" fill="#ccff00"/>
      <circle cx="230" cy="55" r="5" fill="#ccff00"/>

      <!-- Head Chin CLEARING Bar -->
      <circle cx="200" cy="45" r="10" fill="#f8fafc"/>
      <line x1="160" y1="52" x2="240" y2="52" stroke="#ccff00" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text x="245" y="47" fill="#ccff00" font-size="8" font-family="sans-serif" font-weight="800">CHIN OVER</text>

      <!-- Arms driving elbows down -->
      <polyline points="170,55 150,75 185,90" fill="none" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="230,55 250,75 215,90" fill="none" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Torso & Lat V-Taper Flare -->
      <polygon points="185,90 215,90 208,145 192,145" fill="#f1f5f9"/>
      <path d="M 175 90 Q 200 105 225 90" fill="none" stroke="#f43f5e" stroke-width="3"/>
      <text x="200" y="112" fill="#f43f5e" font-size="9" font-family="sans-serif" font-weight="800" text-anchor="middle">LATS DEPRESSED</text>

      <!-- Straight Legs, Hollow Core -->
      <line x1="195" y1="145" x2="192" y2="185" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>
      <line x1="205" y1="145" x2="202" y2="185" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>

      <!-- Elbow Drive Vectors -->
      <path d="M 145 80 L 160 105" stroke="#ccff00" stroke-width="2" fill="none"/>
      <path d="M 255 80 L 240 105" stroke="#ccff00" stroke-width="2" fill="none"/>
      `
    )
  ),

  // 5. Parallel Bar Dips
  'cal-dip-1': createSvgUri(
    wrapSvg(
      'Parallel Bar Dips',
      '90° Elbow Depth • 15° Torso Lean',
      'CALISTHENICS',
      `
      <!-- Parallel Dip Bars -->
      <line x1="110" y1="95" x2="290" y2="95" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
      <line x1="130" y1="95" x2="130" y2="195" stroke="#1e293b" stroke-width="5"/>
      <line x1="270" y1="95" x2="270" y2="195" stroke="#1e293b" stroke-width="5"/>

      <!-- Athlete Figure in Dip Depth -->
      <!-- Head leaned slightly forward -->
      <circle cx="180" cy="70" r="10" fill="#f8fafc"/>
      
      <!-- Torso with 15° Forward Lean -->
      <line x1="185" y1="80" x2="205" y2="140" stroke="#f1f5f9" stroke-width="11" stroke-linecap="round"/>
      
      <!-- Arms bent at 90° -->
      <polyline points="200,95 215,80 190,95" fill="none" stroke="#ccff00" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="200" cy="95" r="4.5" fill="#ccff00"/>

      <!-- 90° Indicator -->
      <rect x="208" y="76" width="10" height="10" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="235" y="78" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="700">90° Angle</text>

      <!-- Legs bent at knees -->
      <polyline points="205,140 220,165 210,185" fill="none" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>

      <!-- Upward Press Vector -->
      <path d="M 185 125 L 185 85" stroke="#ccff00" stroke-width="2.5" fill="none" filter="url(#neonGlow)"/>
      <polygon points="185,80 180,90 190,90" fill="#ccff00"/>
      <text x="140" y="110" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="800">PRESS</text>
      `
    )
  ),

  // 6. Hollow Body Hold
  'cal-plank-1': createSvgUri(
    wrapSvg(
      'Hollow Body Hold',
      'Lumbar Glued to Floor • Banana Arc Compression',
      'CALISTHENICS',
      `
      <!-- Floor Plane -->
      <line x1="30" y1="175" x2="370" y2="175" stroke="#38bdf8" stroke-width="2"/>
      
      <!-- Lumbar Pinned Down Zone -->
      <rect x="170" y="172" width="60" height="5" fill="#f43f5e" filter="url(#neonGlow)"/>
      <text x="200" y="190" fill="#f43f5e" font-size="9" font-family="sans-serif" font-weight="800" text-anchor="middle">LUMBAR PRESSED FLAT (ZERO ARCH)</text>

      <!-- Banana Curve Body Arc -->
      <!-- Extended Arms -->
      <line x1="75" y1="135" x2="135" y2="155" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>
      <circle cx="130" cy="148" r="9" fill="#f8fafc"/>

      <!-- Torso curved upward from floor -->
      <path d="M 135 155 Q 200 174 265 158" fill="none" stroke="#ccff00" stroke-width="9" stroke-linecap="round"/>
      
      <!-- Core Compression Rays -->
      <circle cx="200" cy="160" r="14" fill="#ccff00" fill-opacity="0.25"/>

      <!-- Legs extended straight, toes pointed 6-8 inches high -->
      <line x1="265" y1="158" x2="335" y2="140" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>
      <circle cx="335" cy="140" r="4" fill="#ccff00"/>

      <!-- Elevation Indicators -->
      <line x1="75" y1="135" x2="75" y2="175" stroke="#94a3b8" stroke-dasharray="2 2"/>
      <line x1="335" y1="140" x2="335" y2="175" stroke="#94a3b8" stroke-dasharray="2 2"/>
      <text x="80" y="125" fill="#94a3b8" font-size="8" font-family="sans-serif">6-8" Hover</text>
      <text x="315" y="125" fill="#94a3b8" font-size="8" font-family="sans-serif">6-8" Hover</text>
      `
    )
  ),

  // 7. Barbell Back Squat
  'gym-squat-1': createSvgUri(
    wrapSvg(
      'Barbell Back Squat',
      'Hip Crease Below Parallel • Midfoot Balance',
      'WEIGHTLIFTING',
      `
      <!-- Floor Plane -->
      <line x1="50" y1="190" x2="350" y2="190" stroke="#334155" stroke-width="2"/>

      <!-- Squat Depth Plane Line -->
      <line x1="140" y1="150" x2="270" y2="150" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="275" y="153" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="700">PARALLEL PLANE</text>

      <!-- Athlete in Deep Squat Position -->
      <!-- Head -->
      <circle cx="195" cy="80" r="10" fill="#f8fafc"/>
      
      <!-- Barbell on Traps with Weight Plates -->
      <line x1="130" y1="92" x2="270" y2="92" stroke="#38bdf8" stroke-width="6"/>
      <rect x="135" y="70" width="12" height="44" rx="2" fill="#38bdf8"/>
      <rect x="253" y="70" width="12" height="44" rx="2" fill="#38bdf8"/>
      <circle cx="200" cy="92" r="5" fill="#ccff00"/>

      <!-- Torso with Neutral Spine -->
      <line x1="195" y1="92" x2="180" y2="152" stroke="#f1f5f9" stroke-width="11" stroke-linecap="round"/>

      <!-- Hip Crease at Depth -->
      <circle cx="180" cy="155" r="5" fill="#f43f5e" filter="url(#neonGlow)"/>
      <text x="110" y="160" fill="#f43f5e" font-size="9" font-family="sans-serif" font-weight="800">HIP BELOW KNEE</text>

      <!-- Thigh (Femur) below parallel -->
      <line x1="180" y1="155" x2="225" y2="150" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>
      
      <!-- Shin (Tibia) tracking over toes -->
      <line x1="225" y1="150" x2="205" y2="190" stroke="#f1f5f9" stroke-width="9" stroke-linecap="round"/>
      
      <!-- Foot on Floor -->
      <rect x="195" y="188" width="30" height="4" fill="#ccff00"/>

      <!-- Midfoot Drive Force Vector -->
      <path d="M 200 170 L 200 105" stroke="#ccff00" stroke-width="3" fill="none" filter="url(#neonGlow)"/>
      <polygon points="200,100 195,112 205,112" fill="#ccff00"/>
      <text x="210" y="125" fill="#ccff00" font-size="11" font-family="sans-serif" font-weight="900">DRIVE</text>
      `
    )
  ),

  // 8. Barbell Flat Bench Press
  'gym-bench-1': createSvgUri(
    wrapSvg(
      'Barbell Flat Bench Press',
      'Sternum Bar Touch • 75° Elbow Tuck • Scapular Arch',
      'WEIGHTLIFTING',
      `
      <!-- Flat Workout Bench -->
      <rect x="90" y="145" width="220" height="15" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
      <line x1="110" y1="160" x2="110" y2="195" stroke="#334155" stroke-width="6"/>
      <line x1="290" y1="160" x2="290" y2="195" stroke="#334155" stroke-width="6"/>
      <line x1="40" y1="195" x2="360" y2="195" stroke="#334155" stroke-width="1.5"/>

      <!-- Athlete lying on bench with arch -->
      <!-- Head on bench -->
      <circle cx="120" cy="138" r="9" fill="#f8fafc"/>
      
      <!-- Thoracic Arch -->
      <path d="M 130 145 Q 170 135 220 145" fill="none" stroke="#f1f5f9" stroke-width="11" stroke-linecap="round"/>
      
      <!-- Feet Planted on Floor -->
      <polyline points="220,145 250,165 245,195" fill="none" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>
      <circle cx="245" cy="195" r="4" fill="#ccff00"/>

      <!-- Barbell lowered to mid-sternum -->
      <line x1="80" y1="108" x2="280" y2="108" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
      <rect x="85" y="85" width="12" height="46" rx="2" fill="#38bdf8"/>
      <rect x="263" y="85" width="12" height="46" rx="2" fill="#38bdf8"/>

      <!-- Arms holding barbell -->
      <polyline points="180,108 170,135 160,140" fill="none" stroke="#ccff00" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Upward Press Vector Arc -->
      <path d="M 180 105 Q 175 80 165 65" stroke="#ccff00" stroke-width="2.5" fill="none" filter="url(#neonGlow)"/>
      <polygon points="163,60 161,72 171,68" fill="#ccff00"/>
      <text x="185" y="70" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="800">PRESS PATH</text>
      `
    )
  ),

  // 9. Conventional Barbell Deadlift
  'gym-deadlift-1': createSvgUri(
    wrapSvg(
      'Conventional Barbell Deadlift',
      'Bar Over Midfoot • Hip Hinge Wedge • Lat Lockout',
      'WEIGHTLIFTING',
      `
      <!-- Floor Plane -->
      <line x1="40" y1="195" x2="360" y2="195" stroke="#334155" stroke-width="2"/>

      <!-- Bumper Plates on Floor -->
      <circle cx="180" cy="165" r="28" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="180" cy="165" r="5" fill="#ccff00"/>
      <text x="180" y="168" fill="#38bdf8" font-size="8" font-family="sans-serif" font-weight="800" text-anchor="middle">450mm</text>

      <!-- Athlete in Hip Hinge Wedge Position -->
      <!-- Head in neutral cervical alignment -->
      <circle cx="140" cy="100" r="10" fill="#f8fafc"/>
      
      <!-- Back straight (Neutral Spine from head to hips) -->
      <line x1="145" y1="108" x2="115" y2="148" stroke="#ccff00" stroke-width="10" stroke-linecap="round"/>

      <!-- Hips loaded high between shoulders and knees -->
      <circle cx="115" cy="148" r="6" fill="#f43f5e" filter="url(#neonGlow)"/>
      
      <!-- Femur / Thigh to Knee -->
      <line x1="115" y1="148" x2="165" y2="165" stroke="#f1f5f9" stroke-width="9" stroke-linecap="round"/>

      <!-- Vertical Shin 1 inch from bar -->
      <line x1="165" y1="165" x2="170" y2="195" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="170" cy="195" r="4" fill="#38bdf8"/>

      <!-- Long Arms Hanging Straight (Hooks to Bar) -->
      <line x1="150" y1="115" x2="180" y2="165" stroke="#f1f5f9" stroke-width="6" stroke-linecap="round"/>

      <!-- Drive Floor Away Vector -->
      <path d="M 140 140 L 175 80" stroke="#ccff00" stroke-width="3" fill="none" filter="url(#neonGlow)"/>
      <polygon points="175,75 168,85 180,82" fill="#ccff00"/>
      <text x="185" y="85" fill="#ccff00" font-size="11" font-family="sans-serif" font-weight="900">EXTEND HIPS</text>
      `
    )
  ),

  // 10. Overhead Barbell Military Press
  'gym-ohp-1': createSvgUri(
    wrapSvg(
      'Overhead Military Press',
      'Clavicle Front Rack • Vertical Bar Path • Head Through',
      'WEIGHTLIFTING',
      `
      <!-- Floor Plane -->
      <line x1="60" y1="195" x2="340" y2="195" stroke="#334155" stroke-width="1.5"/>

      <!-- Standing Athlete -->
      <circle cx="200" cy="65" r="9" fill="#f8fafc"/>
      <!-- Torso standing rigid -->
      <line x1="200" y1="74" x2="200" y2="140" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>
      <!-- Legs straight, glutes tight -->
      <line x1="196" y1="140" x2="194" y2="195" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <line x1="204" y1="140" x2="206" y2="195" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>

      <!-- Barbell Locked Out Overhead -->
      <line x1="130" y1="42" x2="270" y2="42" stroke="#38bdf8" stroke-width="6"/>
      <rect x="135" y="24" width="10" height="36" rx="2" fill="#38bdf8"/>
      <rect x="255" y="24" width="10" height="36" rx="2" fill="#38bdf8"/>

      <!-- Arms fully extended into lockout overhead -->
      <polyline points="195,78 175,55 175,42" fill="none" stroke="#ccff00" stroke-width="6" stroke-linecap="round"/>
      <polyline points="205,78 225,55 225,42" fill="none" stroke="#ccff00" stroke-width="6" stroke-linecap="round"/>

      <!-- Vertical Clearance Vector Path -->
      <line x1="240" y1="85" x2="240" y2="45" stroke="#ccff00" stroke-width="2" stroke-dasharray="3 3"/>
      <polygon points="240,40 236,48 244,48" fill="#ccff00"/>
      <text x="250" y="65" fill="#ccff00" font-size="9" font-family="sans-serif" font-weight="800">VERTICAL PATH</text>
      `
    )
  ),

  // 11. Incline Dumbbell Bicep Curl
  'gym-db-curl-1': createSvgUri(
    wrapSvg(
      'Incline Dumbbell Curl',
      '60° Incline Stretch • Elbows Pinned Back • Peak Supination',
      'GYM RESISTANCE',
      `
      <!-- Incline Bench at 60° -->
      <line x1="120" y1="185" x2="210" y2="85" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
      <line x1="100" y1="185" x2="135" y2="185" stroke="#334155" stroke-width="6"/>
      <line x1="170" y1="130" x2="170" y2="185" stroke="#334155" stroke-width="4"/>

      <!-- Seated Athlete -->
      <circle cx="190" cy="80" r="9" fill="#f8fafc"/>
      <!-- Torso leaned back on pad -->
      <line x1="180" y1="88" x2="135" y2="165" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Upper Arm Pinned Back -->
      <line x1="165" y1="105" x2="150" y2="145" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>

      <!-- Forearm Curling Up with Dumbbell -->
      <line x1="150" y1="145" x2="180" y2="120" stroke="#f1f5f9" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Dumbbell -->
      <rect x="175" y="112" width="16" height="16" rx="3" fill="#ccff00"/>
      <circle cx="183" cy="120" r="4" fill="#0c1017"/>

      <!-- Bicep Peak Activation Glow -->
      <circle cx="165" cy="122" r="12" fill="#f43f5e" fill-opacity="0.3" stroke="#f43f5e" stroke-width="1"/>
      <text x="195" y="145" fill="#ccff00" font-size="9" font-family="sans-serif" font-weight="800">CURL & SUPINATE</text>
      `
    )
  ),

  // 12. Ap Chagi (Front Snap Kick)
  'tkd-kick-1': createSvgUri(
    wrapSvg(
      'Ap Chagi (Front Snap Kick)',
      'High Knee Chamber • Ap Chook Ball of Foot Strike',
      'TAEKWONDO',
      `
      <!-- Floor Plane -->
      <line x1="40" y1="195" x2="360" y2="195" stroke="#334155" stroke-width="1.5"/>

      <!-- Fighter Body in High Kick Chamber -->
      <circle cx="130" cy="80" r="10" fill="#f8fafc"/>
      <!-- Guarding Arms (WT Defense) -->
      <polyline points="135,90 150,85 145,105" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
      
      <!-- Torso -->
      <line x1="130" y1="90" x2="145" y2="145" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Standing Support Leg -->
      <line x1="145" y1="145" x2="140" y2="195" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="140" cy="195" r="4.5" fill="#38bdf8"/>

      <!-- High Kicking Leg Extended at Shoulder Height -->
      <line x1="145" y1="145" x2="200" y2="120" stroke="#f1f5f9" stroke-width="9" stroke-linecap="round"/>
      <!-- Lower leg snapped straight -->
      <line x1="200" y1="120" x2="285" y2="105" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      
      <!-- Foot: Toes pulled back (Ap Chook) -->
      <polygon points="285,105 295,98 290,110" fill="#ccff00" filter="url(#neonGlow)"/>
      <circle cx="295" cy="98" r="4" fill="#f43f5e"/>

      <!-- Explosive Snap Kinetic Vector -->
      <path d="M 200 135 Q 240 100 290 98" stroke="#ccff00" stroke-width="3" fill="none" filter="url(#neonGlow)"/>
      <text x="240" y="85" fill="#ccff00" font-size="11" font-family="sans-serif" font-weight="900">AP CHOOK SNAP</text>
      `
    )
  ),

  // 13. Dollyo Chagi (Roundhouse / Turning Kick)
  'tkd-kick-2': createSvgUri(
    wrapSvg(
      'Dollyo Chagi (Turning Kick)',
      '180° Base Foot Pivot • Full Horizontal Hip Turnover',
      'TAEKWONDO',
      `
      <!-- Floor Plane -->
      <line x1="40" y1="195" x2="360" y2="195" stroke="#334155" stroke-width="1.5"/>

      <!-- Base Pivot Indicator on Floor -->
      <ellipse cx="140" cy="195" rx="14" ry="4" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <path d="M 128 193 A 12 12 0 0 1 152 193" fill="none" stroke="#ccff00" stroke-width="2"/>
      <text x="140" y="210" fill="#38bdf8" font-size="8" font-family="sans-serif" font-weight="800" text-anchor="middle">180° PIVOT</text>

      <!-- Fighter in Horizontal Rotation -->
      <circle cx="115" cy="88" r="10" fill="#f8fafc"/>
      <!-- Torso leaned back horizontally to counterbalance -->
      <line x1="125" y1="95" x2="155" y2="140" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Base Standing Leg -->
      <line x1="155" y1="140" x2="140" y2="195" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>

      <!-- Turned Over Hip & Kicking Thigh -->
      <line x1="155" y1="140" x2="215" y2="115" stroke="#f43f5e" stroke-width="9" stroke-linecap="round"/>

      <!-- Whipping Shin & Pointed Instep (Baldeung) -->
      <line x1="215" y1="115" x2="300" y2="105" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <polygon points="300,105 315,108 305,115" fill="#ccff00" filter="url(#neonGlow)"/>

      <!-- Rotational Arc Vectors -->
      <path d="M 210 135 A 40 40 0 0 0 305 105" fill="none" stroke="#ccff00" stroke-width="3" filter="url(#neonGlow)"/>
      <text x="260" y="90" fill="#ccff00" font-size="11" font-family="sans-serif" font-weight="900">INSTEP WHIP</text>
      `
    )
  ),

  // 14. Taegeuk Il Jang (Form 1 - Keon)
  'tkd-poomsae-1': createSvgUri(
    wrapSvg(
      'Taegeuk Il Jang (Form 1)',
      'Walking Stance (Ap Seogi) • Low Block (Arae Makki)',
      'TAEKWONDO',
      `
      <!-- Poomsae Line Grid on Floor -->
      <line x1="60" y1="190" x2="340" y2="190" stroke="#334155" stroke-width="1.5"/>
      <line x1="120" y1="190" x2="280" y2="190" stroke="#38bdf8" stroke-width="3"/>

      <!-- Martial Artist in Ap Seogi Stance -->
      <circle cx="190" cy="72" r="10" fill="#f8fafc"/>
      <!-- Dobok Belt (Yellow/Green) -->
      <rect x="180" y="118" width="20" height="5" fill="#ccff00"/>

      <!-- Torso Standing Upright -->
      <line x1="190" y1="82" x2="190" y2="128" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Low Block (Arae Makki): Arm sweeping down over lead knee -->
      <polyline points="190,90 170,115 155,145" fill="none" stroke="#ccff00" stroke-width="6" stroke-linecap="round"/>
      <circle cx="155" cy="145" r="5" fill="#f43f5e" filter="url(#neonGlow)"/>
      <text x="90" y="145" fill="#ccff00" font-size="9" font-family="sans-serif" font-weight="800">ARAE MAKKI</text>

      <!-- Chambered Fist at Hip -->
      <circle cx="205" cy="120" r="4.5" fill="#f8fafc"/>

      <!-- Ap Seogi (Walking Stance) Legs (1 walking step distance) -->
      <line x1="190" y1="128" x2="165" y2="190" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <line x1="190" y1="128" x2="225" y2="190" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="165" cy="190" r="4" fill="#38bdf8"/>
      <circle cx="225" cy="190" r="4" fill="#38bdf8"/>

      <!-- Forward Step Vector -->
      <path d="M 165 182 L 230 182" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3"/>
      <polygon points="230,182 222,178 222,186" fill="#38bdf8"/>
      <text x="240" y="185" fill="#38bdf8" font-size="8" font-family="sans-serif" font-weight="700">1 STEP</text>
      `
    )
  ),

  // 15. Fast Footwork & Step-In Sliding Drills
  'tkd-footwork-1': createSvgUri(
    wrapSvg(
      'Fast Footwork & Slide Drills',
      'Balls of Feet Bounce • Rapid Sliding Evasion',
      'TAEKWONDO',
      `
      <!-- Agility Grid Lines on Floor -->
      <line x1="40" y1="190" x2="360" y2="190" stroke="#334155" stroke-width="1.5"/>
      <line x1="100" y1="175" x2="100" y2="205" stroke="#38bdf8" stroke-width="2"/>
      <line x1="170" y1="175" x2="170" y2="205" stroke="#38bdf8" stroke-width="2"/>
      <line x1="240" y1="175" x2="240" y2="205" stroke="#38bdf8" stroke-width="2"/>
      <line x1="310" y1="175" x2="310" y2="205" stroke="#38bdf8" stroke-width="2"/>

      <!-- Fighter in Active Sparring Bounce -->
      <circle cx="170" cy="75" r="10" fill="#f8fafc"/>
      <!-- Fighting Guard -->
      <polyline points="175,85 190,80 185,100" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
      
      <!-- Torso -->
      <line x1="170" y1="85" x2="175" y2="135" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Springs on Legs (Heels Off Floor) -->
      <polyline points="175,135 155,160 145,185" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="145" cy="185" r="4.5" fill="#ccff00"/>

      <polyline points="175,135 200,160 215,185" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="215" cy="185" r="4.5" fill="#ccff00"/>

      <!-- Fast Forward Sliding Vectors -->
      <path d="M 145 180 Q 210 165 285 180" fill="none" stroke="#ccff00" stroke-width="2.5" filter="url(#neonGlow)"/>
      <polygon points="290,180 280,175 282,185" fill="#ccff00"/>
      <text x="235" y="160" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="900">BBALLINBAL SLIDE</text>
      `
    )
  ),

  // 16. 90/90 Hip Mobility Flow
  'mob-hips-1': createSvgUri(
    wrapSvg(
      '90/90 Hip Mobility Flow',
      '90° Front & Trail Knees • Internal & External Rotation',
      'MOBILITY',
      `
      <!-- Floor Mat Plane -->
      <polygon points="60,185 340,185 300,210 100,210" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>

      <!-- Athlete Seated Tall in 90/90 -->
      <circle cx="180" cy="85" r="10" fill="#f8fafc"/>
      <!-- Upright Spine -->
      <line x1="180" y1="95" x2="185" y2="155" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Lead Leg: 90° Knee Angle in Front (External Rotation) -->
      <polyline points="185,155 140,170 180,185" fill="none" stroke="#ccff00" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="140" cy="170" r="5" fill="#f43f5e"/>
      <text x="100" y="165" fill="#ccff00" font-size="9" font-family="sans-serif" font-weight="800">90° FRONT</text>

      <!-- Trail Leg: 90° Knee Angle to Side (Internal Rotation) -->
      <polyline points="185,155 240,165 230,195" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="240" cy="165" r="5" fill="#f43f5e"/>
      <text x="250" y="165" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="800">90° TRAIL</text>

      <!-- Forward Hinge Stretch Vector over Lead Shin -->
      <path d="M 180 100 L 155 135" stroke="#ccff00" stroke-width="2.5" fill="none" filter="url(#neonGlow)"/>
      <polygon points="152,140 152,128 162,133" fill="#ccff00"/>
      <text x="195" y="120" fill="#ccff00" font-size="9" font-family="sans-serif" font-weight="800">HINGE OVER SHIN</text>
      `
    )
  ),

  // 17. Dynamic Leg Swings
  'mob-hamstrings-1': createSvgUri(
    wrapSvg(
      'Dynamic Leg Swings',
      'Pendulum Arc • Hamstrings & Hip Flexors • Tall Posture',
      'MOBILITY',
      `
      <!-- Floor Plane -->
      <line x1="40" y1="195" x2="360" y2="195" stroke="#334155" stroke-width="1.5"/>

      <!-- Balance Support Pole / Wall -->
      <line x1="80" y1="40" x2="80" y2="195" stroke="#38bdf8" stroke-width="4"/>
      <text x="65" y="110" fill="#38bdf8" font-size="8" font-family="sans-serif" font-weight="800" transform="rotate(-90,65,110)">WALL SUPPORT</text>

      <!-- Standing Athlete -->
      <circle cx="150" cy="70" r="10" fill="#f8fafc"/>
      <!-- Hand on Wall -->
      <line x1="150" y1="82" x2="80" y2="85" stroke="#f1f5f9" stroke-width="4" stroke-linecap="round"/>

      <!-- Torso Tall and Upright -->
      <line x1="150" y1="80" x2="155" y2="140" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>

      <!-- Standing Base Leg Planted -->
      <line x1="155" y1="140" x2="155" y2="195" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
      <circle cx="155" cy="195" r="4.5" fill="#38bdf8"/>

      <!-- Swung Leg (Forward & Backward Ghost Arcs) -->
      <!-- Back Swing Position (Ghost) -->
      <line x1="155" y1="140" x2="110" y2="165" stroke="#94a3b8" stroke-width="5" stroke-dasharray="3 3"/>
      
      <!-- High Front Swing Position -->
      <line x1="155" y1="140" x2="245" y2="115" stroke="#ccff00" stroke-width="8" stroke-linecap="round"/>
      <circle cx="245" cy="115" r="4" fill="#f43f5e"/>

      <!-- Pendulum Swing Trajectory Arc -->
      <path d="M 105 165 Q 160 195 245 115" fill="none" stroke="#ccff00" stroke-width="2.5" filter="url(#neonGlow)"/>
      <polygon points="250,112 240,115 244,124" fill="#ccff00"/>
      <text x="210" y="95" fill="#ccff00" font-size="10" font-family="sans-serif" font-weight="900">PENDULUM SWING</text>
      `
    )
  )
};
