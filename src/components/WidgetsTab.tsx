import React from 'react';
import { ClockWidget } from './widgets/ClockWidget';
import { PomodoroWidget } from './widgets/PomodoroWidget';
import { SysMonitorWidget } from './widgets/SysMonitorWidget';
import { PostItWidget } from './widgets/PostItWidget';
import { AppSettings, WidgetState } from '../types';
import { getTranslation } from '../i18n';
import { ExternalLink, LayoutGrid } from 'lucide-react';

interface WidgetsTabProps {
  settings: AppSettings;
  widgets: WidgetState[];
  onToggleWidget: (id: string) => void;
}

export const WidgetsTab: React.FC<WidgetsTabProps> = ({ settings, widgets, onToggleWidget }) => {
  const lang = settings.language;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
            🪟 {getTranslation(lang, 'tabWidgets')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {lang === 'es' ? 'Widgets flotantes glassmorphic para mantenerte enfocado e informado sobre tu escritorio.' : 'Glassmorphic floating widgets to keep you focused and informed right on your desktop.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Clock Widget Card */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {getTranslation(lang, 'widgetClock')}
            </span>
            <button
              onClick={() => onToggleWidget('clock')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                color: 'var(--accent-cyan)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ExternalLink size={12} />
              <span>{getTranslation(lang, 'widgetToggle')}</span>
            </button>
          </div>
          <ClockWidget settings={settings} />
        </div>

        {/* Pomodoro Widget Card */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {getTranslation(lang, 'widgetPomodoro')}
            </span>
            <button
              onClick={() => onToggleWidget('pomodoro')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                color: 'var(--accent-cyan)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ExternalLink size={12} />
              <span>{getTranslation(lang, 'widgetToggle')}</span>
            </button>
          </div>
          <PomodoroWidget settings={settings} />
        </div>

        {/* System Monitor Widget Card */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {getTranslation(lang, 'widgetSysMonitor')}
            </span>
            <button
              onClick={() => onToggleWidget('sysmonitor')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                color: 'var(--accent-purple)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ExternalLink size={12} />
              <span>{getTranslation(lang, 'widgetToggle')}</span>
            </button>
          </div>
          <SysMonitorWidget settings={settings} />
        </div>

        {/* Post-It Glass Widget Card */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {getTranslation(lang, 'widgetPostIt')}
            </span>
            <button
              onClick={() => onToggleWidget('postit')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                color: 'var(--accent-amber)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ExternalLink size={12} />
              <span>{getTranslation(lang, 'widgetToggle')}</span>
            </button>
          </div>
          <PostItWidget settings={settings} />
        </div>
      </div>
    </div>
  );
};
