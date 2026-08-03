'use client';

import { CheckItem } from '@/components/CheckItem';
import { longDate, shortDate } from '@/lib/dates';
import { useDayPlan } from '@/lib/planState';
import { getDay, previousNightChecklistFor } from '@/lib/trip';
import { checklistKey, useCheckStates } from '@/lib/useLocalToggle';
import Link from 'next/link';

/* =========================================================================
 * 前一晚提醒的兩個出現位置
 * =========================================================================
 * 1. NextDayPrep      —— 放在「前一天」頁面最下面，今晚就要做完的事
 * 2. PendingReminders —— 放在「當天」頁面最上面，昨晚沒勾完的才會出現
 *
 * 兩邊共用同一個 storage key（以「目標日期 + 內容」計算），
 * 所以在前一天勾掉之後，隔天就不會再出現。
 * ========================================================================= */

/** 前一天頁面最下面：明天出發前，今晚要完成的事 */
export function NextDayPrep({ targetDate }: { targetDate: string }) {
  const day = getDay(targetDate);
  const plan = useDayPlan(targetDate);
  const items = previousNightChecklistFor(targetDate, plan.activePlanId);
  const keys = items.map((t) => checklistKey(targetDate, t));
  const { states } = useCheckStates(keys);

  if (!day || items.length === 0) return null;

  const doneCount = states.filter(Boolean).length;
  const allDone = doneCount === items.length;

  return (
    <section className="px-5 pb-10">
      <h2 className="section-title mb-2.5">今晚要做完</h2>
      <div className={allDone ? 'card border-good-border bg-good-bg p-4' : 'card-alert p-4'}>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <p
            className={`text-[13px] font-semibold ${
              allDone ? 'text-good-text' : 'text-alert-text'
            }`}
          >
            為 {shortDate(targetDate)}「{day.title}」做準備
          </p>
          <span
            className={`shrink-0 text-[11px] tabular-nums ${
              allDone ? 'text-good-text' : 'text-alert-text'
            }`}
          >
            {doneCount} / {items.length}
          </span>
        </div>

        <div className={allDone ? 'divide-y divide-good-border/50' : 'divide-y divide-alert-border/40'}>
          {items.map((t) => (
            <CheckItem key={t} storageKey={checklistKey(targetDate, t)} label={t} emphasis />
          ))}
        </div>

        <p
          className={`mt-2 border-t pt-2 text-[11px] leading-relaxed ${
            allDone
              ? 'border-good-border/50 text-good-text/80'
              : 'border-alert-border/40 text-alert-text/75'
          }`}
        >
          {allDone
            ? '都完成了，明天可以安心出發。'
            : '沒勾完的項目，明天會出現在行程最上方。'}
        </p>
      </div>
    </section>
  );
}

/** 當天頁面最上面：昨晚沒完成的提醒 */
export function PendingReminders({ date }: { date: string }) {
  const plan = useDayPlan(date);
  const items = previousNightChecklistFor(date, plan.activePlanId);
  const keys = items.map((t) => checklistKey(date, t));
  const { states, ready } = useCheckStates(keys);

  if (items.length === 0) return null;

  const pending = items.filter((_, i) => !states[i]);
  // 還沒讀完 localStorage 前不要閃現，避免看起來像全部沒做
  if (!ready || pending.length === 0) return null;

  const prev = previousDateOf(date);

  return (
    <section className="px-5 pt-5">
      <div className="card-alert p-4">
        <p className="text-[13px] font-semibold text-alert-text">
          ⚠ 還有 {pending.length} 項出發前的準備沒完成
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-alert-text/80">
          這些原本應該在{' '}
          <Link
            href={`/day/${prev}`}
            className="font-medium underline underline-offset-2"
          >
            {longDate(prev)}
          </Link>{' '}
          晚上做完。現在補做還來得及的就趕快處理。
        </p>
        <div className="mt-2 divide-y divide-alert-border/40">
          {pending.map((t) => (
            <CheckItem key={t} storageKey={checklistKey(date, t)} label={t} emphasis />
          ))}
        </div>
      </div>
    </section>
  );
}

function previousDateOf(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d - 1);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
}
