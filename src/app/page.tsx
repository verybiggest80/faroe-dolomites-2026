'use client';

import { CheckItem } from '@/components/CheckItem';
import { DirectionsButton, LocationLink } from '@/components/LocationLink';
import { StatusBadges } from '@/components/StatusBadge';
import {
  REGION_LABEL,
  TIMEZONE_LABEL,
  TRIP_END,
  TRIP_START,
  currentTripDate,
  daysBetween,
  longDate,
  shortDate,
  todayISO,
} from '@/lib/dates';
import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  accommodationOfDay,
  badWeatherFallbackFor,
  getDay,
  itemsForDate,
  nextItemOfDay,
  nextTransportOfDay,
  previousNightChecklistFor,
  risksForDate,
} from '@/lib/trip';
import { PackingList } from '@/components/PackingList';
import { PlanSwitcher } from '@/components/PlanSwitcher';
import { useDayPlan } from '@/lib/planState';
import { checklistKey } from '@/lib/useLocalToggle';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ItineraryItem } from '@/types/trip';

export default function DashboardPage() {
  // 用 effect 取得裝置日期，避免 SSR / CSR 不一致
  const [today, setToday] = useState<string | null>(null);
  const [nowMin, setNowMin] = useState(0);

  useEffect(() => {
    setToday(todayISO());
    const d = new Date();
    setNowMin(d.getHours() * 60 + d.getMinutes());
  }, []);

  if (!today) return <div className="p-5 text-sm text-ink-faint">載入中…</div>;
  return <Dashboard today={today} nowMin={nowMin} />;
}

function Dashboard({ today, nowMin }: { today: string; nowMin: number }) {
  const focusDate = currentTripDate(today);
  const day = getDay(focusDate);
  const beforeTrip = today < TRIP_START;
  const afterTrip = today > TRIP_END;
  const countdown = daysBetween(today, TRIP_START);

  // 條件式行程：首頁要顯示目前生效的那一套
  const plan = useDayPlan(focusDate);
  const nextDay = nextDateOf(focusDate);
  const nextDayPlan = useDayPlan(nextDay);

  const items = itemsForDate(focusDate, plan.activePlanId);
  const next = nextItemOfDay(focusDate, nowMin, plan.activePlanId);
  const nextTransport = nextTransportOfDay(focusDate, nowMin, plan.activePlanId);
  const stay = accommodationOfDay(focusDate);
  const risks = risksForDate(focusDate, plan.activePlanId);
  const fallback = badWeatherFallbackFor(focusDate, plan.activePlanId);
  const tonight = previousNightChecklistFor(nextDay, nextDayPlan.activePlanId);

  return (
    <main>
      {/* ------------------------------------------------ 倒數 / 標頭 */}
      <header className="bg-faroe-700 px-5 pb-7 pt-10 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faroe-200">
          法羅群島 × 多洛米蒂
        </p>
        <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight">
          {beforeTrip
            ? `還有 ${countdown} 天出發`
            : afterTrip
              ? '旅程結束，歡迎回家'
              : `第 ${daysBetween(TRIP_START, today) + 1} 天`}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-faroe-100">
          2026/8/15 – 8/31　·　2 位成人
        </p>

        <div className="mt-5 rounded-xl2 bg-white/10 p-3.5">
          <div className="text-[11px] uppercase tracking-widest text-faroe-200">
            {beforeTrip ? '行程第一天' : afterTrip ? '最後一天' : '今天'}
          </div>
          <div className="mt-1 font-display text-lg font-semibold">
            {longDate(focusDate)}　{day?.weekday}
          </div>
          <div className="mt-0.5 text-[13px] text-faroe-100">{day?.title}</div>
          <div className="mt-2 flex items-center gap-2 text-[12px] text-faroe-200">
            <span>📍 {REGION_LABEL[day?.region ?? 'transit']}</span>
            <span>·</span>
            <span>{TIMEZONE_LABEL[day?.timezone ?? 'Asia/Taipei']}</span>
          </div>
        </div>
      </header>

      <div className="space-y-7 px-5 py-7">
        {/* -------------------------------------------- 條件式方案 */}
        {plan.mode !== 'none' && <PlanSwitcher date={focusDate} compact />}

        {/* -------------------------------------------- 行李清單 */}
        <Section title="行李清單">
          <PackingList />
        </Section>

        {/* -------------------------------------------- 下一個活動 */}
        {next && (
          <Section title="下一個活動" action={{ href: `/day/${focusDate}`, label: '看整天' }}>
            <NextCard item={next} />
          </Section>
        )}

        {/* -------------------------------------------- 下一段交通 */}
        {nextTransport && nextTransport.id !== next?.id && (
          <Section title="下一段交通">
            <NextCard item={nextTransport} />
          </Section>
        )}

        {/* -------------------------------------------- 今日住宿 */}
        <Section title="今晚住哪">
          {stay ? (
            <div className="card p-4">
              <h3 className="text-[15px] font-semibold leading-snug">{stay.title}</h3>
              {stay.location && (
                <div className="mt-2">
                  <LocationLink location={stay.location} showAddress />
                  <div className="mt-2">
                    <DirectionsButton location={stay.location} />
                  </div>
                </div>
              )}
              <dl className="mt-3 space-y-1 border-t border-stone2-100 pt-3">
                {stay.details.map((d) => (
                  <div key={d.label} className="flex gap-2 text-[13px]">
                    <dt className="w-20 shrink-0 text-ink-faint">{d.label}</dt>
                    <dd className="text-ink-soft">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="card p-4 text-[13px] text-ink-soft">
              今晚在移動中（機上／轉機），沒有住宿。
            </div>
          )}
        </Section>

        {/* -------------------------------------------- 風險提示 */}
        {risks.length > 0 && (
          <Section title="今日風險">
            <div className="space-y-2">
              {risks.map((r) => (
                <div
                  key={r.itemId + r.kind}
                  className="card-alert flex gap-3 p-3.5"
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    {r.kind === 'ferry' ? '⛴' : r.kind === 'cable_car' ? '🚡' : '🥾'}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-alert-text">{r.label}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-alert-text/85">
                      {r.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* -------------------------------------------- 天氣提示 */}
        {fallback.length > 0 && (
          <Section title="天氣不好的話">
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
              <p className="mt-3 border-t border-stone2-100 pt-3 text-xs text-ink-faint">
                8/17、8/20、8/21、8/22 的非住宿活動可以互換。船班、航班、住宿、Seceda、Tre
                Cime 不會自動移動。
              </p>
            </div>
          </Section>
        )}

        {/* -------------------------------------------- 今晚要做的事 */}
        {tonight.length > 0 && (
          <Section
            title={`今晚要做完（為 ${shortDate(nextDay)} 做準備）`}
            action={{ href: `/day/${focusDate}`, label: '在行程頁看' }}
          >
            <div className="card-alert p-4">
              <div className="divide-y divide-alert-border/40">
                {tonight.map((c) => (
                  <CheckItem
                    key={c}
                    storageKey={checklistKey(nextDay, c)}
                    label={c}
                    emphasis
                  />
                ))}
              </div>
              <p className="mt-2 border-t border-alert-border/40 pt-2 text-[11px] leading-relaxed text-alert-text/75">
                沒勾完的項目，明天會出現在行程最上方。
              </p>
            </div>
          </Section>
        )}

        {/* -------------------------------------------- 今日概覽 */}
        <Section title="今天全部行程" action={{ href: `/day/${focusDate}`, label: '展開' }}>
          <div className="card divide-y divide-stone2-100">
            {items.map((i) => (
              <Link
                key={i.id}
                href={`/day/${focusDate}#${i.id}`}
                className="flex items-baseline gap-3 px-4 py-2.5"
              >
                <span className="w-[42px] shrink-0 font-display text-[13px] font-semibold tabular-nums text-ink-faint">
                  {i.startTime ?? '—'}
                </span>
                <span className="text-[13px] leading-snug text-ink-soft">{i.title}</span>
              </Link>
            ))}
            {items.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-ink-faint">今天沒有排定行程。</p>
            )}
          </div>
        </Section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-baseline justify-between">
        <h2 className="section-title">{title}</h2>
        {action && (
          <Link href={action.href} className="text-[13px] font-medium text-faroe-600">
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function NextCard({ item }: { item: ItineraryItem }) {
  return (
    <div className="card p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="font-display text-xl font-semibold tabular-nums">
          {item.startTime ?? '—'}
        </span>
        <span className="text-[11px] text-ink-faint">
          <span aria-hidden="true">{CATEGORY_ICON[item.category]}</span>{' '}
          {CATEGORY_LABEL[item.category]}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug">{item.title}</h3>
      <div className="mt-2">
        <StatusBadges statuses={item.status} />
      </div>
      {item.location && (
        <div className="mt-3">
          <LocationLink location={item.location} showAddress />
          <div className="mt-2">
            <DirectionsButton location={item.location} />
          </div>
        </div>
      )}
      {item.ferry && (
        <p className="mt-3 rounded-xl border border-alert-border bg-alert-bg p-3 text-[13px] leading-relaxed text-alert-text">
          ⛴ {item.ferry.routeName}　建議 {item.ferry.recommendedArrivalTime} 前抵達碼頭，
          {item.ferry.departureTime} 開船。
        </p>
      )}
      <Link
        href={`/day/${item.date}#${item.id}`}
        className="mt-3 block text-[13px] font-medium text-faroe-600"
      >
        看細節 →
      </Link>
    </div>
  );
}

function nextDateOf(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d + 1);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
}
