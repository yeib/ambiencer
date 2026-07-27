import React from 'react';
import { Play, Pause, Volume2, VolumeX, Timer } from 'lucide-react';
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
  onSetSleepTimer: (minutes: number | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isPlaying,
  activeSleepTimer,
  onTogglePlay,
  onMasterVolumeChange,
  onToggleMute,
  onSetSleepTimer,
}) => {
  const lang = settings.language;

  return (
    <header
      className="glass-panel"
      style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '16px',
        minHeight: '68px',
        height: 'auto',
        flexWrap: 'wrap',
        boxSizing: 'border-box'
      }}
    >
      {/* Brand & Official Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="Ambiencer Logo"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))'
          }}
        />
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#ffffff', lineHeight: 1.1 }}>
            {getTranslation(lang, 'appTitle')}
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {getTranslation(lang, 'appSubtitle')}
          </p>
        </div>
      </div>

      {/* Audio Controls Dock: Responsive, Clean & Uncluttered */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          border: 'var(--border-glass)',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}
      >
        {/* Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: isPlaying ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
            color: isPlaying ? '#090b10' : '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isPlaying ? '0 0 14px var(--accent-cyan)' : 'none',
            transition: 'all 0.2s'
          }}
          title={isPlaying ? getTranslation(lang, 'masterPause') : getTranslation(lang, 'masterPlay')}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />}
        </button>

        {/* Separator Line */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Master Volume Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100px', flexShrink: 0 }}>
          <button
            onClick={onToggleMute}
            style={{ background: 'none', border: 'none', color: settings.isMuted ? 'var(--accent-rose)' : 'var(--text-muted)', cursor: 'pointer', padding: 0, flexShrink: 0 }}
          >
            {settings.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.isMuted ? 0 : settings.masterVolume}
            onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
            style={{ width: '70px', flexShrink: 0 }}
          />
        </div>

        {/* Separator Line */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Live Spectrum Visualizer */}
        <div style={{ width: '75px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <VisualizerCanvas isPlaying={isPlaying} accentColor={settings.themeAccent} />
        </div>

        {/* Separator Line */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Sleep Timer Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '110px', flexShrink: 0 }}>
          <Timer size={14} color={activeSleepTimer ? 'var(--accent-amber)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
          <select
            value={activeSleepTimer || ''}
            onChange={(e) => onSetSleepTimer(e.target.value ? parseInt(e.target.value) : null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeSleepTimer ? 'var(--accent-amber)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              outline: 'none',
              width: '90px',
              fontWeight: 500
            }}
          >
            <option value="" style={{ background: '#121826' }}>{getTranslation(lang, 'sleepTimer')}</option>
            <option value="15" style={{ background: '#121826' }}>15 {getTranslation(lang, 'min')}</option>
            <option value="30" style={{ background: '#121826' }}>30 {getTranslation(lang, 'min')}</option>
            <option value="45" style={{ background: '#121826' }}>45 {getTranslation(lang, 'min')}</option>
            <option value="60" style={{ background: '#121826' }}>60 {getTranslation(lang, 'min')}</option>
            <option value="120" style={{ background: '#121826' }}>120 {getTranslation(lang, 'min')}</option>
          </select>
        </div>
      </div>
    </header>
  );
};
