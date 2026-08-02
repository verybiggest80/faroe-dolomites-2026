import { backupBookings, bookings, getBooking } from '@/data/bookings';
import { itinerary, tripDays } from '@/data/itinerary';
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

/** 依日期取得該日行程，已排序 */
export function itemsForDate(date: string): ItineraryItem[] {
  return itinerary
    .filter((i) => i.date === date && isVisibleInTimeline(i))
    .sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime));
}

/** 該日在地圖上要顯示的所有地點（去重） */
export function locationsForDate(date: string): TripLocation[] {
  const seen = new Set<string>();
  const out: TripLocation[] = [];
  itinerary
    .filter((i) => i.date === date && isVisibleOnMap(i))
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
export function nextItemOfDay(date: string, nowMinutes: number): ItineraryItem | undefined {
  const items = itemsForDate(date);
  if (date !== todayISO()) return items[0];
  return items.find((i) => minutesOf(i.startTime) >= nowMinutes) ?? items[items.length - 1];
}

/** 當日的下一段交通 */
export function nextTransportOfDay(
  date: string,
  nowMinutes: number
): ItineraryItem | undefined {
  const transportCats = new Set([
    'flight',
    'ferry',
    'car',
    'transfer',
    'public_transport',
    'cable_car',
  ]);
  const items = itemsForDate(date).filter((i) => transportCats.has(i.category));
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
export function previousNightChecklistFor(date: string): string[] {
  const d = getDay(date);
  const fromDay = d?.previousNightChecklist ?? [];
  const fromItems = itinerary
    .filter((i) => i.date === date && isVisibleInTimeline(i))
    .flatMap((i) => i.previousNightChecklist ?? []);
  const ferryChecks = itinerary
    .filter((i) => i.date === date && i.ferry)
    .flatMap((i) => i.ferry?.previousNightChecklist ?? []);
  return Array.from(new Set([...fromDay, ...fromItems, ...ferryChecks]));
}

/** 該日的雨天備案（整日層級 + 各項目層級） */
export function badWeatherFallbackFor(date: string): string[] {
  const d = getDay(date);
  const fromDay = d?.badWeatherFallback ?? [];
  const fromItems = itinerary
    .filter((i) => i.date === date && isVisibleInTimeline(i))
    .flatMap((i) => i.badWeatherFallback ?? []);
  return Array.from(new Set([...fromDay, ...fromItems]));
}

/** 該日的風險提示（船班／纜車／健行） */
export interface RiskHint {
  kind: 'ferry' | 'cable_car' | 'hike';
  label: string;
  detail: string;
  itemId: string;
}

export function risksForDate(date: string): RiskHint[] {
  return itemsForDate(date).flatMap<RiskHint>((i) => {
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

  // 8/27 的時間軸不得出現任何 Tre Cime 停車相關項目
  itemsForDate('2026-08-27').forEach((i) => {
    if (i.category === 'parking' || /tre cime/i.test(i.title)) {
      problems.push(`8/27 時間軸出現不該有的項目：${i.id}`);
    }
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
