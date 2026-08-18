'use client';

import { useRef, useState } from 'react';
import {
  CAL_WEEK_LABELS,
  formatDate,
  fromKey,
  isToday,
  monthTitle,
  todayKey,
  toKey,
} from '../utils/date';
import { useI18n } from '../i18n';
import { useClickOutside } from '../hooks/useClickOutside';
import Popover from './Popover';

interface Props {
  value: string;
  onChange: (key: string) => void;
  markedDates?: Set<string>;
}

export default function DatePicker({ value, onChange, markedDates }: Props) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = fromKey(value);
  const [view, setView] = useState(() => ({ y: current.getFullYear(), m: current.getMonth() }));

  useClickOutside(ref, () => setOpen(false), open);

  const openPicker = () => {
    const c = fromKey(value);
    setView({ y: c.getFullYear(), m: c.getMonth() });
    setOpen(true);
  };

  const { main, week } = formatDate(value, locale);
  const today = todayKey();
  const weekLabels = CAL_WEEK_LABELS[locale];

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDay = new Date(view.y, view.m, 1).getDay();

  const shiftMonth = (delta: number) => {
    setView(v => {
      let m = v.m + delta;
      let y = v.y;
      if (m < 0) {
        m = 11;
        y--;
      }
      if (m > 11) {
        m = 0;
        y++;
      }
      return { y, m };
    });
  };

  const cells: ({ day: number; key: string } | null)[] = Array.from(
    { length: firstDay + daysInMonth },
    (_, i) => {
      const day = i - firstDay + 1;
      if (day < 1) return null;
      const key = toKey(new Date(view.y, view.m, day));
      return { day, key };
    },
  );

  return (
    <div className="date-picker" ref={ref}>
      <button
        type="button"
        className="date-trigger"
        onClick={openPicker}
        aria-label={t('date.choose')}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="date-main">{main}</span>
        <span className="date-week">{week}</span>
        {isToday(value) && <span className="today-badge">{t('date.today')}</span>}
        <svg
          className="cal-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      <Popover triggerRef={ref} open={open} className="cal-panel" role="dialog" ariaLabel={t('cal.chooseDate')}>
        <div className="cal-head">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label={t('cal.prevMonth')}>
            ‹
          </button>
          <span>{monthTitle(view.y, view.m, locale)}</span>
          <button type="button" onClick={() => shiftMonth(1)} aria-label={t('cal.nextMonth')}>
            ›
          </button>
        </div>

        <div className="cal-grid cal-week">
          {weekLabels.map(w => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="cal-grid cal-days">
          {cells.map((cell, i) =>
            cell === null ? (
              <span key={i} className="cal-empty" />
            ) : (
              <button
                type="button"
                key={i}
                className={`cal-day${cell.key === value ? ' selected' : ''}${
                  cell.key === today ? ' today' : ''
                }`}
                onClick={() => {
                  onChange(cell.key);
                  setOpen(false);
                }}
              >
                {cell.day}
                {markedDates?.has(cell.key) && <span className="cal-dot" />}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className="cal-today"
          onClick={() => {
            onChange(today);
            setOpen(false);
          }}
        >
          {t('cal.backToday')}
        </button>
      </Popover>
    </div>
  );
}
