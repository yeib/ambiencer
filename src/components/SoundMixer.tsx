import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, CloudRain, Zap, Waves, Wind, Flame, Coffee, Keyboard, Radio, Disc, Car, Train, BookOpen, PenTool, Heart, Trees, Cpu, Headphones } from 'lucide-react';
import { SoundChannel, SoundCategory, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface SoundMixerProps {
  channels: SoundChannel[];
  settings: AppSettings;
  onVolumeChange: (id: string, volume: number) => void;
  onToggleMuteChannel: (id: string) => void;
  onResetMixer: () => void;
}

export const SoundMixer: React.FC<SoundMixerProps> = ({
  channels,
  settings,
  onVolumeChange,
  onToggleMuteChannel,
  onResetMixer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>('all');
  const lang = settings.language;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'rain': return <CloudRain size={20} />;
      case 'thunder': return <Zap size={20} />;
      case 'waves': return <Waves size={20} />;
      case 'wind': return <Wind size={20} />;
      case 'fire': return <Flame size={20} />;
      case 'cafe': return <Coffee size={20} />;
      case 'keyboard': return <Keyboard size={20} />;
      case 'car': return <Car size={20} />;
      case 'train': return <Train size={20} />;
      case 'library': return <BookOpen size={20} />;
      case 'pencil': return <PenTool size={20} />;
      case 'cat': return <Heart size={20} />;
      case 'bamboo': return <Trees size={20} />;
      case 'space': return <Disc size={20} />;
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

  const activeChannelsCount = channels.filter((c) => c.volume > 0 && !c.isMuted).length;

  return (
    <div className="animate-fade-in">
      {/* Category Pills & Reset Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isSel ? 'var(--border-accent)' : 'var(--border-glass)',
                  background: isSel ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSel ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isSel ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                {getTranslation(lang, cat.key)}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {getTranslation(lang, 'activeChannels')}: <strong style={{ color: 'var(--accent-cyan)' }}>{activeChannelsCount}</strong>
          </span>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {filteredChannels.map((ch) => {
          const isActive = ch.volume > 0 && !ch.isMuted;
          const isRealAudio = ch.type === 'media';
          const percent = Math.round(ch.volume * 100);

          // Estilo distintivo por tipo de audio
          const iconBg = isRealAudio
            ? (isActive ? 'var(--accent-cyan-glow)' : 'rgba(56, 189, 248, 0.08)')
            : (isActive ? 'var(--accent-purple-glow)' : 'rgba(168, 85, 247, 0.08)');

          const iconColor = isRealAudio ? 'var(--accent-cyan)' : 'var(--accent-purple)';

          const badgeBg = isRealAudio ? 'rgba(56, 189, 248, 0.12)' : 'rgba(168, 85, 247, 0.12)';
          const badgeBorder = isRealAudio ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)';
          const badgeText = isRealAudio ? 'var(--accent-cyan)' : 'var(--accent-purple)';

          return (
            <div
              key={ch.id}
              className="glass-card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: isActive
                  ? (isRealAudio ? '1px solid var(--accent-cyan)' : '1px solid var(--accent-purple)')
                  : 'var(--border-glass)',
                background: isActive
                  ? (isRealAudio ? 'rgba(22, 38, 56, 0.55)' : 'rgba(38, 22, 56, 0.55)')
                  : 'var(--bg-glass-card)',
                boxShadow: isActive
                  ? (isRealAudio ? '0 0 20px rgba(56, 189, 248, 0.18)' : '0 0 20px rgba(168, 85, 247, 0.18)')
                  : 'none',
                position: 'relative'
              }}
            >
              {/* Top Header info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: iconBg,
                      color: iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getIconComponent(ch.icon)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: isActive ? '#ffffff' : 'var(--text-main)', marginBottom: '2px' }}>
                      {getTranslation(lang, ch.nameKey as any)}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Distinción visual: Badge Audio Real vs Sintetizado por Código */}
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: badgeBg,
                          border: badgeBorder,
                          color: badgeText,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        {isRealAudio ? <Headphones size={10} /> : <Cpu size={10} />}
                        {isRealAudio
                          ? (lang === 'es' ? 'Audio HD' : 'HD Audio')
                          : (lang === 'es' ? 'Sintetizado 0KB' : 'Code Synth 0KB')
                        }
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{percent}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleMuteChannel(ch.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: ch.isMuted ? 'var(--accent-rose)' : isActive ? iconColor : 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px'
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
                  accentColor: iconColor
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
