import { create } from 'zustand';
import type { AuthState } from '../types';
import { backendAPI } from '../services/backend';
import { logger } from '../utils/logger';

const getStoredUser = () => {
  const token = localStorage.getItem('will_token');
  const user = localStorage.getItem('will_user');
  return token && user ? JSON.parse(user) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),

  login: async (email: string, password: string) => {
    try {
      const user = await backendAPI.login(email, password);
      localStorage.setItem('will_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      logger.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    backendAPI.logout();
    localStorage.removeItem('will_user');
    set({ user: null, isAuthenticated: false });
  },
}));
