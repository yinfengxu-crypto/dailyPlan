import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { Priority, Task } from '@/types';

type DB = InstanceType<typeof Database>;

const globalForDb = globalThis as unknown as { __dailyplanDb?: DB };

export interface TaskRow {
  id: string;
  date_key: string;
  title: string;
  priority: Priority;
  time_start: string | null;
  time_end: string | null;
  completed: number;
  created_at: number;
  updated_at: number;
}

export function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    timeStart: row.time_start ?? undefined,
    timeEnd: row.time_end ?? undefined,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

function migrate(db: DB) {
  const cols = (db.prepare('PRAGMA table_info(tasks)').all() as { name: string }[]).map(c => c.name);
  if (!cols.includes('time_start')) {
    db.exec('ALTER TABLE tasks ADD COLUMN time_start TEXT');
  }
  if (!cols.includes('time_end')) {
    db.exec('ALTER TABLE tasks ADD COLUMN time_end TEXT');
  }
  // 兼容旧版本：把旧的 time 字段迁移为 time_start
  if (cols.includes('time')) {
    db.exec('UPDATE tasks SET time_start = time WHERE time_start IS NULL AND time IS NOT NULL');
  }
}

function createDatabase(): DB {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(path.join(dir, 'dailyplan.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      date_key TEXT NOT NULL,
      title TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      time_start TEXT,
      time_end TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date_key);
  `);
  migrate(db);
  return db;
}

export const db: DB = globalForDb.__dailyplanDb ?? createDatabase();

// 开发模式下缓存连接，避免热更新时重复创建
if (process.env.NODE_ENV !== 'production') {
  globalForDb.__dailyplanDb = db;
}
