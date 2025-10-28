import { create } from 'zustand';
import type { PlayerState } from '../types';
import { backendAPI } from '../services/backend';

const defaultConfig = {
  interval: 30,
  showStreamTitles: true,
  showMosaicInfo: true,
  autoFullscreen: true,
  smartInterval: true,
  autoStart: true
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: true,
  currentIndex: 0,
  interval: defaultConfig.interval,
  showStreamTitles: defaultConfig.showStreamTitles,
  showMosaicInfo: defaultConfig.showMosaicInfo,
  autoFullscreen: defaultConfig.autoFullscreen,
  smartInterval: defaultConfig.smartInterval,
  autoStart: defaultConfig.autoStart,

  loadUserConfig: async () => {
    try {
      const config = await backendAPI.getConfig();
      set({
        interval: config.interval,
        showStreamTitles: config.showStreamTitles,
        showMosaicInfo: config.showMosaicInfo,
        autoFullscreen: config.autoFullscreen,
        smartInterval: config.smartInterval,
        autoStart: config.autoStart,
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

  setInterval: async (interval: number) => {
    set({ interval });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval,
      autoStart: state.autoStart
    }).catch(console.error);
  },

  setSmartInterval: async (smart: boolean) => {
    set({ smartInterval: smart });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: smart,
      autoStart: state.autoStart
    }).catch(console.error);
  },

  setShowStreamTitles: async (show: boolean) => {
    set({ showStreamTitles: show });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval: state.interval, 
      showStreamTitles: show, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval,
      autoStart: state.autoStart
    }).catch(console.error);
  },

  setShowMosaicInfo: async (show: boolean) => {
    set({ showMosaicInfo: show });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: show, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval,
      autoStart: state.autoStart
    }).catch(console.error);
  },

  setAutoFullscreen: async (auto: boolean) => {
    set({ autoFullscreen: auto });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: auto,
      smartInterval: state.smartInterval,
      autoStart: state.autoStart
    }).catch(console.error);
  },

  setAutoStart: async (auto: boolean) => {
    set({ autoStart: auto });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval,
      autoStart: auto
    }).catch(console.error);
  },
}));
