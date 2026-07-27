import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { AppSettings, WidgetSettings } from '../../types';

interface QuotesWidgetProps {
  settings: AppSettings;
  widgetSettings?: WidgetSettings;
}

export const QuotesWidget: React.FC<QuotesWidgetProps> = ({ settings, widgetSettings }) => {
  const isEs = settings.language === 'es';
  const customQuote = widgetSettings?.quoteText;
  const customAuthor = widgetSettings?.quoteAuthor;

  const defaultQuote = isEs
    ? '«La tranquilidad perfecta consiste en el buen orden de la mente»'
    : '«Peace comes from within. Do not seek it without.»';
  const defaultAuthor = isEs ? 'Marco Aurelio' : 'Buddha';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 18px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.8rem', fontWeight: 600 }}>
        <Quote size={15} />
        <span>{isEs ? 'Frase & Enfoque Diario' : 'Daily Focus Quote'}</span>
      </div>

      <p style={{
        fontSize: '0.88rem',
        fontStyle: 'italic',
        color: '#ffffff',
        lineHeight: '1.45',
        margin: '2px 0',
        textAlign: 'center'
      }}>
        {customQuote || defaultQuote}
      </p>

      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>
        — {customAuthor || defaultAuthor}
      </div>
    </div>
  );
};
