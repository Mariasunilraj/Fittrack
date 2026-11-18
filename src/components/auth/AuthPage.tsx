import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AgeBand, FoodPreference, TrainingDiscipline } from '../../types';
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

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAgeBand, setRegAgeBand] = useState<AgeBand>('18-29');
  const [regFoodPreference, setRegFoodPreference] = useState<FoodPreference>('non-vegetarian');
  const [regPrimaryDiscipline, setRegPrimaryDiscipline] = useState<TrainingDiscipline>('calisthenics');
  const [regWeightKg, setRegWeightKg] = useState('74.5');
  const [regTargetWeightKg, setRegTargetWeightKg] = useState('70.0');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Login submission with Rate Limiting & Input Sanitization
  const handleLoginSubmit = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setLoading(false);
      resetLoginRateLimit(cleanEmail);
      loginUser(cleanEmail, cleanPassword);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }, 350);
  };

  // Handle Register submission with Input Sanitization & Validation
  const handleRegisterSubmit = (e: React.FormEvent) => {
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

    if (cleanPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const weightNum = sanitizeNumeric(regWeightKg, 25, 300, 74.5);
    const targetWeightNum = sanitizeNumeric(regTargetWeightKg, 25, 300, 70.0);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      registerUser({
        displayName: cleanName,
        email: cleanEmail,
        ageBand: regAgeBand,
        foodPreference: regFoodPreference,
        startingWeightKg: weightNum,
        currentWeightKg: weightNum,
        targetWeightKg: targetWeightNum,
        preferredDisciplines: [regPrimaryDiscipline, 'mobility'],
        createdAt: new Date().toISOString().split('T')[0]
      });

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      } catch {}
    }, 450);
  };

  return (
    <div className="w-full max-w-[clamp(19rem,96vw,26.5rem)] mx-auto px-1 sm:px-2 py-2 sm:py-4 animate-fadeIn">
      {/* Compact Logo & Header Hero */}
      <div className="text-center mb-2.5 sm:mb-3">
        <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-yellow text-slate-950 font-black text-base sm:text-lg shadow-md shadow-brand-yellow/20 mb-1.5 active:scale-95 transition-transform">
          FT
        </div>
        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">FitTrack PRO</h1>
        <p className="text-[11px] text-slate-400 mt-1">Smart Fitness & Nutrition Management</p>
      </div>

      {/* Auth Card: Tight padding, relative scaling */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-36 h-36 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

        {/* Clean Switcher Tabs: Sign In & Create A/C (44px min tap target) */}
        <div className="p-0.5 sm:p-1 rounded-xl bg-brand-dark/90 border border-brand-border flex items-center gap-1 mb-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 min-h-[42px] sm:min-h-[44px] py-2 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'login'
                ? 'bg-brand-yellow text-slate-950 shadow-sm font-black'
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
            className={`flex-1 min-h-[42px] sm:min-h-[44px] py-2 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'register'
                ? 'bg-brand-yellow text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white hover:bg-brand-card'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Create A/C</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1: SIGN IN FORM                                  */}
        {/* ==================================================== */}
        {activeTab === 'login' && (
          <div className="space-y-3 animate-fadeIn">
            <form onSubmit={handleLoginSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to your email.')}
                    className="text-[11px] text-brand-yellow hover:underline cursor-pointer py-0.5"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-11 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px] max-h-[46px]"
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
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 min-h-[32px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-brand-border bg-brand-dark text-brand-yellow focus:ring-0 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 min-h-[44px] max-h-[46px] py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-yellow/15 transition cursor-pointer active:scale-[0.98] disabled:opacity-50 touch-manipulation"
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
            <div className="text-center pt-1 border-t border-brand-border/50">
              <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                <span>Encrypted • </span>
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-brand-yellow hover:underline font-semibold cursor-pointer py-0.5"
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
          <div className="space-y-3 animate-fadeIn">
            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    required
                    placeholder="e.g. F.MARIA SUNIL RAJ"
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Password (min 6)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px] max-h-[46px]"
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
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px] max-h-[46px]"
                    />
                  </div>
                </div>
              </div>

              {/* Age Band Selector (44px min tap targets) */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Age Band (Calibrated Recovery)
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {(['18-29', '30-39', '40-49', '50-59', '60+'] as AgeBand[]).map(band => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setRegAgeBand(band)}
                      className={`min-h-[40px] sm:min-h-[44px] py-1.5 px-0.5 text-center rounded-lg sm:rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 touch-manipulation ${
                        regAgeBand === band
                          ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-sm font-black'
                          : 'bg-brand-dark/80 border-brand-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preference & Primary Discipline */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Diet
                  </label>
                  <select
                    value={regFoodPreference}
                    onChange={e => setRegFoodPreference(e.target.value as FoodPreference)}
                    className="w-full px-2.5 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-brand-yellow capitalize min-h-[44px] max-h-[46px]"
                  >
                    <option value="non-vegetarian">Non-Veg</option>
                    <option value="vegetarian">Veg</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Discipline
                  </label>
                  <select
                    value={regPrimaryDiscipline}
                    onChange={e => setRegPrimaryDiscipline(e.target.value as TrainingDiscipline)}
                    className="w-full px-2.5 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-brand-yellow capitalize min-h-[44px] max-h-[46px]"
                  >
                    <option value="calisthenics">Calisthenics</option>
                    <option value="taekwondo">Taekwondo</option>
                    <option value="gym">Gym / Weights</option>
                    <option value="weightlifting">Powerlifting</option>
                  </select>
                </div>
              </div>

              {/* Weight & Target Goal */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Current (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={regWeightKg}
                    onChange={e => setRegWeightKg(e.target.value)}
                    className="w-full px-2 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs font-mono text-white text-center focus:outline-none focus:border-brand-yellow min-h-[44px] max-h-[46px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Target (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={regTargetWeightKg}
                    onChange={e => setRegTargetWeightKg(e.target.value)}
                    className="w-full px-2 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs font-mono text-brand-yellow text-center focus:outline-none focus:border-brand-yellow min-h-[44px] max-h-[46px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 min-h-[44px] max-h-[46px] py-2.5 px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-yellow/15 transition cursor-pointer active:scale-[0.98] disabled:opacity-50 touch-manipulation"
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

            {/* Privacy Policy Link on Register Form */}
            <div className="text-center pt-1 border-t border-brand-border/50">
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Data minimized •{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-brand-yellow hover:underline font-semibold cursor-pointer py-0.5"
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
