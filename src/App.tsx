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
import { Toaster } from 'react-hot-toast';
import { VoiceControl } from './components/VoiceControl';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const App = () => {
  const theme = useThemeStore((s) => s.theme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <VoiceControl />
                <Lounge />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vision"
          element={
            <ProtectedRoute>
              <>
                <VoiceControl />
                <Vision />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <>
                <VoiceControl />
                <Users />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <>
                <VoiceControl />
                <Settings />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
      </BrowserRouter>
    </div>
  );
};
