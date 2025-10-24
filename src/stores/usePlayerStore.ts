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
    autoFullscreen: true,
    smartInterval: false
  };
};

const saveConfig = (config: { interval: number; showStreamTitles: boolean; showMosaicInfo: boolean; autoFullscreen: boolean; smartInterval: boolean }) => {
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
  smartInterval: initialConfig.smartInterval ?? false,

  loadUserConfig: () => {
    const config = loadConfig();
    set({
      interval: config.interval,
      showStreamTitles: config.showStreamTitles,
      showMosaicInfo: config.showMosaicInfo,
      autoFullscreen: config.autoFullscreen,
      smartInterval: config.smartInterval ?? false,
    });
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

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
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval
    });
  },

  setSmartInterval: (smart: boolean) => {
    set({ smartInterval: smart });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: smart
    });
  },

  setShowStreamTitles: (show: boolean) => {
    set({ showStreamTitles: show });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: show, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval
    });
  },

  setShowMosaicInfo: (show: boolean) => {
    set({ showMosaicInfo: show });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: show, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval
    });
  },

  setAutoFullscreen: (auto: boolean) => {
    set({ autoFullscreen: auto });
    const state = get();
    saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: auto,
      smartInterval: state.smartInterval
    });
  },
}));
