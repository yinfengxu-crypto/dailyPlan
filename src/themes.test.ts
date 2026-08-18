import { describe, expect, it } from 'vitest';
import { PRIORITY_META, THEMES, rgba, themeName } from './themes';

describe('themes', () => {
  it('共 16 套主题且 id 唯一', () => {
    expect(THEMES.length).toBe(16);
    expect(new Set(THEMES.map(t => t.id)).size).toBe(16);
  });

  it('浅色 8 套 + 深色 8 套', () => {
    expect(THEMES.filter(t => !t.dark).length).toBe(8);
    expect(THEMES.filter(t => t.dark).length).toBe(8);
  });

  it('themeName 按语言返回', () => {
    const dawn = THEMES.find(t => t.id === 'dawn')!;
    expect(themeName(dawn, 'zh-CN')).toBe('晨曦');
    expect(themeName(dawn, 'en')).toBe('Dawn');
    expect(themeName(dawn, 'ja')).toBe('夜明け');
  });

  it('rgba 颜色转换', () => {
    expect(rgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    expect(rgba('#fff', 0.14)).toBe('rgba(255, 255, 255, 0.14)');
  });

  it('优先级元数据', () => {
    expect(PRIORITY_META.high.color).toBe('#ef4444');
    expect(PRIORITY_META.medium.color).toBe('#f59e0b');
    expect(PRIORITY_META.low.color).toBe('#22c55e');
  });
});
