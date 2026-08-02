'use client';

import { CheckItem } from '@/components/CheckItem';
import { FerryTerminalCard } from '@/components/FerryTerminalCard';
import { DirectionsButton, LocationLink } from '@/components/LocationLink';
import { StatusBadges } from '@/components/StatusBadge';
import { CATEGORY_ICON, CATEGORY_LABEL } from '@/lib/trip';
import { useLocalToggle } from '@/lib/useLocalToggle';
import type { ItineraryItem } from '@/types/trip';

export function ItineraryItemCard({ item }: { item: ItineraryItem }) {
  const done = useLocalToggle(`item.${item.id}.done`);
  const needsAction = item.status.includes('action_required');

  return (
    <article className="relative pl-7">
      {/* 時間軸圓點 */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[7px] h-[15px] w-[15px] rounded-full border-2 bg-paper ${
          done.value
            ? 'border-good-border'
            : needsAction
              ? 'border-alert-border'
              : 'border-faroe-300'
        }`}
      />

      <div
        className={`card p-4 ${done.value ? 'opacity-55' : ''} ${
          needsAction ? 'border-alert-border' : ''
        }`}
      >
        {/* 時間 + 分類 */}
        <div className="mb-1.5 flex items-center gap-2">
          <span className="font-display text-[17px] font-semibold tabular-nums text-ink">
            {item.startTime ?? '—'}
          </span>
          {item.endTime && (
            <span className="text-[13px] tabular-nums text-ink-faint">– {item.endTime}</span>
          )}
          <span className="ml-auto text-[11px] text-ink-faint">
            <span aria-hidden="true">{CATEGORY_ICON[item.category]}</span>{' '}
            {CATEGORY_LABEL[item.category]}
          </span>
        </div>

        {/* 標題 */}
        <h3
          className={`text-[15px] font-semibold leading-snug ${
            done.value ? 'line-through' : ''
          }`}
        >
          {item.title}
        </h3>

        {/* 狀態 */}
        <div className="mt-2">
          <StatusBadges statuses={item.status} />
        </div>

        {/* 地點 */}
        {item.location && (
          <div className="mt-3">
            <LocationLink location={item.location} showAddress />
            {item.location.hint && (
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                {item.location.hint}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <DirectionsButton location={item.location} />
            </div>
          </div>
        )}

        {/* 其他相關地點 */}
        {item.extraLocations && item.extraLocations.length > 0 && (
          <div className="mt-3 space-y-2 rounded-xl border border-stone2-100 bg-stone2-100/40 p-3">
            <div className="text-[11px] font-semibold text-ink-faint">同一段的其他地點</div>
            {item.extraLocations.map((loc) => (
              <div key={loc.id} className="flex flex-wrap items-center gap-2">
                <LocationLink location={loc} className="text-sm" />
                <a
                  href={loc.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-faroe-600 underline underline-offset-2"
                >
                  開始導航
                </a>
              </div>
            ))}
          </div>
        )}

        {/* 船班卡 */}
        {item.ferry && (
          <div className="mt-3">
            <FerryTerminalCard ferry={item.ferry} itemId={item.id} />
          </div>
        )}

        {/* 備註 */}
        {item.notes && item.notes.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-stone2-100 pt-3">
            {item.notes.map((n) => (
              <li
                key={n}
                className="flex gap-2 text-[13px] leading-relaxed text-ink-soft"
              >
                <span aria-hidden="true" className="text-ink-faint">
                  ·
                </span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 前一晚提醒（項目層級） */}
        {item.previousNightChecklist && item.previousNightChecklist.length > 0 && (
          <div className="mt-3 rounded-xl border border-alert-border bg-alert-bg p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-alert-text">
              前一晚提醒
            </div>
            <div className="divide-y divide-alert-border/40">
              {item.previousNightChecklist.map((c, idx) => (
                <CheckItem key={c} storageKey={`item.${item.id}.pn.${idx}`} label={c} emphasis />
              ))}
            </div>
          </div>
        )}

        {/* 雨天備案 */}
        {item.badWeatherFallback && item.badWeatherFallback.length > 0 && (
          <details className="mt-3 rounded-xl border border-stone2-100 bg-stone2-100/40 p-3">
            <summary className="cursor-pointer list-none text-[13px] font-medium text-ink-soft">
              🌧 雨天／壞天氣備案
            </summary>
            <ul className="mt-2 space-y-1">
              {item.badWeatherFallback.map((f) => (
                <li key={f} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="text-ink-faint">
                    ·
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* 完成勾選 */}
        <button
          type="button"
          onClick={done.toggle}
          className={`mt-3 w-full rounded-full border px-3 py-2 text-[13px] font-medium ${
            done.value
              ? 'border-good-border bg-good-bg text-good-text'
              : 'border-stone2-300 bg-white text-ink-faint'
          }`}
        >
          {done.value ? '✓ 已完成' : '標記完成'}
        </button>
      </div>
    </article>
  );
}
