import React from 'react';
import { Shield, Award, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TaekwondoWidget: React.FC = () => {
  const { taekwondoSessions, setCurrentView } = useApp();
  const latestSession = taekwondoSessions[0];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Martial Arts Track</span>
              <h3 className="text-base font-bold text-white">Taekwondo Conditioning</h3>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {latestSession ? latestSession.beltRank : 'Green Belt'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2 mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Upcoming Focus:</span>
            <span className="font-bold text-white">Taegeuk 3 (Sam Jang) & Turning Kicks</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Safety Gear Checklist:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified (Headgear & Shinguards)
            </span>
          </div>
          {latestSession?.instructorNotes && (
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-brand-border/60">
              "{latestSession.instructorNotes}"
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">Supervised sparring required</span>
        <button
          onClick={() => setCurrentView('taekwondo')}
          className="text-brand-yellow font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Poomsae & Sparring Log</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
