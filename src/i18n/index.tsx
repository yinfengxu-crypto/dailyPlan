'use client';

import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '../types';
import { DICTS } from './dicts';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface LanguageOption {
  id: Locale;
  label: string;
  flag: string;
}

export const LOCALES: LanguageOption[] = [
  { id: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
];

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>('dailyplan:locale', 'zh-CN');

  // 首次访问时根据浏览器语言自动检测（仅在无存储偏好时）
  useEffect(() => {
    try {
      if (localStorage.getItem('dailyplan:locale') == null) {
        const nav = (navigator.language || '').toLowerCase();
        const detected: Locale = nav.startsWith('en') ? 'en' : nav.startsWith('ja') ? 'ja' : 'zh-CN';
        setLocale(detected);
      }
    } catch {
      /* ignore */
    }
  }, [setLocale]);

  const t = (key: string): string => {
    const dict = DICTS[locale] ?? DICTS['zh-CN'];
    return dict[key] ?? key;
  };

  useEffect(() => {
    const dict = DICTS[locale] ?? DICTS['zh-CN'];
    document.title = dict['app.title'];
  }, [locale]);

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
