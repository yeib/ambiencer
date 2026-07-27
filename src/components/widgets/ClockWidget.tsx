import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { AppSettings, WidgetSettings } from '../../types';

interface ClockWidgetProps {
  settings: AppSettings;
  widgetSettings?: WidgetSettings;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ settings, widgetSettings }) => {
  const [time, setTime] = useState<Date>(new Date());

  const format = widgetSettings?.clockFormat || '24h';
  const showSec = widgetSettings?.showSeconds !== false;
  const showDt = widgetSettings?.showDate !== false;
  const size = widgetSettings?.clockSize || 'md';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const is24h = format === '24h';
  const hours = is24h
    ? time.getHours().toString().padStart(2, '0')
    : (time.getHours() % 12 || 12).toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const dateStr = time.toLocaleDateString(settings.language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const fontSize = size === 'sm' ? '1.8rem' : size === 'lg' ? '3.2rem' : '2.5rem';

  return (
    <div
      className="glass-panel"
      style={{
        padding: size === 'sm' ? '12px' : size === 'lg' ? '24px' : '18px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Clock size={14} />
          <span>{settings.language === 'es' ? 'Reloj Digital' : 'Digital Clock'}</span>
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          {is24h ? '24H' : '12H'}
        </span>
      </div>

      {/* Time Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
        <span style={{ fontSize, fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-1px', color: '#ffffff' }}>
          {hours}:{minutes}
        </span>
        {showSec && (
          <span style={{ fontSize: size === 'sm' ? '0.85rem' : '1rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            :{seconds}
          </span>
        )}
        {!is24h && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginLeft: '4px' }}>
            {ampm}
          </span>
        )}
      </div>

      {/* Date Display */}
      {showDt && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'capitalize' }}>
          <Calendar size={13} />
          <span>{dateStr}</span>
        </div>
      )}
    </div>
  );
};
