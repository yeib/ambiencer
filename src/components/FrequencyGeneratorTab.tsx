import React from 'react';
import { Activity, Radio, Volume2, Sparkles } from 'lucide-react';
import { FrequencyGeneratorState, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface FrequencyGeneratorTabProps {
  settings: AppSettings;
  state: FrequencyGeneratorState;
  onChangeState: (newState: Partial<FrequencyGeneratorState>) => void;
}

export const FrequencyGeneratorTab: React.FC<FrequencyGeneratorTabProps> = ({
  settings,
  state,
  onChangeState,
}) => {
  const lang = settings.language;

  const solfeggioFrequencies = [
    { freq: 174, name: '174 Hz', labelEs: 'Alivio del Dolor & Conexión', labelEn: 'Pain Relief & Grounding' },
    { freq: 432, name: '432 Hz', labelEs: 'Frecuencia Universal Zen', labelEn: 'Universal Natural Frequency' },
    { freq: 528, name: '528 Hz', labelEs: 'Frecuencia Milagrosa (ADN)', labelEn: 'Miracle Frequency (DNA Repair)' },
    { freq: 639, name: '639 Hz', labelEs: 'Conexión Armónica & Chakras', labelEn: 'Harmonic Connection & Chakras' },
    { freq: 741, name: '741 Hz', labelEs: 'Limpieza Mental & Intuición', labelEn: 'Mental Detox & Intuition' },
    { freq: 852, name: '852 Hz', labelEs: 'Despertar Espiritual & Orden', labelEn: 'Spiritual Awakening' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            🔮 Frecuencias Curativas Solfeggio & Pulsos Binaurales
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {lang === 'es'
              ? 'Sintetizador de frecuencias armónicas (432Hz/528Hz) y ondas cerebrales para Meditación, Yoga y Sanación Sonora.'
              : 'Harmonic frequency synthesizer (432Hz/528Hz) and brainwave generator for Yoga, Meditation and Sound Healing.'}
          </p>
        </div>

        {/* Master Power Toggle */}
        <button
          onClick={() => onChangeState({ enabled: !state.enabled })}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            border: state.enabled ? '1px solid var(--accent-purple)' : 'var(--border-glass)',
            background: state.enabled ? 'var(--accent-purple-glow)' : 'rgba(255, 255, 255, 0.05)',
            color: state.enabled ? 'var(--accent-purple)' : 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: state.enabled ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={16} />
          <span>{state.enabled ? (lang === 'es' ? 'Sintetizador Activo' : 'Synth Active') : (lang === 'es' ? 'Activar Frecuencias' : 'Enable Frequencies')}</span>
        </button>
      </div>

      {/* Quick Solfeggio Healing Frequencies Pills */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} />
          <span>Frecuencias Sagradas Solfeggio (Selección Rápida Yoga / Meditación)</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {solfeggioFrequencies.map((f) => {
            const isSelected = state.carrierFreq === f.freq && state.enabled;
            return (
              <button
                key={f.freq}
                onClick={() => onChangeState({ carrierFreq: f.freq, enabled: true })}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--accent-purple)' : 'var(--border-glass)',
                  background: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? 'var(--accent-purple)' : 'var(--text-main)' }}>
                  {f.name}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  {lang === 'es' ? f.labelEs : f.labelEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Mode Selector */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Modo de Frecuencia</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onChangeState({ mode: 'pure' })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: state.mode === 'pure' ? 'var(--border-accent)' : 'var(--border-glass)',
                background: state.mode === 'pure' ? 'var(--accent-cyan-glow)' : 'transparent',
                color: state.mode === 'pure' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Frecuencia Pura
            </button>
            <button
              onClick={() => onChangeState({ mode: 'binaural' })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: state.mode === 'binaural' ? '1px solid var(--accent-purple)' : 'var(--border-glass)',
                background: state.mode === 'binaural' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                color: state.mode === 'binaural' ? 'var(--accent-purple)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Pulsos Binaurales
            </button>
          </div>
        </div>

        {/* Carrier Frequency Slider */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Frecuencia Portadora</h3>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{state.carrierFreq} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="963"
            step="1"
            value={state.carrierFreq}
            onChange={(e) => onChangeState({ carrierFreq: parseInt(e.target.value) })}
          />
        </div>

        {/* Volume */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Volumen de Frecuencia</h3>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{Math.round(state.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.volume}
            onChange={(e) => onChangeState({ volume: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
};
