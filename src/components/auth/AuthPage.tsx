import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  Award,
  Activity,
  Utensils,
  Camera,
  ChevronRight,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AgeBand, FoodPreference, TrainingDiscipline } from '../../types';

export const AuthPage: React.FC = () => {
  const { loginUser, registerUser, showToast, setCurrentView } = useApp();

  // Active form tab on the same page: 'login' | 'register'
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

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(loginEmail, loginPassword);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
    }, 600);
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!regEmail.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const weightNum = parseFloat(regWeightKg) || 74.5;
    const targetWeightNum = parseFloat(regTargetWeightKg) || 70.0;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      registerUser({
        displayName: regFullName.trim(),
        email: regEmail.trim(),
        ageBand: regAgeBand,
        foodPreference: regFoodPreference,
        currentWeightKg: weightNum,
        targetWeightKg: targetWeightNum,
        preferredDisciplines: [regPrimaryDiscipline, 'mobility']
      });

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (err) {}
    }, 700);
  };

  // Demo Fast Track Login
  const handleQuickDemoAccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser('athlete@fittrack.in', 'demo123', 'Sunil Raj');
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-2 sm:px-4 animate-fadeIn">
      {/* Container with Left Feature Showcase and Right Dual Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: BRANDING & FEATURE SHOWCASE                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-black uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Next-Gen Fitness Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              One Unified Account for <span className="text-brand-yellow">Hybrid Mastery</span>.
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Designed specifically for all ages (18–60+), combining multimodal Gemini AI food photo scanning, Calisthenics progressions, Taekwondo martial arts, and Gym lifting.
            </p>
          </div>

          {/* 4 Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border flex items-start gap-3.5 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Gemini AI Food Photo Scanner</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Snap any home-cooked or restaurant Indian meal to get instant calories, protein, carbs, and fat breakdown.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border flex items-start gap-3.5 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 text-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Tri-Discipline Training Schedules</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Calisthenics ladders, Taekwondo poomsae & kick drills, and Gym barbell lifts with custom techniques.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border flex items-start gap-3.5 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Goal Trajectory & PR Hall of Fame</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Current weight vs target goal area charts, weekly discipline breakdowns, and personal record logs.
                </p>
              </div>
            </div>
          </div>

          {/* Security Vault Indicator */}
          <div className="p-3.5 rounded-xl bg-brand-dark/70 border border-brand-border/80 flex items-center gap-3 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Server-Side Vault Protected:</strong> API keys and user credentials are shielded from frontend leakage.
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: LOGIN & REGISTER ON THE SAME PAGE          */}
        {/* ======================================================== */}
        <div className="lg:col-span-7">
          <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

            {/* UNIFIED SWITCHER: LOGIN & REGISTER TABS ON THE SAME PAGE */}
            <div className="p-1.5 rounded-2xl bg-brand-dark/90 border border-brand-border flex items-center gap-1.5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-brand-yellow text-slate-950 shadow-md shadow-brand-yellow/20'
                    : 'text-slate-400 hover:text-white hover:bg-brand-card'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>1. Sign In to FitTrack</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-brand-yellow text-slate-950 shadow-md shadow-brand-yellow/20'
                    : 'text-slate-400 hover:text-white hover:bg-brand-card'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>2. Create New Account</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 1: SIGN IN FORM                                  */}
            {/* ==================================================== */}
            {activeTab === 'login' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back to FitTrack</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your email credentials to access your daily workouts, nutrition tracker, and analytics.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="athlete@fittrack.in"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
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
                        onClick={() => showToast('Password reset link has been dispatched to your email.')}
                        className="text-[11px] text-brand-yellow hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-11 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-brand-border bg-brand-dark text-brand-yellow focus:ring-0"
                      />
                      <span>Keep me signed in</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.01] disabled:opacity-50"
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

                {/* Instant Guest / Demo Mode Button */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-brand-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold">
                    <span className="bg-brand-surface px-3 text-slate-500">Or Access With One Click</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoAccess}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer hover:border-slate-500"
                >
                  <Sparkles className="w-4 h-4 text-brand-yellow" />
                  <span>⚡ Instant Demo Access (Guest Mode)</span>
                </button>

                {/* Switch to Register link on same page */}
                <p className="text-center text-xs text-slate-400 pt-2">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage(null);
                    }}
                    className="text-brand-yellow hover:underline font-bold ml-1 cursor-pointer"
                  >
                    Create Account on this page →
                  </button>
                </p>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 2: REGISTER FORM                                 */}
            {/* ==================================================== */}
            {activeTab === 'register' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Create Your FitTrack Account</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Set up your personalized athlete profile for calorie targets, workouts, and goal trajectory.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sunil Raj"
                          value={regFullName}
                          onChange={e => setRegFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Create Password (min 6 chars)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
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
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={regConfirmPassword}
                          onChange={e => setRegConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Age Band Selector (18-60+) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Target Age Band (Calibrated Training & Recovery)
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['18-29', '30-39', '40-49', '50-59', '60+'] as AgeBand[]).map(band => (
                        <button
                          key={band}
                          type="button"
                          onClick={() => setRegAgeBand(band)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                            regAgeBand === band
                              ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-sm'
                              : 'bg-brand-dark/80 border-brand-border text-slate-400 hover:text-white'
                          }`}
                        >
                          {band}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Preference & Primary Discipline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Dietary Palette
                      </label>
                      <select
                        value={regFoodPreference}
                        onChange={e => setRegFoodPreference(e.target.value as FoodPreference)}
                        className="w-full px-3 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow capitalize"
                      >
                        <option value="vegetarian">Vegetarian (Pure Veg)</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="eggetarian">Eggetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Primary Discipline
                      </label>
                      <select
                        value={regPrimaryDiscipline}
                        onChange={e => setRegPrimaryDiscipline(e.target.value as TrainingDiscipline)}
                        className="w-full px-3 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow capitalize"
                      >
                        <option value="calisthenics">Calisthenics (Bodyweight)</option>
                        <option value="taekwondo">Taekwondo (Martial Arts)</option>
                        <option value="gym">Gym & Free Weights</option>
                        <option value="weightlifting">Powerlifting & Strength</option>
                      </select>
                    </div>
                  </div>

                  {/* Weight & Target Goal */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Current Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={regWeightKg}
                        onChange={e => setRegWeightKg(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-xs font-mono text-white text-center focus:outline-none focus:border-brand-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Target Goal (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={regTargetWeightKg}
                        onChange={e => setRegTargetWeightKg(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-xs font-mono text-brand-yellow text-center focus:outline-none focus:border-brand-yellow"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.01] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Start Training</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Sign In link on same page */}
                <p className="text-center text-xs text-slate-400 pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage(null);
                    }}
                    className="text-brand-yellow hover:underline font-bold ml-1 cursor-pointer"
                  >
                    Sign In on this page →
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
