import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db, toTask } from '@/lib/db';
import type { TaskRow } from '@/lib/db';
import type { Priority } from '@/types';

export const runtime = 'nodejs';

// GET /api/tasks?date=YYYY-MM-DD —— 获取某天的所有任务
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: '缺少 date 参数' }, { status: 400 });
  }
  const rows = db
    .prepare('SELECT * FROM tasks WHERE date_key = ? ORDER BY created_at DESC, id DESC')
    .all(date) as TaskRow[];
  return NextResponse.json(rows.map(toTask));
}

// POST /api/tasks —— 新建任务
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const dateKey = typeof body?.dateKey === 'string' ? body.dateKey : '';
  const priority: Priority = ['high', 'medium', 'low'].includes(body?.priority)
    ? (body.priority as Priority)
    : 'medium';
  const timeStart = typeof body?.timeStart === 'string' && body.timeStart.trim() ? body.timeStart.trim() : null;
  const timeEnd = typeof body?.timeEnd === 'string' && body.timeEnd.trim() ? body.timeEnd.trim() : null;

  if (!title || !dateKey) {
    return NextResponse.json({ error: '标题和日期不能为空' }, { status: 400 });
  }
  if (title.length > 120) {
    return NextResponse.json({ error: '标题过长' }, { status: 400 });
  }

  const id = randomUUID();
  const now = Date.now();
  db.prepare(
    'INSERT INTO tasks (id, date_key, title, priority, time_start, time_end, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)',
  ).run(id, dateKey, title, priority, timeStart, timeEnd, now, now);

  return NextResponse.json(
    {
      id,
      title,
      priority,
      timeStart: timeStart ?? undefined,
      timeEnd: timeEnd ?? undefined,
      completed: false,
      createdAt: now,
    },
    { status: 201 },
  );
}

// DELETE /api/tasks?date=YYYY-MM-DD[&completedOnly=1] —— 清除某天任务 / 清除已完成
export async function DELETE(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  const completedOnly = req.nextUrl.searchParams.get('completedOnly') === '1';

  if (!date) {
    return NextResponse.json({ error: '缺少 date 参数' }, { status: 400 });
  }

  if (completedOnly) {
    db.prepare('DELETE FROM tasks WHERE date_key = ? AND completed = 1').run(date);
  } else {
    db.prepare('DELETE FROM tasks WHERE date_key = ?').run(date);
  }
  return NextResponse.json({ ok: true });
}
