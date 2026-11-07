import React from 'react';
import { Bot, User, ShieldCheck, Flame, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { profile, currentView, setCurrentView } = useApp();

  const viewTitles: Record<string, string> = {
    dashboard: 'Executive Dashboard',
    training: 'Workout',
    exercises: 'Curated Exercise Library',
    nutrition: 'Indian Nutrition & Hydration',
    taekwondo: 'Taekwondo Martial Arts',
    progress: 'Progress & Recovery Analytics',
    'ai-coach': 'FitTrack AI Assistant',
    settings: 'Settings & Cloud Database',
    auth: 'Sign In / Register'
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-brand-surface/90 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Brand Logo & Current View */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-yellow flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-md shadow-brand-yellow/20 group-hover:scale-105 transition">
              FT
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                FitTrack <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">PRO</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 ml-3 border-l border-brand-border text-xs text-slate-400 font-medium">
            <span>/</span>
            <span className="text-slate-200 font-semibold">{viewTitles[currentView] || 'Overview'}</span>
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Quick Button */}
          <button
            onClick={() => setCurrentView('ai-coach')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              currentView === 'ai-coach'
                ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-md shadow-brand-yellow/20'
                : 'bg-brand-card hover:bg-brand-hover text-brand-yellow border-brand-yellow/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">AI Fitness Coach</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Sign In / Register Button */}
          <button
            onClick={() => setCurrentView('auth')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              currentView === 'auth'
                ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-md shadow-brand-yellow/20'
                : 'bg-brand-card hover:bg-brand-hover text-slate-200 border-brand-border'
            }`}
            title="Sign In or Register New Account"
          >
            <User className="w-3.5 h-3.5 text-brand-yellow" />
            <span className="hidden sm:inline">Sign In / Register</span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => setCurrentView('settings')}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-yellow to-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              {profile.displayName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-slate-200 leading-tight">{profile.displayName}</div>
              <div className="text-[10px] text-slate-400">{profile.ageBand} • {profile.experienceLevel}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
