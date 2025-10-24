import { create } from 'zustand';
import type { ThemeState } from '../types';

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('will_theme') as ThemeState['theme']) || 'dark',

  setTheme: (theme) => {
    localStorage.setItem('will_theme', theme);
    set({ theme });
  },
}));
