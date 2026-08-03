'use client';

import { ItineraryItemCard } from '@/components/ItineraryItemCard';
import { NextDayPrep, PendingReminders } from '@/components/NightBeforeReminders';
import { PlanSwitcher } from '@/components/PlanSwitcher';
import { useDayPlan } from '@/lib/planState';
import { badWeatherFallbackFor, getDay, itemsForDate } from '@/lib/trip';

/**
 * 每日時間軸。
 *
 * 版面順序：
 *   1. 昨晚沒完成的提醒（只在有漏勾時出現）
 *   2. 方案切換（條件式行程才有）
 *   3. 時間軸
 *   4. 雨天備案
 *   5. 今晚要為「明天」做完的準備
 */
export function DayTimeline({ date }: { date: string }) {
  const day = getDay(date);
  const plan = useDayPlan(date);

  const items = itemsForDate(date, plan.activePlanId);
  const fallback = badWeatherFallbackFor(date, plan.activePlanId);
  const nextDate = nextDateOf(date);
  const hasNextDay = Boolean(getDay(nextDate));

  return (
    <>
      {/* 1. 昨晚沒完成的提醒 */}
      <PendingReminders date={date} />

      {/* 2. 方案切換 */}
      {plan.mode !== 'none' && (
        <div className="px-5 pt-5">
          <PlanSwitcher date={date} compact />
        </div>
      )}

      {/* 3. 時間軸 */}
      <div className="relative px-5 py-7">
        {items.length > 0 && <span aria-hidden="true" className="timeline-rail left-[27px]" />}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} id={item.id} className="scroll-mt-4">
              <ItineraryItemCard item={item} />
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-[13px] text-ink-faint">這天沒有排定行程。</p>
          )}
        </div>
      </div>

      {/* 4. 雨天備案 */}
      {fallback.length > 0 && (
        <section className="px-5 pb-7">
          <h2 className="section-title mb-2.5">雨天／壞天氣備案</h2>
          <div className="card p-4">
            <ul className="space-y-1.5">
              {fallback.map((f) => (
                <li key={f} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="text-ink-faint">
                    ·
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {day?.weatherSwappable && (
              <p className="mt-3 border-t border-stone2-100 pt-3 text-xs leading-relaxed text-ink-faint">
                這天的非住宿活動可與 8/17、8/20、8/21、8/22 互換。
                船班、航班、住宿、Seceda、Tre Cime 不會跟著移動。
              </p>
            )}
          </div>
        </section>
      )}

      {/* 5. 今晚要為明天做完的準備 */}
      {hasNextDay && <NextDayPrep targetDate={nextDate} />}
    </>
  );
}

function nextDateOf(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d + 1);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
}
