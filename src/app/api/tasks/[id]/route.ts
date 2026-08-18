import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db, toTask } from '@/lib/db';
import type { TaskRow } from '@/lib/db';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/tasks/:id —— 更新任务（标题、完成状态、优先级、时间）
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (typeof body?.title === 'string' && body.title.trim()) {
    updates.push('title = ?');
    values.push(body.title.trim());
  }
  if (typeof body?.completed === 'boolean') {
    updates.push('completed = ?');
    values.push(body.completed ? 1 : 0);
  }
  if (['high', 'medium', 'low'].includes(body?.priority)) {
    updates.push('priority = ?');
    values.push(body.priority as string);
  }
  if (body?.timeStart !== undefined) {
    updates.push('time_start = ?');
    values.push(typeof body.timeStart === 'string' && body.timeStart.trim() ? body.timeStart.trim() : null);
  }
  if (body?.timeEnd !== undefined) {
    updates.push('time_end = ?');
    values.push(typeof body.timeEnd === 'string' && body.timeEnd.trim() ? body.timeEnd.trim() : null);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: '没有可更新的字段' }, { status: 400 });
  }

  updates.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  const result = db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  if (result.changes === 0) {
    return NextResponse.json({ error: '任务不存在' }, { status: 404 });
  }

  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow;
  return NextResponse.json(toTask(row));
}

// DELETE /api/tasks/:id —— 删除任务
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
