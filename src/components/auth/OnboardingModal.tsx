import React, { useState } from 'react';
import { Check, ShieldAlert, ChevronRight, ChevronLeft, HeartPulse, Activity, Utensils, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgeBand, ExperienceLevel, FoodPreference, IndianRegion, TrainingDiscipline } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onOpenPrivacyPolicy }) => {
  const { profile, updateProfile, showToast } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [ageBand, setAgeBand] = useState<AgeBand>(profile.ageBand || '30-39');
  const [heightCm, setHeightCm] = useState(profile.heightCm || 175);
  const [currentWeightKg, setCurrentWeightKg] = useState(profile.currentWeightKg || 72);
  const [targetWeightKg, setTargetWeightKg] = useState(profile.targetWeightKg || 70);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile.experienceLevel || 'beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile.primaryGoals || ['General Fitness']);
  const [selectedDisciplines, setSelectedDisciplines] = useState<TrainingDiscipline[]>(profile.preferredDisciplines || ['calisthenics', 'gym']);
  const [region, setRegion] = useState<IndianRegion>(profile.region || 'south-indian');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(profile.foodPreference || 'vegetarian');
  const [medicalNotes, setMedicalNotes] = useState(profile.medicalNotes || '');
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(profile.hasAcceptedDisclaimer || false);

  if (!isOpen) return null;

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => (prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]));
  };

  const toggleDiscipline = (disc: TrainingDiscipline) => {
    setSelectedDisciplines(prev => (prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]));
  };

  const handleFinish = () => {
    if (!acceptedDisclaimer) {
      showToast('Please review and accept the safety disclaimer to proceed.');
      return;
    }

    updateProfile({
      ...profile,
      displayName: displayName || 'FitTrack Athlete',
      ageBand,
      heightCm,
      startingWeightKg: profile.startingWeightKg || currentWeightKg,
      currentWeightKg,
      targetWeightKg,
      experienceLevel,
      primaryGoals: selectedGoals.length ? selectedGoals : ['General Fitness'],
      preferredDisciplines: selectedDisciplines.length ? selectedDisciplines : ['calisthenics'],
      region,
      foodPreference,
      medicalNotes,
      hasAcceptedDisclaimer: true,
      createdAt: profile.createdAt || '2026-11-01'
    });

    onClose();
    showToast('Your personalized FitTrack plan has been configured!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-brand-border bg-brand-card/50 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-brand-yellow tracking-widest">
              FitTrack Onboarding • Step {step} of 4
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {step === 1 && 'Personal Profile & Age Group'}
              {step === 2 && 'Training Goals & Experience'}
              {step === 3 && 'Indian Nutrition & Preferences'}
              {step === 4 && 'Health Safety & Clinical Disclaimer'}
            </h2>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-7 bg-brand-yellow' : s < step ? 'w-3 bg-brand-yellow/60' : 'w-3 bg-brand-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-200">
          {/* STEP 1: Basic Bio & Age Band */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Sunil Raj"
                  className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Age Band (Targeted from 18 to 60+)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['18-29', '30-39', '40-49', '50-59', '60+'] as AgeBand[]).map(band => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setAgeBand(band)}
                      className={`py-3 px-2 rounded-xl text-center font-bold text-sm border transition cursor-pointer ${
                        ageBand === band
                          ? 'bg-brand-yellow text-slate-950 border-brand-yellow shadow-md shadow-brand-yellow/20'
                          : 'bg-brand-card text-slate-300 border-brand-border hover:border-slate-600'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Age is one factor used to calibrate recovery and joint volume defaults, never to arbitrarily limit what you can train.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={currentWeightKg}
                    onChange={e => setCurrentWeightKg(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={targetWeightKg}
                    onChange={e => setTargetWeightKg(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Experience */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Training Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'beginner', label: 'Beginner', desc: '< 1 yr regular training' },
                    { key: 'intermediate', label: 'Intermediate', desc: '1–3 yrs consistent lifts/skills' },
                    { key: 'advanced', label: 'Advanced', desc: '3+ yrs structured progression' }
                  ].map(lvl => (
                    <button
                      key={lvl.key}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.key as ExperienceLevel)}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        experienceLevel === lvl.key
                          ? 'bg-brand-yellow/15 border-brand-yellow text-white'
                          : 'bg-brand-card border-brand-border text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-sm text-white flex items-center justify-between">
                        {lvl.label}
                        {experienceLevel === lvl.key && <Check className="w-4 h-4 text-brand-yellow" />}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select Training Disciplines
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'calisthenics', label: 'Calisthenics & Bodyweight' },
                    { id: 'gym', label: 'Gym Resistance Training' },
                    { id: 'weightlifting', label: 'Heavy Barbell Strength' },
                    { id: 'taekwondo', label: 'Taekwondo Martial Arts' },
                    { id: 'mobility', label: 'Mobility & Flexibility' },
                    { id: 'cardio', label: 'Cardio & Conditioning' }
                  ].map(disc => {
                    const active = selectedDisciplines.includes(disc.id as TrainingDiscipline);
                    return (
                      <button
                        key={disc.id}
                        type="button"
                        onClick={() => toggleDiscipline(disc.id as TrainingDiscipline)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          active
                            ? 'bg-brand-yellow text-slate-950 border-brand-yellow font-bold'
                            : 'bg-brand-card border-brand-border text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span>{disc.label}</span>
                        {active && <Check className="w-4 h-4 text-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Primary Fitness Goals
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Build Functional Strength',
                    'Muscle Hypertrophy',
                    'Calisthenics Skills',
                    'Taekwondo Sparring & Poomsae',
                    'Fat Loss & Body Recomp',
                    'Joint Health & Mobility'
                  ].map(g => {
                    const active = selectedGoals.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGoal(g)}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-left transition cursor-pointer ${
                          active
                            ? 'border-brand-yellow/80 bg-brand-yellow/10 text-brand-yellow'
                            : 'border-brand-border bg-brand-dark/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Indian Nutrition & Dietary Preference */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Food Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'eggetarian', label: 'Eggetarian' },
                    { id: 'non-vegetarian', label: 'Non-Vegetarian' },
                    { id: 'vegan', label: 'Vegan' }
                  ].map(fp => (
                    <button
                      key={fp.id}
                      type="button"
                      onClick={() => setFoodPreference(fp.id as FoodPreference)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        foodPreference === fp.id
                          ? 'bg-brand-yellow text-slate-950 border-brand-yellow'
                          : 'bg-brand-card border-brand-border text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {fp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Regional Food Palette Focus
                </label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value as IndianRegion)}
                  className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-yellow text-sm"
                >
                  <option value="south-indian">South Indian (Idli, Dosa, Sambar, Upma, Pongal, Millets)</option>
                  <option value="north-indian">North Indian (Roti, Dal Tadka, Paneer, Rajma, Chole)</option>
                  <option value="west-indian">West Indian (Poha, Thepla, Dal Dhokli, Bhakri)</option>
                  <option value="east-indian">East Indian (Rice, Fish Curry, Dalma, Chorchori)</option>
                  <option value="all">Pan-Indian Balanced Database</option>
                </select>
                <p className="text-xs text-slate-500 mt-1.5">
                  Curates your quick-add food suggestions with authentic household portions (katori, idli, roti).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Known Injuries / Physical Limitations (Optional)
                </label>
                <textarea
                  rows={3}
                  value={medicalNotes}
                  onChange={e => setMedicalNotes(e.target.value)}
                  placeholder="e.g. Mild lower back sensitivity when cold; shoulder impingement history on overhead press."
                  className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Safety & Disclaimer */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <span>Important Health, Exercise & Medical Disclaimer</span>
                </div>
                <div className="text-xs space-y-2 text-slate-300 leading-relaxed mt-2">
                  <p>
                    <strong>1. FitTrack is not a medical provider.</strong> Workout templates, exercise cues, and nutrition calculations are provided for general educational and self-tracking purposes only.
                  </p>
                  <p>
                    <strong>2. Stop Training Warnings:</strong> If at any point you experience acute chest pain, dizziness, severe breathlessness, nausea, or sharp sudden joint pain, discontinue exercise immediately and seek emergency medical attention.
                  </p>
                  <p>
                    <strong>3. Martial Arts & Heavy Lifts:</strong> Complex Olympic/power lifts and Taekwondo sparring require qualified in-person coaching supervision and safety gear (guards/mats).
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 p-3.5 bg-brand-card/80 border border-brand-border rounded-xl cursor-pointer hover:border-slate-500 transition">
                <input
                  type="checkbox"
                  checked={acceptedDisclaimer}
                  onChange={e => setAcceptedDisclaimer(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-brand-yellow accent-[#e2f163] cursor-pointer"
                />
                <span className="text-xs text-slate-200 leading-snug">
                  I confirm I am an adult (18+), have read and agree to the health & safety terms, and understand that I should consult a doctor before starting any rigorous physical regimen.
                </span>
              </label>

              {/* Privacy Policy & Consent Notice */}
              <div className="p-3 bg-brand-dark/70 border border-brand-border rounded-xl text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Personal metrics are processed under zero-ad data minimization.</span>
                {onOpenPrivacyPolicy && (
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="text-brand-yellow hover:underline font-bold text-left sm:text-right cursor-pointer"
                  >
                    Read Privacy Policy →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-brand-border bg-brand-card/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2.5 px-4 bg-brand-hover text-slate-300 hover:text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="py-2.5 px-6 bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-bold rounded-xl text-sm flex items-center gap-1.5 transition shadow-md shadow-brand-yellow/10 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!acceptedDisclaimer}
              onClick={handleFinish}
              className="py-2.5 px-6 bg-brand-yellow hover:bg-brand-yellowDark disabled:opacity-40 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition shadow-lg shadow-brand-yellow/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Complete Setup & Launch Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
