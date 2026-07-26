import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { AppSettings } from '../../types';

interface BreathworkWidgetProps {
  settings: AppSettings;
}

type Mode = '4-7-8' | 'box' | 'coherence';
type Phase = 'Inhale' | 'Hold' | 'Exhale' | 'Hold2';

export const BreathworkWidget: React.FC<BreathworkWidgetProps> = ({ settings }) => {
  const [mode, setMode] = useState<Mode>('4-7-8');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('Inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [scale, setScale] = useState(1);

  const lang = settings.language;

  const getPhaseText = () => {
    switch (phase) {
      case 'Inhale': return lang === 'es' ? '🌬️ Inhala...' : '🌬️ Inhale...';
      case 'Hold':
      case 'Hold2': return lang === 'es' ? '🧘 Mantén...' : '🧘 Hold...';
      case 'Exhale': return lang === 'es' ? '💨 Exhala...' : '💨 Exhale...';
    }
  };

  useEffect(() => {
    if (!isActive) {
      setScale(1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Advance phase
        if (mode === '4-7-8') {
          if (phase === 'Inhale') {
            setPhase('Hold');
            setScale(1.4);
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            setScale(0.8);
            return 8;
          } else {
            setPhase('Inhale');
            setScale(1.4);
            return 4;
          }
        } else if (mode === 'box') {
          if (phase === 'Inhale') {
            setPhase('Hold');
            setScale(1.4);
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            setScale(0.8);
            return 4;
          } else if (phase === 'Exhale') {
            setPhase('Hold2');
            setScale(0.8);
            return 4;
          } else {
            setPhase('Inhale');
            setScale(1.4);
            return 4;
          }
        } else {
          // Coherence 5-5
          if (phase === 'Inhale') {
            setPhase('Exhale');
            setScale(0.8);
            return 5;
          } else {
            setPhase('Inhale');
            setScale(1.4);
            return 5;
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, mode]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('Inhale');
    setTimeLeft(mode === '4-7-8' ? 4 : mode === 'box' ? 4 : 5);
    setScale(1.4);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setTimeLeft(4);
    setScale(1);
  };

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: '6px', width: '100%', justifyContent: 'center' }}>
        {(['4-7-8', 'box', 'coherence'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); handleReset(); }}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: mode === m ? '1px solid var(--accent-cyan)' : 'var(--border-glass)',
              background: mode === m ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: mode === m ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: mode === m ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            {m === '4-7-8' ? 'Relax 4-7-8' : m === 'box' ? 'Box 4x4' : 'Coherencia 5-5'}
          </button>
        ))}
      </div>

      {/* Animated Glowing Breathing Circle */}
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(168, 85, 247, 0.1) 70%, transparent 100%)',
            border: '2px solid var(--accent-cyan)',
            boxShadow: isActive ? '0 0 30px rgba(56, 189, 248, 0.5)' : 'none',
            transform: `scale(${scale})`,
            transition: 'transform 4s ease-in-out, box-shadow 0.5s'
          }}
        />

        <div style={{ zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            {isActive ? timeLeft : <Wind size={28} color="var(--accent-cyan)" />}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '2px' }}>
            {isActive ? getPhaseText() : (lang === 'es' ? 'Respiración' : 'Breathwork')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={isActive ? () => setIsActive(false) : handleStart}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: isActive ? 'var(--accent-amber)' : 'var(--accent-cyan)',
            color: '#090b10',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          <span>{isActive ? (lang === 'es' ? 'Pausar' : 'Pause') : (lang === 'es' ? 'Iniciar' : 'Start')}</span>
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-glass)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};
