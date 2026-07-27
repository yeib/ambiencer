import React, { useState, useEffect } from 'react';
import { X, Move, Sparkles } from 'lucide-react';
import { ClockWidget } from './ClockWidget';
import { NowPlayingWidget } from './NowPlayingWidget';
import { SysMonitorWidget } from './SysMonitorWidget';
import { PostItWidget } from './PostItWidget';
import { QuotesWidget } from './QuotesWidget';
import { AppSettings, WidgetState } from '../../types';

interface FloatingWidgetOverlayProps {
  widget: WidgetState;
  settings: AppSettings;
  isTestMode?: boolean;
  onClose: () => void;
  onUpdatePosition?: (pos: { x: number; y: number }) => void;
}

export const FloatingWidgetOverlay: React.FC<FloatingWidgetOverlayProps> = ({
  widget,
  settings,
  isTestMode = false,
  onClose,
  onUpdatePosition,
}) => {
  const [position, setPosition] = useState(() => ({
    x: widget.position?.x ?? 40,
    y: widget.position?.y ?? 100,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (widget.position && (widget.position.x !== position.x || widget.position.y !== position.y)) {
      setPosition(widget.position);
    }
  }, [widget.position?.x, widget.position?.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTestMode) return; // Only drag inside App Test Mode
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const newPos = {
        x: Math.max(10, Math.min(window.innerWidth - 330, e.clientX - dragOffset.x)),
        y: Math.max(10, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
      };
      setPosition(newPos);
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
      if (onUpdatePosition) {
        onUpdatePosition(position);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, dragOffset, position, onUpdatePosition]);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'clock': return <ClockWidget settings={settings} widgetSettings={widget.settings} />;
      case 'nowplaying': return <NowPlayingWidget settings={settings} widgetSettings={widget.settings} />;
      case 'sysmonitor': return <SysMonitorWidget settings={settings} widgetSettings={widget.settings} />;
      case 'postit': return <PostItWidget settings={settings} widgetSettings={widget.settings} />;
      case 'quotes': return <QuotesWidget settings={settings} widgetSettings={widget.settings} />;
      default: return null;
    }
  };

  const getWidgetTitle = () => {
    switch (widget.type) {
      case 'clock': return settings.language === 'es' ? 'Reloj & Calendario' : 'Clock & Date';
      case 'nowplaying': return settings.language === 'es' ? 'Reproductor Ambiental' : 'Ambient Player';
      case 'sysmonitor': return settings.language === 'es' ? 'Monitor de Sistema' : 'System Monitor';
      case 'postit': return settings.language === 'es' ? 'Notas & Objetivos' : 'Quick Notes';
      case 'quotes': return settings.language === 'es' ? 'Frase & Enfoque Diario' : 'Daily Focus Quote';
      default: return 'Widget';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isTestMode ? 9990 : 9980,
        width: '320px',
        userSelect: 'none',
        pointerEvents: 'auto'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          background: isTestMode ? 'rgba(15, 21, 35, 0.92)' : 'rgba(15, 21, 35, 0.78)',
          backdropFilter: 'blur(24px)',
          border: isDragging
            ? '2px solid var(--accent-cyan)'
            : isTestMode
            ? '1px solid rgba(192, 132, 252, 0.6)'
            : 'var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          boxShadow: isDragging
            ? '0 20px 50px rgba(56, 189, 248, 0.35)'
            : isTestMode
            ? '0 16px 40px rgba(168, 85, 247, 0.25)'
            : '0 10px 30px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'all 0.2s'
        }}
      >
        {/* Render Drag Bar ONLY in In-App Test Mode */}
        {isTestMode && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              padding: '8px 14px',
              background: isDragging ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
              borderBottom: 'var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.78rem', fontWeight: 600 }}>
              <Move size={14} />
              <span>{getWidgetTitle()}</span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(168, 85, 247, 0.3)',
                color: '#e9d5ff',
                marginLeft: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Sparkles size={10} /> {settings.language === 'es' ? 'Prueba en App' : 'App Test'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={onClose}
                onMouseDown={(e) => e.stopPropagation()}
                title={settings.language === 'es' ? 'Cerrar Widget' : 'Close Widget'}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div style={{ padding: '12px' }}>
          {renderWidgetContent()}
        </div>
      </div>
    </div>
  );
};
