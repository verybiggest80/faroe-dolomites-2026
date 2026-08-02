import { CheckItem } from '@/components/CheckItem';
import { ItineraryItemCard } from '@/components/ItineraryItemCard';
import { LocationLink } from '@/components/LocationLink';
import { tripDays } from '@/data/itinerary';
import { REGION_LABEL, TIMEZONE_LABEL, longDate, shortDate } from '@/lib/dates';
import {
  accommodationOfDay,
  badWeatherFallbackFor,
  getDay,
  itemsForDate,
  previousNightChecklistFor,
} from '@/lib/trip';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return tripDays.map((d) => ({ date: d.date }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const day = getDay(date);
  if (!day) notFound();

  const items = itemsForDate(date);
  const stay = accommodationOfDay(date);
  const fallback = badWeatherFallbackFor(date);
  const tonight = previousNightChecklistFor(date);

  const idx = tripDays.findIndex((d) => d.date === date);
  const prev = tripDays[idx - 1];
  const next = tripDays[idx + 1];

  return (
    <main>
      {/* 標頭 */}
      <header className="border-b border-stone2-100 bg-white px-5 pb-5 pt-8">
        <p className="section-title">{REGION_LABEL[day.region]}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight">
          {longDate(day.date)}
          <span className="ml-2 text-[15px] font-medium text-ink-faint">{day.weekday}</span>
        </h1>
        <p className="mt-1.5 text-[15px] font-medium leading-snug text-ink-soft">
          {day.title}
        </p>
        {day.summary && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">{day.summary}</p>
        )}
        <p className="mt-2 text-[12px] text-ink-faint">
          時間皆為{TIMEZONE_LABEL[day.timezone]}
        </p>

        {/* 住宿 */}
        <div className="mt-4 rounded-xl border border-stone2-100 bg-stone2-100/40 p-3">
          <div className="text-[11px] font-semibold text-ink-faint">今晚住宿</div>
          {stay ? (
            stay.location ? (
              <div className="mt-0.5">
                <LocationLink location={stay.location} className="text-[13px]" />
              </div>
            ) : (
              <div className="mt-0.5 text-[13px] font-medium">{stay.title}</div>
            )
          ) : (
            <div className="mt-0.5 text-[13px] text-ink-soft">移動中，今晚不過夜</div>
          )}
        </div>
      </header>

      {/* 日期切換 */}
      <nav className="flex items-center justify-between gap-2 border-b border-stone2-100 bg-white px-5 py-3">
        {prev ? (
          <Link href={`/day/${prev.date}`} className="btn-quiet text-[13px]">
            ← {shortDate(prev.date)}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/itinerary" className="text-[13px] font-medium text-faroe-600">
          全部日期
        </Link>
        {next ? (
          <Link href={`/day/${next.date}`} className="btn-quiet text-[13px]">
            {shortDate(next.date)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

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
            {day.weatherSwappable && (
              <p className="mt-3 border-t border-stone2-100 pt-3 text-xs leading-relaxed text-ink-faint">
                這天的非住宿活動可與 8/17、8/20、8/21、8/22 互換。
                船班、航班、住宿、Seceda、Tre Cime 不會跟著移動。
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
