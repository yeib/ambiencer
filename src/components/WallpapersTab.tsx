import React from 'react';
import { Image, Eye, Sliders, Sparkles, CloudRain, Flame, Moon, Terminal } from 'lucide-react';
import { WallpaperState, WallpaperType, AppSettings } from '../types';
import { getTranslation } from '../i18n';
import { WallpaperEngine } from './WallpaperEngine';

interface WallpapersTabProps {
  settings: AppSettings;
  state: WallpaperState;
  onChangeWallpaperState: (newState: Partial<WallpaperState>) => void;
}

export const WallpapersTab: React.FC<WallpapersTabProps> = ({
  settings,
  state,
  onChangeWallpaperState,
}) => {
  const lang = settings.language;

  const wallpapers: { id: WallpaperType; nameKey: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'rain_drops', nameKey: lang === 'es' ? 'Lluvia en Cristal (Wet FX)' : 'Glass Raindrops (Wet FX)', icon: <CloudRain size={20} />, badge: 'Procedimental 0KB' },
    { id: 'aurora_stars', nameKey: lang === 'es' ? 'Aurora Borealis & Estrellas' : 'Aurora Borealis & Stars', icon: <Moon size={20} />, badge: 'Procedimental 0KB' },
    { id: 'fireplace_glow', nameKey: lang === 'es' ? 'Brasas de Fogata Cálida' : 'Warm Hearth Embers', icon: <Flame size={20} />, badge: 'Procedimental 0KB' },
    { id: 'cyber_grid', nameKey: lang === 'es' ? 'Malla Neón Audio-Reactiva' : 'Audio-Reactive Cyber Grid', icon: <Terminal size={20} />, badge: 'Procedimental 0KB' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image size={20} color="var(--accent-cyan)" />
          <span>{lang === 'es' ? 'Wallpapers Ambientales Dinámicos (0 KB)' : 'Dynamic Ambient Wallpapers (0 KB)'}</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {lang === 'es' ? 'Wallpapers atmosféricos renderizados por GPU en tiempo real con cero sobrecarga de memoria.' : 'Atmospheric real-time GPU rendered wallpapers with zero memory overhead.'}
        </p>
      </div>

      {/* Grid of Wallpapers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {wallpapers.map((wp) => {
          const isActive = state.activeWallpaper === wp.id;
          return (
            <div
              key={wp.id}
              onClick={() => onChangeWallpaperState({ activeWallpaper: wp.id })}
              className="glass-card"
              style={{
                height: '180px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '2px solid var(--accent-cyan)' : 'var(--border-glass)',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 25px rgba(56, 189, 248, 0.3)' : 'none'
              }}
            >
              {/* Wallpaper Canvas Live Preview */}
              <WallpaperEngine type={wp.id} speed={state.speed} brightness={state.brightness} />

              {/* Overlay Content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(9, 11, 16, 0.85) 0%, transparent 60%)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  zIndex: 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'var(--accent-cyan)',
                    border: 'var(--border-glass)'
                  }}>
                    {wp.badge}
                  </span>
                  {isActive && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={14} /> {lang === 'es' ? 'Activo' : 'Active'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {wp.icon}
                    <span>{wp.nameKey}</span>
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjustments Bar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={16} color="var(--accent-cyan)" />
          <span>{lang === 'es' ? 'Ajustes Visuales del Wallpaper' : 'Wallpaper Visual Controls'}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* Speed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{lang === 'es' ? 'Velocidad de Animación:' : 'Animation Speed:'}</span>
              <strong>{state.speed.toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={state.speed}
              onChange={(e) => onChangeWallpaperState({ speed: parseFloat(e.target.value) })}
            />
          </div>

          {/* Brightness */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{lang === 'es' ? 'Brillo / Intensidad:' : 'Brightness / Glow:'}</span>
              <strong>{Math.round(state.brightness * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={state.brightness}
              onChange={(e) => onChangeWallpaperState({ brightness: parseFloat(e.target.value) })}
            />
          </div>

          {/* Blur */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{lang === 'es' ? 'Desenfoque Glass:' : 'Glass Blur:'}</span>
              <strong>{state.blurAmount}px</strong>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={state.blurAmount}
              onChange={(e) => onChangeWallpaperState({ blurAmount: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
