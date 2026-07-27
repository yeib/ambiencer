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

const ToggleRow: React.FC<{
  label: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}> = ({ label, desc, checked, onToggle }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{label}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
    </div>
    <button
      onClick={onToggle}
      style={{
        width: '48px',
        height: '26px',
        borderRadius: '13px',
        border: 'none',
        background: checked ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
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
          left: checked ? '25px' : '3px',
          transition: 'left 0.2s',
        }}
      />
    </button>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const lang = settings.language;

  const handleToggleStartWithWindows = () => {
    const nextVal = !settings.startWithWindows;
    onUpdateSettings({ startWithWindows: nextVal });
    import('@tauri-apps/api/core').then(({ invoke }) => {
      invoke('set_start_with_windows', { enabled: nextVal }).catch(console.error);
    });
  };

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
                borderRadius: 'var(--radius-md)',
                border: lang === 'es' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                background: lang === 'es' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Español
            </button>
            <button
              onClick={() => onUpdateSettings({ language: 'en' })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: lang === 'en' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                background: lang === 'en' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              English
            </button>
          </div>
        </div>

        {/* Theme Accent Selection */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} color="var(--accent-purple)" />
            <span>{getTranslation(lang, 'settingsAccent')}</span>
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {accentColors.map((color) => {
              const isSelected = settings.themeAccent === color.hex;
              return (
                <button
                  key={color.hex}
                  onClick={() => onUpdateSettings({ themeAccent: color.hex })}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: color.hex,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected ? `0 0 16px ${color.hex}` : 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {isSelected && <Check size={20} color="#000000" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray Settings & Auto Start */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={18} color="var(--accent-cyan)" />
            <span>{getTranslation(lang, 'settingsTrayHeader')}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <ToggleRow
              label={lang === 'es' ? 'Iniciar junto con Windows (Silencioso al System Tray)' : 'Start with Windows (Silently to System Tray)'}
              desc={lang === 'es' ? 'La aplicación se ejecuta al iniciar sesión sin abrir la ventana principal' : 'Launch automatically on Windows login in background'}
              checked={!!settings.startWithWindows}
              onToggle={handleToggleStartWithWindows}
            />

            <ToggleRow
              label={lang === 'es' ? 'Restaurar Live Wallpaper automáticamente al iniciar' : 'Auto-attach Live Wallpaper on startup'}
              desc={lang === 'es' ? 'Monta automáticamente el fondo animado a 60 FPS en el escritorio al abrir' : 'Automatically attach 60 FPS animated background when app starts'}
              checked={!!settings.autoLaunchLiveWallpaper}
              onToggle={() => onUpdateSettings({ autoLaunchLiveWallpaper: !settings.autoLaunchLiveWallpaper })}
            />

            <ToggleRow
              label={getTranslation(lang, 'settingsMinimizeToTray')}
              desc={lang === 'es' ? 'Al minimizar la ventana, se oculta en la bandeja al lado del reloj' : 'When minimizing, hide window into the tray next to clock'}
              checked={!!settings.minimizeToTray}
              onToggle={() => onUpdateSettings({ minimizeToTray: !settings.minimizeToTray })}
            />

            <ToggleRow
              label={getTranslation(lang, 'settingsCloseToTray')}
              desc={lang === 'es' ? 'Al hacer clic en X, la app sigue sonando en segundo plano en la bandeja' : 'Clicking X keeps app running and playing in the tray'}
              checked={!!settings.closeToTray}
              onToggle={() => onUpdateSettings({ closeToTray: !settings.closeToTray })}
            />
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
