import { backupBookings, bookings, getBooking } from '@/data/bookings';
import { alternateDateActivities, itinerary, tripDays } from '@/data/itinerary';
import { allLocations } from '@/data/locations';
import { tasks } from '@/data/tasks';
import { minutesOf, todayISO } from '@/lib/dates';
import type {
  Booking,
  ItemStatus,
  ItineraryItem,
  TripDay,
  TripLocation,
  TripTask,
} from '@/types/trip';

/* ---------------------------------------------------------------- 顯示 */

export const STATUS_LABEL: Record<ItemStatus, string> = {
  confirmed: '已確認',
  planned: '已規劃',
  open: '未定',
  weather_flexible: '看天氣',
  action_required: '待確認',
  informational_only: '僅供參考',
  backup_only: '備用',
};

export const STATUS_CLASS: Record<ItemStatus, string> = {
  confirmed: 'bg-good-bg text-good-text border-good-border',
  planned: 'bg-faroe-50 text-faroe-700 border-faroe-200',
  open: 'bg-stone2-100 text-stone2-700 border-stone2-300',
  weather_flexible: 'bg-dolo-50 text-dolo-700 border-dolo-200',
  action_required: 'bg-alert-bg text-alert-text border-alert-border',
  informational_only: 'bg-stone2-100 text-stone2-500 border-stone2-300',
  backup_only: 'bg-stone2-100 text-stone2-500 border-stone2-300',
};

export const CATEGORY_LABEL: Record<string, string> = {
  flight: '航班',
  accommodation: '住宿',
  car: '租車',
  ferry: '船班',
  tour: '行程',
  cable_car: '纜車',
  parking: '停車',
  hike: '健行',
  attraction: '景點',
  transfer: '移動',
  public_transport: '大眾運輸',
  task: '待辦',
};

export const CATEGORY_ICON: Record<string, string> = {
  flight: '✈',
  accommodation: '🛏',
  car: '🚗',
  ferry: '⛴',
  tour: '🎫',
  cable_car: '🚡',
  parking: '🅿',
  hike: '🥾',
  attraction: '📍',
  transfer: '➜',
  public_transport: '🚌',
  task: '✓',
};

/* -------------------------------------------------------- 過濾與查詢 */

/** 是否可出現在主要畫面（排除備用票與明確關閉顯示的項目） */
export function isVisibleInTimeline(item: ItineraryItem): boolean {
  if (item.isBackupOnly) return false;
  if (item.status.includes('backup_only')) return false;
  if (item.status.includes('informational_only')) return false;
  return item.displayInTimeline !== false;
}

export function isVisibleOnMap(item: ItineraryItem): boolean {
  if (item.isBackupOnly) return false;
  if (item.status.includes('backup_only')) return false;
  return item.displayOnMap !== false;
}

/**
 * 該項目在指定方案下是否要顯示。
 * 沒有 planId 的項目（航班、取車…）不論選哪個方案都會出現。
 */
function matchesPlan(item: ItineraryItem, planId?: string): boolean {
  if (!item.planId) return true;
  return item.planId === planId;
}

/**
 * 條件式行程的預設方案 = Plan A。
 * 靜態產生與伺服器端一律用這個；客戶端再依 localStorage 覆寫。
 */
export function defaultPlanFor(date: string): string | undefined {
  return getDay(date)?.conditionalPlan?.id;
}

/**
 * 依日期取得該日行程，已排序。
 * planId 未指定時使用該日的預設方案。
 */
export function itemsForDate(date: string, planId?: string): ItineraryItem[] {
  const plan = planId ?? defaultPlanFor(date);
  return itinerary
    .filter((i) => i.date === date && isVisibleInTimeline(i) && matchesPlan(i, plan))
    .sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime));
}

/** 該日在地圖上要顯示的所有地點（去重） */
export function locationsForDate(date: string, planId?: string): TripLocation[] {
  const plan = planId ?? defaultPlanFor(date);
  const seen = new Set<string>();
  const out: TripLocation[] = [];
  itinerary
    .filter((i) => i.date === date && isVisibleOnMap(i) && matchesPlan(i, plan))
    .sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime))
    .forEach((i) => {
      [i.location, ...(i.extraLocations ?? [])].forEach((loc) => {
        if (loc && !seen.has(loc.id)) {
          seen.add(loc.id);
          out.push(loc);
        }
      });
    });
  return out;
}

export function getDay(date: string): TripDay | undefined {
  return tripDays.find((d) => d.date === date);
}

export function getItem(id: string): ItineraryItem | undefined {
  return itinerary.find((i) => i.id === id);
}

/** 當日的下一個活動（依裝置時間；不在旅程中時回傳當日第一項） */
export function nextItemOfDay(
  date: string,
  nowMinutes: number,
  planId?: string
): ItineraryItem | undefined {
  const items = itemsForDate(date, planId);
  if (date !== todayISO()) return items[0];
  return items.find((i) => minutesOf(i.startTime) >= nowMinutes) ?? items[items.length - 1];
}

/** 當日的下一段交通 */
export function nextTransportOfDay(
  date: string,
  nowMinutes: number,
  planId?: string
): ItineraryItem | undefined {
  const transportCats = new Set([
    'flight',
    'ferry',
    'car',
    'transfer',
    'public_transport',
    'cable_car',
  ]);
  const items = itemsForDate(date, planId).filter((i) => transportCats.has(i.category));
  if (date !== todayISO()) return items[0];
  return items.find((i) => minutesOf(i.startTime) >= nowMinutes) ?? items[0];
}

/** 當晚住宿 */
export function accommodationOfDay(date: string): Booking | undefined {
  const d = getDay(date);
  if (!d?.accommodationBookingId) return undefined;
  return getBooking(d.accommodationBookingId);
}

/** 明日出發前需要今晚完成的提醒（整日層級 + 各項目層級） */
export function previousNightChecklistFor(date: string, planId?: string): string[] {
  const d = getDay(date);
  const fromDay = d?.previousNightChecklist ?? [];
  const fromItems = itemsForDate(date, planId).flatMap(
    (i) => i.previousNightChecklist ?? []
  );
  const ferryChecks = itemsForDate(date, planId).flatMap(
    (i) => i.ferry?.previousNightChecklist ?? []
  );
  return Array.from(new Set([...fromDay, ...fromItems, ...ferryChecks]));
}

/** 該日的雨天備案（整日層級 + 各項目層級） */
export function badWeatherFallbackFor(date: string, planId?: string): string[] {
  const d = getDay(date);
  const fromDay = d?.badWeatherFallback ?? [];
  const fromItems = itemsForDate(date, planId).flatMap((i) => i.badWeatherFallback ?? []);
  return Array.from(new Set([...fromDay, ...fromItems]));
}

/** 該日的風險提示（船班／纜車／健行） */
export interface RiskHint {
  kind: 'ferry' | 'cable_car' | 'hike';
  label: string;
  detail: string;
  itemId: string;
}

export function risksForDate(date: string, planId?: string): RiskHint[] {
  return itemsForDate(date, planId).flatMap<RiskHint>((i) => {
    if (i.ferry) {
      return [
        {
          kind: 'ferry',
          label: '船班受天候影響',
          detail: `${i.ferry.routeName}　${i.ferry.departureTime} 開船，建議 ${i.ferry.recommendedArrivalTime} 前到碼頭。`,
          itemId: i.id,
        },
      ];
    }
    if (i.category === 'cable_car' && i.status.includes('weather_flexible')) {
      return [
        {
          kind: 'cable_car',
          label: '纜車可能因強風停駛',
          detail: i.title,
          itemId: i.id,
        },
      ];
    }
    if (i.category === 'hike') {
      return [
        {
          kind: 'hike',
          label: '健行需看天氣',
          detail: i.title,
          itemId: i.id,
        },
      ];
    }
    return [];
  });
}

/* ---------------------------------------------------------------- 待辦 */

export function tasksByPriority(priority: TripTask['priority']): TripTask[] {
  return tasks.filter((t) => t.priority === priority);
}

export function tasksDueBy(date: string): TripTask[] {
  return tasks.filter((t) => t.dueDate && t.dueDate <= date);
}

/* -------------------------------------------------------------- 訂位 */

export function bookingsForDate(date: string): Booking[] {
  return bookings.filter(
    (b) => b.startDate === date || (b.endDate && b.startDate <= date && date <= b.endDate)
  );
}

/* ------------------------------------------------------------ 完整性 */

/**
 * 自我檢查：確保備用票券沒有洩漏到任何主要畫面。
 * 在 dev 模式下由 layout 呼叫，出問題會在 console 顯示。
 */
export function assertBackupIsolation(): string[] {
  const problems: string[] = [];

  backupBookings.forEach((b) => {
    if (!b.isBackupOnly) problems.push(`${b.id} 缺少 isBackupOnly`);
    if (b.displayInTimeline !== false) problems.push(`${b.id} 不該出現在時間軸`);
    if (b.displayOnMap !== false) problems.push(`${b.id} 不該出現在地圖`);
    if (b.displayOnDashboard !== false) problems.push(`${b.id} 不該出現在首頁`);
    if (b.displayAsConflict !== false) problems.push(`${b.id} 不該顯示為衝突`);
    if (bookings.some((x) => x.id === b.id)) problems.push(`${b.id} 混進主要訂位清單`);
    if (itinerary.some((i) => i.relatedBookingId === b.id))
      problems.push(`${b.id} 被行程項目引用`);
    if (tasks.some((t) => t.relatedBookingIds?.includes(b.id)))
      problems.push(`${b.id} 被待辦引用`);
  });

  // 8/27 的時間軸不得出現停車票項目，也不得引用任何備用訂位。
  // 註：8/27 提到「整理 Tre Cime 裝備」是隔日的準備工作，屬正常行程，不算外洩。
  const backupIds = new Set(backupBookings.map((b) => b.id));
  itemsForDate('2026-08-27').forEach((i) => {
    if (i.category === 'parking') {
      problems.push(`8/27 時間軸出現停車票項目：${i.id}`);
    }
    if (i.relatedBookingId && backupIds.has(i.relatedBookingId)) {
      problems.push(`8/27 項目 ${i.id} 引用了備用訂位`);
    }
  });

  return problems;
}

/**
 * 自我檢查：條件式行程的方案定義與實際項目一致。
 */
export function assertPlanIntegrity(): string[] {
  const problems: string[] = [];
  const byId = new Map(itinerary.map((i) => [i.id, i]));

  tripDays.forEach((d) => {
    const plans = [d.conditionalPlan, d.fallbackPlan].filter(Boolean);
    if (plans.length === 0) return;

    if (!d.planStorageKey && !d.planDeterminedByFlag) {
      problems.push(`${d.date} 有方案但沒有指定切換方式`);
    }
    if (d.conditionalPlan && !d.fallbackPlan) {
      problems.push(`${d.date} 只有主要方案，缺少備案`);
    }

    plans.forEach((p) => {
      p!.itemIds.forEach((id) => {
        const item = byId.get(id);
        if (!item) {
          problems.push(`${d.date} 方案 ${p!.id} 引用了不存在的項目 ${id}`);
          return;
        }
        if (item.date !== d.date) {
          problems.push(`${p!.id} 引用了不同日期的項目 ${id}`);
        }
        if (item.planId !== p!.id) {
          problems.push(`${id} 的 planId 與方案 ${p!.id} 不符`);
        }
      });
    });

    // 該日每個帶 planId 的項目都必須被某個方案列出
    const declared = new Set(plans.flatMap((p) => p!.itemIds));
    itinerary
      .filter((i) => i.date === d.date && i.planId && !declared.has(i.id))
      .forEach((i) => problems.push(`${i.id} 有 planId 但沒有被任何方案列出`));
  });

  // 跨日期活動：兩邊的旗標必須一致
  Object.entries(alternateDateActivities).forEach(([flag, a]) => {
    a.itemIds.forEach((id) => {
      const item = byId.get(id);
      if (!item) {
        problems.push(`跨日期活動 ${flag} 引用了不存在的項目 ${id}`);
      } else if (item.completedOnAlternateDate !== flag) {
        problems.push(`${id} 缺少 completedOnAlternateDate: '${flag}'`);
      }
    });
  });

  return problems;
}

/**
 * 自我檢查：每個地點都能跳轉 Google Maps。
 */
export function assertAllLocationsMappable(): string[] {
  return allLocations
    .filter(
      (loc) =>
        !loc.googleMapsUrl.startsWith('https://www.google.com/maps/search/') ||
        !loc.googleMapsDirectionsUrl.startsWith('https://www.google.com/maps/dir/') ||
        !loc.googleMapsQuery.trim()
    )
    .map((loc) => `${loc.id} 的 Google Maps 連結不完整`);
}
