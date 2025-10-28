import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import { Login } from './pages/Login';
import { Lounge } from './pages/Lounge';
import { Vision } from './pages/Vision';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { useEffect } from 'react';
import { authService } from './services/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const App = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    authService.initialize();
  }, []);

  const themeClasses: Record<string, string> = {
    dark: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    neon: 'bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900',
    corporate: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900',
  };

  return (
    <div className={themeClasses[theme]}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Lounge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vision"
          element={
            <ProtectedRoute>
              <Vision />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      </BrowserRouter>
    </div>
  );
};
