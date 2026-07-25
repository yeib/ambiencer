import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, CloudRain, Zap, Waves, Wind, Flame, Coffee, Keyboard, Radio, Disc } from 'lucide-react';
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
      case 'rain': return <CloudRain size={22} />;
      case 'thunder': return <Zap size={22} />;
      case 'waves': return <Waves size={22} />;
      case 'wind': return <Wind size={22} />;
      case 'fire': return <Flame size={22} />;
      case 'cafe': return <Coffee size={22} />;
      case 'keyboard': return <Keyboard size={22} />;
      case 'radio': return <Radio size={22} />;
      default: return <Disc size={22} />;
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {filteredChannels.map((ch) => {
          const isActive = ch.volume > 0 && !ch.isMuted;
          const percent = Math.round(ch.volume * 100);

          return (
            <div
              key={ch.id}
              className="glass-card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: isActive ? 'var(--border-accent)' : 'var(--border-glass)',
                background: isActive ? 'rgba(38, 50, 78, 0.45)' : 'var(--bg-glass-card)',
                boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isActive ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getIconComponent(ch.icon)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: isActive ? '#ffffff' : 'var(--text-main)' }}>
                      {getTranslation(lang, ch.nameKey as any)}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{percent}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleMuteChannel(ch.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: ch.isMuted ? 'var(--accent-rose)' : isActive ? 'var(--accent-cyan)' : 'var(--text-dim)',
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
