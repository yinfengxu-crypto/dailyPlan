'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Priority, Task, TaskPatch } from '../types';
import { PRIORITY_META, rgba } from '../themes';
import { isOverdue } from '../utils/date';
import { useI18n } from '../i18n';
import Countdown from './Countdown';
import TimePicker from './TimePicker';

interface Props {
  task: Task;
  dateKey: string;
  selected: boolean;
  onSelect: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, patch: TaskPatch) => void;
}

const ORDER: Priority[] = ['high', 'medium', 'low'];

export default function TaskItem({
  task,
  dateKey,
  selected,
  onSelect,
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftPriority, setDraftPriority] = useState<Priority>(task.priority);
  const [draftStart, setDraftStart] = useState(task.timeStart ?? '');
  const [draftEnd, setDraftEnd] = useState(task.timeEnd ?? '');

  const meta = PRIORITY_META[task.priority];
  const overdue = !task.completed && isOverdue(task, dateKey);

  const timeText = task.timeStart
    ? task.timeEnd
      ? `${task.timeStart} – ${task.timeEnd}`
      : task.timeStart
    : task.timeEnd
      ? `${t('time.to')} ${task.timeEnd}`
      : '';

  const startEdit = () => {
    setDraftTitle(task.title);
    setDraftPriority(task.priority);
    setDraftStart(task.timeStart ?? '');
    setDraftEnd(task.timeEnd ?? '');
    setEditing(true);
  };

  const save = () => {
    const title = draftTitle.trim();
    if (!title) {
      setEditing(false);
      return;
    }
    onEdit(task.id, { title, priority: draftPriority, timeStart: draftStart, timeEnd: draftEnd });
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <li
      className={`task-item ${task.completed ? 'done' : ''} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="task-row">
        <button
          className="check"
          onClick={e => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          aria-label={task.completed ? t('task.undoAria') : t('task.doneAria')}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>

        <div className="task-body">
          {editing ? (
            <div className="edit-panel" onClick={e => e.stopPropagation()}>
              <input
                className="edit-input"
                value={draftTitle}
                autoFocus
                onChange={e => setDraftTitle(e.target.value)}
                onKeyDown={onKey}
                maxLength={120}
              />
              <div className="edit-row">
                <div className="priority-seg" role="group" aria-label={t('task.priority')}>
                  {ORDER.map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`prio-opt ${draftPriority === p ? 'active' : ''}`}
                      onClick={() => setDraftPriority(p)}
                      style={
                        draftPriority === p
                          ? { background: PRIORITY_META[p].color, color: '#fff' }
                          : undefined
                      }
                    >
                      {t(`add.${p}`)}
                    </button>
                  ))}
                </div>
                <div className="time-range">
                  <TimePicker value={draftStart} onChange={setDraftStart} placeholder={t('add.start')} />
                  <span className="time-range-sep">{t('add.to')}</span>
                  <TimePicker value={draftEnd} onChange={setDraftEnd} placeholder={t('add.end')} />
                </div>
              </div>
              <div className="edit-actions">
                <button type="button" className="edit-save" onClick={save}>
                  {t('task.save')}
                </button>
                <button type="button" className="edit-cancel" onClick={cancel}>
                  {t('task.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="title">{task.title}</span>
              <div className="meta">
                <span
                  className="badge"
                  style={{ color: meta.color, background: rgba(meta.color, 0.14) }}
                >
                  {t(`add.${task.priority}`)}
                </span>
                {overdue && <span className="badge overdue">{t('task.overdue')}</span>}
                {timeText && <span className="time-tag">🕐 {timeText}</span>}
              </div>
            </>
          )}
        </div>

        <div className="actions">
          <button
            className="icon-btn"
            onClick={e => {
              e.stopPropagation();
              startEdit();
            }}
            aria-label={t('task.editAria')}
            title={t('task.edit')}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
          <button
            className="icon-btn del"
            onClick={e => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            aria-label={t('task.deleteAria')}
            title={t('task.delete')}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      {selected && (
        <Countdown
          dateKey={dateKey}
          timeStart={task.timeStart}
          timeEnd={task.timeEnd}
          completed={task.completed}
        />
      )}
    </li>
  );
}
