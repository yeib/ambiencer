import React, { useState } from 'react';
import { X, Sparkles, Star, Flame, Waves, Wind, Moon, Heart, Compass } from 'lucide-react';
import { AppSettings, SoundChannel } from '../types';

interface SavePresetModalProps {
  isOpen: boolean;
  settings: AppSettings;
  activeChannels: SoundChannel[];
  onClose: () => void;
  onSavePreset: (name: string, icon: string) => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  settings,
  activeChannels,
  onClose,
  onSavePreset,
}) => {
  const [presetName, setPresetName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('sparkles');

  if (!isOpen) return null;

  const lang = settings.language;
  const activeCount = activeChannels.filter(c => c.volume > 0 && !c.isMuted).length;

  const iconOptions = [
    { id: 'sparkles', icon: <Sparkles size={18} /> },
    { id: 'star', icon: <Star size={18} /> },
    { id: 'flame', icon: <Flame size={18} /> },
    { id: 'waves', icon: <Waves size={18} /> },
    { id: 'wind', icon: <Wind size={18} /> },
    { id: 'moon', icon: <Moon size={18} /> },
    { id: 'heart', icon: <Heart size={18} /> },
    { id: 'compass', icon: <Compass size={18} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;
    onSavePreset(presetName.trim(), selectedIcon);
    setPresetName('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
          background: 'rgba(15, 21, 35, 0.95)',
          border: 'var(--border-accent)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="var(--accent-amber)" />
            <span>{lang === 'es' ? 'Guardar Preset Personalizado' : 'Save Custom Preset'}</span>
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {lang === 'es'
            ? `Se guardará tu combinación actual de ${activeCount} canales activos con sus niveles de volumen exactos.`
            : `Your current mix of ${activeCount} active sound channels with exact volume levels will be saved.`}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              {lang === 'es' ? 'Nombre del Preset' : 'Preset Name'}
            </label>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Ej: Meditación Nocturna, Enfoque 80s...' : 'e.g. Night Meditation, 80s Focus...'}
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-glass)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              {lang === 'es' ? 'Icono Distintivo' : 'Badge Icon'}
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {iconOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedIcon(opt.id)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: selectedIcon === opt.id ? '1px solid var(--accent-cyan)' : 'var(--border-glass)',
                    background: selectedIcon === opt.id ? 'var(--accent-cyan-glow)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedIcon === opt.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-glass)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!presetName.trim()}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--accent-cyan)',
                color: '#090b10',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: presetName.trim() ? 'pointer' : 'not-allowed',
                opacity: presetName.trim() ? 1 : 0.5
              }}
            >
              {lang === 'es' ? 'Guardar Preset' : 'Save Preset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
