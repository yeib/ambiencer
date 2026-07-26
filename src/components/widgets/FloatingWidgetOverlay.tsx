import React, { useState } from 'react';
import { X, Minimize2, Move } from 'lucide-react';
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
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(10, e.clientX - dragOffset.x),
        y: Math.max(10, e.clientY - dragOffset.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9990,
        width: '320px',
        userSelect: 'none'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          background: 'rgba(15, 21, 35, 0.85)',
          backdropFilter: 'blur(20px)',
          border: 'var(--border-accent)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden'
        }}
      >
        {/* Widget Handle Bar */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderBottom: 'var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'move'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Move size={14} />
            <span>Widget Flotante</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '12px' }}>
          {renderWidgetContent()}
        </div>
      </div>
    </div>
  );
};
