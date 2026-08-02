'use client';

import { CheckItem } from '@/components/CheckItem';
import { ItineraryItemCard } from '@/components/ItineraryItemCard';
import { PlanSwitcher } from '@/components/PlanSwitcher';
import { useDayPlan } from '@/lib/planState';
import {
  badWeatherFallbackFor,
  getDay,
  itemsForDate,
  previousNightChecklistFor,
} from '@/lib/trip';

/**
 * 每日時間軸。
 * 條件式行程（8/16、8/22）會依目前生效的方案切換內容。
 */
export function DayTimeline({ date }: { date: string }) {
  const day = getDay(date);
  const plan = useDayPlan(date);

  const items = itemsForDate(date, plan.activePlanId);
  const fallback = badWeatherFallbackFor(date, plan.activePlanId);
  const tonight = previousNightChecklistFor(date, plan.activePlanId);

  return (
    <>
      {/* 方案切換 */}
      {plan.mode !== 'none' && (
        <div className="px-5 pt-5">
          <PlanSwitcher date={date} compact />
        </div>
      )}

      {/* 時間軸 */}
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

      {/* 整日層級：前一晚提醒 */}
      {tonight.length > 0 && (
        <section className="px-5 pb-7">
          <h2 className="section-title mb-2.5">出發前一晚的提醒（本日）</h2>
          <div className="card-alert p-4">
            <div className="divide-y divide-alert-border/40">
              {tonight.map((c, i) => (
                <CheckItem key={c} storageKey={`day.${date}.pn.${i}`} label={c} emphasis />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 整日層級：雨天備案 */}
      {fallback.length > 0 && (
        <section className="px-5 pb-10">
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
    </>
  );
}
