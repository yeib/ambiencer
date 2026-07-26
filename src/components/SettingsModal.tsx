import React from 'react';
import { Globe, Palette, Volume2, Monitor, Check } from 'lucide-react';
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

  const accentColors = [
    { hex: '#38bdf8', key: 'colorCyan' },
    { hex: '#a855f7', key: 'colorPurple' },
    { hex: '#fbbf24', key: 'colorAmber' },
    { hex: '#4ade80', key: 'colorEmerald' },
    { hex: '#f43f5e', key: 'colorRose' },
  ];

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Language Selection */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--accent-cyan)" />
            <span>{getTranslation(lang, 'settingsLang')}</span>
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onUpdateSettings({ language: 'es' })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: settings.language === 'es' ? 'var(--border-accent)' : 'var(--border-glass)',
                background: settings.language === 'es' ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.03)',
                color: settings.language === 'es' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>🇪🇸 Español</span>
              {settings.language === 'es' && <Check size={16} />}
            </button>

            <button
              onClick={() => onUpdateSettings({ language: 'en' })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: settings.language === 'en' ? 'var(--border-accent)' : 'var(--border-glass)',
                background: settings.language === 'en' ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.03)',
                color: settings.language === 'en' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>🇺🇸 English</span>
              {settings.language === 'en' && <Check size={16} />}
            </button>
          </div>
        </div>

        {/* UI Theme Accent Color */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} color="var(--accent-purple)" />
            <span>{getTranslation(lang, 'settingsAccent')}</span>
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {accentColors.map((col) => {
              const isSelected = settings.themeAccent === col.hex;
              const colorLabel = getTranslation(lang, col.key as any);
              return (
                <button
                  key={col.hex}
                  onClick={() => onUpdateSettings({ themeAccent: col.hex })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? `2px solid ${col.hex}` : 'var(--border-glass)',
                    background: isSelected ? `${col.hex}22` : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: col.hex, display: 'inline-block' }} />
                  <span>{colorLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray Settings (Minimize to Tray & Close to Tray) */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={18} color="var(--accent-cyan)" />
            <span>{getTranslation(lang, 'settingsTrayHeader')}</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Minimize to Tray */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                  {getTranslation(lang, 'settingsMinimizeToTray')}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {lang === 'es' ? 'Al minimizar la ventana, se oculta en la bandeja al lado del reloj' : 'When minimizing, hide window into the tray next to clock'}
                </div>
              </div>

              <button
                onClick={() => onUpdateSettings({ minimizeToTray: !settings.minimizeToTray })}
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  border: 'none',
                  background: settings.minimizeToTray ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: '3px',
                    left: settings.minimizeToTray ? '25px' : '3px',
                    transition: 'left 0.2s'
                  }}
                />
              </button>
            </div>

            {/* Close to Tray */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                  {getTranslation(lang, 'settingsCloseToTray')}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {lang === 'es' ? 'Al hacer clic en X, la app sigue sonando en segundo plano en la bandeja' : 'Clicking X keeps app running and playing in the tray'}
                </div>
              </div>

              <button
                onClick={() => onUpdateSettings({ closeToTray: !settings.closeToTray })}
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  border: 'none',
                  background: settings.closeToTray ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: '3px',
                    left: settings.closeToTray ? '25px' : '3px',
                    transition: 'left 0.2s'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Audio Engine Quality */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={18} color="var(--accent-amber)" />
            <span>{getTranslation(lang, 'settingsAudio')}</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                {getTranslation(lang, 'settingsHighQuality')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {lang === 'es' ? 'Procesamiento de 24-bit a 48kHz con baja latencia WebAudio' : '24-bit 48kHz processing with low latency WebAudio'}
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ highQualityAudio: !settings.highQualityAudio })}
              style={{
                width: '48px',
                height: '26px',
                borderRadius: '13px',
                border: 'none',
                background: settings.highQualityAudio ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.highQualityAudio ? '25px' : '3px',
                  transition: 'left 0.2s'
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
