import React, { useState, useEffect } from 'react';
import { X, Move } from 'lucide-react';
import { ClockWidget } from './ClockWidget';
import { PomodoroWidget } from './PomodoroWidget';
import { SysMonitorWidget } from './SysMonitorWidget';
import { PostItWidget } from './PostItWidget';
import { AppSettings, WidgetState } from '../../types';

interface FloatingWidgetOverlayProps {
  widget: WidgetState;
  settings: AppSettings;
  onClose: () => void;
}

export const FloatingWidgetOverlay: React.FC<FloatingWidgetOverlayProps> = ({
  widget,
  settings,
  onClose,
}) => {
  const [position, setPosition] = useState({ x: 40, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
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
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 330, e.clientX - dragOffset.x)),
        y: Math.max(10, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
      });
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, dragOffset]);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'clock': return <ClockWidget settings={settings} />;
      case 'pomodoro': return <PomodoroWidget settings={settings} />;
      case 'sysmonitor': return <SysMonitorWidget settings={settings} />;
      case 'postit': return <PostItWidget settings={settings} />;
      default: return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9990,
        width: '320px',
        userSelect: 'none',
        pointerEvents: 'auto'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          background: 'rgba(15, 21, 35, 0.88)',
          backdropFilter: 'blur(24px)',
          border: isDragging ? '2px solid var(--accent-cyan)' : 'var(--border-accent)',
          borderRadius: 'var(--radius-md)',
          boxShadow: isDragging ? '0 20px 50px rgba(56, 189, 248, 0.3)' : '0 16px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'box-shadow 0.2s, border 0.2s'
        }}
      >
        {/* Widget Drag Handle Bar */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            padding: '8px 14px',
            background: isDragging ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            borderBottom: 'var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Move size={14} />
            <span>Widget Flotante</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onClose}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '12px', pointerEvents: isDragging ? 'none' : 'auto' }}>
          {renderWidgetContent()}
        </div>
      </div>
    </div>
  );
};
