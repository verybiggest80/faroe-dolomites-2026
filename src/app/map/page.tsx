import { PageHeader } from '@/components/PageHeader';
import { DirectionsButton, LocationLink } from '@/components/LocationLink';
import { tripDays } from '@/data/itinerary';
import { REGION_LABEL, shortDate } from '@/lib/dates';
import { locationsForDate } from '@/lib/trip';
import type { LocationKind } from '@/types/trip';
import Link from 'next/link';

const KIND_LABEL: Record<LocationKind, string> = {
  airport: '機場',
  hotel: '飯店',
  airbnb: 'Airbnb',
  car_rental: '租車',
  car_return: '還車',
  ferry_terminal: '碼頭',
  parking: '停車場',
  cable_car: '纜車站',
  bus_stop: '公車站',
  vaporetto: '水上巴士',
  trailhead: '健行起點',
  mountain_hut: '山屋',
  attraction: '景點',
  viewpoint: '觀景台',
  village: '村落',
  fuel: '加油站',
  restaurant: '餐廳',
  shop: '商店',
};

const KIND_ICON: Record<LocationKind, string> = {
  airport: '✈',
  hotel: '🛏',
  airbnb: '🏠',
  car_rental: '🚗',
  car_return: '🔑',
  ferry_terminal: '⛴',
  parking: '🅿',
  cable_car: '🚡',
  bus_stop: '🚌',
  vaporetto: '🛥',
  trailhead: '🥾',
  mountain_hut: '🏔',
  attraction: '📍',
  viewpoint: '👁',
  village: '🏘',
  fuel: '⛽',
  restaurant: '🍽',
  shop: '🛒',
};

export default function MapPage() {
  return (
    <main>
      <PageHeader
        eyebrow="地圖"
        title="每日路線與地點"
        subtitle="每個地點都可以點開 Google Maps，或直接開始導航。山區與離島訊號差，出發前記得下載離線地圖。"
      />

      <div className="space-y-6 px-5 pb-10">
        {tripDays.map((day) => {
          const locs = locationsForDate(day.date);
          if (locs.length === 0) return null;
          return (
            <section key={day.date}>
              <div className="mb-2 flex items-baseline gap-2">
                <Link
                  href={`/day/${day.date}`}
                  className="font-display text-[17px] font-semibold tabular-nums text-ink"
                >
                  {shortDate(day.date)}
                </Link>
                <span className="text-[12px] text-ink-faint">{day.weekday}</span>
                <span className="ml-auto text-[11px] text-ink-faint">
                  {REGION_LABEL[day.region]}
                </span>
              </div>

              <div className="card divide-y divide-stone2-100">
                {locs.map((loc, i) => (
                  <div key={loc.id} className="flex items-start gap-3 p-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone2-100 text-[11px]"
                    >
                      {KIND_ICON[loc.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-ink-faint">
                        {i + 1}　{KIND_LABEL[loc.kind]}
                      </div>
                      <LocationLink location={loc} showAddress className="text-[14px]" />
                      {loc.hint && (
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{loc.hint}</p>
                      )}
                      <div className="mt-2">
                        <DirectionsButton location={loc} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
