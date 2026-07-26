import React, { useState } from 'react';
import { Play, Sparkles, CloudRain, Coffee, Waves, Brain, Moon, Trash2, Star, ShieldCheck } from 'lucide-react';
import { FocusPreset, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface FocusPresetsProps {
  presets: FocusPreset[];
  settings: AppSettings;
  onApplyPreset: (preset: FocusPreset) => void;
  onDeleteCustomPreset?: (id: string) => void;
}

export const FocusPresets: React.FC<FocusPresetsProps> = ({
  presets,
  settings,
  onApplyPreset,
  onDeleteCustomPreset,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'system' | 'custom'>('all');
  const lang = settings.language;

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles size={24} />;
      case 'rain': return <CloudRain size={24} />;
      case 'cafe': return <Coffee size={24} />;
      case 'waves': return <Waves size={24} />;
      case 'brain': return <Brain size={24} />;
      case 'moon': return <Moon size={24} />;
      case 'star': return <Star size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  const filteredPresets = presets.filter((p) => {
    if (filterCategory === 'system') return !p.isCustom;
    if (filterCategory === 'custom') return p.isCustom;
    return true; // 'all'
  });

  const customCount = presets.filter(p => p.isCustom).length;
  const systemCount = presets.filter(p => !p.isCustom).length;

  return (
    <div className="animate-fade-in">
      {/* Category Pills & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            ✨ {lang === 'es' ? 'Presets de Enfoque & Personalizados' : 'Focus & Custom Presets'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {lang === 'es'
              ? 'Mezclas prediseñadas y tus propias combinaciones personalizadas guardadas.'
              : 'Pre-designed soundscapes and your saved custom mixes.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilterCategory('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: filterCategory === 'all' ? 'var(--border-accent)' : 'var(--border-glass)',
              background: filterCategory === 'all' ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.04)',
              color: filterCategory === 'all' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: filterCategory === 'all' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            {lang === 'es' ? `Todos (${presets.length})` : `All (${presets.length})`}
          </button>

          <button
            onClick={() => setFilterCategory('system')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: filterCategory === 'system' ? 'var(--border-accent)' : 'var(--border-glass)',
              background: filterCategory === 'system' ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.04)',
              color: filterCategory === 'system' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: filterCategory === 'system' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            {lang === 'es' ? `Sistema (${systemCount})` : `System (${systemCount})`}
          </button>

          <button
            onClick={() => setFilterCategory('custom')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: filterCategory === 'custom' ? '1px solid var(--accent-amber)' : 'var(--border-glass)',
              background: filterCategory === 'custom' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: filterCategory === 'custom' ? 'var(--accent-amber)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: filterCategory === 'custom' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            ⭐ {lang === 'es' ? `Mis Presets (${customCount})` : `My Presets (${customCount})`}
          </button>
        </div>
      </div>

      {/* Grid of Presets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredPresets.map((preset) => {
          const isCustom = preset.isCustom;
          const name = isCustom ? preset.nameKey : getTranslation(lang, preset.nameKey as any);
          const desc = isCustom
            ? (preset.descKey || `${Object.keys(preset.volumes).length} ${lang === 'es' ? 'canales configurados' : 'channels configured'}`)
            : getTranslation(lang, preset.descKey as any);

          return (
            <div
              key={preset.id}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                border: isCustom ? '1px solid var(--accent-amber)' : 'var(--border-glass)',
                background: isCustom ? 'rgba(38, 30, 22, 0.55)' : 'var(--bg-glass-card)',
                boxShadow: isCustom ? '0 0 20px rgba(251, 191, 36, 0.12)' : 'none',
                position: 'relative'
              }}
            >
              {/* Badge & Top Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: isCustom ? 'rgba(251, 191, 36, 0.15)' : 'var(--accent-cyan-glow)',
                      color: isCustom ? 'var(--accent-amber)' : 'var(--accent-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getPresetIcon(preset.icon)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: isCustom ? 'rgba(251, 191, 36, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        border: isCustom ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                        color: isCustom ? 'var(--accent-amber)' : 'var(--accent-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isCustom ? <Star size={11} fill="currentColor" /> : <ShieldCheck size={11} />}
                      {preset.badge}
                    </span>

                    {/* Delete Custom Preset Button */}
                    {isCustom && onDeleteCustomPreset && (
                      <button
                        onClick={() => onDeleteCustomPreset(preset.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-rose)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={lang === 'es' ? 'Eliminar preset' : 'Delete preset'}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  {name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {desc}
                </p>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: 'var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {Object.keys(preset.volumes).length} {lang === 'es' ? 'canales' : 'channels'}
                </span>

                <button
                  onClick={() => onApplyPreset(preset)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isCustom ? 'var(--accent-amber)' : 'var(--accent-cyan)',
                    color: '#090b10',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isCustom ? '0 0 14px rgba(251, 191, 36, 0.3)' : '0 0 14px rgba(56, 189, 248, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Play size={14} fill="currentColor" />
                  <span>{lang === 'es' ? 'Cargar Preset' : 'Load Preset'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
