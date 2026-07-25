export type SoundCategory = 'all' | 'nature' | 'urban' | 'asmr' | 'synth' | 'binaural';

export interface SoundChannel {
  id: string;
  nameKey: string;
  icon: string;
  category: SoundCategory;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  type: string;
}

export interface FocusPreset {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  badge: string;
  volumes: Record<string, number>; // soundId -> volume
}

export interface FrequencyGeneratorState {
  enabled: boolean;
  mode: 'pure' | 'binaural';
  carrierFreq: number; // e.g. 432, 528, 639, 741
  beatFreq: number; // e.g. 10 (Alpha), 6 (Theta), 2 (Delta), 40 (Gamma)
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  volume: number;
  smoothFilter: number; // Cutoff frequency to keep sounds soft and soothing
}

export type WallpaperType = 'rain_drops' | 'aurora_stars' | 'fireplace_glow' | 'cyber_grid';

export interface WallpaperState {
  activeWallpaper: WallpaperType;
  blurAmount: number;
  speed: number;
  brightness: number;
}

export interface WidgetState {
  id: string;
  type: 'clock' | 'pomodoro' | 'sysmonitor' | 'postit';
  enabled: boolean;
  position: { x: number; y: number };
  settings?: Record<string, any>;
}

export interface AppSettings {
  language: 'es' | 'en';
  themeAccent: string;
  masterVolume: number;
  isMuted: boolean;
  autoStartDesktop: boolean;
  visualizerMode: 'wave' | 'bars' | 'circle';
  highQualityAudio: boolean;
}

export type ActiveTab = 'mixer' | 'generator' | 'wallpapers' | 'presets' | 'widgets' | 'settings';
