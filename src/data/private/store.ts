'use client';

import type { PrivateTicket } from '@/types/trip';

/* =========================================================================
 * 私人票券儲存
 * =========================================================================
 * 設計原則：
 * - QR code、票券序號、訂位 PIN、信用卡、護照資料**永遠不進 repo**。
 * - 實際內容只存在使用者這台裝置的 localStorage。
 * - 這個檔案只有「欄位骨架」與讀寫函式，沒有任何真實票券內容。
 *
 * 若偏好檔案式管理，可另外建立 src/data/private/tickets.local.ts
 * （已列入 .gitignore），格式見 tickets.local.example.ts。
 * ========================================================================= */

const STORAGE_KEY = 'trip2026.privateTickets.v1';

/** 有哪些票券槽位（只有標籤，沒有內容） */
export const PRIVATE_TICKET_SLOTS: { id: string; label: string; hint?: string }[] = [
  { id: 'flight-outbound', label: '去程機票（TG635 / TG950 / SK1777）' },
  { id: 'flight-faroe-venice', label: '法羅 → 威尼斯（RC454 / SK2697）' },
  { id: 'flight-return', label: '回程機票（TK1868 / TG901 / TG630）' },
  { id: 'tour-mykines', label: 'Mykines Tour 船票', hint: '離線保存！' },
  { id: 'ferry-kalsoy', label: 'Kalsoy Route 56 船票', hint: '含車牌，離線保存！' },
  { id: 'cable-seceda', label: 'Seceda 纜車票 × 2', hint: 'QR code，離線保存！' },
  { id: 'parking-tre-cime', label: 'Tre Cime 停車票 8/28', hint: 'QR code，離線保存！' },
  { id: 'stay-hilton', label: 'Hilton Garden Inn 訂房' },
  { id: 'stay-airbnb-torshavn', label: 'Tórshavn Airbnb' },
  { id: 'stay-cozy-hut', label: 'Cozy hut（含鑰匙盒密碼）' },
  { id: 'stay-ca-tessera-1', label: "Ca' Tessera 8/23" },
  { id: 'stay-hartmann', label: 'Chalet Hotel Hartmann' },
  { id: 'stay-linder', label: 'Linder Cycling Hotel' },
  { id: 'stay-franceschi', label: 'Franceschi Park Hotel' },
  { id: 'stay-ca-tessera-2', label: "Ca' Tessera 8/29" },
  { id: 'car-sixt', label: 'SIXT 租車訂單' },
  { id: 'car-autovia', label: 'Autovia 租車訂單' },
  { id: 'parking-tre-cime-backup', label: 'Tre Cime 停車票 8/27（備用）' },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function readPrivateTickets(): Record<string, PrivateTicket> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PrivateTicket>) : {};
  } catch {
    return {};
  }
}

export function writePrivateTicket(ticket: PrivateTicket): void {
  if (!isBrowser()) return;
  const all = readPrivateTickets();
  all[ticket.id] = ticket;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deletePrivateTicket(id: string): void {
  if (!isBrowser()) return;
  const all = readPrivateTickets();
  delete all[id];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function clearPrivateTickets(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
