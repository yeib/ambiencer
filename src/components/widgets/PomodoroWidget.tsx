import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';
import { AppSettings } from '../../types';
import { getTranslation } from '../../i18n';

interface PomodoroWidgetProps {
  settings: AppSettings;
}

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({ settings }) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const lang = settings.language;

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px'
      }}
    >
      {/* Header Mode Switch */}
      <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
        <button
          onClick={() => switchMode('work')}
          style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: mode === 'work' ? 'var(--accent-cyan)' : 'transparent',
            color: mode === 'work' ? '#090b10' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {getTranslation(lang, 'pomodoroWork')}
        </button>
        <button
          onClick={() => switchMode('break')}
          style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: mode === 'break' ? 'var(--accent-emerald)' : 'transparent',
            color: mode === 'break' ? '#090b10' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {getTranslation(lang, 'pomodoroBreak')}
        </button>
      </div>

      {/* Progress Ring */}
      <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" fill="transparent" />
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={mode === 'work' ? 'var(--accent-cyan)' : 'var(--accent-emerald)'}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff' }}>
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      {/* Play/Pause/Reset Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={toggleTimer}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: isActive ? 'var(--accent-amber)' : 'var(--accent-cyan)',
            color: '#090b10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />}
        </button>
        <button
          onClick={resetTimer}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'var(--border-glass)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};
