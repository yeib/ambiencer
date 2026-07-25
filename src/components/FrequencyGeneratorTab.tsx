import React from 'react';
import { Activity, Radio, Volume2, Sparkles, Sliders, Zap, Disc } from 'lucide-react';
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

  const solfeggioPresets = [
    { freq: 432, name: '432 Hz', desc: 'Armonía Natural & Calma' },
    { freq: 528, name: '528 Hz', desc: 'Frecuencia de Milagros' },
    { freq: 639, name: '639 Hz', desc: 'Conexión & Empatía' },
    { freq: 741, name: '741 Hz', desc: 'Limpieza Mental & Foco' },
    { freq: 852, name: '852 Hz', desc: 'Intuición & Elevación' },
  ];

  const binauralPresets = [
    { beat: 2, name: 'Delta (2 Hz)', desc: 'Sueño Profundo & Regeneración' },
    { beat: 6, name: 'Theta (6 Hz)', desc: 'Meditación Profunda & R.E.M.' },
    { beat: 10, name: 'Alfa (10 Hz)', desc: 'Estado de Flujo & Estudio' },
    { beat: 18, name: 'Beta (18 Hz)', desc: 'Atención Alerta & Resolución' },
    { beat: 40, name: 'Gamma (40 Hz)', desc: 'Memoria & Procesamiento Alto' },
  ];

  const waveforms: { id: 'sine' | 'triangle' | 'sawtooth' | 'square'; name: string }[] = [
    { id: 'sine', name: 'Sinusoidal (Suave)' },
    { id: 'triangle', name: 'Triangular (Cálido)' },
    { id: 'sawtooth', name: 'Sierra (Armónicos)' },
    { id: 'square', name: 'Cuadrada (Retro)' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Activity size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
              {lang === 'es' ? 'Sintetizador de Frecuencias & Ondas Binaurales' : 'Frequency & Binaural Beat Synthesizer'}
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {lang === 'es' ? 'Genera afinaciones curativas (432Hz, 528Hz) y estímulos cerebrales con forma de onda personalizable.' : 'Generate healing tones (432Hz, 528Hz) and brainwave entrainment with customizable waveforms.'}
          </p>
        </div>

        {/* Master Toggle */}
        <button
          onClick={() => onChangeState({ enabled: !state.enabled })}
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: state.enabled ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
            color: state.enabled ? '#090b10' : '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: state.enabled ? '0 0 20px var(--accent-cyan-glow)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Radio size={18} />
          <span>{state.enabled ? (lang === 'es' ? 'Generador Activo' : 'Generator Active') : (lang === 'es' ? 'Activar Generador' : 'Activate Generator')}</span>
        </button>
      </div>

      {/* Main Grid: Controls & Presets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Left Column: Waveform & Custom Sliders */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} />
            <span>{lang === 'es' ? 'Parámetros del Generador' : 'Generator Parameters'}</span>
          </h3>

          {/* Mode Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lang === 'es' ? 'Modo de Emisión:' : 'Emission Mode:'}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => onChangeState({ mode: 'pure' })}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: state.mode === 'pure' ? 'var(--border-accent)' : 'var(--border-glass)',
                  background: state.mode === 'pure' ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.04)',
                  color: state.mode === 'pure' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {lang === 'es' ? '🎵 Frecuencia Pura' : '🎵 Pure Tone'}
              </button>
              <button
                onClick={() => onChangeState({ mode: 'binaural' })}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: state.mode === 'binaural' ? 'var(--border-accent)' : 'var(--border-glass)',
                  background: state.mode === 'binaural' ? 'var(--accent-purple-glow)' : 'rgba(255, 255, 255, 0.04)',
                  color: state.mode === 'binaural' ? 'var(--accent-purple)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {lang === 'es' ? '🎧 Ondas Binaurales' : '🎧 Binaural Beats'}
              </button>
            </div>
          </div>

          {/* Waveform Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lang === 'es' ? 'Tipo de Onda (Oscilador):' : 'Waveform Type:'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {waveforms.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onChangeState({ waveform: w.id })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: state.waveform === w.id ? 'var(--border-accent)' : 'var(--border-glass)',
                    background: state.waveform === w.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: state.waveform === w.id ? 'var(--accent-cyan)' : 'var(--text-main)',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {/* Carrier Frequency Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{lang === 'es' ? 'Frecuencia Portadora (Hz):' : 'Carrier Frequency (Hz):'}</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{state.carrierFreq} Hz</strong>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="1"
              value={state.carrierFreq}
              onChange={(e) => onChangeState({ carrierFreq: parseFloat(e.target.value) })}
            />
          </div>

          {/* Binaural Beat Slider (If Binaural mode) */}
          {state.mode === 'binaural' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{lang === 'es' ? 'Diferencia Binaural (Hz):' : 'Binaural Beat (Hz):'}</span>
                <strong style={{ color: 'var(--accent-purple)' }}>+{state.beatFreq} Hz</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="40"
                step="0.5"
                value={state.beatFreq}
                onChange={(e) => onChangeState({ beatFreq: parseFloat(e.target.value) })}
              />
            </div>
          )}

          {/* Volume Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{lang === 'es' ? 'Volumen del Sintetizador:' : 'Synthesizer Volume:'}</span>
              <span>{Math.round(state.volume * 100)}%</span>
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

        {/* Right Column: Solfeggio & Brainwave Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Solfeggio Healing Frequencies */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              <span>{lang === 'es' ? 'Frecuencias Solfeggio Curativas' : 'Solfeggio Healing Tones'}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {solfeggioPresets.map((p) => (
                <button
                  key={p.freq}
                  onClick={() => onChangeState({ carrierFreq: p.freq, enabled: true })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: state.carrierFreq === p.freq ? 'var(--border-accent)' : 'var(--border-glass)',
                    background: state.carrierFreq === p.freq ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                  className="glass-card"
                >
                  <strong style={{ color: 'var(--accent-amber)' }}>{p.name}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brainwave Binaural Presets */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Disc size={16} />
              <span>{lang === 'es' ? 'Ondas Cerebrales Binaurales' : 'Brainwave Entrainment'}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {binauralPresets.map((b) => (
                <button
                  key={b.beat}
                  onClick={() => onChangeState({ mode: 'binaural', beatFreq: b.beat, enabled: true })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: state.beatFreq === b.beat && state.mode === 'binaural' ? 'var(--border-accent)' : 'var(--border-glass)',
                    background: state.beatFreq === b.beat && state.mode === 'binaural' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                  className="glass-card"
                >
                  <strong style={{ color: 'var(--accent-purple)' }}>{b.name}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{b.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
