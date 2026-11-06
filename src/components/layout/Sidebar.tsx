import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Shield,
  TrendingUp,
  Sparkles,
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
    { id: 'ai-coach', label: 'AI Assistant', icon: Sparkles, badge: 'Gemini' },
    { id: 'settings', label: 'Settings & Cloud', icon: Settings }
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
              onClick={() => setCurrentView(item.id)}
              title={item.label}
              className={`w-full flex items-center justify-center lg:justify-between p-3 lg:px-3.5 lg:py-3 rounded-xl text-sm font-semibold transition group cursor-pointer relative ${
                isActive
                  ? 'bg-brand-yellow text-slate-950 font-bold shadow-md shadow-brand-yellow/15'
                  : 'text-slate-400 hover:text-white hover:bg-brand-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition ${
                    isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-brand-yellow'
                  }`}
                />
                <span className="hidden lg:inline">{item.label}</span>
              </div>
              {item.badge && (
                <>
                  {/* Laptop Badge Pill */}
                  <span
                    className={`hidden lg:inline text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-900 text-brand-yellow'
                        : 'bg-brand-dark/80 text-slate-400 border border-brand-border'
                    }`}
                  >
                    {item.badge}
                  </span>
                  {/* Tablet Indicator Dot */}
                  <span className="lg:hidden absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-yellow" />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Safety & Medical Context Footer Banner (Shown on Laptop) */}
      <div className="hidden lg:block p-3.5 rounded-2xl bg-brand-card/60 border border-brand-border text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-brand-yellow font-bold text-[11px]">
          <Shield className="w-3.5 h-3.5" />
          <span>Safety Standard</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          FitTrack is non-prescriptive. Discontinue immediately if dizzy or sharp joint pain occurs.
        </p>
      </div>
    </aside>
  );
};
