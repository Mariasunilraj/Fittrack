import React from 'react';
import { LayoutDashboard, Dumbbell, BookOpen, UtensilsCrossed, TrendingUp, Settings } from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const items: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'training', label: 'Workout', icon: Dumbbell },
    { id: 'exercises', label: 'Library', icon: BookOpen },
    { id: 'nutrition', label: 'Diet', icon: UtensilsCrossed },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: AppView) => {
    // Subtle haptic vibration on mobile
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
    setCurrentView(id);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-surface/98 backdrop-blur-xl border-t border-brand-border px-1 py-1 flex items-center justify-around shadow-2xl safe-area-bottom select-none h-14"
    >
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[46px] px-1 py-0.5 rounded-xl transition-all cursor-pointer active:scale-90 active:opacity-80 touch-manipulation ${
              isActive
                ? 'text-[#ccff00] font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-0.5 rounded-lg transition-transform ${isActive ? 'bg-[#ccff00]/15 scale-105' : ''}`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
