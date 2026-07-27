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
  const styleMode = widgetSettings?.clockStyle || 'digital';
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

  // Analog Clock angles
  const secAngle = time.getSeconds() * 6;
  const minAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  return (
    <div
      className="glass-panel"
      style={{
        padding: size === 'sm' ? '14px' : size === 'lg' ? '24px' : '18px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.65)',
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
          <span>{styleMode === 'analog' ? (settings.language === 'es' ? 'Reloj Analógico' : 'Analog Clock') : (settings.language === 'es' ? 'Reloj Digital' : 'Digital Clock')}</span>
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          {styleMode === 'analog' ? 'ANALOG' : is24h ? '24H' : '12H'}
        </span>
      </div>

      {styleMode === 'analog' ? (
        /* Analog Clock Face */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
          <div
            style={{
              width: size === 'sm' ? '110px' : size === 'lg' ? '160px' : '130px',
              height: size === 'sm' ? '110px' : size === 'lg' ? '160px' : '130px',
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.35)',
              background: 'radial-gradient(circle, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Hour Markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                style={{
                  position: 'absolute',
                  width: deg % 90 === 0 ? '3px' : '1.5px',
                  height: deg % 90 === 0 ? '8px' : '5px',
                  background: deg % 90 === 0 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.3)',
                  transform: `rotate(${deg}deg) translateY(-${size === 'sm' ? '46px' : size === 'lg' ? '68px' : '56px'})`
                }}
              />
            ))}

            {/* Hour Hand */}
            <div
              style={{
                position: 'absolute',
                width: '4px',
                height: size === 'sm' ? '30px' : size === 'lg' ? '42px' : '35px',
                background: '#ffffff',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                transform: `rotate(${hourAngle}deg) translateY(-50%)`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.5)'
              }}
            />

            {/* Minute Hand */}
            <div
              style={{
                position: 'absolute',
                width: '2.5px',
                height: size === 'sm' ? '42px' : size === 'lg' ? '60px' : '48px',
                background: 'var(--accent-cyan)',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                transform: `rotate(${minAngle}deg) translateY(-50%)`,
                boxShadow: '0 0 8px var(--accent-cyan)'
              }}
            />

            {/* Second Hand */}
            {showSec && (
              <div
                style={{
                  position: 'absolute',
                  width: '1.5px',
                  height: size === 'sm' ? '48px' : size === 'lg' ? '68px' : '55px',
                  background: '#fb7185',
                  borderRadius: '1px',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${secAngle}deg) translateY(-50%)`
                }}
              />
            )}

            {/* Center Pivot Pin */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                boxShadow: '0 0 8px var(--accent-cyan)',
                zIndex: 10
              }}
            />
          </div>
        </div>
      ) : (
        /* Digital Clock Display */
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
      )}

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
