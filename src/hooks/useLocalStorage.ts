'use client';

import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  // 服务端与客户端首次渲染都使用 initial，避免水合不一致
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  // 挂载后再从 localStorage 读取
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let next: T | null = null;
      try {
        const raw = localStorage.getItem(key);
        if (raw != null) next = JSON.parse(raw) as T;
      } catch {
        /* ignore */
      }
      if (!cancelled && next != null) setValue(next);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  // 读取完成后再写回，避免覆盖已保存的值
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue];
}
