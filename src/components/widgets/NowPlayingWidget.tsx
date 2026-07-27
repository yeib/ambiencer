import React from 'react';
import { Disc, Volume2, Sparkles } from 'lucide-react';
import { AppSettings, WidgetSettings } from '../../types';

interface NowPlayingWidgetProps {
  settings: AppSettings;
  widgetSettings?: WidgetSettings;
}

export const NowPlayingWidget: React.FC<NowPlayingWidgetProps> = ({ settings, widgetSettings }) => {
  const showVis = widgetSettings?.showVisualizer !== false;
  const isEs = settings.language === 'es';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Disc size={16} className="animate-spin-slow" />
          <span>{isEs ? 'Reproductor Ambiental' : 'Ambient Player'}</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
          {isEs ? 'En Reproducción' : 'Playing'}
        </div>
      </div>

      {/* Audio Visualizer Spectrum Bars */}
      {showVis && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '36px', margin: '4px 0' }}>
          {[40, 70, 100, 60, 90, 50, 80, 45, 85, 65, 95, 55, 75, 35].map((h, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: `${h}%`,
                background: 'linear-gradient(to top, var(--accent-cyan), var(--accent-purple))',
                borderRadius: '2px',
                opacity: 0.85,
                animation: `pulse 1.2s infinite ease-in-out ${i * 0.08}s`
              }}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Volume2 size={13} color="var(--accent-cyan)" />
          <span>Volumen: {Math.round(settings.masterVolume * 100)}%</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Ambiencer Pro 60FPS</span>
      </div>
    </div>
  );
};
