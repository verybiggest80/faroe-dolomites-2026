'use client';

import { CheckItem } from '@/components/CheckItem';
import { DirectionsButton, LocationLink } from '@/components/LocationLink';
import { useLocalToggle } from '@/lib/useLocalToggle';
import type { FerryTerminalInfo, TripLocation } from '@/types/trip';

/**
 * 所有涉及船班的行程都必須顯示這張卡。
 * 內容涵蓋：航線、去回程碼頭與地址、Google Maps、建議抵達時間、開船時間、
 * 是否開車上船、車牌補登、前一晚確認、停航天氣提醒、票券離線保存狀態。
 */
export function FerryTerminalCard({
  ferry,
  itemId,
}: {
  ferry: FerryTerminalInfo;
  itemId: string;
}) {
  const offline = useLocalToggle(`ferry.${itemId}.offlineTicket`, ferry.ticketSavedOffline);

  const returnFrom = ferry.returnDepartureTerminal ?? ferry.arrivalTerminal;
  const returnTo = ferry.returnArrivalTerminal ?? ferry.departureTerminal;

  return (
    <section className="overflow-hidden rounded-xl2 border border-faroe-200 bg-white shadow-card">
      {/* 標頭 */}
      <header className="flex items-center gap-2 border-b border-faroe-100 bg-faroe-50 px-4 py-3">
        <span aria-hidden="true" className="text-lg leading-none">
          ⛴
        </span>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-faroe-600">
            船班資訊
          </div>
          <h3 className="text-[15px] font-semibold text-faroe-800">{ferry.routeName}</h3>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {/* 天氣警示 */}
        {ferry.weatherSensitive && (
          <div className="card-alert p-3">
            <p className="text-[13px] font-semibold text-alert-text">
              ⚠ 這是受天候影響的船班，可能停航
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-alert-text/85">
              前一晚一定要確認是否正常開船，並查看 email 有沒有停航通知。
              {ferry.operatorNote ? `　${ferry.operatorNote}` : ''}
            </p>
          </div>
        )}

        {/* 去程 */}
        <Leg
          title="去程"
          from={ferry.departureTerminal}
          to={ferry.arrivalTerminal}
          departureTime={ferry.departureTime}
          arriveBy={ferry.recommendedArrivalTime}
        />

        {/* 回程 */}
        {ferry.returnDepartureTime && (
          <Leg
            title="回程"
            from={returnFrom}
            to={returnTo}
            departureTime={ferry.returnDepartureTime}
            arriveBy={ferry.returnRecommendedArrivalTime}
          />
        )}

        {/* 車輛 */}
        <div className="rounded-xl border border-stone2-100 bg-stone2-100/40 p-3">
          <div className="text-[11px] font-semibold text-ink-faint">車輛</div>
          <ul className="mt-1 space-y-1 text-[13px] leading-relaxed text-ink-soft">
            <li>
              開車上船：
              <strong className="text-ink">{ferry.vehicleIncluded ? '是' : '否（純步行）'}</strong>
            </li>
            {ferry.vehiclePlateRequired && (
              <li className="text-alert-text">
                <strong>車牌尚未補登</strong> — 取到租車後必須補上。
              </li>
            )}
            {ferry.passengerCountNeedsVerification && (
              <li className="text-alert-text">
                <strong>人數待確認</strong> — 票面只顯示 1 Adult，第二位成人要確認。
              </li>
            )}
            {ferry.vehicleInstructions && <li>{ferry.vehicleInstructions}</li>}
            {ferry.parkingInstructions && <li>{ferry.parkingInstructions}</li>}
          </ul>
        </div>

        {/* 前一晚確認 */}
        {ferry.previousNightChecklist && ferry.previousNightChecklist.length > 0 && (
          <div>
            <div className="section-title mb-1">前一晚確認</div>
            <div className="divide-y divide-stone2-100">
              {ferry.previousNightChecklist.map((c, idx) => (
                <CheckItem
                  key={c}
                  storageKey={`ferry.${itemId}.pn.${idx}`}
                  label={c}
                  emphasis
                />
              ))}
            </div>
          </div>
        )}

        {/* 票券離線保存 */}
        <button
          type="button"
          onClick={offline.toggle}
          className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] ${
            offline.value
              ? 'border-good-border bg-good-bg text-good-text'
              : 'border-alert-border bg-alert-bg text-alert-text'
          }`}
        >
          <span aria-hidden="true">{offline.value ? '✓' : '!'}</span>
          <span className="font-medium">
            {offline.value ? '票券已離線保存' : '票券尚未離線保存 — 點一下標記完成'}
          </span>
        </button>
      </div>
    </section>
  );
}

function Leg({
  title,
  from,
  to,
  departureTime,
  arriveBy,
}: {
  title: string;
  from: TripLocation;
  to: TripLocation;
  departureTime: string;
  arriveBy?: string;
}) {
  return (
    <div className="rounded-xl border border-stone2-100 p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
          {title}
        </span>
        <span className="font-display text-lg font-semibold tabular-nums text-ink">
          {departureTime} 開船
        </span>
      </div>

      {arriveBy && (
        <p className="mb-2 text-[13px] font-medium text-alert-text">
          建議 {arriveBy} 前抵達碼頭
        </p>
      )}

      <div className="space-y-2">
        <div>
          <div className="text-[11px] text-ink-faint">出發碼頭</div>
          <LocationLink location={from} showAddress />
          {from.hint && (
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{from.hint}</p>
          )}
          <div className="mt-1.5">
            <DirectionsButton location={from} label="導航到碼頭" />
          </div>
        </div>
        <div className="border-t border-stone2-100 pt-2">
          <div className="text-[11px] text-ink-faint">抵達碼頭</div>
          <LocationLink location={to} showAddress />
        </div>
      </div>
    </div>
  );
}
