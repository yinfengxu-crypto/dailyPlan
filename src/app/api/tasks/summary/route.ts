import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/tasks/summary —— 返回所有有计划任务的日期，用于日历标记
export async function GET() {
  const rows = db
    .prepare('SELECT DISTINCT date_key FROM tasks ORDER BY date_key')
    .all() as { date_key: string }[];
  return NextResponse.json(rows.map(r => r.date_key));
}
