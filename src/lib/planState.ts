'use client';

import { getDay } from '@/lib/trip';
import { useCallback, useEffect, useState } from 'react';
import type { DayPlan, TripDay } from '@/types/trip';

/* =========================================================================
 * 條件式行程的狀態
 * =========================================================================
 * 全部存在這台裝置的 localStorage，不上傳、不進 repo。
 * - 使用者選的方案：trip2026.plan.<日期>
 * - 跨日期活動的完成狀態：trip2026.done.<旗標>
 * ========================================================================= */

const PLAN_PREFIX = 'trip2026.plan.';
const DONE_PREFIX = 'trip2026.done.';

export function planKey(storageKey: string): string {
  return PLAN_PREFIX + storageKey;
}

export function doneKey(flag: string): string {
  return DONE_PREFIX + flag;
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* 忽略 */
  }
}

/** 讓同一頁面內的其他元件也能立刻收到變更 */
const EVENT = 'trip2026:planstate';

function broadcast() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT));
  }
}

function useStateSync(compute: () => void) {
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
  }, []);
}

/* ------------------------------------------- 跨日期活動的完成狀態 */

export function useActivityDone(flag?: string) {
  const [done, setDoneState] = useState(false);
  const [ready, setReady] = useState(false);

  useStateSync(() => {
    if (!flag) {
      setReady(true);
      return;
    }
    setDoneState(read(doneKey(flag)) === '1');
    setReady(true);
  });

  const setDone = useCallback(
    (value: boolean) => {
      if (!flag) return;
      write(doneKey(flag), value ? '1' : '0');
      setDoneState(value);
      broadcast();
    },
    [flag]
  );

  const toggle = useCallback(() => setDone(!done), [done, setDone]);

  return { done, setDone, toggle, ready };
}

/* -------------------------------------------------- 一日的方案選擇 */

export interface ResolvedPlan {
  /** 目前生效的方案 id；沒有條件式行程時為 undefined */
  activePlanId?: string;
  activePlan?: DayPlan;
  otherPlan?: DayPlan;
  /** 方案是使用者選的，還是由完成狀態自動決定 */
  mode: 'none' | 'manual' | 'auto';
  /** auto 模式下的判斷依據 */
  autoReason?: string;
  ready: boolean;
  /** manual 模式才有作用 */
  choose?: (planId: string) => void;
}

export function useDayPlan(date: string): ResolvedPlan {
  const day = getDay(date);
  const [choice, setChoice] = useState<string | null>(null);
  const [flagDone, setFlagDone] = useState(false);
  const [ready, setReady] = useState(false);

  useStateSync(() => {
    if (day?.planStorageKey) {
      setChoice(read(planKey(day.planStorageKey)));
    }
    if (day?.planDeterminedByFlag) {
      setFlagDone(read(doneKey(day.planDeterminedByFlag)) === '1');
    }
    setReady(true);
  });

  const choose = useCallback(
    (planId: string) => {
      if (!day?.planStorageKey) return;
      write(planKey(day.planStorageKey), planId);
      setChoice(planId);
      broadcast();
    },
    [day?.planStorageKey]
  );

  if (!day?.conditionalPlan) {
    return { mode: 'none', ready: true };
  }

  const primary = day.conditionalPlan;
  const fallback = day.fallbackPlan;

  // 由完成狀態自動決定
  if (day.planDeterminedByFlag) {
    const active = flagDone && fallback ? fallback : primary;
    const other = active.id === primary.id ? fallback : primary;
    return {
      activePlanId: active.id,
      activePlan: active,
      otherPlan: other,
      mode: 'auto',
      autoReason: flagDone
        ? 'Trælanípan 已在 8/16 完成，這天自動改成輕鬆版'
        : 'Trælanípan 尚未完成，這天保留完整健行',
      ready,
    };
  }

  // 由使用者手動選
  const active = choice === fallback?.id && fallback ? fallback : primary;
  const other = active.id === primary.id ? fallback : primary;
  return {
    activePlanId: active.id,
    activePlan: active,
    otherPlan: other,
    mode: 'manual',
    ready,
    choose,
  };
}

/** 伺服器端／靜態產生時使用的預設方案（永遠是 Plan A） */
export function defaultPlanIdOf(day?: TripDay): string | undefined {
  return day?.conditionalPlan?.id;
}
