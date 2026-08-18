'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Priority, Task, TaskPatch } from '@/types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `请求失败 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function useTasks(dateKey: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion(v => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await request<Task[]>(`/api/tasks?date=${encodeURIComponent(dateKey)}`);
        if (!cancelled) setTasks(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dateKey, version]);

  const addTask = async (title: string, priority: Priority, timeStart: string, timeEnd: string) => {
    const task = await request<Task>('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority, timeStart, timeEnd, dateKey }),
    });
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = async (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const completed = !target.completed;
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed } : t)));
    try {
      await request(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
    } catch {
      reload();
    }
  };

  const updateTask = async (id: string, patch: TaskPatch) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
    try {
      await request(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch {
      reload();
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await request(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch {
      reload();
    }
  };

  const clearDone = async () => {
    setTasks(prev => prev.filter(t => !t.completed));
    try {
      await request(`/api/tasks?date=${encodeURIComponent(dateKey)}&completedOnly=1`, {
        method: 'DELETE',
      });
    } catch {
      reload();
    }
  };

  const clearAll = async () => {
    setTasks([]);
    try {
      await request(`/api/tasks?date=${encodeURIComponent(dateKey)}`, { method: 'DELETE' });
    } catch {
      reload();
    }
  };

  return {
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
  };
}
