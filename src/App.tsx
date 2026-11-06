import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { TrainingPlanner } from './components/training/TrainingPlanner';
import { LiveWorkoutModal } from './components/training/LiveWorkoutModal';
import { ExerciseLibrary } from './components/exercises/ExerciseLibrary';
import { NutritionTracker } from './components/nutrition/NutritionTracker';
import { TaekwondoTracker } from './components/taekwondo/TaekwondoTracker';
import { ProgressAnalytics } from './components/progress/ProgressAnalytics';
import { AICoachChat } from './components/ai/AICoachChat';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    activeWorkoutSession,
    cancelActiveWorkout,
    showOnboarding,
    setShowOnboarding,
    toastMessage
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0f14] text-slate-100 flex flex-col font-sans selection:bg-[#e2f163] selection:text-black">
      {/* Top Navbar */}
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* View Switcher Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'training' && <TrainingPlanner />}
          {currentView === 'exercises' && <ExerciseLibrary />}
          {currentView === 'nutrition' && <NutritionTracker />}
          {currentView === 'taekwondo' && <TaekwondoTracker />}
          {currentView === 'progress' && <ProgressAnalytics />}
          {currentView === 'ai-coach' && <AICoachChat />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Bottom Mobile Navigation */}
      <MobileNav />

      {/* Active Live Workout Tracker Modal */}
      {activeWorkoutSession && (
        <LiveWorkoutModal
          session={activeWorkoutSession}
          onClose={cancelActiveWorkout}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-2xl bg-brand-surface border border-brand-yellow/40 text-slate-100 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
