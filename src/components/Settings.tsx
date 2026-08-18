'use client';

import { useRef, useState } from 'react';
import { THEMES, themeName } from '../themes';
import { LOCALES, useI18n } from '../i18n';
import { useClickOutside } from '../hooks/useClickOutside';
import Popover from './Popover';

interface Props {
  themeId: string;
  onSelectTheme: (id: string) => void;
}

export default function Settings({ themeId, onSelectTheme }: Props) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="settings" ref={ref}>
      <button
        type="button"
        className="settings-btn"
        onClick={() => setOpen(o => !o)}
        aria-label={t('settings.buttonAria')}
        aria-expanded={open}
        title={t('settings.buttonAria')}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08A1.7 1.7 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56h.08a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08A1.7 1.7 0 0 0 20.91 9H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
        </svg>
      </button>

      <Popover
        triggerRef={ref}
        open={open}
        className="settings-panel"
        role="dialog"
        ariaLabel={t('settings.title')}
        align="end"
      >
        <section className="settings-section">
          <h3>{t('settings.language')}</h3>
          <div className="lang-grid">
            {LOCALES.map(l => (
              <button
                key={l.id}
                type="button"
                className={`lang-option ${locale === l.id ? 'active' : ''}`}
                onClick={() => setLocale(l.id)}
              >
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-label">{l.label}</span>
                {locale === l.id && (
                  <svg
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
          </div>
        </section>

        <div className="settings-divider" />

        <section className="settings-section">
          <h3>{t('settings.theme')}</h3>
          <div className="swatches">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={`swatch-item ${themeId === theme.id ? 'active' : ''}`}
                onClick={() => onSelectTheme(theme.id)}
                aria-label={themeName(theme, locale)}
                title={themeName(theme, locale)}
              >
                <span
                  className="swatch-preview"
                  style={{ background: `linear-gradient(135deg, ${theme.gradA}, ${theme.gradB})` }}
                >
                  <span className="swatch-dot" style={{ background: theme.accent }} />
                  {themeId === theme.id && (
                    <svg
                      className="swatch-check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="swatch-name">{themeName(theme, locale)}</span>
              </button>
            ))}
          </div>
        </section>
      </Popover>
    </div>
  );
}
