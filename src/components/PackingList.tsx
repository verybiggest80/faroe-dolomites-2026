'use client';

import { CheckItem } from '@/components/CheckItem';
import { packingGroups, packingKey, packingTotal } from '@/data/packing';
import { useCheckStates } from '@/lib/useLocalToggle';

/**
 * 行李清單 —— 首頁區塊。
 * 分組收合，勾選狀態存在這台裝置。
 */
export function PackingList() {
  const allKeys = packingGroups.flatMap((g) => g.items.map((i) => packingKey(g.id, i.id)));
  const { states, ready } = useCheckStates(allKeys);

  const doneMap = new Map(allKeys.map((k, i) => [k, states[i]]));
  const done = states.filter(Boolean).length;
  const pct = packingTotal === 0 ? 0 : Math.round((done / packingTotal) * 100);

  // 還沒打包的必備品
  const missingEssentials = packingGroups.flatMap((g) =>
    g.items
      .filter((i) => i.essential && !doneMap.get(packingKey(g.id, i.id)))
      .map((i) => ({ group: g, item: i }))
  );

  const allDone = ready && done === packingTotal;

  return (
    <div className="card overflow-hidden">
      {/* 進度 */}
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[15px] font-semibold">
            {allDone ? '行李都打包好了' : `已打包 ${done} / ${packingTotal}`}
          </p>
          <span className="shrink-0 text-[13px] tabular-nums text-ink-faint">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone2-100">
          <div
            className={`h-full rounded-full transition-[width] ${
              allDone ? 'bg-moss-500' : 'bg-faroe-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {ready && missingEssentials.length > 0 && (
          <p className="mt-2.5 text-[12px] leading-relaxed text-alert-text">
            還有 {missingEssentials.length} 樣必備品沒打包，沒帶會直接卡住行程。
          </p>
        )}
      </div>

      {/* 分組 */}
      <div className="divide-y divide-stone2-100 border-t border-stone2-100">
        {packingGroups.map((g) => {
          const keys = g.items.map((i) => packingKey(g.id, i.id));
          const gDone = keys.filter((k) => doneMap.get(k)).length;
          const gAll = gDone === g.items.length;
          return (
            <details key={g.id} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3">
                <span aria-hidden="true" className="text-base leading-none">
                  {g.icon}
                </span>
                <span className="flex-1 text-[14px] font-medium">{g.title}</span>
                <span
                  className={`text-[12px] tabular-nums ${
                    gAll ? 'text-good-text' : 'text-ink-faint'
                  }`}
                >
                  {gAll ? '✓' : `${gDone}/${g.items.length}`}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[11px] text-ink-faint transition-transform group-open:rotate-90"
                >
                  ▶
                </span>
              </summary>

              <div className="px-4 pb-3">
                {g.items.map((i) => (
                  <div key={i.id}>
                    <CheckItem
                      storageKey={packingKey(g.id, i.id)}
                      label={i.essential ? `${i.label}　★` : i.label}
                      emphasis={i.essential}
                    />
                    {i.why && (
                      <p className="mb-1 pl-[28px] text-[11px] leading-relaxed text-ink-faint">
                        {i.why}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>

      <p className="border-t border-stone2-100 px-4 py-2.5 text-[11px] leading-relaxed text-ink-faint">
        ★ 為必備品。勾選狀態只存在這台裝置。
      </p>
    </div>
  );
}
