import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { DashboardView } from './components/dashboard/DashboardView';
import { TrainingPlanner } from './components/training/TrainingPlanner';
import { LiveWorkoutModal } from './components/training/LiveWorkoutModal';
import { ExerciseLibrary } from './components/exercises/ExerciseLibrary';
import { NutritionTracker } from './components/nutrition/NutritionTracker';
import { TaekwondoTracker } from './components/taekwondo/TaekwondoTracker';
import { ProgressAnalytics } from './components/progress/ProgressAnalytics';
import { SettingsView } from './components/settings/SettingsView';
import { AuthPage } from './components/auth/AuthPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    isAuthenticated,
    activeWorkoutSession,
    cancelActiveWorkout,
    showOnboarding,
    setShowOnboarding,
    toastMessage
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [cookieKey, setCookieKey] = useState(0);

  const mainRef = useRef<HTMLElement>(null);
  const authMainRef = useRef<HTMLElement>(null);

  // Scroll to absolute top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    if (authMainRef.current) {
      authMainRef.current.scrollTop = 0;
    }
  }, [currentView]);

  const handleOpenCookiePreferences = () => {
    localStorage.removeItem('fittrack_cookie_consent_v1');
    setCookieKey(prev => prev + 1);
  };

  // If user is not authenticated or explicitly on the auth view, render the focused AuthPage with Footer
  if (!isAuthenticated || currentView === 'auth') {
    return (
      <div className="min-h-screen bg-[#0c0f14] text-slate-100 flex flex-col font-sans selection:bg-[#e2f163] selection:text-black">
        <Navbar onOpenAuth={() => setShowAuthModal(true)} />
        <main ref={authMainRef} className="flex-1 p-3 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <AuthPage onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)} />
        </main>

        <Footer
          onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
          onOpenCookiePreferences={handleOpenCookiePreferences}
        />

        <CookieConsentBanner
          key={cookieKey}
          onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
        />

        <PWAInstallBanner />

        <PrivacyPolicyModal
          isOpen={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
        />

        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-3.5 rounded-2xl bg-brand-surface border border-brand-yellow/40 text-slate-100 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-slideUp">
            <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f14] text-slate-100 flex flex-col font-sans selection:bg-[#e2f163] selection:text-black">
      {/* Top Navbar */}
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* View Switcher Main Content Area */}
        <main ref={mainRef} className="flex-1 p-3 sm:p-5 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8 flex flex-col justify-between">
          <div>
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'training' && <TrainingPlanner />}
            {currentView === 'exercises' && <ExerciseLibrary />}
            {currentView === 'nutrition' && <NutritionTracker />}
            {currentView === 'taekwondo' && <TaekwondoTracker />}
            {currentView === 'progress' && <ProgressAnalytics />}
            {currentView === 'settings' && <SettingsView />}
          </div>

          <Footer
            onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
            onOpenCookiePreferences={handleOpenCookiePreferences}
          />
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
        onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        key={cookieKey}
        onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
      />

      {/* PWA App Install Banner */}
      <PWAInstallBanner />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
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

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
