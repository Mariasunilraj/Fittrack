import React from 'react';
import { LayoutDashboard, Dumbbell, BookOpen, UtensilsCrossed, TrendingUp, Sparkles } from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const items: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'training', label: 'Workout', icon: Dumbbell },
    { id: 'exercises', label: 'Library', icon: BookOpen },
    { id: 'nutrition', label: 'Diet', icon: UtensilsCrossed },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-surface/95 backdrop-blur-md border-t border-brand-border px-1.5 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer min-w-[50px] ${
              isActive ? 'text-brand-yellow font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 transition ${isActive ? 'text-brand-yellow scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
