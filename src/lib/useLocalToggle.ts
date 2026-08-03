'use client';

import { useCallback, useEffect, useState } from 'react';

/* =========================================================================
 * 勾選狀態
 * =========================================================================
 * 全部存在這台裝置的 localStorage，不上傳、不進 repo。
 * 同一個 key 在不同頁面／元件之間會即時同步 —— 這是「前一天勾了，
 * 隔天就不再提醒」能運作的前提。
 * ========================================================================= */

const EVENT = 'trip2026:toggle';

function broadcast() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(`trip2026.toggle.${key}`) === '1';
  } catch {
    return false;
  }
}

function write(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(`trip2026.toggle.${key}`, value ? '1' : '0');
  } catch {
    /* 忽略 */
  }
}

function useSync(compute: () => void, deps: unknown[]) {
  useEffect(() => {
    compute();
    const handler = () => compute();
    window.addEventListener(EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener('storage', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useLocalToggle(key: string, initial = false) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useSync(() => {
    setValue(read(key));
    setReady(true);
  }, [key]);

  const toggle = useCallback(() => {
    const next = !read(key);
    write(key, next);
    setValue(next);
    broadcast();
  }, [key]);

  return { value, toggle, ready };
}

/** 一次讀多個勾選狀態，用來算「還有哪些沒完成」 */
export function useCheckStates(keys: string[]) {
  const [states, setStates] = useState<boolean[]>(() => keys.map(() => false));
  const [ready, setReady] = useState(false);
  const signature = keys.join('|');

  useSync(() => {
    setStates(keys.map(read));
    setReady(true);
  }, [signature]);

  return { states, ready };
}

/**
 * 提醒事項的儲存 key。
 * 用內容雜湊而不是索引 —— 清單順序改變時，已勾選的狀態才不會錯位。
 */
export function checklistKey(date: string, text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `pn.${date}.${(h >>> 0).toString(36)}`;
}
