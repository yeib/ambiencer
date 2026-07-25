import React from 'react';
import { Sparkles, CloudRain, Coffee, Waves, Brain, Moon, Play } from 'lucide-react';
import { FocusPreset, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface FocusPresetsProps {
  presets: FocusPreset[];
  settings: AppSettings;
  onApplyPreset: (preset: FocusPreset) => void;
}

export const FocusPresets: React.FC<FocusPresetsProps> = ({ presets, settings, onApplyPreset }) => {
  const lang = settings.language;

  const getPresetIcon = (icon: string) => {
    switch (icon) {
      case 'rain': return <CloudRain size={28} />;
      case 'cafe': return <Coffee size={28} />;
      case 'waves': return <Waves size={28} />;
      case 'brain': return <Brain size={28} />;
      case 'moon': return <Moon size={28} />;
      default: return <Sparkles size={28} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
          ⚡ {getTranslation(lang, 'tabPresets')}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {lang === 'es' ? 'Selecciona una atmósfera prediseñada para entrar instantáneamente en estado de flujo.' : 'Select a pre-designed soundscape atmosphere to immediately enter a flow state.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(22, 30, 48, 0.6) 0%, rgba(12, 16, 26, 0.7) 100%)'
            }}
          >
            {/* Top Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-cyan-glow)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
              }}>
                {getPresetIcon(preset.icon)}
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--accent-cyan)',
                border: 'var(--border-glass)'
              }}>
                {preset.badge}
              </span>
            </div>

            {/* Info */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                {getTranslation(lang, preset.nameKey as any)}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {getTranslation(lang, preset.descKey as any)}
              </p>
            </div>

            {/* Activate Button */}
            <button
              onClick={() => onApplyPreset(preset)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--accent-cyan)',
                color: '#090b10',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 16px var(--accent-cyan-glow)',
                transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Play size={16} fill="currentColor" />
              <span>{lang === 'es' ? 'Activar Preset' : 'Apply Preset'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
