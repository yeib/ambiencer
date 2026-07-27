export type SoundCategory = 'all' | 'nature' | 'urban' | 'asmr' | 'synth';

export interface SoundChannel {
  id: string;
  nameKey: string;
  icon: string;
  category: SoundCategory;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  type: string;
  fileUrl?: string;
}

export interface FocusPreset {
  id: string;
  nameKey: string;
  descKey?: string;
  icon: string;
  badge: string;
  volumes: Record<string, number>; // soundId -> volume
  isCustom?: boolean;
}

export interface FrequencyGeneratorState {
  enabled: boolean;
  mode: 'pure' | 'binaural';
  carrierFreq: number; // e.g. 432, 528, 639, 741
  beatFreq: number; // e.g. 10 (Alpha), 6 (Theta), 2 (Delta), 40 (Gamma)
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  volume: number;
  smoothFilter: number;
}

export type WallpaperType =
  | 'rain_drops'
  | 'aurora_stars'
  | 'fireplace_glow'
  | 'cyber_grid'
  | 'cherry_blossoms'
  | 'cyberpunk_matrix'
  | 'ocean_waves'
  | 'zen_nebula'
  | 'fireflies_garden'
  | 'sunset_synthwave'
  | 'autumn_leaves'
  | 'hyperdrive_warp';

export interface WallpaperState {
  activeWallpaper: WallpaperType;
  blurAmount: number;
  speed: number;
  brightness: number;
}

export interface WidgetSettings {
  clockSize?: 'sm' | 'md' | 'lg';
  clockFormat?: '12h' | '24h';
  clockStyle?: 'digital' | 'analog';
  showSeconds?: boolean;
  showDate?: boolean;
  showCpu?: boolean;
  showRam?: boolean;
  showDisk?: boolean;
  showBattery?: boolean;
  showNet?: boolean;
  postItText?: string;
  postItColor?: 'amber' | 'cyan' | 'purple' | 'emerald' | 'rose';
  quoteText?: string;
  quoteAuthor?: string;
  showVisualizer?: boolean;
}

export interface WidgetState {
  id: string;
  type: 'clock' | 'sysmonitor' | 'postit';
  enabled: boolean; // Backward compatibility desktop toggle
  desktopActive?: boolean; // Active on Windows Desktop
  testActive?: boolean; // Active as In-App Preview / Test Overlay
  position: { x: number; y: number };
  settings?: WidgetSettings;
}

export interface AppSettings {
  language: 'es' | 'en';
  themeAccent: string;
  masterVolume: number;
  isMuted: boolean;
  autoStartDesktop: boolean;
  minimizeToTray: boolean;
  closeToTray: boolean;
  visualizerMode: 'wave' | 'bars' | 'circle';
  highQualityAudio: boolean;
  startWithWindows?: boolean;
  autoLaunchLiveWallpaper?: boolean;
}

export type ActiveTab = 'mixer' | 'generator' | 'wallpapers' | 'presets' | 'widgets' | 'settings';
