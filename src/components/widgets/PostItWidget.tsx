import React from 'react';
import { StickyNote } from 'lucide-react';
import { AppSettings, WidgetSettings } from '../../types';
import { getTranslation } from '../../i18n';

interface PostItWidgetProps {
  settings: AppSettings;
  widgetSettings?: WidgetSettings;
}

export const PostItWidget: React.FC<PostItWidgetProps> = ({ settings, widgetSettings }) => {
  const lang = settings.language;
  const noteText = widgetSettings?.postItText || (lang === 'es' ? '🎯 Mi Objetivo de Hoy:\n• Mantener la calma y concentrarme\n• Terminar la interfaz UI' : '🎯 Today\'s Focus:\n• Stay calm and focus\n• Finish UI design');
  const colorKey = widgetSettings?.postItColor || 'amber';

  const getColorStyle = () => {
    switch (colorKey) {
      case 'cyan': return { accent: 'var(--accent-cyan)', bg: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)' };
      case 'purple': return { accent: '#c084fc', bg: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)' };
      case 'emerald': return { accent: '#34d399', bg: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.3)' };
      case 'rose': return { accent: '#fb7185', bg: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)' };
      case 'amber':
      default: return { accent: 'var(--accent-amber)', bg: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)' };
    }
  };

  const style = getColorStyle();

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: style.bg,
        border: style.border,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: style.accent, fontSize: '0.8rem', fontWeight: 600 }}>
        <StickyNote size={16} />
        <span>{getTranslation(lang, 'widgetPostIt')}</span>
      </div>

      <div style={{
        fontSize: '0.84rem',
        color: '#ffffff',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.5',
        minHeight: '60px'
      }}>
        {noteText}
      </div>
    </div>
  );
};
