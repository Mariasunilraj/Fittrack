import React, { useState } from 'react';
import { User, LogOut, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { profile, currentView, setCurrentView, isAuthenticated, logoutUser } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logoutUser();
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-brand-surface/98 backdrop-blur-md border-b border-brand-border px-3 sm:px-6 py-2 sm:py-2.5 safe-area-top select-none">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Brand Logo & Current View */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'auth')}
              className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#ccff00] flex items-center justify-center font-black text-slate-950 text-base sm:text-lg tracking-tighter shadow-md shadow-[#ccff00]/20">
                FT
              </div>
              <div>
                <span className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  FitTrack <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">PRO</span>
                </span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 pl-3 ml-2 border-l border-brand-border text-xs text-slate-400 font-medium">
                <span>/</span>
                <span className="text-slate-200 font-semibold">{viewTitles[currentView] || 'Overview'}</span>
              </div>
            )}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {isAuthenticated ? (
              <>
                {/* User Profile Pill (Min 44px tap target) */}
                <div
                  onClick={() => setCurrentView('settings')}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border transition cursor-pointer min-h-[44px] active:scale-95 touch-manipulation"
                  title="Account Settings"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#ccff00] to-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                    {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-semibold text-slate-200 leading-tight truncate max-w-[120px]">{profile.displayName || 'Athlete'}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{profile.ageBand} • {profile.experienceLevel}</div>
                  </div>
                </div>

                {/* Safe Sign Out Button with Confirmation Prompt */}
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-brand-card hover:bg-rose-950/30 border border-brand-border hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold min-h-[44px] min-w-[44px] active:scale-95 touch-manipulation"
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
                className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#ccff00]/20 transition cursor-pointer active:scale-95 touch-manipulation"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Sign Out Confirmation</h3>
                <p className="text-xs text-slate-400 mt-0.5">Are you sure you want to sign out of FitTrack?</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-brand-dark/80 p-3 rounded-xl border border-brand-border">
              Your workouts, nutrition logs, and progress history are securely saved. You can sign back in anytime.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="min-h-[44px] px-4 py-2 text-xs font-bold text-white rounded-xl bg-rose-600 hover:bg-rose-500 transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
