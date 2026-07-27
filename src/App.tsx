import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SoundMixer } from './components/SoundMixer';
import { FocusPresets } from './components/FocusPresets';
import { WidgetsTab } from './components/WidgetsTab';
import { FrequencyGeneratorTab } from './components/FrequencyGeneratorTab';
import { WallpapersTab } from './components/WallpapersTab';
import { WallpaperEngine } from './components/WallpaperEngine';
import { SettingsModal } from './components/SettingsModal';
import { FloatingWidgetOverlay } from './components/widgets/FloatingWidgetOverlay';
import { audioEngine } from './audio/WebAudioEngine';
import { SoundChannel, FocusPreset, WidgetState, AppSettings, ActiveTab, FrequencyGeneratorState, WallpaperState } from './types';
import './styles/main.css';

const INITIAL_CHANNELS: SoundChannel[] = [
  // Naturaleza & Clima
  { id: 'waves', nameKey: 'soundWaves', icon: 'waves', category: 'nature', volume: 0.5, isMuted: false, type: 'media', fileUrl: '/sounds/powerful-oceanic-waves-crashing-against_072626.webm' },
  { id: 'rain', nameKey: 'soundRain', icon: 'rain', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/gentle-raindrops-falling-steadily-on_072526.webm' },
  { id: 'thunder', nameKey: 'soundThunder', icon: 'thunder', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/heavy-thunderstorm-rumble-distant-low_072526.webm' },
  { id: 'waterfall', nameKey: 'soundWaterfall', icon: 'waterfall', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/powerful-mountain-waterfall-roaring-stream_072626.webm' },
  { id: 'wind', nameKey: 'soundWind', icon: 'wind', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/soft-autumn-wind-blowing-through_072526.webm' },
  { id: 'fire', nameKey: 'soundFire', icon: 'fire', category: 'nature', volume: 0.3, isMuted: false, type: 'media', fileUrl: '/sounds/crackle-of-a-cozy-fireplace_072526.webm' },
  { id: 'morning_forest', nameKey: 'soundMorningForest', icon: 'morning_forest', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/peaceful-morning-forest-ambience-gentle_072626.webm' },
  { id: 'night_forest', nameKey: 'soundNightForest', icon: 'night_forest', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/calm-summer-night-forest-ambience_072526.webm' },
  { id: 'jungle', nameKey: 'soundJungle', icon: 'jungle', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/deep-tropical-rainforest-jungle-ambience_072626.webm' },
  { id: 'meadow', nameKey: 'soundMeadow', icon: 'meadow', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/calm-open-spring-meadow-landscape_072626.webm' },
  { id: 'bamboo', nameKey: 'soundBamboo', icon: 'bamboo', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/japanese-bamboo-water-fountain-shishi-odoshi_072526.webm' },
  { id: 'zen_pond', nameKey: 'soundZenPond', icon: 'zen_pond', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/tranquil-japanese-zen-garden-gentle_072626.webm' },
  { id: 'cave', nameKey: 'soundCave', icon: 'cave', category: 'nature', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/large-ancient-stone-cave-acoustic_072526.webm' },

  // Urbanos & Espacios Acogedores
  { id: 'car_rain', nameKey: 'soundCarRain', icon: 'car', category: 'urban', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/night-rain-falling-on-car_072526.webm' },
  { id: 'train', nameKey: 'soundTrain', icon: 'train', category: 'urban', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/passenger-train-interior-gentle-rhythmic_072526.webm' },
  { id: 'library', nameKey: 'soundLibrary', icon: 'library', category: 'urban', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/quiet-library-interior-subtle-paper_072526.webm' },

  // ASMR & Tactil
  { id: 'keyboard', nameKey: 'soundKeyboard', icon: 'keyboard', category: 'asmr', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/asmr-mechanical-keyboard-typing-thocky_072526.webm' },
  { id: 'pencil', nameKey: 'soundPencil', icon: 'pencil', category: 'asmr', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/pencil-writing-smoothly-on-thick_072526.webm' },

  // Zen & Sanación Sonora
  { id: 'om_chant', nameKey: 'soundOmChant', icon: 'om_chant', category: 'synth', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/deep-meditative-sacred-om-chant_072626.webm' },
  { id: 'singing_bowl', nameKey: 'soundSingingBowl', icon: 'singing_bowl', category: 'synth', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/meditative-singing-bowl-warm-drone_072526.webm' },
  { id: 'solar_synth', nameKey: 'soundSolarSynth', icon: 'solar_synth', category: 'synth', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/warm-analog-synth-ambient-drone_072526.webm' },
  { id: 'space_pad', nameKey: 'soundSpacePad', icon: 'space', category: 'synth', volume: 0.0, isMuted: false, type: 'media', fileUrl: '/sounds/deep-space-cosmic-ambient-pad_072526.webm' },
  { id: 'pink_noise', nameKey: 'soundPinkNoise', icon: 'radio', category: 'synth', volume: 0.0, isMuted: false, type: 'pink_noise' },
  { id: 'white_noise', nameKey: 'soundWhiteNoise', icon: 'radio', category: 'synth', volume: 0.0, isMuted: false, type: 'white_noise' },
];

const SYSTEM_PRESETS: FocusPreset[] = [
  {
    id: 'yoga_chakra',
    nameKey: 'presetYogaChakra',
    descKey: 'presetYogaChakraDesc',
    icon: 'sparkles',
    badge: 'Yoga & Sanación',
    volumes: { singing_bowl: 0.7, om_chant: 0.5, solar_synth: 0.35 }
  },
  {
    id: 'total_calm',
    nameKey: 'presetTotalCalm',
    descKey: 'presetTotalCalmDesc',
    icon: 'waves',
    badge: 'Relajación',
    volumes: { waves: 0.65, fire: 0.4, morning_forest: 0.25 }
  },
  {
    id: 'rainy_night',
    nameKey: 'presetRainyNight',
    descKey: 'presetRainyNightDesc',
    icon: 'rain',
    badge: 'Clima & Naturaleza',
    volumes: { rain: 0.7, thunder: 0.3, wind: 0.2, car_rain: 0.25 }
  },
  {
    id: 'mountain_sanctuary',
    nameKey: 'presetMountainSanctuary',
    descKey: 'presetMountainSanctuaryDesc',
    icon: 'compass',
    badge: 'Refugio Natural',
    volumes: { waterfall: 0.6, morning_forest: 0.5, meadow: 0.3 }
  },
  {
    id: 'amazon_zen',
    nameKey: 'presetAmazonZen',
    descKey: 'presetAmazonZenDesc',
    icon: 'trees',
    badge: 'Zen Tropical',
    volumes: { jungle: 0.55, bamboo: 0.45, zen_pond: 0.35 }
  },
  {
    id: 'alpha_study',
    nameKey: 'presetAlphaStudy',
    descKey: 'presetAlphaStudyDesc',
    icon: 'brain',
    badge: 'Enfoque Alfa',
    volumes: { pink_noise: 0.3, library: 0.4, pencil: 0.35, keyboard: 0.2 }
  },
  {
    id: 'deep_space',
    nameKey: 'presetDeepSpace',
    descKey: 'presetDeepSpaceDesc',
    icon: 'moon',
    badge: 'Meditación Profunda',
    volumes: { space_pad: 0.5, singing_bowl: 0.4, solar_synth: 0.3 }
  },
  {
    id: 'night_train',
    nameKey: 'presetNightTrain',
    descKey: 'presetNightTrainDesc',
    icon: 'train',
    badge: 'Viaje & Calma',
    volumes: { train: 0.6, car_rain: 0.3, wind: 0.2 }
  },
  {
    id: 'mystic_cave',
    nameKey: 'presetMysticCave',
    descKey: 'presetMysticCaveDesc',
    icon: 'disc',
    badge: 'Sanación Sonora',
    volumes: { cave: 0.65, om_chant: 0.55, white_noise: 0.25 }
  },
  {
    id: 'spring_breeze',
    nameKey: 'presetSpringBreeze',
    descKey: 'presetSpringBreezeDesc',
    icon: 'wind',
    badge: 'Aire Puro',
    volumes: { meadow: 0.6, night_forest: 0.35, wind: 0.3 }
  }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mixer');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [channels, setChannels] = useState<SoundChannel[]>(INITIAL_CHANNELS);
  
  // Custom Presets State (localStorage persistence)
  const [customPresets, setCustomPresets] = useState<FocusPreset[]>(() => {
    try {
      const saved = localStorage.getItem('ambiencer_custom_presets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Frequency & Binaural Synthesizer State
  const [freqState, setFreqState] = useState<FrequencyGeneratorState>({
    enabled: false,
    mode: 'pure',
    carrierFreq: 432,
    beatFreq: 10,
    waveform: 'sine',
    volume: 0.3,
    smoothFilter: 1400
  });

  // Wallpaper State
  const [wallpaperState, setWallpaperState] = useState<WallpaperState>(() => {
    try {
      const saved = localStorage.getItem('ambiencer_wallpaper_state');
      return saved ? JSON.parse(saved) : {
        activeWallpaper: 'rain_drops',
        blurAmount: 0,
        speed: 1.0,
        brightness: 1.0
      };
    } catch (e) {
      return {
        activeWallpaper: 'rain_drops',
        blurAmount: 0,
        speed: 1.0,
        brightness: 1.0
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ambiencer_wallpaper_state', JSON.stringify(wallpaperState));
    } catch (e) {}
  }, [wallpaperState]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ambiencer_wallpaper_state' && e.newValue) {
        try {
          setWallpaperState(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [widgets, setWidgets] = useState<WidgetState[]>(() => {
    try {
      const saved = localStorage.getItem('ambiencer_widgets_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      { id: 'clock', type: 'clock', enabled: false, desktopActive: false, testActive: false, position: { x: 40, y: 40 }, settings: { clockFormat: '24h', clockSize: 'md', showSeconds: true, showDate: true } },
      { id: 'nowplaying', type: 'nowplaying', enabled: false, desktopActive: false, testActive: false, position: { x: 40, y: 220 }, settings: { showVisualizer: true } },
      { id: 'sysmonitor', type: 'sysmonitor', enabled: false, desktopActive: false, testActive: false, position: { x: 380, y: 40 }, settings: { showCpu: true, showRam: true, showDisk: true } },
      { id: 'postit', type: 'postit', enabled: false, desktopActive: false, testActive: false, position: { x: 380, y: 220 }, settings: { postItColor: 'amber' } },
      { id: 'quotes', type: 'quotes', enabled: false, desktopActive: false, testActive: false, position: { x: 720, y: 40 } },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ambiencer_widgets_state', JSON.stringify(widgets));
    } catch (e) {}
  }, [widgets]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ambiencer_widgets_state' && e.newValue) {
        try {
          setWidgets(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggleTestWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, testActive: !w.testActive } : w))
    );
  };

  const handleToggleDesktopWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextState = !(w.desktopActive || w.enabled);
          if (nextState) {
            import('@tauri-apps/api/core').then(({ invoke }) => {
              invoke('attach_live_wallpaper_to_desktop').catch(() => {});
            });
          }
          return { ...w, desktopActive: nextState, enabled: nextState };
        }
        return w;
      })
    );
  };

  const handleUpdateWidgetSettings = (id: string, settingsUpdate: Partial<WidgetSettings>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, settings: { ...w.settings, ...settingsUpdate } } : w))
    );
  };

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ambiencer_settings');
      return saved ? {
        language: 'es',
        themeAccent: '#38bdf8',
        masterVolume: 0.8,
        isMuted: false,
        autoStartDesktop: false,
        minimizeToTray: true,
        closeToTray: true,
        visualizerMode: 'bars',
        highQualityAudio: true,
        startWithWindows: false,
        autoLaunchLiveWallpaper: false,
        ...JSON.parse(saved)
      } : {
        language: 'es',
        themeAccent: '#38bdf8',
        masterVolume: 0.8,
        isMuted: false,
        autoStartDesktop: false,
        minimizeToTray: true,
        closeToTray: true,
        visualizerMode: 'bars',
        highQualityAudio: true,
        startWithWindows: false,
        autoLaunchLiveWallpaper: false
      };
    } catch (e) {
      return {
        language: 'es',
        themeAccent: '#38bdf8',
        masterVolume: 0.8,
        isMuted: false,
        autoStartDesktop: false,
        minimizeToTray: true,
        closeToTray: true,
        visualizerMode: 'bars',
        highQualityAudio: true,
        startWithWindows: false,
        autoLaunchLiveWallpaper: false
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ambiencer_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    if (!window.location.search.includes('mode=wallpaper') && settings.autoLaunchLiveWallpaper) {
      import('@tauri-apps/api/core').then(({ invoke }) => {
        invoke('attach_live_wallpaper_to_desktop').catch(() => {});
      });
    }
  }, []);

  const [sleepTimer, setSleepTimer] = useState<number | null>(null);

  // Dynamic Global CSS Theme Accent Variable Propagation
  useEffect(() => {
    const accent = settings.themeAccent;
    document.documentElement.style.setProperty('--accent-cyan', accent);
    document.documentElement.style.setProperty('--accent-cyan-glow', `${accent}33`);
    document.documentElement.style.setProperty('--border-accent', `1px solid ${accent}66`);
  }, [settings.themeAccent]);

  // Save custom presets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ambiencer_custom_presets', JSON.stringify(customPresets));
    } catch (e) {}
  }, [customPresets]);

  // Sync Master Volume & Mute to AudioEngine
  useEffect(() => {
    audioEngine.setMasterVolume(settings.masterVolume);
    audioEngine.setMasterMute(settings.isMuted);
  }, [settings.masterVolume, settings.isMuted]);

  // Sync Channels & Frequency Generator to AudioEngine
  useEffect(() => {
    if (isPlaying) {
      audioEngine.resume();
      channels.forEach((ch) => {
        audioEngine.updateChannelVolume(ch.id, ch.volume, ch.isMuted, ch.type, ch.fileUrl);
      });
      audioEngine.updateFrequencyGenerator(freqState);
    } else {
      audioEngine.stopAllChannels();
      audioEngine.updateFrequencyGenerator({ ...freqState, enabled: false });
    }
  }, [channels, freqState, isPlaying]);

  // Mouse 4/5 navigation support
  useEffect(() => {
    const handleMouseAux = (e: MouseEvent) => {
      const tabs: ActiveTab[] = ['mixer', 'generator', 'presets', 'wallpapers', 'widgets', 'settings'];
      const idx = tabs.indexOf(activeTab);
      if (e.button === 3 && idx > 0) setActiveTab(tabs[idx - 1]);
      else if (e.button === 4 && idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
    };

    window.addEventListener('mouseup', handleMouseAux);
    return () => {
      window.removeEventListener('mouseup', handleMouseAux);
    };
  }, [activeTab]);

  const handleTogglePlay = () => {
    if (!isPlaying) audioEngine.resume();
    else audioEngine.stopAllChannels();
    setIsPlaying(!isPlaying);
  };

  const handleChannelVolumeChange = (id: string, vol: number) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, volume: vol } : c))
    );
    if (!isPlaying && vol > 0) setIsPlaying(true);
  };

  const handleToggleMuteChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const handleResetMixer = () => {
    setChannels((prev) => prev.map((c) => ({ ...c, volume: 0, isMuted: false })));
    setFreqState((prev) => ({ ...prev, enabled: false }));
    audioEngine.stopAllChannels();
  };

  const handleSaveCustomPreset = (name: string, icon: string) => {
    const activeVolumes: Record<string, number> = {};
    channels.forEach(c => {
      if (c.volume > 0 && !c.isMuted) {
        activeVolumes[c.id] = c.volume;
      }
    });

    const newPreset: FocusPreset = {
      id: `custom_${Date.now()}`,
      nameKey: name,
      descKey: `${Object.keys(activeVolumes).length} ${settings.language === 'es' ? 'canales guardados' : 'channels saved'}`,
      icon,
      badge: 'Personalizado',
      volumes: activeVolumes,
      isCustom: true
    };

    setCustomPresets(prev => [newPreset, ...prev]);
  };

  const handleDeleteCustomPreset = (id: string) => {
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleApplyPreset = (preset: FocusPreset) => {
    audioEngine.stopAllChannels();
    setChannels((prev) =>
      prev.map((c) => ({
        ...c,
        volume: preset.volumes[c.id] !== undefined ? preset.volumes[c.id] : 0,
        isMuted: false,
      }))
    );
    setIsPlaying(true);
    setActiveTab('mixer');
  };

  const allPresets = [...customPresets, ...SYSTEM_PRESETS];

  if (window.location.search.includes('mode=wallpaper')) {
    const desktopWidgets = widgets.filter((w) => w.desktopActive || w.enabled);
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000', zIndex: 0 }}>
        <WallpaperEngine
          type={wallpaperState.activeWallpaper}
          blurAmount={wallpaperState.blurAmount}
          speed={wallpaperState.speed}
          brightness={wallpaperState.brightness}
        />
        {/* Floating Active Desktop Widgets System */}
        {desktopWidgets.map((w) => (
          <FloatingWidgetOverlay
            key={`desktop-${w.id}`}
            widget={w}
            settings={settings}
            isTestMode={false}
            onClose={() => handleToggleDesktopWidget(w.id)}
            onUpdatePosition={(newPos) => {
              setWidgets((prev) =>
                prev.map((item) => (item.id === w.id ? { ...item, position: newPos } : item))
              );
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Live Procedural Wallpaper Background */}
      <WallpaperEngine
        type={wallpaperState.activeWallpaper}
        blurAmount={wallpaperState.blurAmount}
        speed={wallpaperState.speed}
        brightness={wallpaperState.brightness}
      />

      {/* Floating In-App Test/Preview Widgets Overlay System */}
      {widgets.filter((w) => w.testActive).map((w) => (
        <FloatingWidgetOverlay
          key={`test-${w.id}`}
          widget={w}
          settings={settings}
          isTestMode={true}
          onClose={() => handleToggleTestWidget(w.id)}
          onUpdatePosition={(newPos) => {
            setWidgets((prev) =>
              prev.map((item) => (item.id === w.id ? { ...item, position: newPos } : item))
            );
          }}
        />
      ))}

      {/* Main Glass Layout Container */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
        {/* Top Header */}
        <Header
          settings={settings}
          isPlaying={isPlaying}
          activeSleepTimer={sleepTimer}
          onTogglePlay={handleTogglePlay}
          onMasterVolumeChange={(vol) => setSettings((s) => ({ ...s, masterVolume: vol }))}
          onToggleMute={() => setSettings((s) => ({ ...s, isMuted: !s.isMuted }))}
          onSetSleepTimer={setSleepTimer}
        />

        {/* Navigation Tabs Bar */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} settings={settings} />

        {/* Dynamic Tab Body Content */}
        <main style={{ marginTop: '20px' }}>
          {activeTab === 'mixer' && (
            <SoundMixer
              channels={channels}
              settings={settings}
              onVolumeChange={handleChannelVolumeChange}
              onToggleMuteChannel={handleToggleMuteChannel}
              onResetMixer={handleResetMixer}
              onSaveCustomPreset={handleSaveCustomPreset}
            />
          )}
          {activeTab === 'generator' && (
            <FrequencyGeneratorTab
              settings={settings}
              state={freqState}
              onChangeState={(newS) => {
                setFreqState((prev) => ({ ...prev, ...newS }));
                if (!isPlaying && (newS.enabled || newS.volume)) setIsPlaying(true);
              }}
            />
          )}
          {activeTab === 'presets' && (
            <FocusPresets
              presets={allPresets}
              settings={settings}
              onApplyPreset={handleApplyPreset}
              onDeleteCustomPreset={handleDeleteCustomPreset}
            />
          )}
          {activeTab === 'wallpapers' && (
            <WallpapersTab
              settings={settings}
              state={wallpaperState}
              onChangeWallpaperState={(newS) => setWallpaperState((prev) => ({ ...prev, ...newS }))}
            />
          )}
          {activeTab === 'widgets' && (
            <WidgetsTab
              settings={settings}
              widgets={widgets}
              onToggleTestWidget={handleToggleTestWidget}
              onToggleDesktopWidget={handleToggleDesktopWidget}
              onUpdateWidgetPosition={(id, pos) => {
                setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, position: pos } : w)));
              }}
              onUpdateWidgetSettings={handleUpdateWidgetSettings}
            />
          )}
          {activeTab === 'settings' && (
            <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>⚙️ Ajustes de Ambiencer</h2>
              <SettingsModal
                isOpen={true}
                settings={settings}
                onClose={() => setActiveTab('mixer')}
                onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
