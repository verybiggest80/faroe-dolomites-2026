import { PageHeader } from '@/components/PageHeader';
import { DirectionsButton, LocationLink } from '@/components/LocationLink';
import { StatusBadges } from '@/components/StatusBadge';
import {
  activityBookings,
  backupBookings,
  carBookings,
  flightBookings,
  stayBookings,
} from '@/data/bookings';
import { shortDate } from '@/lib/dates';
import type { Booking } from '@/types/trip';
import Link from 'next/link';

export default function BookingsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="訂位"
        title="所有已訂的東西"
        subtitle="這裡只放日期、時間、地點與提醒。QR code、票號、訂位 PIN 都在私人票券頁，只存在你的手機裡。"
      />

      <div className="space-y-8 px-5 pb-10">
        <Group title="航班" bookings={flightBookings} />
        <Group title="住宿" bookings={stayBookings} />
        <Group title="租車" bookings={carBookings} />
        <Group title="船班・行程・纜車・停車" bookings={activityBookings} />

        {/* 私人票券入口 */}
        <section>
          <h2 className="section-title mb-2.5">私人票券</h2>
          <Link href="/private" className="card block p-4">
            <p className="text-[15px] font-semibold">🔒 QR code 與訂位編號</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
              只存在這台裝置，不會上傳、不會進 repo。
            </p>
          </Link>
        </section>

        {/* 備用票券 — 預設收合，不出現在時間軸、地圖、首頁 */}
        <section>
          <h2 className="section-title mb-2.5">備用票券</h2>
          <details className="card p-4">
            <summary className="cursor-pointer list-none text-[13px] font-medium text-ink-soft">
              展開備用票券（{backupBookings.length}）
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-ink-faint">
              這些票不列入行程、不顯示在地圖與首頁，也不會被當成行程衝突。
            </p>
            <div className="mt-3 space-y-3">
              {backupBookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-stone2-100 p-3">
                  <p className="text-[14px] font-medium">{b.title}</p>
                  <dl className="mt-2 space-y-1">
                    {b.details.map((d) => (
                      <div key={d.label} className="flex gap-2 text-[13px]">
                        <dt className="w-16 shrink-0 text-ink-faint">{d.label}</dt>
                        <dd className="text-ink-soft">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {b.notes?.map((n) => (
                    <p key={n} className="mt-2 text-xs leading-relaxed text-ink-faint">
                      {n}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}

function Group({ title, bookings }: { title: string; bookings: Booking[] }) {
  return (
    <section>
      <h2 className="section-title mb-2.5">{title}</h2>
      <div className="space-y-3">
        {bookings.map((b) => (
          <article key={b.id} className="card p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[13px] font-semibold tabular-nums text-ink-faint">
                {shortDate(b.startDate)}
                {b.endDate && b.endDate !== b.startDate ? ` – ${shortDate(b.endDate)}` : ''}
              </span>
              {b.provider && (
                <span className="ml-auto text-[11px] text-ink-faint">{b.provider}</span>
              )}
            </div>

            <h3 className="mt-1 text-[15px] font-semibold leading-snug">{b.title}</h3>

            <div className="mt-2">
              <StatusBadges statuses={b.status} />
            </div>

            <dl className="mt-3 space-y-1 border-t border-stone2-100 pt-3">
              {b.details.map((d) => (
                <div key={d.label} className="flex gap-2 text-[13px]">
                  <dt className="w-24 shrink-0 text-ink-faint">{d.label}</dt>
                  <dd className="flex-1 leading-relaxed text-ink-soft">{d.value}</dd>
                </div>
              ))}
            </dl>

            {b.location && (
              <div className="mt-3 space-y-2">
                <LocationLink location={b.location} showAddress />
                <DirectionsButton location={b.location} />
              </div>
            )}
            {b.secondaryLocation && b.secondaryLocation.id !== b.location?.id && (
              <div className="mt-3 space-y-2 border-t border-stone2-100 pt-3">
                <div className="text-[11px] text-ink-faint">另一端</div>
                <LocationLink location={b.secondaryLocation} showAddress />
                <DirectionsButton location={b.secondaryLocation} />
              </div>
            )}

            {b.notes && b.notes.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-stone2-100 pt-3">
                {b.notes.map((n) => (
                  <li key={n} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="text-ink-faint">
                      ·
                    </span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}

            {b.hasPrivateTicket && (
              <p className="mt-3 text-xs text-ink-faint">
                🔒 票券內容存在
                <Link href="/private" className="mx-1 font-medium text-faroe-600 underline">
                  私人票券頁
                </Link>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
