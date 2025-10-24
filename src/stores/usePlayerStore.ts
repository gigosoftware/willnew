import { create } from 'zustand';
import type { PlayerState } from '../types';
import { useAuthStore } from './useAuthStore';

const getStorageKey = () => {
  const user = useAuthStore.getState().user;
  return `player_config_${user?.id || 'default'}`;
};

const loadConfig = () => {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : { 
    interval: 30, 
    showStreamTitles: true, 
    showMosaicInfo: true, 
    autoFullscreen: true 
  };
};

const saveConfig = (config: { interval: number; showStreamTitles: boolean; showMosaicInfo: boolean; autoFullscreen: boolean }) => {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(config));
};

const initialConfig = loadConfig();

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: true,
  currentIndex: 0,
  interval: initialConfig.interval,
  showStreamTitles: initialConfig.showStreamTitles,
  showMosaicInfo: initialConfig.showMosaicInfo,
  autoFullscreen: initialConfig.autoFullscreen,

  setPlaying: (playing: boolean) => set({ isPlaying: playing }),

  nextMosaic: () => {
    const { currentIndex } = get();
    set({ currentIndex: currentIndex + 1 });
  },

  prevMosaic: () => {
    const { currentIndex } = get();
    set({ currentIndex: Math.max(0, currentIndex - 1) });
  },

  setInterval: (interval: number) => {
    set({ interval });
    const state = get();
    saveConfig({ 
      interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen 
    });
  },

  setShowStreamTitles: (show: boolean) => {
    set({ showStreamTitles: show });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: show, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen 
    });
  },

  setShowMosaicInfo: (show: boolean) => {
    set({ showMosaicInfo: show });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: show, 
      autoFullscreen: state.autoFullscreen 
    });
  },

  setAutoFullscreen: (auto: boolean) => {
    set({ autoFullscreen: auto });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: auto 
    });
  },
}));
