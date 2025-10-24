import { create } from 'zustand';
import type { AuthState } from '../types';
import { authService } from '../services/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: !!authService.getCurrentUser(),

  login: async (email: string, password: string) => {
    const user = authService.login(email, password);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
