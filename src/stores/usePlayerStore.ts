import { create } from 'zustand';
import type { PlayerState } from '../types';
import { backendAPI } from '../services/backend';

const defaultConfig = {
  interval: 30,
  showStreamTitles: true,
  showMosaicInfo: true,
  autoFullscreen: true,
  smartInterval: false
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: true,
  currentIndex: 0,
  interval: defaultConfig.interval,
  showStreamTitles: defaultConfig.showStreamTitles,
  showMosaicInfo: defaultConfig.showMosaicInfo,
  autoFullscreen: defaultConfig.autoFullscreen,
  smartInterval: defaultConfig.smartInterval,

  loadUserConfig: async () => {
    try {
      const config = await backendAPI.getConfig();
      set({
        interval: config.interval,
        showStreamTitles: config.showStreamTitles,
        showMosaicInfo: config.showMosaicInfo,
        autoFullscreen: config.autoFullscreen,
        smartInterval: config.smartInterval,
      });
    } catch (error) {
      console.error('Load config error:', error);
    }
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
    backendAPI.saveConfig({ 
      interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval
    }).catch(console.error);
  },

  setSmartInterval: (smart: boolean) => {
    set({ smartInterval: smart });
    const state = get();
    backendAPI.saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: smart
    }).catch(console.error);
  },

  setShowStreamTitles: (show: boolean) => {
    set({ showStreamTitles: show });
    const state = get();
    backendAPI.saveConfig({ 
      interval: state.interval, 
      showStreamTitles: show, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval
    }).catch(console.error);
  },

  setShowMosaicInfo: (show: boolean) => {
    set({ showMosaicInfo: show });
    const state = get();
    backendAPI.saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: show, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval
    }).catch(console.error);
  },

  setAutoFullscreen: (auto: boolean) => {
    set({ autoFullscreen: auto });
    const state = get();
    backendAPI.saveConfig({ 
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: auto,
      smartInterval: state.smartInterval
    }).catch(console.error);
  },
}));
