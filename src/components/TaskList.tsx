'use client';

import type { Filter, SortBy, Task, TaskPatch } from '../types';
import { useI18n } from '../i18n';
import TaskItem from './TaskItem';
import SortSelect from './SortSelect';

interface Props {
  tasks: Task[];
  total: number;
  done: number;
  filter: Filter;
  dateKey: string;
  selectedId: string | null;
  loading?: boolean;
  sortBy: SortBy;
  onSortBy: (s: SortBy) => void;
  query: string;
  onQuery: (q: string) => void;
  onFilter: (f: Filter) => void;
  onClearDone: () => void;
  onClearAll: () => void;
  onSelect: (id: string | null) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, patch: TaskPatch) => void;
}

export default function TaskList({
  tasks,
  total,
  done,
  filter,
  dateKey,
  selectedId,
  loading = false,
  sortBy,
  onSortBy,
  query,
  onQuery,
  onFilter,
  onClearDone,
  onClearAll,
  onSelect,
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  const { t } = useI18n();

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: t('filter.all') },
    { id: 'active', label: t('filter.active') },
    { id: 'completed', label: t('filter.completed') },
  ];

  const counts = { all: total, active: total - done, completed: done };

  const empty = () => {
    if (total === 0) return { icon: '🎯', title: t('empty.noneTitle'), desc: t('empty.noneDesc') };
    if (filter === 'active')
      return { icon: '🎉', title: t('empty.allDoneTitle'), desc: t('empty.allDoneDesc') };
    return { icon: '📝', title: t('empty.completedTitle'), desc: t('empty.completedDesc') };
  };

  const e = empty();

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => onFilter(f.id)}
            >
              {f.label} {counts[f.id]}
            </button>
          ))}
        </div>

        <div className="filter-tools">
          <input
            className="search-input"
            value={query}
            onChange={e => onQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
          />
          <SortSelect
            value={sortBy}
            onChange={onSortBy}
            options={[
              { value: 'priority', label: t('sort.priority') },
              { value: 'time', label: t('sort.time') },
              { value: 'created', label: t('sort.created') },
            ]}
          />
          {done > 0 && (
            <button className="clear-btn" onClick={onClearDone}>
              {t('filter.clearDone')}
            </button>
          )}
          {total > 0 && (
            <button className="clear-btn danger" onClick={onClearAll}>
              {t('filter.clearAll')}
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 && loading ? (
        <div className="card empty">
          <span className="spinner" aria-hidden="true" />
          <p>{t('empty.loading')}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty">
          <span className="empty-icon" role="img" aria-hidden="true">
            {e.icon}
          </span>
          <h3>{e.title}</h3>
          <p>{e.desc}</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              dateKey={dateKey}
              selected={task.id === selectedId}
              onSelect={() => onSelect(task.id === selectedId ? null : task.id)}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
