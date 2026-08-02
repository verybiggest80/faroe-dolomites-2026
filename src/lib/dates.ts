import type { TripRegion, TripTimezone } from '@/types/trip';

export const TRIP_START = '2026-08-15';
export const TRIP_END = '2026-08-31';

const WEEKDAY_TC = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

/** "2026-08-19" -> Date（以當地零時建立，避免 UTC 位移） */
export function parseDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "2026-08-19" -> "星期三" */
export function weekdayOf(date: string): string {
  return WEEKDAY_TC[parseDate(date).getDay()];
}

/** "2026-08-19" -> "8/19" */
export function shortDate(date: string): string {
  const d = parseDate(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** "2026-08-19" -> "8 月 19 日" */
export function longDate(date: string): string {
  const d = parseDate(date);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 兩個日期相差幾天（b - a） */
export function daysBetween(a: string, b: string): number {
  const ms = parseDate(b).getTime() - parseDate(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** 產生 from 到 to（含）之間的所有日期 */
export function dateRange(from: string, to: string): string[] {
  const out: string[] = [];
  const end = parseDate(to);
  const cur = parseDate(from);
  while (cur.getTime() <= end.getTime()) {
    out.push(toISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 今天（裝置本機日期） */
export function todayISO(): string {
  return toISO(new Date());
}

/**
 * App 的「目前日期」。
 * 出發前顯示第一天，旅行中顯示今天，回國後顯示最後一天。
 */
export function currentTripDate(today: string = todayISO()): string {
  if (today < TRIP_START) return TRIP_START;
  if (today > TRIP_END) return TRIP_END;
  return today;
}

/** 距離出發還有幾天；已出發回傳 0 或負值 */
export function daysUntilDeparture(today: string = todayISO()): number {
  return daysBetween(today, TRIP_START);
}

/** "HH:mm" -> 當日分鐘數，用於排序 */
export function minutesOf(time?: string): number {
  if (!time) return -1;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const REGION_LABEL: Record<TripRegion, string> = {
  transit: '移動中',
  'faroe-islands': '法羅群島',
  dolomites: '多洛米蒂',
  venice: '威尼斯',
};

export const REGION_TIMEZONE: Record<TripRegion, TripTimezone> = {
  transit: 'Asia/Taipei',
  'faroe-islands': 'Atlantic/Faroe',
  dolomites: 'Europe/Rome',
  venice: 'Europe/Rome',
};

export const TIMEZONE_LABEL: Record<TripTimezone, string> = {
  'Atlantic/Faroe': '法羅時間',
  'Europe/Rome': '義大利時間',
  'Asia/Taipei': '台灣時間',
};
