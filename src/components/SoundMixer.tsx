import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, CloudRain, Zap, Waves, Wind, Flame, Coffee, Keyboard, Radio, Disc, Car, Train, BookOpen, PenTool, Heart, Trees, Cpu, Headphones, Compass, Sparkles, Moon, Sun, Droplets, Palmtree, Flower2, CircleDot } from 'lucide-react';
import { SoundChannel, SoundCategory, AppSettings, FrequencyGeneratorState } from '../types';
import { SavePresetModal } from './SavePresetModal';
import { getTranslation } from '../i18n';

interface SoundMixerProps {
  channels: SoundChannel[];
  settings: AppSettings;
  freqState?: FrequencyGeneratorState;
  onChangeFreqState?: (newState: Partial<FrequencyGeneratorState>) => void;
  onVolumeChange: (id: string, volume: number) => void;
  onToggleMuteChannel: (id: string) => void;
  onResetMixer: () => void;
  onSaveCustomPreset: (name: string, icon: string) => void;
}

const CATEGORY_THEMES: Record<SoundCategory, {
  accent: string;
  glowBg: string;
  iconBgActive: string;
  iconBgInactive: string;
  cardBgActive: string;
  cardBgInactive: string;
  borderActive: string;
  borderInactive: string;
  badgeBg: string;
  badgeBorder: string;
}> = {
  nature: {
    accent: '#10b981', // Emerald Green / Nature & Water
    glowBg: 'rgba(16, 185, 129, 0.25)',
    iconBgActive: 'rgba(16, 185, 129, 0.25)',
    iconBgInactive: 'rgba(16, 185, 129, 0.1)',
    cardBgActive: 'rgba(16, 48, 36, 0.65)',
    cardBgInactive: 'rgba(16, 185, 129, 0.05)',
    borderActive: '1px solid #10b981',
    borderInactive: '1px solid rgba(16, 185, 129, 0.22)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeBorder: '1px solid rgba(16, 185, 129, 0.35)',
  },
  urban: {
    accent: '#f59e0b', // Warm Amber / Focus & City
    glowBg: 'rgba(245, 158, 11, 0.25)',
    iconBgActive: 'rgba(245, 158, 11, 0.25)',
    iconBgInactive: 'rgba(245, 158, 11, 0.1)',
    cardBgActive: 'rgba(48, 36, 16, 0.65)',
    cardBgInactive: 'rgba(245, 158, 11, 0.05)',
    borderActive: '1px solid #f59e0b',
    borderInactive: '1px solid rgba(245, 158, 11, 0.22)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeBorder: '1px solid rgba(245, 158, 11, 0.35)',
  },
  asmr: {
    accent: '#f43f5e', // Neon Pink / Tactile ASMR
    glowBg: 'rgba(244, 63, 94, 0.25)',
    iconBgActive: 'rgba(244, 63, 94, 0.25)',
    iconBgInactive: 'rgba(244, 63, 94, 0.1)',
    cardBgActive: 'rgba(48, 16, 28, 0.65)',
    cardBgInactive: 'rgba(244, 63, 94, 0.05)',
    borderActive: '1px solid #f43f5e',
    borderInactive: '1px solid rgba(244, 63, 94, 0.22)',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeBorder: '1px solid rgba(244, 63, 94, 0.35)',
  },
  synth: {
    accent: '#a855f7', // Mystic Purple / Frequencies & Zen
    glowBg: 'rgba(168, 85, 247, 0.25)',
    iconBgActive: 'rgba(168, 85, 247, 0.25)',
    iconBgInactive: 'rgba(168, 85, 247, 0.1)',
    cardBgActive: 'rgba(38, 22, 56, 0.65)',
    cardBgInactive: 'rgba(168, 85, 247, 0.05)',
    borderActive: '1px solid #a855f7',
    borderInactive: '1px solid rgba(168, 85, 247, 0.22)',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeBorder: '1px solid rgba(168, 85, 247, 0.35)',
  },
  all: {
    accent: '#38bdf8', // Neon Cyan
    glowBg: 'rgba(56, 189, 248, 0.25)',
    iconBgActive: 'rgba(56, 189, 248, 0.25)',
    iconBgInactive: 'rgba(56, 189, 248, 0.1)',
    cardBgActive: 'rgba(22, 38, 56, 0.65)',
    cardBgInactive: 'rgba(56, 189, 248, 0.05)',
    borderActive: '1px solid #38bdf8',
    borderInactive: '1px solid rgba(56, 189, 248, 0.22)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeBorder: '1px solid rgba(56, 189, 248, 0.35)',
  }
};

export const SoundMixer: React.FC<SoundMixerProps> = ({
  channels,
  settings,
  freqState,
  onChangeFreqState,
  onVolumeChange,
  onToggleMuteChannel,
  onResetMixer,
  onSaveCustomPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>('all');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const lang = settings.language;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'rain': return <CloudRain size={20} />;
      case 'thunder': return <Zap size={20} />;
      case 'waves': return <Waves size={20} />;
      case 'wind': return <Wind size={20} />;
      case 'fire': return <Flame size={20} />;
      case 'keyboard': return <Keyboard size={20} />;
      case 'car': return <Car size={20} />;
      case 'train': return <Train size={20} />;
      case 'library': return <BookOpen size={20} />;
      case 'pencil': return <PenTool size={20} />;
      case 'bamboo': return <Trees size={20} />;
      case 'space': return <Disc size={20} />;
      case 'cave': return <Compass size={20} />;
      case 'solar_synth': return <Sparkles size={20} />;
      case 'singing_bowl': return <CircleDot size={20} />;
      case 'night_forest': return <Moon size={20} />;
      case 'morning_forest': return <Sun size={20} />;
      case 'waterfall': return <Droplets size={20} />;
      case 'jungle': return <Palmtree size={20} />;
      case 'meadow': return <Flower2 size={20} />;
      case 'zen_pond': return <Trees size={20} />;
      case 'om_chant': return <CircleDot size={20} />;
      case 'radio': return <Radio size={20} />;
      default: return <Disc size={20} />;
    }
  };

  const categories: { id: SoundCategory; key: keyof typeof import('../i18n').translations['es'] }[] = [
    { id: 'all', key: 'categoryAll' },
    { id: 'nature', key: 'categoryNature' },
    { id: 'urban', key: 'categoryUrban' },
    { id: 'asmr', key: 'categoryAsmr' },
    { id: 'synth', key: 'categorySynth' },
  ];

  const filteredChannels = channels.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );

  const activeChannels = channels.filter((c) => c.volume > 0 && !c.isMuted);

  return (
    <div className="animate-fade-in">
      {/* Category Pills & Controls Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => {
            const isSel = selectedCategory === cat.id;
            const theme = CATEGORY_THEMES[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isSel ? `1px solid ${theme.accent}` : 'var(--border-glass)',
                  background: isSel ? `${theme.accent}26` : 'rgba(255, 255, 255, 0.04)',
                  color: isSel ? theme.accent : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isSel ? 700 : 400,
                  boxShadow: isSel ? `0 0 12px ${theme.accent}40` : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {getTranslation(lang, cat.key)}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {getTranslation(lang, 'activeChannels')}: <strong style={{ color: 'var(--accent-cyan)' }}>{activeChannels.length + (freqState?.enabled && freqState.volume > 0 ? 1 : 0)}</strong>
          </span>

          {/* Guardar Mezcla como Preset */}
          {activeChannels.length > 0 && (
            <button
              onClick={() => setIsSaveModalOpen(true)}
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid var(--accent-amber)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                color: 'var(--accent-amber)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <span>⭐</span>
              <span>{lang === 'es' ? 'Guardar Preset' : 'Save Preset'}</span>
            </button>
          )}

          <button
            onClick={onResetMixer}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem'
            }}
          >
            <RotateCcw size={14} />
            <span>{getTranslation(lang, 'resetMixer')}</span>
          </button>
        </div>
      </div>

      {/* Grid of Sound Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {/* Synthesizer Frequency Master Card */}
        {freqState && onChangeFreqState && (selectedCategory === 'all' || selectedCategory === 'synth') && (() => {
          const isFreqActive = freqState.enabled && freqState.volume > 0;
          const freqPercent = isFreqActive ? Math.round(freqState.volume * 100) : 0;
          const modeText = freqState.mode === 'binaural'
            ? `Binaural ${freqState.beatFreq}Hz`
            : `${freqState.carrierFreq}Hz`;
          const synthTheme = CATEGORY_THEMES.synth;

          return (
            <div
              key="binaural-synth-card"
              className="glass-card"
              style={{
                height: '110px',
                boxSizing: 'border-box',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isFreqActive ? synthTheme.borderActive : synthTheme.borderInactive,
                background: isFreqActive ? synthTheme.cardBgActive : synthTheme.cardBgInactive,
                boxShadow: isFreqActive ? `0 0 20px ${synthTheme.glowBg}` : 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isFreqActive ? synthTheme.iconBgActive : synthTheme.iconBgInactive,
                      color: synthTheme.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: isFreqActive ? '#ffffff' : 'var(--text-main)',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {lang === 'es' ? 'Frecuencias & Binaural' : 'Binaural & Frequencies'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: synthTheme.badgeBg,
                          border: synthTheme.badgeBorder,
                          color: synthTheme.accent,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Cpu size={9} />
                        {modeText}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{freqPercent}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onChangeFreqState({ enabled: !freqState.enabled, volume: freqState.volume === 0 ? 0.3 : freqState.volume })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isFreqActive ? synthTheme.accent : 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                    flexShrink: 0
                  }}
                  title={isFreqActive ? 'Desactivar Frecuencias' : 'Activar Frecuencias'}
                >
                  {isFreqActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={freqState.enabled ? freqState.volume : 0}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  onChangeFreqState({ volume: vol, enabled: vol > 0 });
                }}
                style={{
                  accentColor: synthTheme.accent,
                  width: '100%'
                }}
              />
            </div>
          );
        })()}

        {filteredChannels.map((ch) => {
          const isActive = ch.volume > 0 && !ch.isMuted;
          const isRealAudio = ch.type === 'media';
          const percent = Math.round(ch.volume * 100);

          const theme = CATEGORY_THEMES[ch.category] || CATEGORY_THEMES.all;

          return (
            <div
              key={ch.id}
              className="glass-card"
              style={{
                height: '110px',
                boxSizing: 'border-box',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isActive ? theme.borderActive : theme.borderInactive,
                background: isActive ? theme.cardBgActive : theme.cardBgInactive,
                boxShadow: isActive ? `0 0 20px ${theme.glowBg}` : 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Header info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isActive ? theme.iconBgActive : theme.iconBgInactive,
                      color: theme.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}
                  >
                    {getIconComponent(ch.icon)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3
                      title={getTranslation(lang, ch.nameKey as any)}
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: isActive ? '#ffffff' : 'var(--text-main)',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {getTranslation(lang, ch.nameKey as any)}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: theme.badgeBg,
                          border: theme.badgeBorder,
                          color: theme.accent,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isRealAudio ? <Headphones size={9} /> : <Cpu size={9} />}
                        {isRealAudio
                          ? (lang === 'es' ? 'Audio HD' : 'HD Audio')
                          : (lang === 'es' ? 'Sintetizado' : 'Code Synth')
                        }
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{percent}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleMuteChannel(ch.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: ch.isMuted ? 'var(--accent-rose)' : isActive ? theme.accent : 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                    flexShrink: 0
                  }}
                >
                  {ch.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={ch.isMuted ? 0 : ch.volume}
                onChange={(e) => onVolumeChange(ch.id, parseFloat(e.target.value))}
                style={{
                  accentColor: theme.accent,
                  width: '100%'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Modal para Guardar Preset */}
      <SavePresetModal
        isOpen={isSaveModalOpen}
        settings={settings}
        activeChannels={channels}
        onClose={() => setIsSaveModalOpen(false)}
        onSavePreset={onSaveCustomPreset}
      />
    </div>
  );
};
