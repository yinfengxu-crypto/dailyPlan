import type { Locale, Task } from '../types';

const WEEK_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_JA = ['日', '月', '火', '水', '木', '金', '土'];

export const CAL_WEEK_LABELS: Record<Locale, string[]> = {
  'zh-CN': ['日', '一', '二', '三', '四', '五', '六'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  ja: ['日', '月', '火', '水', '木', '金', '土'],
};

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, delta: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + delta);
  return toKey(d);
}

export function isToday(key: string): boolean {
  return key === todayKey();
}

export function formatDate(key: string, locale: Locale): { main: string; week: string } {
  const d = fromKey(key);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = d.getDay();

  if (locale === 'en') {
    return { main: `${MONTHS_EN[d.getMonth()]} ${day}`, week: WEEK_EN[wd] };
  }
  const week = locale === 'ja' ? `${WEEK_JA[wd]}曜日` : WEEK_ZH[wd];
  return { main: `${m}月${day}日`, week };
}

export function monthTitle(y: number, m: number, locale: Locale): string {
  return locale === 'en' ? `${MONTHS_EN[m]} ${y}` : `${y}年${m + 1}月`;
}

export function isOverdue(task: Task, dateKey: string): boolean {
  if (task.completed) return false;
  const end = task.timeEnd ?? task.timeStart;
  if (!end) return false;
  const deadline = new Date(`${dateKey}T${end}:00`).getTime();
  return deadline < Date.now();
}
