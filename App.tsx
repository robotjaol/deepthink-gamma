

import React, { useContext, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';
import NotificationContainer from './components/ui/NotificationContainer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load page components for code splitting
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardLayout = React.lazy(() => import('./components/layout/DashboardLayout'));
const ProtectedRoute = React.lazy(() => import('./components/layout/ProtectedRoute'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const UserSettingsPage = React.lazy(() => import('./pages/dashboard/UserSettingsPage'));
const ScenarioPage = React.lazy(() => import('./pages/dashboard/ScenarioPage'));
const ScenarioSessionPage = React.lazy(() => import('./pages/dashboard/ScenarioSessionPage'));
const LeaderboardPage = React.lazy(() => import('./pages/dashboard/LeaderboardPage'));
const HistoryPage = React.lazy(() => import('./pages/dashboard/HistoryPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const UserProfilePage = React.lazy(() => import('./pages/dashboard/UserProfilePage'));
const NotesPage = React.lazy(() => import('./pages/dashboard/NotesPage'));
const SubscribePage = React.lazy(() => import('./pages/SubscribePage'));
const SubscriptionSuccessPage = React.lazy(() => import('./pages/SubscriptionSuccessPage'));
const BadgesPage = React.lazy(() => import('./pages/dashboard/BadgesPage'));
const DevelopmentPage = React.lazy(() => import('./pages/dashboard/DevelopmentPage'));
const MasteryPage = React.lazy(() => import('./pages/dashboard/MasteryPage'));
const ChallengePage = React.lazy(() => import('./pages/dashboard/ChallengePage'));

const FullPageLoader: React.FC = () => (
    <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner />
    </div>
);

const App: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text min-h-screen font-sans transition-colors duration-300">
      <NotificationContainer />
      <HashRouter>
        <Suspense fallback={<FullPageLoader />}>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/subscribe/:planName" element={<SubscribePage />} />
            <Route path="/subscribe/success" element={<SubscriptionSuccessPage />} />
            <Route 
                path="/dashboard" 
                element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<DashboardPage />} />
                <Route path="settings" element={<UserSettingsPage />} />
                <Route path="scenario" element={<ScenarioPage />} />
                <Route path="scenario/:id" element={<ScenarioSessionPage />} />
                <Route path="challenges" element={<ChallengePage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="profile/:userId" element={<UserProfilePage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="badges" element={<BadgesPage />} />
                <Route path="development" element={<DevelopmentPage />} />
                <Route path="mastery" element={<MasteryPage />} />
            </Route>
            </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
};

export default App;