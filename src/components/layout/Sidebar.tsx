import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Shield,
  TrendingUp,
  Settings,
  HelpCircle,
  Award
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, workoutPlans, activeWorkoutSession } = useApp();

  const navItems: { id: AppView; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'training',
      label: 'Workout',
      icon: Dumbbell,
      badge: activeWorkoutSession ? 'Active' : `${workoutPlans.length}`
    },
    { id: 'exercises', label: 'Exercise Library', icon: BookOpen },
    { id: 'nutrition', label: 'Indian Nutrition', icon: UtensilsCrossed },
    { id: 'taekwondo', label: 'Taekwondo', icon: Shield },
    { id: 'progress', label: 'Progress & Recovery', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col md:w-16 lg:w-64 bg-brand-surface border-r border-brand-border p-2.5 lg:p-4 h-[calc(100vh-65px)] sticky top-[65px] justify-between transition-all duration-300 flex-shrink-0">
      <div className="space-y-1.5">
        <div className="hidden lg:block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                const mainEl = document.querySelector('main');
                if (mainEl) mainEl.scrollTop = 0;
              }}
              title={item.label}
              className={`w-full flex items-center justify-center lg:justify-between p-3 lg:px-3.5 lg:py-3 rounded-xl text-sm font-semibold transition group cursor-pointer relative ${
                isActive
                  ? 'bg-brand-yellow text-slate-950 font-bold shadow-md shadow-brand-yellow/15'
                  : 'text-slate-400 hover:text-white hover:bg-brand-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 transition ${isActive ? 'text-slate-950' : 'group-hover:text-brand-yellow'}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`hidden lg:inline text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-slate-950 text-brand-yellow'
                      : 'bg-brand-card text-brand-yellow border border-brand-yellow/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Indicator Dot for Mobile/Tablet collapsed view */}
              {isActive && (
                <div className="lg:hidden absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-yellow rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="hidden lg:block p-3.5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Award className="w-4 h-4 text-brand-yellow" />
          <span>FitTrack PRO</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Tri-Discipline: Calisthenics, Taekwondo, and Indian Nutrition Management.
        </p>
      </div>
    </aside>
  );
};
