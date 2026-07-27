import React, { useState } from 'react';
import { Image, Sliders, Sparkles, CloudRain, Flame, Moon, Terminal, Download, Monitor, CheckCircle } from 'lucide-react';
import { WallpaperState, WallpaperType, AppSettings } from '../types';
import { getTranslation } from '../i18n';
import { WallpaperEngine, generateWallpaperSnapshot } from './WallpaperEngine';

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
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleSetWindowsWallpaper = async () => {
    setIsApplying(true);
    setStatusMsg(null);
    try {
      const dataUrl = generateWallpaperSnapshot(state.activeWallpaper, state.brightness, 1920, 1080);
      
      // Dynamic import of Tauri invoke API
      const { invoke } = await import('@tauri-apps/api/core');
      const msg = await invoke<string>('set_desktop_wallpaper', { imageDataBase64: dataUrl });
      setStatusMsg(msg || (lang === 'es' ? '¡Fondo de escritorio de Windows establecido con éxito! 🖥️✨' : 'Windows desktop wallpaper applied successfully! 🖥️✨'));
    } catch (err: any) {
      console.log('Web preview mode notice:', err);
      setStatusMsg(
        lang === 'es'
          ? 'ℹ️ Nota: Para cambiar el fondo de tu PC en tiempo real, ejecuta la app en modo nativo (npm run tauri dev)'
          : 'ℹ️ Note: To change Windows desktop background, run app in native mode (npm run tauri dev)'
      );
    } finally {
      setIsApplying(false);
      setTimeout(() => setStatusMsg(null), 6000);
    }
  };

  const handleDownloadWallpaperHD = async () => {
    const dataUrl = generateWallpaperSnapshot(state.activeWallpaper, state.brightness, 3840, 2160);
    const fileName = `ambiencer_wallpaper_${state.activeWallpaper}_4k.png`;

    // Native Windows File Save Picker if supported
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'PNG Image (*.png)',
            accept: { 'image/png': ['.png'] }
          }]
        });
        const writable = await handle.createWritable();
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await writable.write(blob);
        await writable.close();
        setStatusMsg(lang === 'es' ? '¡Imagen 4K guardada en la carpeta seleccionada! 📁✨' : '4K image saved to selected folder! 📁✨');
        setTimeout(() => setStatusMsg(null), 5000);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // User cancelled save dialog
      }
    }

    // Fallback: Automatic download link
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    setStatusMsg(lang === 'es' ? `¡Imagen 4K descargada en tu carpeta de Descargas! (${fileName}) ⬇️` : `4K PNG downloaded to your Downloads folder! (${fileName}) ⬇️`);
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const wallpapers: { id: WallpaperType; nameKey: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'rain_drops', nameKey: lang === 'es' ? 'Lluvia en Cristal (Wet FX)' : 'Glass Raindrops (Wet FX)', icon: <CloudRain size={20} />, badge: 'Procedimental GPU' },
    { id: 'aurora_stars', nameKey: lang === 'es' ? 'Aurora Borealis & Estrellas' : 'Aurora Borealis & Stars', icon: <Moon size={20} />, badge: 'Procedimental GPU' },
    { id: 'fireplace_glow', nameKey: lang === 'es' ? 'Brasas de Fogata Cálida' : 'Warm Hearth Embers', icon: <Flame size={20} />, badge: 'Procedimental GPU' },
    { id: 'cyber_grid', nameKey: lang === 'es' ? 'Malla Neón Audio-Reactiva' : 'Audio-Reactive Cyber Grid', icon: <Terminal size={20} />, badge: 'Procedimental GPU' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image size={20} color="var(--accent-cyan)" />
          <span>{lang === 'es' ? 'Wallpapers Ambientales Dinámicos (Procedimental GPU)' : 'Dynamic Ambient Wallpapers (Procedural GPU)'}</span>
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

      {/* Windows Wallpaper Action & HD Export Card */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          background: 'rgba(56, 189, 248, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={18} color="var(--accent-cyan)" />
              <span>{lang === 'es' ? 'Establecer en Windows & Exportar HD' : 'Set as Windows Wallpaper & Export HD'}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'es'
                ? 'Aplica tu wallpaper personalizado directamente como fondo de pantalla en Windows o descárgalo en resolución 4K.'
                : 'Apply your customized wallpaper directly as your Windows desktop background or export in 4K resolution.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Set as Windows Wallpaper Button */}
            <button
              onClick={handleSetWindowsWallpaper}
              disabled={isApplying}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#090b10',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: isApplying ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              <Monitor size={17} />
              <span>{isApplying ? (lang === 'es' ? 'Aplicando...' : 'Applying...') : (lang === 'es' ? 'Establecer como Fondo de Pantalla' : 'Set as Windows Wallpaper')}</span>
            </button>

            {/* Download 4K PNG */}
            <button
              onClick={handleDownloadWallpaperHD}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Download size={17} />
              <span>{lang === 'es' ? 'Guardar Imagen 4K PNG...' : 'Save 4K PNG Image...'}</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              background: statusMsg.startsWith('ℹ️') ? 'rgba(56, 189, 248, 0.15)' : 'rgba(52, 211, 153, 0.15)',
              border: statusMsg.startsWith('ℹ️') ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)',
              color: statusMsg.startsWith('ℹ️') ? '#38bdf8' : '#4ade80',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle size={16} />
            <span>{statusMsg}</span>
          </div>
        )}
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
