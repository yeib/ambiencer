import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Server } from 'lucide-react';
import { AppSettings } from '../../types';
import { getTranslation } from '../../i18n';

interface SysMonitorWidgetProps {
  settings: AppSettings;
}

export const SysMonitorWidget: React.FC<SysMonitorWidgetProps> = ({ settings }) => {
  const [cpu, setCpu] = useState<number>(24);
  const [ram, setRam] = useState<number>(48);
  const [disk, setDisk] = useState<number>(62);
  const lang = settings.language;

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(18 + Math.random() * 22));
      setRam(Math.floor(45 + Math.random() * 8));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 600 }}>
        <Cpu size={16} />
        <span>{getTranslation(lang, 'widgetSysMonitor')}</span>
      </div>

      {/* CPU Meter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{getTranslation(lang, 'sysCpu')}</span>
          <strong style={{ color: 'var(--text-main)' }}>{cpu}%</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${cpu}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* RAM Meter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{getTranslation(lang, 'sysRam')}</span>
          <strong style={{ color: 'var(--text-main)' }}>{ram}% (7.6 GB)</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${ram}%`, height: '100%', background: 'var(--accent-purple)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Disk Meter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{getTranslation(lang, 'sysDisk')}</span>
          <strong style={{ color: 'var(--text-main)' }}>{disk}% (312 GB)</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${disk}%`, height: '100%', background: 'var(--accent-emerald)', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  );
};
