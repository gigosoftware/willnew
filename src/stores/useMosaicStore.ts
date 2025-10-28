import { create } from 'zustand';
import type { MosaicState } from '../types';
import { api } from '../services/api';
import { backendAPI } from '../services/backend';

export const useMosaicStore = create<MosaicState>((set, get) => ({
  mosaics: [],
  selectedMosaics: [],
  isLoading: false,
  error: null,

  fetchMosaics: async () => {
    if (get().mosaics.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const mosaics = await api.getMosaics();
      set({ mosaics, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadSelectedMosaics: async () => {
    try {
      const config = await backendAPI.getConfig();
      const savedIds = config.selectedMosaics || [];
      const { mosaics } = get();
      const validIds = savedIds.filter((id: number) => mosaics.some(m => m.id === id));
      set({ selectedMosaics: validIds });
    } catch (error) {
      console.error('Load selected mosaics error:', error);
    }
  },

  toggleMosaic: (id: number) => {
    const { selectedMosaics } = get();
    const newSelection = selectedMosaics.includes(id)
      ? selectedMosaics.filter(m => m !== id)
      : [...selectedMosaics, id];
    set({ selectedMosaics: newSelection });
    backendAPI.saveSelectedMosaics(newSelection).catch(console.error);
  },

  clearSelection: () => {
    set({ selectedMosaics: [] });
    backendAPI.saveSelectedMosaics([]).catch(console.error);
  },
}));
