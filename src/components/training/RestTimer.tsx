import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Volume2 } from 'lucide-react';

interface RestTimerProps {
  initialSeconds: number;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ initialSeconds, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Play soft web audio beep when rest ends
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // audio context fallback
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPct = ((initialSeconds - secondsLeft) / initialSeconds) * 100;

  return (
    <div className="fixed bottom-24 sm:bottom-20 right-3 sm:right-6 z-50 p-4 rounded-2xl bg-brand-surface border border-brand-border shadow-2xl w-72 text-slate-100 animate-slideUp safe-area-bottom">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-yellow tracking-wider">
          <Timer className="w-4 h-4" />
          <span>Rest Interval</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center my-3">
        <div className={`text-4xl font-black font-mono tracking-tight ${secondsLeft === 0 ? 'text-emerald-400 animate-bounce' : 'text-white'}`}>
          {secondsLeft === 0 ? 'Ready!' : formatTime(secondsLeft)}
        </div>
        <div className="w-full bg-brand-dark rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${secondsLeft === 0 ? 'bg-emerald-400' : 'bg-brand-yellow'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-brand-border/60">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="py-1.5 px-3 rounded-lg bg-brand-card hover:bg-brand-hover text-xs font-semibold flex items-center gap-1.5 text-slate-200 transition"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Resume'}</span>
        </button>
        <button
          onClick={() => {
            setSecondsLeft(initialSeconds);
            setIsRunning(true);
          }}
          className="py-1.5 px-3 rounded-lg bg-brand-card hover:bg-brand-hover text-xs font-semibold flex items-center gap-1.5 text-slate-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
        <button
          onClick={() => setSecondsLeft(prev => prev + 30)}
          className="py-1.5 px-2.5 rounded-lg bg-brand-card hover:bg-brand-hover text-xs font-semibold text-brand-yellow transition"
        >
          +30s
        </button>
      </div>
    </div>
  );
};
