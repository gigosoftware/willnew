import { create } from 'zustand';
import type { MosaicState } from '../types';
import { api } from '../services/api';

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

  toggleMosaic: (id: number) => {
    const { selectedMosaics } = get();
    set({
      selectedMosaics: selectedMosaics.includes(id)
        ? selectedMosaics.filter(m => m !== id)
        : [...selectedMosaics, id],
    });
  },

  clearSelection: () => set({ selectedMosaics: [] }),
}));
