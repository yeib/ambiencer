import React from 'react';
import { Settings, X, Globe, Volume2, ShieldCheck, Zap } from 'lucide-react';
import { AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const lang = settings.language;

  const colors = [
    { name: 'Cyan Space', hex: '#38bdf8' },
    { name: 'Purple Nebula', hex: '#a855f7' },
    { name: 'Emerald Forest', hex: '#34d399' },
    { name: 'Amber Sunset', hex: '#fbbf24' },
    { name: 'Rose Quartz', hex: '#f43f5e' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '90%',
          maxWidth: '500px',
          padding: '24px',
          background: 'rgba(18, 24, 38, 0.92)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          border: 'var(--border-glass-bright)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'var(--border-glass)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {getTranslation(lang, 'settingsGeneral')}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Settings Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Globe size={16} color="var(--text-muted)" />
              <span>{getTranslation(lang, 'settingsLang')}</span>
            </div>
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ language: e.target.value as 'es' | 'en' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: 'var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '6px 12px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="es" style={{ background: '#121826' }}>Español (ES)</option>
              <option value="en" style={{ background: '#121826' }}>English (EN)</option>
            </select>
          </div>

          {/* Accent Color */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Zap size={16} color="var(--text-muted)" />
              <span>{getTranslation(lang, 'settingsAccent')}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onUpdateSettings({ themeAccent: c.hex })}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: c.hex,
                    border: settings.themeAccent === c.hex ? '2px solid #ffffff' : 'none',
                    boxShadow: settings.themeAccent === c.hex ? `0 0 10px ${c.hex}` : 'none',
                    cursor: 'pointer'
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Audio Engine */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Volume2 size={16} color="var(--text-muted)" />
              <span>{getTranslation(lang, 'settingsHighQuality')}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.highQualityAudio}
              onChange={(e) => onUpdateSettings({ highQualityAudio: e.target.checked })}
              style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
          </div>

          {/* Ecosystem Banner */}
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: 'var(--border-accent)', borderRadius: 'var(--radius-sm)', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="var(--accent-cyan)" />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <strong>Yeib Ecosystem — Native Windows App</strong><br />
              100% Offline, Privacy First, Zero cloud tracking.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
