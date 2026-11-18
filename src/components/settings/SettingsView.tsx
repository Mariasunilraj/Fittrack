import React from 'react';
import {
  User,
  Download,
  Trash2,
  LogOut,
  Target,
  Award,
  Dumbbell,
  Heart,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storage';
import { Footer } from '../layout/Footer';

interface SettingsViewProps {
  onOpenPrivacyPolicy?: () => void;
  onOpenCookiePreferences?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenPrivacyPolicy = () => {},
  onOpenCookiePreferences = () => {}
}) => {
  const { profile, setShowOnboarding, showToast, logoutUser } = useApp();

  const handleExportData = () => {
    const dataStr = storageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitTrack_Export_${profile.displayName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full fitness records and profile exported as JSON!');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset your local FitTrack training records? This action cannot be undone.')) {
      storageService.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-nav-safe animate-fadeIn max-w-4xl mx-auto">
      {/* Settings Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
            Account & Security Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Manage your athlete profile, training disciplines, nutrition goals, and data portability.
        </p>
      </div>

      {/* 1. Athlete Profile Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-yellow to-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-brand-yellow/20">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">{profile.displayName}</h2>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                  {profile.experienceLevel} Tier
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {profile.email} • Age Band: {profile.ageBand} • {profile.foodPreference}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOnboarding(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-xs font-bold text-slate-200 transition cursor-pointer self-start sm:self-auto"
          >
            Edit Athlete Profile
          </button>
        </div>

        {/* Core Measurements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-brand-dark/70 border border-brand-border">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Scale className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Current Weight</span>
            </div>
            <div className="text-white font-bold text-base mt-1">{profile.currentWeightKg} kg</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Target: {profile.targetWeightKg} kg</div>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-dark/70 border border-brand-border">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Height</span>
            </div>
            <div className="text-white font-bold text-base mt-1">{profile.heightCm} cm</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              BMI: {(profile.currentWeightKg / ((profile.heightCm / 100) * (profile.heightCm / 100))).toFixed(1)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-dark/70 border border-brand-border">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span>Dietary Palette</span>
            </div>
            <div className="text-white font-bold text-base mt-1 capitalize">{profile.region}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 capitalize">{profile.foodPreference}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-dark/70 border border-brand-border">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Disciplines</span>
            </div>
            <div className="text-brand-yellow font-bold text-xs mt-1 truncate">
              {profile.preferredDisciplines.join(', ')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{profile.trainingAccess} access</div>
          </div>
        </div>
      </div>

      {/* 2. Primary Goals & Equipment */}
      <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-yellow" />
          <h2 className="text-base font-bold text-white">Fitness Goals & Equipment</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Primary Goals */}
          <div className="p-4 rounded-xl bg-brand-dark/60 border border-brand-border/80 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
              Active Goals
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.primaryGoals && profile.primaryGoals.length > 0 ? (
                profile.primaryGoals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-semibold"
                  >
                    {goal}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">General Fitness & Strength</span>
              )}
            </div>
          </div>

          {/* Equipment Access */}
          <div className="p-4 rounded-xl bg-brand-dark/60 border border-brand-border/80 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
              Equipment On Hand
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.equipment && profile.equipment.length > 0 ? (
                profile.equipment.map((eq, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-brand-card border border-brand-border text-slate-300 text-xs font-medium"
                  >
                    {eq}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Bodyweight Only</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Account Controls & Data Portability */}
      <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4 shadow-lg">
        <div>
          <h2 className="text-base font-bold text-white">Data Portability & Account Controls</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            You own your fitness logs. Export your complete activity dataset anytime or manage your account session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-brand-yellow" />
            <span>Export All Records (JSON)</span>
          </button>

          <button
            onClick={() => {
              logoutUser();
            }}
            className="py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-hover border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-amber-400" />
            <span>Sign Out / Switch Account</span>
          </button>

          <button
            onClick={handleResetData}
            className="py-2.5 px-4 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition cursor-pointer sm:ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Local Records</span>
          </button>
        </div>
      </div>

      {/* 4. FitTrack Legal & Trust Footer (Shown strictly on Settings view) */}
      <div className="pt-2">
        <Footer
          onOpenPrivacyPolicy={onOpenPrivacyPolicy}
          onOpenCookiePreferences={onOpenCookiePreferences}
        />
      </div>
    </div>
  );
};
