import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Volume2, Layout, Globe, X } from 'lucide-react';
import { SoundChannel, FocusPreset, AppSettings } from '../types';
import { getTranslation } from '../i18n';

interface OmnibarModalProps {
  isOpen: boolean;
  settings: AppSettings;
  channels: SoundChannel[];
  presets: FocusPreset[];
  onClose: () => void;
  onApplyPreset: (preset: FocusPreset) => void;
  onSelectSound: (soundId: string) => void;
  onToggleLanguage: () => void;
}

export const OmnibarModal: React.FC<OmnibarModalProps> = ({
  isOpen,
  settings,
  channels,
  presets,
  onClose,
  onApplyPreset,
  onSelectSound,
  onToggleLanguage,
}) => {
  const [query, setQuery] = useState('');
  const lang = settings.language;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.code === 'Space')) && !isOpen) {
        e.preventDefault();
        // open
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPresets = presets.filter((p) =>
    getTranslation(lang, p.nameKey as any).toLowerCase().includes(query.toLowerCase())
  );

  const filteredSounds = channels.filter((c) =>
    getTranslation(lang, c.nameKey as any).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '90%',
          maxWidth: '560px',
          padding: '20px',
          background: 'rgba(18, 24, 38, 0.9)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          border: 'var(--border-glass-bright)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: 'var(--border-glass)', paddingBottom: '14px', marginBottom: '14px' }}>
          <Search size={20} color="var(--accent-cyan)" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getTranslation(lang, 'omnibarPlaceholder')}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
          {/* Quick Actions */}
          <div
            onClick={() => { onToggleLanguage(); onClose(); }}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={16} color="var(--accent-cyan)" />
              <span>{lang === 'es' ? 'Cambiar Idioma a Inglés (EN)' : 'Switch Language to Spanish (ES)'}</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[CMD]</span>
          </div>

          {/* Presets */}
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => { onApplyPreset(preset); onClose(); }}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}
              className="glass-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <span>{getTranslation(lang, preset.nameKey as any)}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>Preset</span>
            </div>
          ))}

          {/* Sound Channels */}
          {filteredSounds.map((sound) => (
            <div
              key={sound.id}
              onClick={() => { onSelectSound(sound.id); onClose(); }}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}
              className="glass-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={16} color="var(--accent-purple)" />
                <span>{getTranslation(lang, sound.nameKey as any)}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{Math.round(sound.volume * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
