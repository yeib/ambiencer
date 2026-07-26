import React from 'react';
import { Clock, Timer, Cpu, StickyNote, Wind } from 'lucide-react';
import { ClockWidget } from './widgets/ClockWidget';
import { PomodoroWidget } from './widgets/PomodoroWidget';
import { SysMonitorWidget } from './widgets/SysMonitorWidget';
import { PostItWidget } from './widgets/PostItWidget';
import { BreathworkWidget } from './widgets/BreathworkWidget';
import { AppSettings, WidgetState } from '../types';
import { getTranslation } from '../i18n';

interface WidgetsTabProps {
  settings: AppSettings;
  widgets: WidgetState[];
  onToggleWidget: (id: string) => void;
}

export const WidgetsTab: React.FC<WidgetsTabProps> = ({
  settings,
  widgets,
  onToggleWidget,
}) => {
  const lang = settings.language;

  const getWidgetTitle = (type: string) => {
    switch (type) {
      case 'clock': return getTranslation(lang, 'widgetClock');
      case 'pomodoro': return getTranslation(lang, 'widgetPomodoro');
      case 'sysmonitor': return getTranslation(lang, 'widgetSysMonitor');
      case 'postit': return getTranslation(lang, 'widgetPostIt');
      case 'breathwork': return lang === 'es' ? 'Guía de Respiración & Yoga (Pranayama)' : 'Guided Breathwork & Yoga (Pranayama)';
      default: return type;
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'clock': return <Clock size={20} />;
      case 'pomodoro': return <Timer size={20} />;
      case 'sysmonitor': return <Cpu size={20} />;
      case 'postit': return <StickyNote size={20} />;
      case 'breathwork': return <Wind size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const renderWidgetPreview = (type: string) => {
    switch (type) {
      case 'clock': return <ClockWidget settings={settings} />;
      case 'pomodoro': return <PomodoroWidget settings={settings} />;
      case 'sysmonitor': return <SysMonitorWidget settings={settings} />;
      case 'postit': return <PostItWidget settings={settings} />;
      case 'breathwork': return <BreathworkWidget settings={settings} />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
          ✨ {getTranslation(lang, 'tabWidgets')}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {lang === 'es'
            ? 'Activa widgets flotantes traslúcidos para fijar en tu escritorio mientras trabajas o meditas.'
            : 'Enable translucent floating desktop widgets to pin on your screen while working or meditating.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {widgets.map((w) => (
          <div
            key={w.id}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: w.enabled ? 'var(--border-accent)' : 'var(--border-glass)',
              background: w.enabled ? 'rgba(38, 50, 78, 0.4)' : 'var(--bg-glass-card)',
              transition: 'all 0.2s'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: w.enabled ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.05)',
                    color: w.enabled ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getWidgetIcon(w.type)}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: w.enabled ? '#ffffff' : 'var(--text-main)' }}>
                  {getWidgetTitle(w.type)}
                </h3>
              </div>

              <button
                onClick={() => onToggleWidget(w.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: w.enabled ? 'var(--border-accent)' : 'var(--border-glass)',
                  background: w.enabled ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                  color: w.enabled ? '#090b10' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {w.enabled ? (lang === 'es' ? 'Activo' : 'Active') : getTranslation(lang, 'widgetToggle')}
              </button>
            </div>

            {/* Widget Preview */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {renderWidgetPreview(w.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
