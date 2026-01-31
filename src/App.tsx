import { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import OnboardingPage from '@/pages/OnboardingPage';
import SettingsPage from '@/pages/SettingsPage';
import LandingPage from '@/pages/LandingPage';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useProjectStore } from '@/stores/useProjectStore';
import Toaster from '@/components/ui/Toaster';

import ProjectsPage from '@/pages/ProjectsPage';
import WorkspacePage from '@/pages/WorkspacePage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if not completed (and allow for optional chaining in case user struct is partial)
  if (!user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function OnboardingRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If already onboarded, go to dashboard
  if (user?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Clean up legacy mock projects (IDs: 1, 2, 3, 4)
  const { projects, deleteProject } = useProjectStore();
  useEffect(() => {
    const mockIds = ['1', '2', '3', '4'];
    projects.forEach(p => {
      if (mockIds.includes(p.id)) {
        deleteProject(p.id);
      }
    });
  }, [projects, deleteProject]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <OnboardingPage />
            </OnboardingRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/workspace/:projectId"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
