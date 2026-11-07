import React from 'react';
import { User, Sparkles, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { profile, currentView, setCurrentView, isAuthenticated, logoutUser } = useApp();

  const viewTitles: Record<string, string> = {
    dashboard: 'Executive Dashboard',
    training: 'Workout',
    exercises: 'Curated Exercise Library',
    nutrition: 'Indian Nutrition & Hydration',
    taekwondo: 'Taekwondo Martial Arts',
    progress: 'Progress & Recovery Analytics',
    'ai-coach': 'FitTrack AI Assistant',
    settings: 'Account Settings',
    auth: 'Sign In / Register'
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-brand-surface/90 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Brand Logo & Current View */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'auth')}
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

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 pl-4 ml-3 border-l border-brand-border text-xs text-slate-400 font-medium">
              <span>/</span>
              <span className="text-slate-200 font-semibold">{viewTitles[currentView] || 'Overview'}</span>
            </div>
          )}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
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

              {/* User Profile Pill */}
              <div
                onClick={() => setCurrentView('settings')}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border transition cursor-pointer"
                title="Account Settings"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-yellow to-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-slate-200 leading-tight">{profile.displayName || 'Athlete'}</div>
                  <div className="text-[10px] text-slate-400">{profile.ageBand} • {profile.experienceLevel}</div>
                </div>
              </div>

              {/* 1-Click Sign Out Button */}
              <button
                onClick={logoutUser}
                className="p-2 rounded-xl bg-brand-card hover:bg-rose-950/30 border border-brand-border hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Sign Out of FitTrack"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </>
          ) : (
            /* Logged Out / Guest View: Only show Sign In button */
            <button
              onClick={() => setCurrentView('auth')}
              className="px-3.5 py-1.5 rounded-xl bg-brand-yellow hover:bg-[#cbe034] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-yellow/20 transition cursor-pointer hover:scale-105"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
