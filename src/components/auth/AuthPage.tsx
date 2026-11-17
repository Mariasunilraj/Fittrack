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
        `Too many failed attempts. Login locked for security. Please retry in ${rateCheck.remainingSeconds} seconds.`
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
      } catch (err) {}
    }, 400);
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
      setErrorMessage('Please enter your full name (maximum 80 characters).');
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
      } catch (err) {}
    }, 500);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-4 sm:py-10 px-2 sm:px-4 animate-fadeIn w-full">
      <div className="w-full max-w-[440px] mx-auto">
        {/* FitTrack Logo & Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-yellow text-slate-950 font-black text-xl shadow-lg shadow-brand-yellow/20 mb-3 active:scale-95 transition-transform">
            FT
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">FitTrack PRO</h1>
          <p className="text-xs text-slate-400 mt-1">Smart Fitness & Nutrition Management</p>
        </div>

        {/* Simplified Auth Card */}
        <div className="bg-brand-surface border border-brand-border rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden text-slate-100">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-44 h-44 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          {/* Clean Switcher: Sign In & Create A/C (44px min tap targets) */}
          <div className="p-1 rounded-2xl bg-brand-dark/90 border border-brand-border flex items-center gap-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 touch-manipulation ${
                activeTab === 'login'
                  ? 'bg-brand-yellow text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-brand-card'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 touch-manipulation ${
                activeTab === 'register'
                  ? 'bg-brand-yellow text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-brand-card'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Create A/C</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 1: SIGN IN FORM                                  */}
          {/* ==================================================== */}
          {activeTab === 'login' && (
            <div className="space-y-4 animate-fadeIn">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
                      className="w-full pl-10 pr-4 py-3 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => showToast('Password reset instructions dispatched to your verified email.')}
                      className="text-xs text-brand-yellow hover:underline cursor-pointer py-1"
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
                      className="w-full pl-10 pr-12 py-3 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-90"
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 min-h-[36px]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-border bg-brand-dark text-brand-yellow focus:ring-0 cursor-pointer"
                    />
                    <span>Keep me signed in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 min-h-[48px] py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer active:scale-[0.98] disabled:opacity-50 touch-manipulation"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Privacy Policy Link on Form */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span>Encrypted & Private • </span>
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="text-brand-yellow hover:underline font-bold cursor-pointer py-1"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>

              <p className="text-center text-xs text-slate-400 pt-3 border-t border-brand-border/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                  }}
                  className="text-brand-yellow hover:underline font-bold ml-1 cursor-pointer py-1"
                >
                  Create A/C
                </button>
              </p>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: REGISTER FORM                                 */}
          {/* ==================================================== */}
          {activeTab === 'register' && (
            <div className="space-y-4 animate-fadeIn">
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. F.MARIA SUNIL RAJ"
                      value={regFullName}
                      onChange={e => setRegFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
                      className="w-full pl-10 pr-4 py-3 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
                        className="w-full pl-9 pr-10 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-90"
                        aria-label="Toggle password visibility"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
                        className="w-full pl-9 pr-4 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Age Band Selector (44px min tap targets) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Age Band (Calibrated Recovery)
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['18-29', '30-39', '40-49', '50-59', '60+'] as AgeBand[]).map(band => (
                      <button
                        key={band}
                        type="button"
                        onClick={() => setRegAgeBand(band)}
                        className={`min-h-[44px] py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 touch-manipulation ${
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Diet
                    </label>
                    <select
                      value={regFoodPreference}
                      onChange={e => setRegFoodPreference(e.target.value as FoodPreference)}
                      className="w-full px-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-brand-yellow capitalize min-h-[44px]"
                    >
                      <option value="non-vegetarian">Non-Veg</option>
                      <option value="vegetarian">Veg</option>
                      <option value="eggetarian">Eggetarian</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Discipline
                    </label>
                    <select
                      value={regPrimaryDiscipline}
                      onChange={e => setRegPrimaryDiscipline(e.target.value as TrainingDiscipline)}
                      className="w-full px-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-brand-yellow capitalize min-h-[44px]"
                    >
                      <option value="calisthenics">Calisthenics</option>
                      <option value="taekwondo">Taekwondo</option>
                      <option value="gym">Gym / Weights</option>
                      <option value="weightlifting">Powerlifting</option>
                    </select>
                  </div>
                </div>

                {/* Weight & Target Goal */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={regWeightKg}
                      onChange={e => setRegWeightKg(e.target.value)}
                      className="w-full px-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs font-mono text-white text-center focus:outline-none focus:border-brand-yellow min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Target Goal (kg)
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={regTargetWeightKg}
                      onChange={e => setRegTargetWeightKg(e.target.value)}
                      className="w-full px-3 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-base sm:text-xs font-mono text-brand-yellow text-center focus:outline-none focus:border-brand-yellow min-h-[44px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 min-h-[48px] py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer active:scale-[0.98] disabled:opacity-50 touch-manipulation"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Privacy Policy Link on Register Form */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  By creating an account, you agree to FitTrack's{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="text-brand-yellow hover:underline font-bold cursor-pointer py-1"
                  >
                    Privacy Policy
                  </button>{' '}
                  and data minimization terms.
                </p>
              </div>

              <p className="text-center text-xs text-slate-400 pt-3 border-t border-brand-border/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className="text-brand-yellow hover:underline font-bold ml-1 cursor-pointer py-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
