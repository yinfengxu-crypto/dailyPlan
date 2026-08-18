import { describe, expect, it } from 'vitest';
import {
  addDays,
  formatDate,
  fromKey,
  isOverdue,
  monthTitle,
  toKey,
} from './date';
import type { Task } from '../types';

const baseTask: Task = {
  id: '1',
  title: 'test',
  priority: 'medium',
  completed: false,
  createdAt: 1,
};

describe('date utils', () => {
  it('toKey / fromKey 互转', () => {
    expect(toKey(new Date(2026, 7, 19))).toBe('2026-08-19');
    const d = fromKey('2026-08-19');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(19);
  });

  it('addDays 跨月/跨年', () => {
    expect(addDays('2026-08-19', 1)).toBe('2026-08-20');
    expect(addDays('2026-08-19', -1)).toBe('2026-08-18');
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('formatDate 三种语言', () => {
    expect(formatDate('2026-08-19', 'zh-CN')).toEqual({ main: '8月19日', week: '周三' });
    expect(formatDate('2026-08-19', 'en')).toEqual({ main: 'August 19', week: 'Wed' });
    expect(formatDate('2026-08-19', 'ja')).toEqual({ main: '8月19日', week: '水曜日' });
  });

  it('monthTitle', () => {
    expect(monthTitle(2026, 7, 'en')).toBe('August 2026');
    expect(monthTitle(2026, 7, 'zh-CN')).toBe('2026年8月');
    expect(monthTitle(2026, 7, 'ja')).toBe('2026年8月');
  });

  it('isOverdue 判断', () => {
    expect(isOverdue({ ...baseTask, timeEnd: '00:00' }, '2000-01-01')).toBe(true);
    expect(isOverdue({ ...baseTask, timeEnd: '23:59' }, '2999-01-01')).toBe(false);
    expect(isOverdue({ ...baseTask, timeEnd: '00:00', completed: true }, '2000-01-01')).toBe(false);
    expect(isOverdue(baseTask, '2999-01-01')).toBe(false);
  });
});
