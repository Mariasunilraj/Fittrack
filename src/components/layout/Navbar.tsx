import React from 'react';
import { User, LogOut } from 'lucide-react';
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
    settings: 'Account Settings',
    auth: 'Sign In / Register'
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-brand-surface/95 backdrop-blur-md border-b border-brand-border px-3 sm:px-6 py-2.5 sm:py-3.5 safe-area-top select-none">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Brand Logo & Current View */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'auth')}
            className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-md shadow-brand-yellow/20">
              FT
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
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
              {/* User Profile Pill (44px min tap target) */}
              <div
                onClick={() => setCurrentView('settings')}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border transition cursor-pointer min-h-[44px] active:scale-95 touch-manipulation"
                title="Account Settings"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-yellow to-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                  {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-slate-200 leading-tight">{profile.displayName || 'Athlete'}</div>
                  <div className="text-[10px] text-slate-400">{profile.ageBand} • {profile.experienceLevel}</div>
                </div>
              </div>

              {/* 1-Click Sign Out Button (44px min tap target) */}
              <button
                onClick={logoutUser}
                className="p-2.5 sm:p-2 rounded-xl bg-brand-card hover:bg-rose-950/30 border border-brand-border hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold min-h-[44px] min-w-[44px] active:scale-95 touch-manipulation"
                title="Sign Out of FitTrack"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </>
          ) : currentView !== 'auth' ? (
            /* Logged Out / Guest View: Only shown when NOT already on the auth page */
            <button
              onClick={() => setCurrentView('auth')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-yellow hover:bg-[#cbe034] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-yellow/20 transition cursor-pointer active:scale-95 touch-manipulation"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
