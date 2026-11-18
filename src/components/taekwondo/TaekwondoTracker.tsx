import React, { useState } from 'react';
import {
  Shield,
  Award,
  BookOpen,
  CheckCircle,
  Plus,
  Flame,
  AlertTriangle,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POOMSAE_DATABASE, TAEKWONDO_BELT_RANKS } from '../../data/taekwondoDatabase';

export const TaekwondoTracker: React.FC = () => {
  const { taekwondoSessions, addTaekwondoSession, setCurrentView, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'poomsae' | 'log' | 'gear'>('poomsae');
  const [showLogModal, setShowLogModal] = useState(false);

  // New session state
  const [focusArea, setFocusArea] = useState<any>('poomsae');
  const [duration, setDuration] = useState(60);
  const [beltRank, setBeltRank] = useState('Green Belt (6th Gup)');
  const [rpe, setRpe] = useState(8);
  const [notes, setNotes] = useState('');
  const [gearChecked, setGearChecked] = useState(true);

  // Safety checklist states
  const [gearChecklist, setGearChecklist] = useState({
    dobok: true,
    mouthguard: true,
    shinguards: true,
    forearmguards: true,
    headgear: false,
    hogu: false
  });

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    addTaekwondoSession({
      date: new Date().toISOString().split('T')[0],
      durationMinutes: duration,
      focusArea,
      beltRank,
      instructorNotes: notes || 'Worked on poomsae timing and crisp snap on roundhouse chambers.',
      rpe,
      gearChecklistCompleted: gearChecked
    });
    setShowLogModal(false);
    showToast('🥋 Taekwondo practice session recorded!');
  };

  return (
    <div className="space-y-6 pb-nav-safe animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              World Taekwondo (WT) Curriculum
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Poomsae & Sparring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <Shield className="w-7 h-7 text-rose-400" />
            <span>Taekwondo Martial Arts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Fundamentals, Taegeuk Poomsae forms, kicking mechanics, safety checklist, and dojang session log.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-500/20 transition cursor-pointer self-start sm:self-auto active:scale-95 touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          <span>Log TKD Practice</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2">
        <button
          onClick={() => setActiveTab('poomsae')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'poomsae'
              ? 'bg-brand-yellow text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-brand-hover'
          }`}
        >
          Taegeuk Poomsae Forms
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'log'
              ? 'bg-brand-yellow text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-brand-hover'
          }`}
        >
          Dojang Practice Log
        </button>
        <button
          onClick={() => setActiveTab('gear')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'gear'
              ? 'bg-brand-yellow text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-brand-hover'
          }`}
        >
          Safety & Protective Gear
        </button>
      </div>

      {/* TAB 1: Poomsae Guide */}
      {activeTab === 'poomsae' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold">
                🥋
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Official Kukkiwon Poomsae Curriculum</h3>
                <p className="text-xs text-slate-400">Master each form with breath control, snapshot finish, and accurate stances.</p>
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-brand-yellow px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30">
              WT Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POOMSAE_DATABASE.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-yellow">{p.belt}</span>
                    <span className="text-xs text-slate-500 font-mono">{p.movementsCount} movements</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {p.name} <span className="text-xs text-slate-400 font-normal font-sans">({p.koreanName})</span>
                  </h3>
                  <p className="text-xs text-slate-300 italic mt-1">{p.meaning}</p>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Key Techniques:
                    </span>
                    {p.keyTechniques.map((tech, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-border/60 text-xs text-amber-300/90 leading-relaxed bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                  <strong className="text-amber-400">Biomechanics Cue: </strong>{p.safetyTips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Dojang Practice Log */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {taekwondoSessions.map(s => (
              <div key={s.id} className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-card border border-brand-border text-brand-yellow">
                      {s.focusArea}
                    </span>
                    <span className="text-xs text-slate-400">{s.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      {s.beltRank}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {s.durationMinutes}m
                    </span>
                  </div>
                </div>

                {s.instructorNotes && (
                  <p className="text-xs text-slate-300 italic p-3 rounded-xl bg-brand-card border border-brand-border">
                    "{s.instructorNotes}"
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-brand-border/60">
                  <span>Effort Rating (RPE): <strong className="text-white">{s.rpe}/10</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Protective gear verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Safety Checklist */}
      {activeTab === 'gear' && (
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-5 shadow-lg">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Sparring Safety & Coach Supervision Protocol</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Taekwondo kicks involve rapid angular velocity and force. Sparring (Gyeorugi) must ONLY occur under the direct supervision of a certified black belt instructor with proper protective gear in place.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pre-Sparring Equipment Checklist
            </h3>

            {[
              { key: 'dobok', label: 'Uniform (Dobok) & Properly Tied Belt' },
              { key: 'mouthguard', label: 'Dental Mouthguard (Required for full contact)' },
              { key: 'shinguards', label: 'Instep & Shin Guards (Tibia Protection)' },
              { key: 'forearmguards', label: 'Forearm Block Protectors' },
              { key: 'headgear', label: 'WT Approved Headgear (Helmet)' },
              { key: 'hogu', label: 'Chest Protector (Hogu) securely fastened' }
            ].map(item => {
              const checked = (gearChecklist as any)[item.key];
              return (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-brand-card border border-brand-border cursor-pointer hover:border-slate-500 transition"
                >
                  <span className="text-xs font-medium text-slate-200">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => setGearChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand-yellow accent-[#e2f163] cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h2 className="text-xl font-bold text-white">Log Taekwondo Session</h2>
            <p className="text-xs text-slate-400">Record practice duration, focus, and coaching cues.</p>

            <form onSubmit={handleCreateSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Focus Area
                </label>
                <select
                  value={focusArea}
                  onChange={e => setFocusArea(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-yellow"
                >
                  <option value="poomsae">Poomsae (Forms & Stances)</option>
                  <option value="kicking-drills">Kicking Pad Drills (Speed & Chamber)</option>
                  <option value="footwork">Fast Footwork & Sliding Evasion</option>
                  <option value="supervised-sparring">Supervised Sparring (Gyeorugi)</option>
                  <option value="conditioning">Martial Arts Conditioning</option>
                  <option value="flexibility">Hip Mobility & High Kick Stretches</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Belt Rank
                  </label>
                  <select
                    value={beltRank}
                    onChange={e => setBeltRank(e.target.value)}
                    className="w-full px-2 py-2 bg-brand-dark border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-yellow"
                  >
                    {TAEKWONDO_BELT_RANKS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Instructor / Coach Notes & Self Feedback
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Master pointed out to pivot standing foot full 180 on Dollyo Chagi."
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-card border border-brand-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={gearChecked}
                  onChange={e => setGearChecked(e.target.checked)}
                  className="w-4 h-4 accent-[#e2f163]"
                />
                <span className="text-xs text-slate-300">Wore required safety pads / supervised practice</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-yellow text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-yellow/15"
                >
                  Save Practice Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
