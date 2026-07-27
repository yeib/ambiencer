import React from 'react';
import { Activity, Radio, Volume2, Sparkles, Sliders, Zap } from 'lucide-react';
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
    { freq: 174, name: '174 Hz', labelEs: 'Alivio del Dolor', labelEn: 'Pain Relief' },
    { freq: 432, name: '432 Hz', labelEs: 'Frecuencia Universal Zen', labelEn: 'Universal Natural' },
    { freq: 528, name: '528 Hz', labelEs: 'Frecuencia Milagrosa (ADN)', labelEn: 'Miracle Frequency' },
    { freq: 639, name: '639 Hz', labelEs: 'Conexión & Chakras', labelEn: 'Chakras & Connection' },
    { freq: 741, name: '741 Hz', labelEs: 'Limpieza & Intuición', labelEn: 'Detox & Intuition' },
    { freq: 852, name: '852 Hz', labelEs: 'Despertar Espiritual', labelEn: 'Spiritual Awakening' },
  ];

  const brainwavePresets = [
    { beat: 2.5, name: 'Delta (2.5 Hz)', descEs: 'Sueño Profundo & Regeneración', descEn: 'Deep Sleep & Healing' },
    { beat: 6.0, name: 'Theta (6.0 Hz)', descEs: 'Meditación & Memoria', descEn: 'Meditation & Memory' },
    { beat: 10.0, name: 'Alfa (10.0 Hz)', descEs: 'Enfoque & Calma', descEn: 'Relaxed Focus & Study' },
    { beat: 20.0, name: 'Beta (20.0 Hz)', descEs: 'Concentración Activa', descEn: 'Active Cognition' },
    { beat: 40.0, name: 'Gamma (40.0 Hz)', descEs: 'Alto Rendimiento Mental', descEn: 'Peak Performance' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            🔮 Sintetizador de Frecuencias Solfeggio & Pulsos Binaurales
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {lang === 'es'
              ? 'Generador de precisión en tiempo real de ondas binaurales, formas de onda y frecuencias sagradas.'
              : 'Real-time precision generator of binaural beats, custom waveforms, and Solfeggio frequencies.'}
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
          <span>1. Frecuencias Sagradas Solfeggio (Portadora Base)</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
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

      {/* Mode & Waveform Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Mode Selector */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} />
            <span>2. Modo de Generación</span>
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onChangeState({ mode: 'pure' })}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: state.mode === 'pure' ? 'var(--border-accent)' : 'var(--border-glass)',
                background: state.mode === 'pure' ? 'var(--accent-cyan-glow)' : 'transparent',
                color: state.mode === 'pure' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '0.82rem',
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
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: state.mode === 'binaural' ? '1px solid var(--accent-purple)' : 'var(--border-glass)',
                background: state.mode === 'binaural' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                color: state.mode === 'binaural' ? 'var(--accent-purple)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Pulsos Binaurales
            </button>
          </div>
        </div>

        {/* Waveform Selector */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            3. Forma de Onda (Waveform)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {(['sine', 'triangle', 'sawtooth', 'square'] as const).map((wave) => (
              <button
                key={wave}
                onClick={() => onChangeState({ waveform: wave })}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  border: state.waveform === wave ? '1px solid var(--accent-cyan)' : 'var(--border-glass)',
                  background: state.waveform === wave ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: state.waveform === wave ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: state.waveform === wave ? 700 : 400,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {wave === 'sine' ? 'Seno' : wave === 'triangle' ? 'Triángulo' : wave === 'sawtooth' ? 'Sierra' : 'Cuadrada'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Binaural Beat Control Panel (Only active when mode === 'binaural') */}
      {state.mode === 'binaural' && (
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} />
              <span>4. Frecuencia de Desfase Binaural (Ondas Cerebrales)</span>
            </h3>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{state.beatFreq.toFixed(1)} Hz</span>
          </div>

          {/* Quick Brainwave Presets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
            {brainwavePresets.map((b) => {
              const isSelected = Math.abs(state.beatFreq - b.beat) < 0.1;
              return (
                <button
                  key={b.beat}
                  onClick={() => onChangeState({ beatFreq: b.beat })}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1px solid var(--accent-purple)' : 'var(--border-glass)',
                    background: isSelected ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--accent-purple)' : 'var(--text-main)' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                    {lang === 'es' ? b.descEs : b.descEn}
                  </div>
                </button>
              );
            })}
          </div>

          <input
            type="range"
            min="0.5"
            max="40"
            step="0.5"
            value={state.beatFreq}
            onChange={(e) => onChangeState({ beatFreq: parseFloat(e.target.value) })}
            style={{ accentColor: 'var(--accent-purple)' }}
          />
        </div>
      )}

      {/* Sliders Grid (Carrier Frequency & Volume & Lowpass Filter) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Carrier Frequency Slider */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Frecuencia Portadora Manual</h3>
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

        {/* Lowpass Filter Smooth Cutoff */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Filtro Paso Bajo (Suavizado)</h3>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{state.smoothFilter} Hz</span>
          </div>
          <input
            type="range"
            min="200"
            max="4000"
            step="50"
            value={state.smoothFilter}
            onChange={(e) => onChangeState({ smoothFilter: parseInt(e.target.value) })}
            style={{ accentColor: 'var(--accent-amber)' }}
          />
        </div>
      </div>
    </div>
  );
};
