export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Mosaic {
  id: number;
  title: string;
  type: string;
  organization_id: number;
  streams: MosaicStream[];
}

export interface MosaicStream {
  name?: string;
  title?: string;
  playback_token?: string;
  streaming_endpoint?: string;
  alive?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface MosaicState {
  mosaics: Mosaic[];
  selectedMosaics: number[];
  isLoading: boolean;
  error: string | null;
  fetchMosaics: () => Promise<void>;
  toggleMosaic: (id: number) => void;
  clearSelection: () => void;
}

export interface PlayerState {
  isPlaying: boolean;
  currentIndex: number;
  interval: number;
  showStreamTitles: boolean;
  showMosaicInfo: boolean;
  autoFullscreen: boolean;
  setPlaying: (playing: boolean) => void;
  nextMosaic: () => void;
  prevMosaic: () => void;
  setInterval: (interval: number) => void;
  setShowStreamTitles: (show: boolean) => void;
  setShowMosaicInfo: (show: boolean) => void;
  setAutoFullscreen: (auto: boolean) => void;
}

export interface ThemeState {
  theme: 'dark' | 'neon' | 'corporate';
  setTheme: (theme: ThemeState['theme']) => void;
}

export type LayoutType = '1x7' | '2x2' | '3x3' | '4x4' | '5x5' | '6x6' | '7x7' | '8x8';
