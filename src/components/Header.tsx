import React from 'react';
import { Play, Pause, Volume2, VolumeX, Timer, Command, Globe, Settings, Waves } from 'lucide-react';
import { VisualizerCanvas } from './VisualizerCanvas';
import { getTranslation } from '../i18n';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  isPlaying: boolean;
  activeSleepTimer: number | null; // minutes remaining
  onTogglePlay: () => void;
  onMasterVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenOmnibar: () => void;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
  onSetSleepTimer: (minutes: number | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isPlaying,
  activeSleepTimer,
  onTogglePlay,
  onMasterVolumeChange,
  onToggleMute,
  onOpenOmnibar,
  onToggleLanguage,
  onOpenSettings,
  onSetSleepTimer,
}) => {
  const lang = settings.language;

  return (
    <header className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-[#38bdf8, #a855f7]',
          backgroundImage: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
        }}>
          <Waves size={24} color="#ffffff" className={isPlaying ? 'pulse-glow' : ''} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
            {getTranslation(lang, 'appTitle')}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {getTranslation(lang, 'appSubtitle')}
          </p>
        </div>
      </div>

      {/* Center: Audio Controls & Visualizer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.25)', padding: '8px 18px', borderRadius: 'var(--radius-full)', border: 'var(--border-glass)' }}>
        <button
          onClick={onTogglePlay}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: isPlaying ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
            color: isPlaying ? '#090b10' : '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isPlaying ? '0 0 12px var(--accent-cyan)' : 'none',
            transition: 'all 0.2s'
          }}
          title={isPlaying ? getTranslation(lang, 'masterPause') : getTranslation(lang, 'masterPlay')}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />}
        </button>

        {/* Master Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px' }}>
          <button
            onClick={onToggleMute}
            style={{ background: 'none', border: 'none', color: settings.isMuted ? 'var(--accent-rose)' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            {settings.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.isMuted ? 0 : settings.masterVolume}
            onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
          />
        </div>

        {/* Live Spectrum Visualizer */}
        <VisualizerCanvas isPlaying={isPlaying} accentColor={settings.themeAccent} />

        {/* Sleep Timer */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Timer size={16} color="var(--text-muted)" />
          <select
            value={activeSleepTimer || ''}
            onChange={(e) => onSetSleepTimer(e.target.value ? parseInt(e.target.value) : null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeSleepTimer ? 'var(--accent-amber)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" style={{ background: '#121826' }}>⏱️ {getTranslation(lang, 'sleepTimer')}</option>
            <option value="15" style={{ background: '#121826' }}>15 {getTranslation(lang, 'min')}</option>
            <option value="30" style={{ background: '#121826' }}>30 {getTranslation(lang, 'min')}</option>
            <option value="45" style={{ background: '#121826' }}>45 {getTranslation(lang, 'min')}</option>
            <option value="60" style={{ background: '#121826' }}>60 {getTranslation(lang, 'min')}</option>
            <option value="120" style={{ background: '#121826' }}>120 {getTranslation(lang, 'min')}</option>
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Omnibar Button */}
        <button
          onClick={onOpenOmnibar}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s'
          }}
          className="glass-card"
        >
          <Command size={14} />
          <span>/ (Ctrl+Space)</span>
        </button>

        {/* Language Switch */}
        <button
          onClick={onToggleLanguage}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <Globe size={14} />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
