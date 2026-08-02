import { PageHeader } from '@/components/PageHeader';
import { tripDays } from '@/data/itinerary';
import { REGION_LABEL, shortDate } from '@/lib/dates';
import { itemsForDate, risksForDate } from '@/lib/trip';
import Link from 'next/link';

const REGION_ACCENT: Record<string, string> = {
  transit: 'border-l-stone2-300',
  'faroe-islands': 'border-l-faroe-400',
  dolomites: 'border-l-dolo-400',
  venice: 'border-l-moss-300',
};

export default function ItineraryPage() {
  return (
    <main>
      <PageHeader
        eyebrow="17 天"
        title="每日行程"
        subtitle="2026/8/15 – 8/31　·　法羅群島 8 天、多洛米蒂與威尼斯 7 天"
      />

      <div className="space-y-3 px-5 pb-10">
        {tripDays.map((day) => {
          const items = itemsForDate(day.date);
          const risks = risksForDate(day.date);
          return (
            <Link
              key={day.date}
              href={`/day/${day.date}`}
              className={`block border-l-4 ${REGION_ACCENT[day.region]} card p-4`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[19px] font-semibold tabular-nums">
                  {shortDate(day.date)}
                </span>
                <span className="text-[12px] text-ink-faint">{day.weekday}</span>
                <span className="ml-auto text-[11px] text-ink-faint">
                  {REGION_LABEL[day.region]}
                </span>
              </div>
              <h2 className="mt-1 text-[15px] font-semibold leading-snug">{day.title}</h2>
              {day.summary && (
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{day.summary}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-ink-faint">
                <span>{items.length} 個項目</span>
                {risks.map((r) => (
                  <span key={r.kind + r.itemId} className="chip border-alert-border bg-alert-bg text-alert-text">
                    {r.kind === 'ferry' ? '⛴ 船班' : r.kind === 'cable_car' ? '🚡 纜車' : '🥾 健行'}
                  </span>
                ))}
                {day.weatherSwappable && (
                  <span className="chip border-dolo-200 bg-dolo-50 text-dolo-700">可換日</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
