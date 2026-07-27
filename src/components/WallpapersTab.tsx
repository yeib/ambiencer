import React from 'react';
import { Image, Sliders, Sparkles, CloudRain, Flame, Moon, Terminal, Flower2, Code2, Waves, Compass, Trees, Sun, Leaf, Zap } from 'lucide-react';
import { WallpaperState, WallpaperType, AppSettings } from '../types';
import { getTranslation } from '../i18n';
import { WallpaperEngine } from './WallpaperEngine';
import { WindowsWallpaperCard } from './wallpapers/WindowsWallpaperCard';

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
    { id: 'rain_drops', nameKey: lang === 'es' ? 'Lluvia en Cristal (Wet FX)' : 'Glass Raindrops (Wet FX)', icon: <CloudRain size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'aurora_stars', nameKey: lang === 'es' ? 'Aurora Borealis & Estrellas' : 'Aurora Borealis & Stars', icon: <Moon size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'fireplace_glow', nameKey: lang === 'es' ? 'Brasas de Fogata Cálida' : 'Warm Hearth Embers', icon: <Flame size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'cyber_grid', nameKey: lang === 'es' ? 'Malla Neón Cyberpunk' : 'Cyberpunk Grid FX', icon: <Terminal size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'cherry_blossoms', nameKey: lang === 'es' ? 'Cerezos en Flor (Sakura Spring)' : 'Sakura Cherry Blossoms', icon: <Flower2 size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'cyberpunk_matrix', nameKey: lang === 'es' ? 'Lluvia Digital Matrix' : 'Matrix Digital Rain', icon: <Code2 size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'ocean_waves', nameKey: lang === 'es' ? 'Olas Oceánicas Bioluminiscentes' : 'Bioluminescent Ocean Waves', icon: <Waves size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'zen_nebula', nameKey: lang === 'es' ? 'Nebulosa Zen & Polvo Estelar' : 'Zen Cosmic Nebula', icon: <Compass size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'fireflies_garden', nameKey: lang === 'es' ? 'Jardín de Luciérnagas Místicas' : 'Mystic Fireflies Garden', icon: <Trees size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'sunset_synthwave', nameKey: lang === 'es' ? 'Horizonte Crepuscular Brumoso' : 'Misty Twilight Horizon', icon: <Sun size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'autumn_leaves', nameKey: lang === 'es' ? 'Hojas de Otoño Flotantes' : 'Drifting Autumn Leaves', icon: <Leaf size={20} />, badge: 'Procedimental 60 FPS' },
    { id: 'hyperdrive_warp', nameKey: lang === 'es' ? 'Vértice Espacial Hyperdrive' : 'Hyperdrive Space Warp', icon: <Zap size={20} />, badge: 'Procedimental 60 FPS' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image size={20} color="var(--accent-cyan)" />
          <span>{lang === 'es' ? 'Wallpapers Ambientales Dinámicos (12 Estilos 60 FPS)' : 'Dynamic Ambient Wallpapers (12 60 FPS Styles)'}</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {lang === 'es' ? 'Wallpapers atmosféricos renderizados por GPU en tiempo real con cero sobrecarga de memoria.' : 'Atmospheric real-time GPU rendered wallpapers with zero memory overhead.'}
        </p>
      </div>

      {/* Grid of 8 Wallpapers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {wallpapers.map((wp) => {
          const isActive = state.activeWallpaper === wp.id;
          return (
            <div
              key={wp.id}
              onClick={() => onChangeWallpaperState({ activeWallpaper: wp.id })}
              className="glass-card"
              style={{
                height: '170px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '2px solid var(--accent-cyan)' : 'var(--border-glass)',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 25px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {/* Wallpaper Canvas Live Preview */}
              <WallpaperEngine type={wp.id} speed={state.speed} brightness={state.brightness} />

              {/* Overlay Content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(9, 11, 16, 0.9) 0%, transparent 65%)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  zIndex: 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(0, 0, 0, 0.65)',
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
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    {wp.icon}
                    <span>{wp.nameKey}</span>
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <WindowsWallpaperCard settings={settings} state={state} />

      {/* Adjustments Bar (4 Sliders) */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={16} color="var(--accent-cyan)" />
          <span>{lang === 'es' ? 'Ajustes Visuales del Wallpaper' : 'Wallpaper Visual Controls'}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* 1. Brightness Slider (1% to 100%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{lang === 'es' ? '1. Brillo del Fondo:' : '1. Background Brightness:'}</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{Math.round(state.brightness * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={state.brightness}
              onChange={(e) => onChangeWallpaperState({ brightness: parseFloat(e.target.value) })}
            />
          </div>

          {/* 2. Speed Slider (0.2x to 3.0x) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{lang === 'es' ? '2. Velocidad de Animación:' : '2. Animation Speed:'}</span>
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

          {/* 3. Glass Blur Slider (0px to 20px) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{lang === 'es' ? '3. Desenfoque Glass:' : '3. Glass Blur:'}</span>
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
