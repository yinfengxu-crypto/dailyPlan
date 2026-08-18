import type { CSSProperties } from 'react';
import type { Locale, Priority } from './types';

export interface Theme {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  dark: boolean;
  gradA: string;
  gradB: string;
  accent: string;
  text: string;
  textDim: string;
  card: string;
  cardBorder: string;
  success: string;
  danger: string;
}

export function themeName(t: Theme, locale: Locale): string {
  return locale === 'en' ? t.nameEn : locale === 'ja' ? t.nameJa : t.name;
}

export const THEMES: Theme[] = [
  // ---------- 浅色主题 ----------
  {
    id: 'dawn', name: '晨曦', nameEn: 'Dawn', nameJa: '夜明け', dark: false,
    gradA: '#fff3ec', gradB: '#ffdcd0', accent: '#f05e4e',
    text: '#4a2f28', textDim: '#a0705f', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#2e9e6b', danger: '#e5484d',
  },
  {
    id: 'sakura', name: '樱粉', nameEn: 'Sakura', nameJa: '桜', dark: false,
    gradA: '#fdeef4', gradB: '#fad4e2', accent: '#ec6ba8',
    text: '#4c2f3d', textDim: '#a4778e', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#2e9e6b', danger: '#e5484d',
  },
  {
    id: 'sea', name: '海风', nameEn: 'Sea Breeze', nameJa: '海風', dark: false,
    gradA: '#eef7ff', gradB: '#d2eaff', accent: '#2f80ed',
    text: '#24344c', textDim: '#6f839c', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#1f9d63', danger: '#e5484d',
  },
  {
    id: 'mint', name: '薄荷', nameEn: 'Mint', nameJa: 'ミント', dark: false,
    gradA: '#eefaf3', gradB: '#d6f2e0', accent: '#1fa568',
    text: '#22362c', textDim: '#6d8a7a', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#1fa568', danger: '#e5484d',
  },
  {
    id: 'lemon', name: '柠檬', nameEn: 'Lemon', nameJa: 'レモン', dark: false,
    gradA: '#fffbe6', gradB: '#ffedbf', accent: '#eab308',
    text: '#4a3e1a', textDim: '#a09155', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#2e9e6b', danger: '#e5484d',
  },
  {
    id: 'lavender', name: '薰衣草', nameEn: 'Lavender', nameJa: 'ラベンダー', dark: false,
    gradA: '#f6f2ff', gradB: '#e5daff', accent: '#7c5cfc',
    text: '#3a304f', textDim: '#8d7fb0', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#2e9e6b', danger: '#e5484d',
  },
  {
    id: 'sky', name: '天空', nameEn: 'Sky', nameJa: '空', dark: false,
    gradA: '#ecfbff', gradB: '#cff0ff', accent: '#0ea5e9',
    text: '#1f3544', textDim: '#6f8c9e', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#2e9e6b', danger: '#e5484d',
  },
  {
    id: 'coral', name: '珊瑚', nameEn: 'Coral', nameJa: '珊瑚', dark: false,
    gradA: '#fff2e6', gradB: '#ffdcc2', accent: '#f97316',
    text: '#4a301c', textDim: '#a07b58', card: 'rgba(255, 255, 255, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.65)', success: '#2e9e6b', danger: '#e5484d',
  },

  // ---------- 深色主题 ----------
  {
    id: 'moon', name: '月光', nameEn: 'Moonlight', nameJa: '月光', dark: true,
    gradA: '#241f45', gradB: '#151230', accent: '#a78bfa',
    text: '#eae6ff', textDim: '#9b93c8', card: 'rgba(38, 32, 74, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'deep', name: '深海', nameEn: 'Deep Sea', nameJa: '深海', dark: true,
    gradA: '#0f2430', gradB: '#0a1620', accent: '#4cc9f0',
    text: '#e2f3fa', textDim: '#8bb3c4', card: 'rgba(13, 34, 46, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'aurora', name: '极光', nameEn: 'Aurora', nameJa: 'オーロラ', dark: true,
    gradA: '#0b1f1a', gradB: '#103c2e', accent: '#34d399',
    text: '#dff5ec', textDim: '#86c4af', card: 'rgba(14, 40, 32, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'neon', name: '霓虹', nameEn: 'Neon', nameJa: 'ネオン', dark: true,
    gradA: '#301033', gradB: '#160a29', accent: '#ff5fa2',
    text: '#fcecf4', textDim: '#b890a9', card: 'rgba(48, 16, 51, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'rose', name: '玫瑰', nameEn: 'Rose', nameJa: 'ローズ', dark: true,
    gradA: '#3a1020', gradB: '#1c0810', accent: '#fb7185',
    text: '#fbe8ec', textDim: '#b98693', card: 'rgba(58, 16, 32, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'lava', name: '熔岩', nameEn: 'Lava', nameJa: '溶岩', dark: true,
    gradA: '#3a1608', gradB: '#1e0a03', accent: '#fb923c',
    text: '#fdeee4', textDim: '#b88f78', card: 'rgba(58, 22, 8, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'coffee', name: '咖啡', nameEn: 'Coffee', nameJa: 'コーヒー', dark: true,
    gradA: '#2c1f15', gradB: '#17100a', accent: '#e0a45c',
    text: '#f3e8dc', textDim: '#a88f79', card: 'rgba(44, 31, 21, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
  {
    id: 'grape', name: '葡萄', nameEn: 'Grape', nameJa: 'ブドウ', dark: true,
    gradA: '#25103a', gradB: '#12081f', accent: '#d946ef',
    text: '#f6e9ff', textDim: '#b08cc4', card: 'rgba(37, 16, 58, 0.55)',
    cardBorder: 'rgba(255, 255, 255, 0.08)', success: '#34d399', danger: '#fb7185',
  },
];

export const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  high: { label: '高', color: '#ef4444' },
  medium: { label: '中', color: '#f59e0b' },
  low: { label: '低', color: '#22c55e' },
};

export function themeVars(t: Theme): CSSProperties {
  return {
    '--grad-a': t.gradA,
    '--grad-b': t.gradB,
    '--accent': t.accent,
    '--text': t.text,
    '--text-dim': t.textDim,
    '--card': t.card,
    '--card-border': t.cardBorder,
    '--success': t.success,
    '--danger': t.danger,
    colorScheme: t.dark ? 'dark' : 'light',
  } as CSSProperties;
}

export function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
