import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { AppSettings } from '../../types';

interface ClockWidgetProps {
  settings: AppSettings;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ settings }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [is24h, setIs24h] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Clock size={14} />
          <span>{settings.language === 'es' ? 'Reloj Digital' : 'Digital Clock'}</span>
        </div>
        <button
          onClick={() => setIs24h(!is24h)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            padding: '2px 6px',
            cursor: 'pointer'
          }}
        >
          {is24h ? '24H' : '12H'}
        </button>
      </div>

      {/* Time Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-1px', color: '#ffffff' }}>
          {hours}:{minutes}
        </span>
        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', width: '24px' }}>
          :{seconds}
        </span>
        {!is24h && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {ampm}
          </span>
        )}
      </div>

      {/* Date Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'capitalize' }}>
        <Calendar size={14} />
        <span>{dateStr}</span>
      </div>
    </div>
  );
};
