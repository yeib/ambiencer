import React from 'react';
import { Sliders, Sparkles, Layout, Settings, Activity, Image, Volume2, Monitor } from 'lucide-react';
import { ActiveTab, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface NavigationProps {
  activeTab: ActiveTab;
  settings: AppSettings;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, settings, onTabChange }) => {
  const lang = settings.language;

  const audioTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'mixer', label: getTranslation(lang, 'tabMixer'), icon: <Sliders size={17} /> },
    { id: 'generator', label: lang === 'es' ? 'Frecuencias & Solfeggio' : 'Frequencies & Solfeggio', icon: <Activity size={17} /> },
    { id: 'presets', label: getTranslation(lang, 'tabPresets'), icon: <Sparkles size={17} /> },
  ];

  const visualTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'wallpapers', label: lang === 'es' ? 'Wallpapers Ambientales' : 'Ambient Wallpapers', icon: <Image size={17} /> },
    { id: 'widgets', label: getTranslation(lang, 'tabWidgets'), icon: <Layout size={17} /> },
  ];

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}
    >
      {/* Category 1: Audio / Paisajes Sonoros */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(56, 189, 248, 0.04)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          flex: '3 1 420px'
        }}
      >
        {audioTabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid transparent',
                background: isActive ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.84rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none'
              }}
            >
              {t.icon}
              <span style={{ whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category 2: Visual & Desktop */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(192, 132, 252, 0.04)',
          border: '1px solid rgba(192, 132, 252, 0.15)',
          flex: '2 1 280px'
        }}
      >
        {visualTabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: isActive ? '1px solid rgba(192, 132, 252, 0.6)' : '1px solid transparent',
                background: isActive ? 'rgba(192, 132, 252, 0.16)' : 'transparent',
                color: isActive ? '#c084fc' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.84rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 0 16px rgba(192, 132, 252, 0.25)' : 'none'
              }}
            >
              {t.icon}
              <span style={{ whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category 3: Settings */}
      <button
        onClick={() => onTabChange('settings')}
        style={{
          padding: '11px 16px',
          borderRadius: 'var(--radius-md)',
          border: activeTab === 'settings' ? 'var(--border-accent)' : 'var(--border-glass)',
          background: activeTab === 'settings' ? 'rgba(255, 255, 255, 0.12)' : 'var(--bg-glass-card)',
          color: activeTab === 'settings' ? '#ffffff' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: activeTab === 'settings' ? 600 : 400,
          fontSize: '0.84rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          flex: '0 0 auto'
        }}
        title={getTranslation(lang, 'tabSettings')}
      >
        <Settings size={17} />
        <span>{getTranslation(lang, 'tabSettings')}</span>
      </button>
    </nav>
  );
};

