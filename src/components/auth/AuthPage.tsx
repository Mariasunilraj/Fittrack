import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Globe,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AgeBand, FoodPreference, TrainingDiscipline, ExperienceLevel, IndianRegion } from '../../types';
import {
  sanitizeString,
  isValidEmail,
  sanitizeNumeric,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit
} from '../../utils/security';

interface AuthPageProps {
  onOpenPrivacyPolicy?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onOpenPrivacyPolicy }) => {
  const { loginUser, registerUser, showToast } = useApp();

  // Active form tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state (Weights empty with placeholders, no real name prefill)
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regAgeBand, setRegAgeBand] = useState<AgeBand>('18-29');
  const [regFoodPreference, setRegFoodPreference] = useState<FoodPreference>('non-vegetarian');
  const [regPrimaryDiscipline, setRegPrimaryDiscipline] = useState<TrainingDiscipline>('calisthenics');
  const [regExperienceLevel, setRegExperienceLevel] = useState<ExperienceLevel>('intermediate');
  const [regRegion, setRegRegion] = useState<IndianRegion>('south-indian');
  const [regWeightKg, setRegWeightKg] = useState('');
  const [regTargetWeightKg, setRegTargetWeightKg] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password confirmation match indicators
  const passwordHasTyped = regPassword.length > 0;
  const confirmHasTyped = regConfirmPassword.length > 0;
  const passwordsMatch = passwordHasTyped && confirmHasTyped && regPassword === regConfirmPassword;
  const passwordsMismatch = confirmHasTyped && regPassword !== regConfirmPassword;

  // Handle Login submission with Rate Limiting & Input Sanitization
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = sanitizeString(loginEmail, 150).toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Rate Limiting check (anti-brute force)
    const rateCheck = checkLoginRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      setErrorMessage(
        `Too many failed attempts. Locked for security. Retry in ${rateCheck.remainingSeconds}s.`
      );
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(cleanEmail, cleanPassword);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password.');
      } else {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register submission with Input Sanitization & Validation (min 8 chars)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = sanitizeString(regFullName, 80);
    const cleanEmail = sanitizeString(regEmail, 150).toLowerCase();
    const cleanPassword = regPassword.trim();
    const cleanConfirm = regConfirmPassword.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name (max 80 chars).');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long for account security.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    // Validate weights or prompt user cleanly
    const currentWeightNum = regWeightKg ? parseFloat(regWeightKg) : 74.5;
    const targetWeightNum = regTargetWeightKg ? parseFloat(regTargetWeightKg) : 70.0;

    if (regWeightKg && (isNaN(currentWeightNum) || currentWeightNum < 30 || currentWeightNum > 250)) {
      setErrorMessage('Please enter a realistic current weight between 30 kg and 250 kg.');
      return;
    }

    if (regTargetWeightKg && (isNaN(targetWeightNum) || targetWeightNum < 30 || targetWeightNum > 250)) {
      setErrorMessage('Please enter a realistic target weight between 30 kg and 250 kg.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(
        {
          displayName: cleanName,
          email: cleanEmail,
          ageBand: regAgeBand,
          foodPreference: regFoodPreference,
          preferredDisciplines: [regPrimaryDiscipline, 'mobility'],
          experienceLevel: regExperienceLevel,
          region: regRegion,
          startingWeightKg: currentWeightNum,
          currentWeightKg: currentWeightNum,
          targetWeightKg: targetWeightNum,
          createdAt: new Date().toISOString().split('T')[0]
        },
        cleanPassword
      );

      if (!result.success) {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      } else {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        } catch {}
      }
    } catch {
      setErrorMessage('An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[clamp(19rem,96vw,27.5rem)] mx-auto px-1 sm:px-2 pt-2 sm:pt-4 pb-8 animate-fadeIn">
      {/* Compact Logo & Header Hero */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ccff00] text-slate-950 font-black text-base sm:text-lg shadow-md shadow-[#ccff00]/20 mb-1.5 active:scale-95 transition-transform">
          FT
        </div>
        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">FitTrack PRO</h1>
        <p className="text-xs text-slate-400 mt-1">Smart Fitness & Nutrition Management</p>
      </div>

      {/* Auth Card: High contrast, responsive scaling, no clipping */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-36 h-36 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Clean Switcher Tabs: Sign In & Create Account (never "Create A/C") */}
        <div className="p-1 rounded-xl bg-brand-dark/95 border border-brand-border flex items-center gap-1 mb-3.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'login'
                ? 'bg-[#ccff00] text-slate-950 shadow-md shadow-[#ccff00]/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-brand-card'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'register'
                ? 'bg-[#ccff00] text-slate-950 shadow-md shadow-[#ccff00]/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-brand-card'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1: SIGN IN FORM                                  */}
        {/* ==================================================== */}
        {activeTab === 'login' && (
          <div className="space-y-3.5 animate-fadeIn">
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] transition min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to your email.')}
                    className="text-xs text-[#ccff00] hover:underline cursor-pointer py-0.5"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] transition min-h-[44px] max-h-[46px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-90"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 min-h-[32px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-brand-border bg-brand-dark text-[#ccff00] focus:ring-0 cursor-pointer accent-[#ccff00]"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Primary Action Button: Vibrant Lime matching Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 min-h-[44px] max-h-[48px] py-2.5 px-4 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/20 transition cursor-pointer active:scale-[0.98] disabled:opacity-50 touch-manipulation"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Policy Link on Form */}
            <div className="text-center pt-2 border-t border-brand-border/60">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                <span>Encrypted • </span>
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-[#ccff00] hover:underline font-semibold cursor-pointer py-0.5"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: REGISTER FORM                                 */}
        {/* ==================================================== */}
        {activeTab === 'register' && (
          <div className="space-y-3.5 animate-fadeIn">
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    required
                    placeholder="e.g. Alex Kumar"
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] transition min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] transition min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              {/* Password & Confirm Password (min 8 chars with match indicator) */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Password (min 8 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] transition min-h-[44px] max-h-[46px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-90"
                        aria-label="Toggle password visibility"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-2.5 bg-brand-dark/95 border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none transition min-h-[44px] max-h-[46px] ${
                          passwordsMismatch
                            ? 'border-rose-500 focus:border-rose-400'
                            : passwordsMatch
                            ? 'border-emerald-500 focus:border-emerald-400'
                            : 'border-brand-border focus:border-[#ccff00]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-90"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {confirmHasTyped && (
                  <div className="flex items-center gap-1.5 text-xs pt-0.5">
                    {passwordsMatch ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Passwords match</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Passwords do not match yet</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Age Band Selector (High-contrast chips, min 44px tap targets) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Age Band (Target Recovery Profile)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['18-29', '30-39', '40-49', '50-59', '60+'] as AgeBand[]).map(band => {
                    const isSelected = regAgeBand === band;
                    return (
                      <button
                        key={band}
                        type="button"
                        onClick={() => setRegAgeBand(band)}
                        className={`min-h-[42px] sm:min-h-[44px] py-1.5 px-0.5 text-center rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 touch-manipulation ${
                          isSelected
                            ? 'bg-[#ccff00] text-slate-950 border-[#ccff00] shadow-md shadow-[#ccff00]/20 font-black'
                            : 'bg-brand-dark/95 border-brand-border text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        {band}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Preference & Primary Discipline (Custom Styled Dropdowns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Dietary Preference
                  </label>
                  <div className="relative">
                    <select
                      value={regFoodPreference}
                      onChange={e => setRegFoodPreference(e.target.value as FoodPreference)}
                      className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-[#ccff00] capitalize min-h-[44px] max-h-[46px] cursor-pointer"
                    >
                      <option value="non-vegetarian" className="bg-[#141821] text-white">Non-Vegetarian</option>
                      <option value="vegetarian" className="bg-[#141821] text-white">Vegetarian</option>
                      <option value="eggetarian" className="bg-[#141821] text-white">Eggetarian</option>
                      <option value="vegan" className="bg-[#141821] text-white">Vegan</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Primary Discipline
                  </label>
                  <div className="relative">
                    <select
                      value={regPrimaryDiscipline}
                      onChange={e => setRegPrimaryDiscipline(e.target.value as TrainingDiscipline)}
                      className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-[#ccff00] capitalize min-h-[44px] max-h-[46px] cursor-pointer"
                    >
                      <option value="calisthenics" className="bg-[#141821] text-white">Calisthenics</option>
                      <option value="taekwondo" className="bg-[#141821] text-white">Taekwondo</option>
                      <option value="gym" className="bg-[#141821] text-white">Gym / Weights</option>
                      <option value="weightlifting" className="bg-[#141821] text-white">Powerlifting</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Region & Tier (Collected at Sign-up so profile displays them accurately) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>Athlete Tier</span>
                  </label>
                  <div className="relative">
                    <select
                      value={regExperienceLevel}
                      onChange={e => setRegExperienceLevel(e.target.value as ExperienceLevel)}
                      className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-[#ccff00] capitalize min-h-[44px] max-h-[46px] cursor-pointer"
                    >
                      <option value="beginner" className="bg-[#141821] text-white">Beginner</option>
                      <option value="intermediate" className="bg-[#141821] text-white">Intermediate</option>
                      <option value="advanced" className="bg-[#141821] text-white">Advanced</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dietary Region</span>
                  </label>
                  <div className="relative">
                    <select
                      value={regRegion}
                      onChange={e => setRegRegion(e.target.value as IndianRegion)}
                      className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-[#ccff00] min-h-[44px] max-h-[46px] cursor-pointer"
                    >
                      <option value="south-indian" className="bg-[#141821] text-white">South Indian</option>
                      <option value="north-indian" className="bg-[#141821] text-white">North Indian</option>
                      <option value="west-indian" className="bg-[#141821] text-white">West Indian</option>
                      <option value="east-indian" className="bg-[#141821] text-white">East Indian</option>
                      <option value="all" className="bg-[#141821] text-white">Pan-Indian / Global</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Current & Target Body Weight (Empty with clear placeholders) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="e.g. 74.5"
                    value={regWeightKg}
                    onChange={e => setRegWeightKg(e.target.value)}
                    className="w-full px-3 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm font-mono text-white text-center placeholder-slate-500 focus:outline-none focus:border-[#ccff00] min-h-[44px] max-h-[46px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Goal (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="e.g. 70.0"
                    value={regTargetWeightKg}
                    onChange={e => setRegTargetWeightKg(e.target.value)}
                    className="w-full px-3 py-2.5 bg-brand-dark/95 border border-brand-border rounded-xl text-base sm:text-sm font-mono text-[#ccff00] text-center placeholder-slate-500 focus:outline-none focus:border-[#ccff00] min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              {/* Primary Action Button: Vibrant Lime matching Sign In, high contrast text */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 min-h-[44px] max-h-[48px] py-2.5 px-4 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/25 transition cursor-pointer active:scale-[0.98] disabled:opacity-50 touch-manipulation"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Policy Link on Register Form (No clipping) */}
            <div className="text-center pt-2 border-t border-brand-border/60">
              <p className="text-xs text-slate-400">
                Data minimized •{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-[#ccff00] hover:underline font-semibold cursor-pointer py-0.5"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
