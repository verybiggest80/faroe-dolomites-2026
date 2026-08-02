'use client';

import { useDayPlan } from '@/lib/planState';
import { getDay } from '@/lib/trip';
import Link from 'next/link';

/**
 * 條件式行程的方案卡。
 * - manual：使用者用兩個按鈕自己選（8/16）
 * - auto：由跨日期活動的完成狀態自動決定，不能手動改（8/22）
 */
export function PlanSwitcher({ date, compact = false }: { date: string; compact?: boolean }) {
  const day = getDay(date);
  const plan = useDayPlan(date);

  if (!day?.conditionalPlan || plan.mode === 'none' || !plan.activePlan) return null;

  const { activePlan, otherPlan, mode } = plan;

  /* ------------------------------------------------ 自動決定（8/22） */
  if (mode === 'auto') {
    return (
      <section
        className={`rounded-xl2 border border-faroe-200 bg-faroe-50 p-4 ${compact ? '' : 'mt-4'}`}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-faroe-600">
            今日方案
          </span>
          <span className="chip border-faroe-200 bg-white text-faroe-700">自動</span>
        </div>
        <h3 className="mt-1 text-[15px] font-semibold text-faroe-800">{activePlan.label}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-faroe-800/80">
          {activePlan.description}
        </p>
        {plan.autoReason && (
          <p className="mt-2 border-t border-faroe-200 pt-2 text-[12px] leading-relaxed text-faroe-700">
            ↳ {plan.autoReason}
          </p>
        )}
        <p className="mt-2 text-[12px] text-faroe-700/80">
          要改變這個，去{' '}
          <Link href="/day/2026-08-16" className="font-medium underline underline-offset-2">
            8/16
          </Link>{' '}
          調整 Trælanípan 的完成狀態。
        </p>
      </section>
    );
  }

  /* ------------------------------------------------ 手動選擇（8/16） */
  return (
    <section
      className={`rounded-xl2 border border-faroe-200 bg-faroe-50 p-4 ${compact ? '' : 'mt-4'}`}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-faroe-600">
          今日方案
        </span>
        <span className="chip border-faroe-200 bg-white text-faroe-700">可切換</span>
      </div>
      <h3 className="mt-1 text-[15px] font-semibold text-faroe-800">{activePlan.label}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-faroe-800/80">
        {activePlan.description}
      </p>

      {activePlan.activationConditions && activePlan.activationConditions.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-faroe-200 pt-2">
          {activePlan.activationConditions.map((c) => (
            <li key={c} className="flex gap-1.5 text-[12px] leading-relaxed text-faroe-800/75">
              <span aria-hidden="true">·</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="btn cursor-default border border-faroe-600 bg-faroe-600 text-[13px] text-white"
        >
          ✓ {activePlan.buttonLabel}
        </button>
        {otherPlan && (
          <button
            type="button"
            onClick={() => plan.choose?.(otherPlan.id)}
            className="btn border border-faroe-300 bg-white text-[13px] text-faroe-700"
          >
            {otherPlan.buttonLabel}
          </button>
        )}
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-faroe-700/80">
        落地後看天氣再決定，隨時可以切換。選擇只存在這台裝置。
      </p>
    </section>
  );
}
