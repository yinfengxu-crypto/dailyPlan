'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Priority } from '../types';
import { PRIORITY_META } from '../themes';
import { useI18n } from '../i18n';
import TimePicker from './TimePicker';

interface Props {
  onAdd: (title: string, priority: Priority, timeStart: string, timeEnd: string) => void;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ORDER: Priority[] = ['high', 'medium', 'low'];

export default function AddTaskForm({ onAdd, notify }: Props) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [shaking, setShaking] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const val = title.trim();
    if (!val) {
      notify(t('add.emptyHint'), 'error');
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }
    onAdd(val, priority, timeStart, timeEnd);
    setTitle('');
    setTimeStart('');
    setTimeEnd('');
    setPriority('medium');
  };

  return (
    <form className={`card add-form ${shaking ? 'shake' : ''}`} onSubmit={submit}>
      <input
        id="add-task-input"
        className="add-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder={t('add.placeholder')}
        maxLength={120}
        autoComplete="off"
      />
      <div className="form-row">
        <div className="priority-seg" role="group" aria-label={t('add.priority')}>
          {ORDER.map(p => (
            <button
              key={p}
              type="button"
              className={`prio-opt ${priority === p ? 'active' : ''}`}
              onClick={() => setPriority(p)}
              style={priority === p ? { background: PRIORITY_META[p].color, color: '#fff' } : undefined}
            >
              {t(`add.${p}`)}
            </button>
          ))}
        </div>

        <div className="time-range">
          <TimePicker value={timeStart} onChange={setTimeStart} placeholder={t('add.start')} />
          <span className="time-range-sep">{t('add.to')}</span>
          <TimePicker value={timeEnd} onChange={setTimeEnd} placeholder={t('add.end')} />
        </div>

        <button type="submit" className="add-btn">
          {t('add.button')}
        </button>
      </div>
    </form>
  );
}
