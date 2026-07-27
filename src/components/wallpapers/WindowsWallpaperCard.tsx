import React, { useState } from 'react';
import { Monitor, Play, Download, CheckCircle } from 'lucide-react';
import { WallpaperState, AppSettings } from '../../types';
import { generateWallpaperSnapshot } from '../WallpaperEngine';

interface WindowsWallpaperCardProps {
  settings: AppSettings;
  state: WallpaperState;
}

export const WindowsWallpaperCard: React.FC<WindowsWallpaperCardProps> = ({
  settings,
  state,
}) => {
  const lang = settings.language;
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleSetWindowsWallpaper = async () => {
    setIsApplying(true);
    setStatusMsg(null);
    try {
      const dataUrl = generateWallpaperSnapshot(state.activeWallpaper, state.brightness, 1920, 1080, 'image/jpeg');
      
      const { invoke } = await import('@tauri-apps/api/core');
      const msg = await invoke<string>('set_desktop_wallpaper', { imageDataBase64: dataUrl });
      setStatusMsg(msg || (lang === 'es' ? '¡Fondo estático de Windows establecido con éxito! 🖥️✨' : 'Windows desktop wallpaper applied successfully! 🖥️✨'));
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

  const handleAttachLiveDesktop = async () => {
    setIsApplying(true);
    setStatusMsg(null);
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const msg = await invoke<string>('attach_live_wallpaper_to_desktop');
      setStatusMsg(msg || (lang === 'es' ? '¡Live Wallpaper acoplado al fondo de escritorio detrás de tus iconos! 🎬✨' : 'Live 60 FPS Wallpaper attached to desktop! 🎬✨'));
    } catch (err: any) {
      console.log('Live mode notice:', err);
      setStatusMsg(
        lang === 'es'
          ? 'ℹ️ El modo Live Wallpaper requiere ejecutar en app nativa (npm run tauri dev)'
          : 'ℹ️ Live 60 FPS Wallpaper requires running native app (npm run tauri dev)'
      );
    } finally {
      setIsApplying(false);
      setTimeout(() => setStatusMsg(null), 6000);
    }
  };

  const handleDetachLiveDesktop = async () => {
    setIsApplying(true);
    setStatusMsg(null);
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const msg = await invoke<string>('detach_live_wallpaper_from_desktop');
      setStatusMsg(msg || (lang === 'es' ? '¡Ambiencer restaurado al escritorio normal! 🖥️' : 'Ambiencer restored to desktop! 🖥️'));
    } catch (err: any) {
      console.log('Detach mode notice:', err);
    } finally {
      setIsApplying(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleDownloadWallpaperHD = async () => {
    const dataUrl = generateWallpaperSnapshot(state.activeWallpaper, state.brightness, 3840, 2160, 'image/png');
    const fileName = `ambiencer_wallpaper_${state.activeWallpaper}_4k.png`;

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'PNG Image (3840x2160 4K UHD)',
              accept: { 'image/png': ['.png'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await writable.write(blob);
        await writable.close();
        setStatusMsg(lang === 'es' ? '¡Imagen 4K guardada con éxito en tu PC! 🎨' : '4K Image saved successfully to your PC! 🎨');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    setStatusMsg(lang === 'es' ? '¡Imagen 4K descargada con éxito! 🎨' : '4K Image downloaded successfully! 🎨');
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}
        >
          <Monitor size={22} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            {lang === 'es' ? 'Integración con Escritorio Windows' : 'Windows Desktop Integration'}
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {lang === 'es'
              ? 'Fija el paisaje animado a 60 FPS detrás de tus iconos de Windows o establece el fondo estático.'
              : 'Attach live 60 FPS animated background behind Windows icons or set static wallpaper.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleAttachLiveDesktop}
          disabled={isApplying}
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: isApplying ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          <Play size={16} fill="currentColor" />
          <span>{lang === 'es' ? 'Fijar en Escritorio (Live 60 FPS)' : 'Attach to Desktop (Live 60 FPS)'}</span>
        </button>

        <button
          onClick={handleDetachLiveDesktop}
          disabled={isApplying}
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            background: 'rgba(168, 85, 247, 0.12)',
            color: '#d8b4fe',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: isApplying ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Monitor size={16} />
          <span>{lang === 'es' ? 'Restaurar Ventana' : 'Restore Window'}</span>
        </button>

        <button
          onClick={handleSetWindowsWallpaper}
          disabled={isApplying}
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            background: 'rgba(56, 189, 248, 0.12)',
            color: 'var(--accent-cyan)',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: isApplying ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Monitor size={16} />
          <span>{lang === 'es' ? 'Fondo Estático Windows' : 'Set Windows Wallpaper'}</span>
        </button>

        <button
          onClick={handleDownloadWallpaperHD}
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Download size={16} />
          <span>{lang === 'es' ? 'Guardar 4K PNG...' : 'Save 4K PNG...'}</span>
        </button>
      </div>

      {statusMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: statusMsg.includes('ℹ️')
              ? 'rgba(234, 179, 8, 0.12)'
              : 'rgba(56, 189, 248, 0.12)',
            border: `1px solid ${
              statusMsg.includes('ℹ️')
                ? 'rgba(234, 179, 8, 0.3)'
                : 'rgba(56, 189, 248, 0.3)'
            }`,
            borderRadius: 'var(--radius-md)',
            color: statusMsg.includes('ℹ️') ? '#fde047' : 'var(--accent-cyan)',
            fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle size={18} />
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
};
