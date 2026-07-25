import React from 'react';
import { Sliders, Sparkles, Layout, Settings, Activity, Image } from 'lucide-react';
import { ActiveTab, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface NavigationProps {
  activeTab: ActiveTab;
  settings: AppSettings;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, settings, onTabChange }) => {
  const lang = settings.language;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'mixer', label: getTranslation(lang, 'tabMixer'), icon: <Sliders size={18} /> },
    { id: 'generator', label: lang === 'es' ? 'Frecuencias & Solfeggio' : 'Frequencies & Solfeggio', icon: <Activity size={18} /> },
    { id: 'wallpapers', label: lang === 'es' ? 'Wallpapers Ambientales' : 'Ambient Wallpapers', icon: <Image size={18} /> },
    { id: 'presets', label: getTranslation(lang, 'tabPresets'), icon: <Sparkles size={18} /> },
    { id: 'widgets', label: getTranslation(lang, 'tabWidgets'), icon: <Layout size={18} /> },
    { id: 'settings', label: getTranslation(lang, 'tabSettings'), icon: <Settings size={18} /> },
  ];

  return (
    <nav style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              flex: '1 1 140px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: isActive ? 'var(--border-accent)' : 'var(--border-glass)',
              background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-glass-card)',
              color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.85rem',
              transition: 'all var(--transition-normal)',
              boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.15)' : 'none'
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
