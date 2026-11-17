import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AgeBand, FoodPreference, TrainingDiscipline } from '../../types';

export const AuthPage: React.FC = () => {
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
      loginUser(loginEmail.trim(), loginPassword.trim());
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
    }, 400);
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
    <div className="min-h-[75vh] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-4 animate-fadeIn">
      <div className="w-full max-w-[440px] mx-auto">
        {/* FitTrack Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-yellow text-slate-950 font-black text-xl shadow-lg shadow-brand-yellow/20 mb-3">
            FT
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">FitTrack PRO</h1>
          <p className="text-xs text-slate-400 mt-1">Smart Fitness & Nutrition Management</p>
        </div>

        {/* Simplified Auth Card */}
        <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-slate-100">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-44 h-44 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          {/* Clean Switcher: Sign In & Create A/C */}
          <div className="p-1 rounded-2xl bg-brand-dark/90 border border-brand-border flex items-center gap-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-brand-yellow text-slate-950 shadow-sm'
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
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-brand-yellow text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-brand-card'
              }`}
            >
              <User className="w-3.5 h-3.5" />
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
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
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
                      onClick={() => showToast('Password reset link sent to your registered email.')}
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

                <div className="flex items-center justify-between pt-0.5">
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
                  className="w-full mt-2 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.01] disabled:opacity-50"
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

              <p className="text-center text-xs text-slate-400 pt-3 border-t border-brand-border/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                  }}
                  className="text-brand-yellow hover:underline font-bold ml-1 cursor-pointer"
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
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. F.MARIA SUNIL RAJ"
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
                      placeholder="name@example.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Age Band Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Age Band
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['18-29', '30-39', '40-49', '50-59', '60+'] as AgeBand[]).map(band => (
                      <button
                        key={band}
                        type="button"
                        onClick={() => setRegAgeBand(band)}
                        className={`py-1.5 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Diet
                    </label>
                    <select
                      value={regFoodPreference}
                      onChange={e => setRegFoodPreference(e.target.value as FoodPreference)}
                      className="w-full px-2.5 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow capitalize"
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
                      className="w-full px-2.5 py-2 bg-brand-dark/90 border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow capitalize"
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
                  className="w-full mt-2 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.01] disabled:opacity-50"
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

              <p className="text-center text-xs text-slate-400 pt-3 border-t border-brand-border/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className="text-brand-yellow hover:underline font-bold ml-1 cursor-pointer"
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
