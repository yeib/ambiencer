import React, { useState } from 'react';
import { Clock, Cpu, StickyNote, Sparkles, Monitor, MapPin, SlidersHorizontal, ChevronDown, ChevronUp, Plus, Trash2, Globe } from 'lucide-react';
import { ClockWidget } from './widgets/ClockWidget';
import { SysMonitorWidget } from './widgets/SysMonitorWidget';
import { PostItWidget } from './widgets/PostItWidget';
import { AppSettings, WidgetState, WidgetSettings } from '../types';
import { getTranslation } from '../i18n';

interface WidgetsTabProps {
  settings: AppSettings;
  widgets: WidgetState[];
  onToggleTestWidget: (id: string) => void;
  onToggleDesktopWidget: (id: string) => void;
  onUpdateWidgetPosition: (id: string, pos: { x: number; y: number }) => void;
  onUpdateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;
  onAddPostItWidget: () => void;
  onAddClockWidget: () => void;
  onDeleteWidget: (id: string) => void;
}

export const WidgetsTab: React.FC<WidgetsTabProps> = ({
  settings,
  widgets,
  onToggleTestWidget,
  onToggleDesktopWidget,
  onUpdateWidgetPosition,
  onUpdateWidgetSettings,
  onAddPostItWidget,
  onAddClockWidget,
  onDeleteWidget,
}) => {
  const lang = settings.language;
  const isEs = lang === 'es';
  const [expandedEditId, setExpandedEditId] = useState<string | null>(null);

  const getWidgetTitle = (w: WidgetState) => {
    switch (w.type) {
      case 'clock':
        if (w.settings?.cityLabel) return w.settings.cityLabel;
        return w.id === 'clock'
          ? getTranslation(lang, 'widgetClock')
          : isEs ? `Reloj Mundial (${w.id.replace('clock_', 'N°')})` : `World Clock (${w.id})`;
      case 'sysmonitor':
        return isEs ? 'Monitor de Hardware Real (RAM / CPU / Temp / Discos)' : 'Real Hardware Monitor (RAM / CPU / Temp / Disks)';
      case 'postit':
        return isEs ? `Meta & Recordatorio del Día (${w.id === 'postit' ? 'Principal' : w.id.replace('postit_', 'N°')})` : `Daily Goal & Focus Target (${w.id})`;
      default:
        return w.type;
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'clock': return <Clock size={20} />;
      case 'sysmonitor': return <Cpu size={20} />;
      case 'postit': return <StickyNote size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const renderWidgetPreview = (w: WidgetState) => {
    switch (w.type) {
      case 'clock': return <ClockWidget settings={settings} widgetSettings={w.settings} />;
      case 'sysmonitor': return <SysMonitorWidget settings={settings} widgetSettings={w.settings} />;
      case 'postit': return <PostItWidget settings={settings} widgetSettings={w.settings} />;
      default: return null;
    }
  };

  const setPresetPosition = (id: string, key: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right') => {
    const screenW = window.screen.width || window.innerWidth || 1920;
    const availH = window.screen.availHeight || (window.innerHeight - 60);

    const sameCornerCount = widgets.filter(
      (w) => w.id !== id && (w.desktopActive || w.enabled) && w.settings?.cornerPreset === key
    ).length;

    const stackOffsetY = sameCornerCount * 190;
    let pos = { x: 40, y: 40 };

    switch (key) {
      case 'top-left':
        pos = { x: 40, y: 40 + stackOffsetY };
        break;
      case 'top-right':
        pos = { x: Math.max(40, screenW - 360), y: 40 + stackOffsetY };
        break;
      case 'center':
        pos = { x: Math.max(40, Math.floor((screenW - 320) / 2)), y: Math.max(40, Math.floor((availH - 220) / 2) + stackOffsetY) };
        break;
      case 'bottom-left':
        pos = { x: 40, y: Math.max(40, availH - 250 - stackOffsetY) };
        break;
      case 'bottom-right':
        pos = { x: Math.max(40, screenW - 360), y: Math.max(40, availH - 250 - stackOffsetY) };
        break;
    }

    onUpdateWidgetSettings(id, { cornerPreset: key });
    onUpdateWidgetPosition(id, pos);
  };

  const activeWidgetsList = widgets.filter((w) => ['clock', 'sysmonitor', 'postit'].includes(w.type));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
          ✨ {getTranslation(lang, 'tabWidgets')}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isEs
            ? 'Widgets flotantes personalizables para probar en tiempo real o fijar limpiamente en tu escritorio de Windows.'
            : 'Customizable floating widgets to test in-app or pin cleanly to your Windows desktop.'}
        </p>
      </div>

      {/* Instructional Banner */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', border: 'var(--border-glass)', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(15, 23, 42, 0.5)' }}>
        <Sparkles size={24} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          <strong style={{ color: '#ffffff' }}>
            {isEs ? '💡 Suite de Widgets Esenciales & Multi-Relojes Mundiales:' : '💡 Essential Widgets & World Clocks:'}
          </strong>
          <br />
          • <strong style={{ color: '#c084fc' }}>{isEs ? '🧪 Probar en App:' : '🧪 Test in App:'}</strong> {isEs ? 'Abre el widget flotante con marco dentro de esta ventana para probarlo y moverlo.' : 'Opens floating widget inside this window to drag and test.'}
          <br />
          • <strong style={{ color: 'var(--accent-cyan)' }}>{isEs ? '🖥️ Fijar en Escritorio:' : '🖥️ Pin to Desktop:'}</strong> {isEs ? 'Fija el widget 100% transparente sin marcos molestos sobre tu fondo de Windows.' : 'Pins clean widget onto your desktop background.'}
          <br />
          • <strong style={{ color: 'var(--accent-amber)' }}>{isEs ? '⚙️ Personalizar & Multi-Relojes:' : '⚙️ Customize & Multi-Clocks:'}</strong> {isEs ? 'Agrega múltiples relojes con distintas zonas horarias (Tokio, Nueva York, Londres) o notas de metas del día.' : 'Add multiple clocks with different timezones (Tokyo, NY, London) or daily goal notes.'}
        </div>
      </div>

      {/* Grid of Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {activeWidgetsList.map((w) => {
          const isDesktopActive = !!(w.desktopActive || w.enabled);
          const isTestActive = !!w.testActive;
          const isExpanded = expandedEditId === w.id;
          const isExtraWidget = w.id !== 'clock' && w.id !== 'sysmonitor' && w.id !== 'postit';

          return (
            <div
              key={w.id}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: isDesktopActive ? 'var(--border-accent)' : isTestActive ? '1px solid rgba(192, 132, 252, 0.6)' : 'var(--border-glass)',
                background: isDesktopActive ? 'rgba(38, 50, 78, 0.4)' : isTestActive ? 'rgba(40, 20, 60, 0.35)' : 'var(--bg-glass-card)',
                transition: 'all 0.2s'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isDesktopActive ? 'var(--accent-cyan-glow)' : isTestActive ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isDesktopActive ? 'var(--accent-cyan)' : isTestActive ? '#c084fc' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getWidgetIcon(w.type)}
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: (isDesktopActive || isTestActive) ? '#ffffff' : 'var(--text-main)' }}>
                    {getWidgetTitle(w)}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Expand Edit Options Button */}
                  <button
                    onClick={() => setExpandedEditId(isExpanded ? null : w.id)}
                    style={{
                      background: isExpanded ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: 'var(--border-glass)',
                      borderRadius: 'var(--radius-sm)',
                      color: isExpanded ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <SlidersHorizontal size={13} />
                    <span>{isEs ? 'Personalizar' : 'Customize'}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {/* Delete Extra Widget Button */}
                  {isExtraWidget && (
                    <button
                      onClick={() => onDeleteWidget(w.id)}
                      title={isEs ? 'Eliminar este widget' : 'Delete this widget'}
                      style={{
                        background: 'rgba(244, 63, 94, 0.15)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fb7185',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Custom Settings Panel */}
              {isExpanded && (
                <div style={{
                  padding: '14px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '0.8rem'
                }}>
                  {/* 1. Clock Customization */}
                  {w.type === 'clock' && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span>{isEs ? 'Nombre / Etiqueta de Ciudad:' : 'City Name / Label:'}</span>
                        <input
                          type="text"
                          value={w.settings?.cityLabel ?? ''}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { cityLabel: e.target.value })}
                          placeholder={isEs ? 'Ej: 📍 Tokio, 📍 Nueva York, 📍 Madrid' : 'e.g. 📍 Tokyo, 📍 New York'}
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            color: '#ffffff',
                            padding: '6px 8px',
                            fontSize: '0.78rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Zona Horaria:' : 'Timezone:'}</span>
                        <select
                          value={w.settings?.timezoneOffset ?? 'local'}
                          onChange={(e) => {
                            const val = e.target.value === 'local' ? undefined : parseFloat(e.target.value);
                            onUpdateWidgetSettings(w.id, { timezoneOffset: val });
                          }}
                          style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '0.78rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="local">{isEs ? 'Local (Tu PC)' : 'Local PC Time'}</option>
                          <option value="0">Londres / UTC+0</option>
                          <option value="1">Madrid / París / UTC+1</option>
                          <option value="-5">Nueva York / Miami / UTC-5</option>
                          <option value="-8">Los Ángeles / UTC-8</option>
                          <option value="9">Tokio / Japón / UTC+9</option>
                          <option value="10">Sídney / Australia / UTC+10</option>
                          <option value="-3">Santiago / BsAs / UTC-3</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Estilo de reloj:' : 'Clock style:'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => onUpdateWidgetSettings(w.id, { clockStyle: 'digital' })}
                            style={{ padding: '3px 8px', borderRadius: '4px', background: (w.settings?.clockStyle || 'digital') === 'digital' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)', color: (w.settings?.clockStyle || 'digital') === 'digital' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                          >Digital</button>
                          <button
                            onClick={() => onUpdateWidgetSettings(w.id, { clockStyle: 'analog' })}
                            style={{ padding: '3px 8px', borderRadius: '4px', background: w.settings?.clockStyle === 'analog' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)', color: w.settings?.clockStyle === 'analog' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                          >Analógico</button>
                        </div>
                      </div>

                      {w.settings?.clockStyle !== 'analog' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{isEs ? 'Formato de hora:' : 'Time format:'}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => onUpdateWidgetSettings(w.id, { clockFormat: '24h' })}
                              style={{ padding: '3px 8px', borderRadius: '4px', background: (w.settings?.clockFormat || '24h') === '24h' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)', color: (w.settings?.clockFormat || '24h') === '24h' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            >24H</button>
                            <button
                              onClick={() => onUpdateWidgetSettings(w.id, { clockFormat: '12h' })}
                              style={{ padding: '3px 8px', borderRadius: '4px', background: w.settings?.clockFormat === '12h' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)', color: w.settings?.clockFormat === '12h' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            >12H</button>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Tamaño del reloj:' : 'Clock size:'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {(['sm', 'md', 'lg'] as const).map((sz) => (
                            <button
                              key={sz}
                              onClick={() => onUpdateWidgetSettings(w.id, { clockSize: sz })}
                              style={{ padding: '3px 8px', borderRadius: '4px', background: (w.settings?.clockSize || 'md') === sz ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)', color: (w.settings?.clockSize || 'md') === sz ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase' }}
                            >{sz}</button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar segundos:' : 'Show seconds:'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showSeconds !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showSeconds: e.target.checked })}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar fecha:' : 'Show date:'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showDate !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showDate: e.target.checked })}
                        />
                      </div>
                    </>
                  )}

                  {/* 2. SysMonitor Customization */}
                  {w.type === 'sysmonitor' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar uso de CPU & Temp:' : 'Show CPU & Temp:'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showCpu !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showCpu: e.target.checked })}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar memoria RAM:' : 'Show RAM metric:'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showRam !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showRam: e.target.checked })}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar unidades de Disco (C:, D...):' : 'Show Disks (C:, D...):'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showDisk !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showDisk: e.target.checked })}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar estado de Batería & Carga:' : 'Show Battery & Charging:'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showBattery !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showBattery: e.target.checked })}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Mostrar estado de Conexión Red:' : 'Show Network status:'}</span>
                        <input
                          type="checkbox"
                          checked={w.settings?.showNet !== false}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { showNet: e.target.checked })}
                        />
                      </div>
                    </>
                  )}

                  {/* 3. Post-It Customization */}
                  {w.type === 'postit' && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span>{isEs ? 'Texto de la Meta u Objetivo del Día:' : 'Daily Focus Goal Text:'}</span>
                        <textarea
                          rows={3}
                          value={w.settings?.postItText ?? (isEs ? '🎯 Mi Objetivo de Hoy:\n• Mantener la calma y concentrarme\n• Terminar la versión de Ambiencer' : '🎯 Today\'s Focus:\n• Stay calm and focus\n• Finish Ambiencer release')}
                          onChange={(e) => onUpdateWidgetSettings(w.id, { postItText: e.target.value })}
                          placeholder={isEs ? 'Escribe aquí tu meta u objetivo...' : 'Type your focus goal here...'}
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            color: '#ffffff',
                            padding: '6px 8px',
                            fontSize: '0.78rem',
                            resize: 'vertical',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isEs ? 'Color de nota / marco glass:' : 'Note color / glass accent:'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {(['amber', 'cyan', 'purple', 'emerald', 'rose'] as const).map((clr) => (
                            <button
                              key={clr}
                              onClick={() => onUpdateWidgetSettings(w.id, { postItColor: clr })}
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: clr === 'amber' ? '#f59e0b' : clr === 'cyan' ? '#38bdf8' : clr === 'purple' ? '#c084fc' : clr === 'emerald' ? '#34d399' : '#fb7185',
                                border: (w.settings?.postItColor || 'amber') === clr ? '2px solid #fff' : 'none',
                                cursor: 'pointer'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons: 1. Probar en App / 2. Fijar en Escritorio */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* 1. Test In-App */}
                <button
                  onClick={() => onToggleTestWidget(w.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: isTestActive ? '1px solid #c084fc' : 'var(--border-glass)',
                    background: isTestActive ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: isTestActive ? '#e9d5ff' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Sparkles size={14} />
                  <span>
                    {isTestActive
                      ? (isEs ? 'Probando en App' : 'Testing in App')
                      : (isEs ? 'Probar en App' : 'Test in App')}
                  </span>
                </button>

                {/* 2. Pin to Desktop */}
                <button
                  onClick={() => onToggleDesktopWidget(w.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: isDesktopActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(56, 189, 248, 0.35)',
                    background: isDesktopActive ? 'var(--accent-cyan)' : 'rgba(56, 189, 248, 0.12)',
                    color: isDesktopActive ? '#090b10' : 'var(--accent-cyan)',
                    boxShadow: isDesktopActive ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Monitor size={14} />
                  <span>
                    {isDesktopActive
                      ? (isEs ? 'En Escritorio' : 'On Desktop')
                      : (isEs ? 'Fijar Escritorio' : 'Pin to Desktop')}
                  </span>
                </button>
              </div>

              {/* Position Controls for Desktop Pinned Widgets */}
              {isDesktopActive && (
                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    <MapPin size={13} />
                    <span>{isEs ? 'Posición en Pantalla de Escritorio:' : 'Desktop Screen Position:'}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                    <button
                      onClick={() => setPresetPosition(w.id, 'top-left')}
                      title={isEs ? 'Arriba Izquierda' : 'Top Left'}
                      style={{ padding: '5px 2px', borderRadius: '4px', border: 'var(--border-glass)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      ↖️
                    </button>
                    <button
                      onClick={() => setPresetPosition(w.id, 'top-right')}
                      title={isEs ? 'Arriba Derecha' : 'Top Right'}
                      style={{ padding: '5px 2px', borderRadius: '4px', border: 'var(--border-glass)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      ↗️
                    </button>
                    <button
                      onClick={() => setPresetPosition(w.id, 'center')}
                      title={isEs ? 'Centro' : 'Center'}
                      style={{ padding: '5px 2px', borderRadius: '4px', border: 'var(--border-glass)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      🎯
                    </button>
                    <button
                      onClick={() => setPresetPosition(w.id, 'bottom-left')}
                      title={isEs ? 'Abajo Izquierda' : 'Bottom Left'}
                      style={{ padding: '5px 2px', borderRadius: '4px', border: 'var(--border-glass)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      ↙️
                    </button>
                    <button
                      onClick={() => setPresetPosition(w.id, 'bottom-right')}
                      title={isEs ? 'Abajo Derecha' : 'Bottom Right'}
                      style={{ padding: '5px 2px', borderRadius: '4px', border: 'var(--border-glass)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      ↘️
                    </button>
                  </div>
                </div>
              )}

              {/* Widget Live Component Preview */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                {renderWidgetPreview(w)}
              </div>

              {/* Inline Add Button inside Clock or Post-It cards */}
              {w.type === 'clock' && w.id === 'clock' && (
                <button
                  onClick={onAddClockWidget}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed rgba(56, 189, 248, 0.4)',
                    background: 'rgba(56, 189, 248, 0.08)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Globe size={14} />
                  <span>{isEs ? '+ Agregar Otro Reloj (Ciudad / Zona Horaria)' : '+ Add Another World Clock'}</span>
                </button>
              )}

              {w.type === 'postit' && w.id === 'postit' && (
                <button
                  onClick={onAddPostItWidget}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed rgba(251, 191, 36, 0.4)',
                    background: 'rgba(251, 191, 36, 0.08)',
                    color: 'var(--accent-amber)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={14} />
                  <span>{isEs ? '+ Agregar Otra Nota / Meta del Día' : '+ Add Another Daily Goal Note'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
