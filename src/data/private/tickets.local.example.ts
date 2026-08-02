/* =========================================================================
 * 私人票券 — 範例檔（可安全進 repo，因為裡面沒有真資料）
 * =========================================================================
 * 若你想用「檔案」而不是瀏覽器 localStorage 管理票券：
 *
 *   1. 複製這個檔案，改名為 tickets.local.ts（同一個資料夾）
 *   2. 填入真實內容
 *   3. tickets.local.ts 已列入 .gitignore，不會被 commit
 *
 * ⚠ 不要把這些內容寫進 bookings.ts / itinerary.ts。
 * ========================================================================= */

import type { PrivateTicket } from '@/types/trip';

export const localTickets: Record<string, PrivateTicket> = {
  'ferry-kalsoy': {
    id: 'ferry-kalsoy',
    label: 'Kalsoy Route 56 船票',
    reference: '（填入訂位編號）',
    qrImage: '', // 例如 '/private/kalsoy-qr.png'（public/private/ 也已 gitignore）
    fields: [
      { label: '車牌', value: '（取車後補登）' },
      { label: '人數', value: '（確認第二位成人後填）' },
    ],
    fileHint: '原始 PDF：法羅租車.pdf 同資料夾',
  },
};
