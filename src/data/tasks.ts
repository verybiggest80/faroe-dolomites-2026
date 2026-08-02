import type { TripTask } from '@/types/trip';

/* =========================================================================
 * 待辦事項
 * =========================================================================
 * completed 只是預設值；使用者的實際勾選狀態存在瀏覽器 localStorage，
 * 不會寫回這個檔案（也就不會進 repo）。
 * ========================================================================= */

export const tasks: TripTask[] = [
  /* ------------------------------------------------------- critical */
  {
    id: 'task-kalsoy-plate',
    title: 'Kalsoy 船票補登租車車牌',
    priority: 'critical',
    dueDate: '2026-08-18',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['fr-kalsoy', 'c-sixt-pickup'],
    relatedBookingIds: ['ferry-kalsoy', 'car-sixt'],
    description:
      'Route 56 船票已包含一輛汽車（車資含 1 位駕駛的船票，另購 1 張成人票，兩人都有票），但車牌尚未登錄。8/16 取到 SIXT 租車後就要補登，最晚 8/18 晚上完成。',
    howTo: [
      '8/16 取車時先拍下車牌照片',
      '登入購票網站／回信給售票方補登車牌',
      '補登後把更新的票券再存一次離線檔',
    ],
  },
  {
    id: 'task-sixt-early-return',
    title: '確認 SIXT 8/23 清晨還車方式',
    priority: 'critical',
    dueDate: '2026-08-22',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['c-sixt-return'],
    relatedBookingIds: ['car-sixt'],
    description:
      '建議 07:45 完成還車。訂單上的 13:30 只是預設值。需要問清楚清晨有沒有人。',
    howTo: [
      '確認清晨是人工櫃檯還是鑰匙箱',
      '確認車輛檢查方式（有沒有人驗車？）',
      '確認鑰匙最終歸還位置',
      '把回覆截圖存離線',
    ],
  },
  {
    id: 'task-mykines-weather',
    title: 'Mykines 前一晚確認船班及天候',
    priority: 'critical',
    dueDate: '2026-08-17',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['fr-mykines'],
    relatedBookingIds: ['tour-mykines'],
    description: 'Mykines 船班受天候影響，停航機率不低。8/17 晚上一定要確認。',
    howTo: [
      '查看 email 是否收到停航通知',
      '確認官方公告的當日開航狀況',
      '若停航，把 8/17 或 8/20 的行程往前遞補',
    ],
  },
  {
    id: 'task-catessera-luggage',
    title: "確認 Ca' Tessera 8/29 可提前寄放行李",
    priority: 'critical',
    dueDate: '2026-08-27',
    completed: false,
    region: 'venice',
    relatedItemIds: ['x-luggage-drop'],
    relatedBookingIds: ['stay-ca-tessera-2'],
    description:
      '8/29 約 10:00 抵達，晚上才入住。不能寄放的話要改用機場的合法行李寄放服務。',
    howTo: [
      '直接寫信或訊息問飯店',
      '不能寄放就查 Venice Marco Polo Airport 的 left luggage 位置與價格',
      '不論如何都不帶大型行李進威尼斯',
    ],
  },
  {
    id: 'task-autovia-early-return',
    title: '確認 Autovia 接受 8/29 約 11:00 提早還車',
    priority: 'critical',
    dueDate: '2026-08-27',
    completed: false,
    region: 'venice',
    relatedItemIds: ['c-autovia-return'],
    relatedBookingIds: ['car-autovia'],
    description:
      '原訂還車是 8/30 10:00，實際計畫提早一天。需要事先確認，否則現場可能沒人收車。',
    howTo: [
      '聯繫 Autovia 說明 8/29 約 11:00 還車',
      '確認是否需要修改訂單',
      '確認還車檢查程序',
      '不預期未使用的租車時間可以退款',
    ],
  },
  {
    id: 'task-catessera-shuttle',
    title: "確認 Ca' Tessera 8/29 晚間及 8/30 清晨機場接駁",
    priority: 'critical',
    dueDate: '2026-08-27',
    completed: false,
    region: 'venice',
    relatedItemIds: ['h-catessera-2', 'x-to-vce-30'],
    relatedBookingIds: ['stay-ca-tessera-2'],
    description:
      '8/29 晚上從機場回飯店、8/30 06:45 從飯店到機場，兩趟都需要交通。車已經還掉了。',
    howTo: [
      '問飯店接駁的營運時間與是否需預約',
      '沒有接駁就先查好計程車叫車方式',
      '把飯店電話存進手機',
    ],
  },
  {
    id: 'task-offline-tickets',
    title: '將 Mykines、Kalsoy、Seceda、Tre Cime 票券離線保存',
    priority: 'critical',
    dueDate: '2026-08-14',
    completed: false,
    relatedBookingIds: [
      'tour-mykines',
      'ferry-kalsoy',
      'cable-seceda',
      'parking-tre-cime',
    ],
    description: '山上和離島常常沒訊號，票券一定要能離線打開。',
    howTo: [
      '每張票另存 PDF 或截圖到手機相簿',
      '同時存一份到 Apple Wallet／Google Wallet（若支援）',
      '確認在飛航模式下打得開',
    ],
  },
  {
    id: 'task-offline-maps',
    title: '下載法羅群島及多洛米蒂 Google Maps 離線地圖',
    priority: 'critical',
    dueDate: '2026-08-14',
    completed: false,
    description: 'Kalsoy、Mykines、Tre Cime 都可能沒訊號。',
    howTo: [
      'Google Maps →「離線地圖」→ 選取自己的地圖',
      '至少下載：Streymoy／Vágar／Kalsoy／Eysturoy、Val Gardena／Val di Funes／Cortina 一帶',
      '出發前確認離線地圖沒過期',
    ],
  },

  {
    id: 'task-dunnesdrangar-offline',
    title: '將 Dunnesdrangar 訂位確認信離線保存',
    priority: 'important',
    dueDate: '2026-08-20',
    completed: false,
    region: 'faroe-islands',
    relatedBookingIds: ['tour-dunnesdrangar'],
    description:
      '集合點在 Sørvágur 村內，現場不一定有訊號。確認信、導遊電話與集合座標都要能離線打開。',
    howTo: [
      '把確認信截圖存到私人票券頁的「Dunnesdrangar 嚮導健行」',
      '順便填入導遊電話，之後可以一鍵撥打',
      '金額與訂單編號也填進去（只會存在這台裝置）',
    ],
  },
  {
    id: 'task-dunnesdrangar-confirm',
    title: 'Dunnesdrangar 前一晚確認天候與是否取消',
    priority: 'critical',
    dueDate: '2026-08-20',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['dunnesdrangar-guided-hike-2026-08-21'],
    relatedBookingIds: ['tour-dunnesdrangar'],
    description:
      '8/21 10:00 的嚮導健行已付款。這是嚮導帶領行程，取消就是取消，不能自己走。前一晚要確認風速、能見度，並檢查有沒有收到營運方通知。',
    howTo: [
      '查看 Sørvágur 一帶的風速與能見度預報',
      '檢查 email 與簡訊有沒有取消通知',
      '把訂位確認信離線保存到私人票券頁',
      '若取消，在 App 的 8/21 切換到備案方案（Kvívík／Vestmanna）',
    ],
  },

  /* ------------------------------------------------------ important */
  {
    id: 'task-airbnb-luggage',
    title: '確認 Tórshavn Airbnb 是否可 8/17 提早寄放行李',
    priority: 'important',
    dueDate: '2026-08-16',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['x-depart-17'],
    relatedBookingIds: ['stay-airbnb-torshavn'],
    description:
      '8/17 早上 08:15 就要出門玩一整天，晚上才入住。不能寄放就得整天帶著行李。',
    howTo: [
      '訊息問房東',
      '不能寄放：行李完整遮蔽於鎖上的後車廂',
      '護照、現金、票券及貴重物品一律隨身',
    ],
  },
  {
    id: 'task-cph-transfer',
    title: '規劃 8/23 哥本哈根 T2 → T3 轉機動線',
    priority: 'important',
    dueDate: '2026-08-22',
    completed: false,
    region: 'transit',
    relatedItemIds: ['x-cph-transfer'],
    description:
      '13:55 落地 T2，17:00 從 T3 起飛。必須提領行李、換航廈、重新託運，只有 3 小時 5 分。',
    howTo: [
      '事先看好 CPH T2 → T3 的步行路線',
      '落地後不逛免稅店，先把行李處理完',
      '先確認 SK2697 的報到櫃檯位置',
    ],
  },
  {
    id: 'task-museum-hours',
    title: '確認 8/20 Nordic House 與國家博物館開放時間',
    priority: 'important',
    dueDate: '2026-08-19',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['a-nordic-house', 'a-national-museum'],
    description: '8/20 的室內行程完全依賴這兩處的開放時間。',
    howTo: ['查官方網站的當週開放時間', '若都沒開，改成 Kirkjubøur + 市區'],
  },
  {
    id: 'task-seceda-qr',
    title: '下載兩張 Seceda QR code 並確認山頂天氣',
    priority: 'important',
    dueDate: '2026-08-24',
    completed: false,
    region: 'dolomites',
    relatedItemIds: ['cc-seceda-up'],
    relatedBookingIds: ['cable-seceda'],
    description: '8/25 08:30 上山，票券是指定時間的。',
    howTo: [
      '兩張 QR code 分別存成圖片',
      '確認山頂風勢（風大會停駛）',
      '確認飯店到纜車站的交通方式',
    ],
  },
  {
    id: 'task-tre-cime-plate',
    title: '確認 Tre Cime 停車票的車牌資料',
    priority: 'important',
    dueDate: '2026-08-27',
    completed: false,
    region: 'dolomites',
    relatedItemIds: ['pk-tre-cime'],
    relatedBookingIds: ['parking-tre-cime', 'car-autovia'],
    description: '8/28 06:00 入場，車牌若對不上會卡在閘口。',
    howTo: ['8/24 取車後核對車牌', '有誤就立刻修改'],
  },
  {
    id: 'task-venice-transport',
    title: '查詢 8/29 當日 ATVO／ACTV 班次',
    priority: 'important',
    dueDate: '2026-08-28',
    completed: false,
    region: 'venice',
    relatedItemIds: ['pt-to-venice', 'pt-vaporetto-back'],
    description: '還車後改搭公共交通進威尼斯本島，班次當天再確認。',
    howTo: [
      '首選 ATVO Airport Bus Express，備選 ACTV Line 5',
      '同時查最後一班回機場的時間',
      '順便決定要不要買 vaporetto 一日票',
    ],
  },

  /* --------------------------------------------------------- normal */
  {
    id: 'task-faroe-fuel',
    title: '8/18 晚上把車加滿油（隔天 04:50 出發）',
    priority: 'normal',
    dueDate: '2026-08-18',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['x-depart-19'],
    description: '清晨出發，加油站不一定開。',
  },
  {
    id: 'task-car-photos-faroe',
    title: '8/22 傍晚拍好 SIXT 車況照片',
    priority: 'normal',
    dueDate: '2026-08-22',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['p-prep-22'],
    description: '清晨還車若沒人驗車，照片就是唯一證據。',
    howTo: ['車身四面、輪胎、油表、里程、車內'],
  },
  {
    id: 'task-car-photos-italy',
    title: '8/29 還車前拍好 Autovia 車況照片',
    priority: 'normal',
    dueDate: '2026-08-29',
    completed: false,
    region: 'venice',
    relatedItemIds: ['c-refuel-29'],
    description: '提早還車更需要留紀錄。',
    howTo: ['油表、里程、車身、輪胎及車內'],
  },
  {
    id: 'task-traelanipa-fee',
    title: '確認 Trælanípa 健行費用與付款方式',
    priority: 'normal',
    dueDate: '2026-08-21',
    completed: false,
    region: 'faroe-islands',
    relatedItemIds: ['hk-traelanipa'],
    description: '這條步道在私人土地上，依現場規定支付健行費。',
    howTo: ['導航到正式接待處／停車場，不要直接導航到懸崖座標'],
  },
];

export const criticalTasks = tasks.filter((t) => t.priority === 'critical');

export function getTask(id: string): TripTask | undefined {
  return tasks.find((t) => t.id === id);
}
