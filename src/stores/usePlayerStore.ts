import { create } from 'zustand';
import type { PlayerState } from '../types';
import { backendAPI } from '../services/backend';
import { logger } from '../utils/logger';

const defaultConfig = {
  interval: 30,
  showStreamTitles: true,
  showMosaicInfo: true,
  autoFullscreen: true,
  smartInterval: true,
  autoStart: true,
  voiceEnabled: false
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
  voiceEnabled: defaultConfig.voiceEnabled,

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
        voiceEnabled: config.voiceEnabled ?? false,
      });
    } catch (error) {
      logger.error('Load config error:', error);
    }
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  nextMosaic: (totalMosaics: number) => {
    const { currentIndex } = get();
    const nextIndex = (currentIndex + 1) % totalMosaics;
    set({ currentIndex: nextIndex });
  },

  prevMosaic: (totalMosaics: number) => {
    const { currentIndex } = get();
    const prevIndex = currentIndex === 0 ? totalMosaics - 1 : currentIndex - 1;
    set({ currentIndex: prevIndex });
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
    }).catch(logger.error);
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
    }).catch(logger.error);
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
    }).catch(logger.error);
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
    }).catch(logger.error);
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
    }).catch(logger.error);
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
      autoStart: auto,
      voiceEnabled: state.voiceEnabled
    }).catch(logger.error);
  },

  setVoiceEnabled: async (enabled: boolean) => {
    set({ voiceEnabled: enabled });
    const state = get();
    const config = await backendAPI.getConfig();
    backendAPI.saveConfig({ 
      ...config,
      interval: state.interval, 
      showStreamTitles: state.showStreamTitles, 
      showMosaicInfo: state.showMosaicInfo, 
      autoFullscreen: state.autoFullscreen,
      smartInterval: state.smartInterval,
      autoStart: state.autoStart,
      voiceEnabled: enabled
    }).catch(logger.error);
  },
}));
