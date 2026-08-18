import { useEffect, useState } from 'react';

/** 每秒返回一次当前时间戳，用于驱动倒计时刷新。 */
export function useNow(interval = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);

  return now;
}
