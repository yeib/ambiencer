import React, { useState } from 'react';
import { StickyNote, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { AppSettings } from '../../types';
import { getTranslation } from '../../i18n';

interface PostItWidgetProps {
  settings: AppSettings;
}

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export const PostItWidget: React.FC<PostItWidgetProps> = ({ settings }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: '1', text: 'Revisar maqueta Ambiencer Pro', completed: true },
    { id: '2', text: 'Configurar presets de ondas binaurales', completed: false },
    { id: '3', text: 'Prueba de widgets de escritorio glassmorphic', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const lang = settings.language;

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 21, 35, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 600 }}>
        <StickyNote size={16} />
        <span>{getTranslation(lang, 'widgetPostIt')}</span>
      </div>

      {/* Input */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder={getTranslation(lang, 'postitPlaceholder')}
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.25)',
            border: 'var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            color: '#ffffff',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--accent-amber)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#090b10',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
        </button>
      </form>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.03)',
              fontSize: '0.8rem'
            }}
          >
            <div
              onClick={() => toggleTask(task.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
            >
              {task.completed ? <CheckSquare size={14} color="var(--accent-amber)" /> : <Square size={14} color="var(--text-dim)" />}
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-dim)' : 'var(--text-main)' }}>
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
