import { describe, expect, it } from 'vitest';
import { DICTS } from './dicts';

const locales = ['zh-CN', 'en', 'ja'] as const;

describe('i18n dictionaries', () => {
  it('三种语言键完全一致', () => {
    const [zh, en, ja] = locales.map(l => Object.keys(DICTS[l]).sort());
    expect(en).toEqual(zh);
    expect(ja).toEqual(zh);
  });

  it('所有文案非空', () => {
    for (const l of locales) {
      for (const [k, v] of Object.entries(DICTS[l])) {
        expect(v.trim(), `${l}.${k}`).not.toBe('');
      }
    }
  });

  it('包含核心键', () => {
    for (const l of locales) {
      expect(DICTS[l]['app.title']).toBeTruthy();
      expect(DICTS[l]['tp.hour']).toBeTruthy();
      expect(DICTS[l]['search.placeholder']).toBeTruthy();
    }
  });
});
