'use client';

import { useRef, useState } from 'react';
import type { SortBy } from '../types';
import { useI18n } from '../i18n';
import { useClickOutside } from '../hooks/useClickOutside';
import Popover from './Popover';

interface Props {
  value: SortBy;
  onChange: (s: SortBy) => void;
  options: { value: SortBy; label: string }[];
}

export default function SortSelect({ value, onChange, options }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const current = options.find(o => o.value === value);

  return (
    <div className="sort-select" ref={ref}>
      <button
        type="button"
        className={`sort-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('sort.label')}
        title={t('sort.label')}
      >
        <span className="sort-value">{current?.label ?? ''}</span>
        <svg
          className="sort-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <Popover
        triggerRef={ref}
        open={open}
        className="sort-panel"
        role="listbox"
        ariaLabel={t('sort.label')}
      >
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={opt.value === value}
            className={`sort-option ${opt.value === value ? 'active' : ''}`}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            <span className="sort-option-label">{opt.label}</span>
            {opt.value === value && (
              <svg
                className="sort-check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        ))}
      </Popover>
    </div>
  );
}
