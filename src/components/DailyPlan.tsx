'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Filter, Priority, SortBy } from '../types';
import { THEMES, themeVars } from '../themes';
import { QUOTES } from '../quotes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { useI18n } from '../i18n';
import { addDays, isOverdue, isToday, todayKey } from '../utils/date';
import Settings from './Settings';
import DatePicker from './DatePicker';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import ProgressBar from './ProgressBar';
import ProgressRing from './ProgressRing';
import ToastViewport from './ToastViewport';

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export default function DailyPlan() {
  const { locale, t } = useI18n();
  const [themeId, setThemeId] = useLocalStorage<string>('dailyplan:theme', 'dawn');
  const [dateKey, setDateKey] = useState(todayKey());
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('priority');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());

  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    clearDone,
    clearAll,
    reload,
  } = useTasks(dateKey);
  const { toasts, push } = useToast();

  // 拉取所有有计划任务的日期，用于日历标记
  useEffect(() => {
    fetch('/api/tasks/summary')
      .then(r => (r.ok ? r.json() : []))
      .then(dates => setMarkedDates(new Set(dates as string[])))
      .catch(() => {});
  }, [tasks]);

  // 按 / 快速聚焦添加输入框
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        document.getElementById('add-task-input')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];
  const done = tasks.filter(t => t.completed).length;
  const overdueCount = tasks.filter(t => !t.completed && isOverdue(t, dateKey)).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const allDone = tasks.length > 0 && done === tasks.length;

  const sorted = useMemo(() => {
    const copy = [...tasks];
    copy.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.completed) return 0;
      if (sortBy === 'time') {
        const d = (a.timeStart ?? '99:99').localeCompare(b.timeStart ?? '99:99');
        if (d !== 0) return d;
        return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      }
      if (sortBy === 'created') return b.createdAt - a.createdAt;
      const w = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      if (w !== 0) return w;
      return (a.timeStart ?? '99:99').localeCompare(b.timeStart ?? '99:99');
    });
    return copy;
  }, [tasks, sortBy]);

  const filtered = useMemo(() => {
    let list = sorted;
    if (filter === 'active') list = list.filter(t => !t.completed);
    else if (filter === 'completed') list = list.filter(t => t.completed);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(t => t.title.toLowerCase().includes(q));
    return list;
  }, [sorted, filter, query]);

  const quote = useMemo(() => {
    const list = QUOTES[locale] ?? QUOTES['zh-CN'];
    let h = 0;
    for (const c of dateKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return list[h % list.length];
  }, [dateKey, locale]);

  const handleAdd = async (title: string, priority: Priority, timeStart: string, timeEnd: string) => {
    try {
      await addTask(title, priority, timeStart, timeEnd);
      push(t('toast.added'), 'success');
    } catch {
      push(t('toast.addFailed'), 'error');
    }
  };

  const handleDelete = (id: string) => {
    void deleteTask(id);
    push(t('toast.deleted'), 'info');
  };

  const handleClearDone = () => {
    void clearDone();
    push(t('toast.cleared'), 'info');
  };

  const handleClearAll = () => {
    void clearAll();
    push(t('toast.clearedAll'), 'info');
  };

  return (
    <div className="app" style={themeVars(theme)}>
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <ToastViewport toasts={toasts} />

      <main className="container">
        <header className="topbar">
          <div className="brand">
            <span className="logo">✨</span>
            <div>
              <h1>{t('app.title')}</h1>
              <p>{t('app.subtitle')}</p>
            </div>
          </div>
          <Settings themeId={themeId} onSelectTheme={setThemeId} />
        </header>

        <div className="datebar">
          <button className="nav-btn" onClick={() => setDateKey(addDays(dateKey, -1))} aria-label={t('date.prev')}>
            ‹
          </button>
          <DatePicker value={dateKey} onChange={setDateKey} markedDates={markedDates} />
          <button className="nav-btn" onClick={() => setDateKey(addDays(dateKey, 1))} aria-label={t('date.next')}>
            ›
          </button>
          {!isToday(dateKey) && (
            <button className="today-btn" onClick={() => setDateKey(todayKey())}>
              {t('date.backToday')}
            </button>
          )}
        </div>

        <section className="card stats">
          <p className="quote">“{quote}”</p>
          <div className="stats-body">
            <div className="stats-counts">
              <div className="stats-row">
                <span>
                  {t('stats.planned')} <b>{tasks.length}</b> {t('stats.items')} ·{' '}
                  {t('stats.completed')} <b>{done}</b> ·{' '}
                  {t('stats.remaining')} <b>{tasks.length - done}</b>
                  {overdueCount > 0 && (
                    <>
                      {' '}· {t('stats.overdue')} <b className="overdue-num">{overdueCount}</b>
                    </>
                  )}
                </span>
              </div>
              <ProgressBar percent={percent} />
              {allDone && <p className="celebrate">{t('stats.allDone')}</p>}
            </div>
            <ProgressRing percent={percent} />
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <span>⚠️ {t('error.loadFailed')}</span>
            <button onClick={reload}>{t('error.retry')}</button>
          </div>
        )}

        <AddTaskForm onAdd={handleAdd} notify={push} />

        <TaskList
          tasks={filtered}
          total={tasks.length}
          done={done}
          filter={filter}
          dateKey={dateKey}
          selectedId={selectedId}
          loading={loading}
          sortBy={sortBy}
          onSortBy={setSortBy}
          query={query}
          onQuery={setQuery}
          onFilter={setFilter}
          onClearDone={handleClearDone}
          onClearAll={handleClearAll}
          onSelect={setSelectedId}
          onToggle={id => void toggleTask(id)}
          onDelete={handleDelete}
          onEdit={(id, patch) => void updateTask(id, patch)}
        />

        <footer className="footer">
          <p>{t('footer.text')}</p>
          <p className="footer-hint">{t('footer.hint')}</p>
        </footer>
      </main>
    </div>
  );
}
