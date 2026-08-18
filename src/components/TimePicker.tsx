'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useClickOutside } from '../hooks/useClickOutside';

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function TimePicker({ value, onChange, placeholder }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const ref = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const [h, m] = draft ? draft.split(':') : ['', ''];

  useEffect(() => {
    if (!open) return;
    const scrollTo = (listRef: { current: HTMLDivElement | null }, val: string) => {
      const el = listRef.current;
      if (!el) return;
      const cell = el.querySelector(`[data-value="${val}"]`) as HTMLElement | null;
      if (cell) el.scrollTop = cell.offsetTop - el.clientHeight / 2 + cell.clientHeight / 2;
    };
    if (h) scrollTo(hourRef, h);
    scrollTo(minRef, m || '00');
  }, [open, h, m]);

  const openPanel = () => {
    setDraft(value ?? '');
    setOpen(true);
  };

  const confirm = () => {
    if (draft) onChange(draft);
    setOpen(false);
  };

  const setNow = () => {
    const d = new Date();
    setDraft(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
  };

  const clear = () => {
    onChange('');
    setOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => pad(i));
  const minutes = Array.from({ length: 60 }, (_, i) => pad(i));
  const ph = placeholder ?? t('tp.placeholder');

  return (
    <div className="time-picker" ref={ref}>
      <div
        className="time-picker-trigger"
        role="button"
        tabIndex={0}
        onClick={openPanel}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPanel();
          }
        }}
        aria-label={t('tp.choose')}
      >
        <span className={`time-picker-value ${value ? '' : 'placeholder'}`}>{value || ph}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        {value && (
          <button
            type="button"
            className="time-picker-clear"
            aria-label={t('tp.clear')}
            onClick={e => {
              e.stopPropagation();
              clear();
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="time-panel" role="dialog" aria-label={t('tp.choose')}>
          <div className="time-panel-body">
            <div className="time-col">
              <div className="time-col-title">{t('tp.hour')}</div>
              <div className="time-col-list" ref={hourRef}>
                {hours.map(hh => (
                  <button
                    key={hh}
                    type="button"
                    data-value={hh}
                    className={`time-cell ${hh === h ? 'selected' : ''}`}
                    onClick={() => setDraft(`${hh}:${m || '00'}`)}
                  >
                    {hh}
                  </button>
                ))}
              </div>
            </div>
            <div className="time-col">
              <div className="time-col-title">{t('tp.minute')}</div>
              <div className="time-col-list" ref={minRef}>
                {minutes.map(mm => (
                  <button
                    key={mm}
                    type="button"
                    data-value={mm}
                    className={`time-cell ${mm === m ? 'selected' : ''}`}
                    onClick={() => setDraft(`${h || '00'}:${mm}`)}
                  >
                    {mm}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="time-panel-footer">
            <button type="button" className="time-now" onClick={setNow}>
              {t('tp.now')}
            </button>
            <button type="button" className="time-ok" onClick={confirm}>
              {t('tp.ok')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
