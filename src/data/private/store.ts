'use client';

/* =========================================================================
 * 私人票券儲存 — 只存在這台裝置
 * =========================================================================
 * 設計原則：
 * - QR code 圖檔、票券序號、訂位 PIN、鑰匙盒密碼**永遠不上傳**。
 * - 圖檔以 Blob 存在瀏覽器的 IndexedDB，不經過任何伺服器。
 * - 因此就算網站本身是公開的，票券也不會外洩 —— 票券根本不在網站裡。
 *
 * ⚠ 這不是備份。清除瀏覽器資料會一併清掉。
 *   QR 原檔請務必留在手機相簿或 Apple Wallet。
 * ========================================================================= */

const DB_NAME = 'trip2026-private';
const DB_VERSION = 1;
const STORE = 'tickets';

export interface StoredTicket {
  id: string;
  /** 訂位／票券編號 */
  reference?: string;
  /** 自由備註：鑰匙盒密碼、車牌、聯絡電話 */
  note?: string;
  /** QR code、票券截圖或原始確認信 */
  image?: Blob;
  imageName?: string;

  /* --- 私人訂位細節（PrivateBookingDetails；只存在這台裝置） --- */
  /** 導遊／營運方電話，供「撥打導遊」按鈕使用 */
  guidePhone?: string;
  /** 已付金額（實際數值只存在這台裝置，不進 repo） */
  priceAmount?: number;
  /** 幣別代碼 */
  priceCurrency?: string;

  updatedAt: number;
}

/** 有哪些票券槽位（只有標籤，沒有內容） */
export const PRIVATE_TICKET_SLOTS: {
  id: string;
  label: string;
  hint?: string;
  critical?: boolean;
  /** 對應的公開 booking，用來取得集合地點與名稱 */
  bookingId?: string;
  /** 這個槽位要顯示導遊電話與金額欄位 */
  hasGuideDetails?: boolean;
}[] = [
  { id: 'tour-mykines', label: 'Mykines Tour 船票', hint: '8/18 · 離線必備', critical: true },
  {
    id: 'tour-dunnesdrangar',
    label: 'Dunnesdrangar 嚮導健行',
    hint: '8/21 10:00 · 含導遊電話與金額',
    critical: true,
    bookingId: 'tour-dunnesdrangar',
    hasGuideDetails: true,
  },
  { id: 'ferry-kalsoy', label: 'Kalsoy Route 56 船票', hint: '8/19 · 含車牌 · 離線必備', critical: true },
  { id: 'cable-seceda', label: 'Seceda 纜車票 × 2', hint: '8/25 08:30 · 離線必備', critical: true },
  { id: 'parking-tre-cime', label: 'Tre Cime 停車票', hint: '8/28 06:00 · 離線必備', critical: true },
  { id: 'flight-outbound', label: '去程機票（TG635 / TG950 / SK1777）' },
  { id: 'flight-faroe-venice', label: '法羅 → 威尼斯（RC454 / SK2697）' },
  { id: 'flight-return', label: '回程機票（TK1868 / TG901 / TG630）' },
  { id: 'stay-hilton', label: 'Hilton Garden Inn 訂房' },
  { id: 'stay-airbnb-torshavn', label: 'Tórshavn Airbnb' },
  { id: 'stay-cozy-hut', label: 'Cozy hut（含鑰匙盒密碼）', hint: '自助入住' },
  { id: 'stay-ca-tessera-1', label: "Ca' Tessera 8/23" },
  { id: 'stay-hartmann', label: 'Chalet Hotel Hartmann' },
  { id: 'stay-linder', label: 'Linder Cycling Hotel' },
  { id: 'stay-franceschi', label: 'Franceschi Park Hotel' },
  { id: 'stay-ca-tessera-2', label: "Ca' Tessera 8/29" },
  { id: 'car-sixt', label: 'SIXT 租車訂單' },
  { id: 'car-autovia', label: 'Autovia 租車訂單' },
  { id: 'parking-tre-cime-backup', label: 'Tre Cime 停車票 8/27（備用）' },
];

export function slotLabel(id: string): string {
  return PRIVATE_TICKET_SLOTS.find((s) => s.id === id)?.label ?? id;
}

export function slotOf(id: string) {
  return PRIVATE_TICKET_SLOTS.find((s) => s.id === id);
}

/* ------------------------------------------------------------ IndexedDB */

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('這個瀏覽器不支援本機儲存'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        t.oncomplete = () => db.close();
      })
  );
}

export function getTicket(id: string): Promise<StoredTicket | undefined> {
  return tx<StoredTicket | undefined>('readonly', (s) => s.get(id)).catch(() => undefined);
}

export function listTickets(): Promise<StoredTicket[]> {
  return tx<StoredTicket[]>('readonly', (s) => s.getAll()).catch(() => []);
}

export function putTicket(ticket: Omit<StoredTicket, 'updatedAt'>): Promise<unknown> {
  return tx('readwrite', (s) => s.put({ ...ticket, updatedAt: Date.now() }));
}

export function deleteTicket(id: string): Promise<unknown> {
  return tx('readwrite', (s) => s.delete(id));
}

/** 這台裝置上票券總共佔多少空間 */
export async function storageUsage(): Promise<{ count: number; bytes: number }> {
  const all = await listTickets();
  return {
    count: all.length,
    bytes: all.reduce((sum, t) => sum + (t.image?.size ?? 0), 0),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
