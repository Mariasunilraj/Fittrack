import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { showToast, setShowOnboarding } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(isSignUp ? 'Account created! Complete your onboarding profile.' : 'Welcome back to FitTrack!');
      onClose();
      if (isSignUp) {
        setShowOnboarding(true);
      }
    }, 800);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Signed in with Demo Member profile');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-brand-hover transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-yellow/10 text-brand-yellow mb-3 border border-brand-yellow/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isSignUp ? 'Join FitTrack' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isSignUp ? 'Personalized fitness & Indian nutrition for ages 18–60+' : 'Access your workout logs, nutrition & martial arts'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sundaram"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-brand-dark/80 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-yellow transition text-white placeholder-slate-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-brand-dark/80 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-yellow transition text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-brand-dark/80 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-yellow transition text-white placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-bold rounded-xl transition duration-200 shadow-lg shadow-brand-yellow/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isSignUp ? 'Create FitTrack Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-brand-surface px-3 text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full py-2.5 px-4 bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-brand-yellow" />
          <span>Quick Demo Access (Guest Mode)</span>
        </button>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-brand-yellow hover:underline font-semibold ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-brand-yellow hover:underline font-semibold ml-1 cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
