'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * 勾選狀態存在這台裝置的 localStorage，
 * 不寫回程式碼、也不會進 repo。
 */
export function useLocalToggle(key: string, initial = false) {
  const storageKey = `trip2026.toggle.${key}`;
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw !== null) setValue(raw === '1');
    } catch {
      /* localStorage 不可用時就用預設值 */
    }
    setReady(true);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(storageKey, next ? '1' : '0');
      } catch {
        /* 忽略 */
      }
      return next;
    });
  }, [storageKey]);

  return { value, toggle, ready };
}
