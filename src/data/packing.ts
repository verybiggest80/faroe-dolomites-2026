/* =========================================================================
 * 行李清單
 * =========================================================================
 * 針對這趟旅行的實際需求：法羅群島 8 天（多雨、強風、離島船班、自駕）
 * + 多洛米蒂 7 天（高山健行、清晨出發、纜車）。
 *
 * 勾選狀態存在裝置的 localStorage，不上傳。
 * ========================================================================= */

export interface PackingItem {
  id: string;
  label: string;
  /** 沒帶會直接卡住行程的東西 */
  essential?: boolean;
  /** 為什麼需要 —— 只在跟這趟行程特別相關時才寫 */
  why?: string;
}

export interface PackingGroup {
  id: string;
  title: string;
  icon: string;
  items: PackingItem[];
}

export const packingGroups: PackingGroup[] = [
  {
    id: 'documents',
    title: '證件與金錢',
    icon: '🛂',
    items: [
      { id: 'passport', label: '護照（效期至少 6 個月）', essential: true },
      {
        id: 'idp',
        label: '國際駕照 + 台灣駕照正本',
        essential: true,
        why: '法羅與義大利兩段租車都要，兩本都要帶，缺一不可取車',
      },
      { id: 'insurance', label: '旅遊保險保單（離線存一份）', essential: true },
      { id: 'creditcard', label: '信用卡 ×2（不同發卡組織）', essential: true },
      { id: 'cash-dkk', label: '丹麥克朗現金', why: '法羅群島用 DKK，健行費可能只收現場付款' },
      { id: 'cash-eur', label: '歐元現金', why: '義大利段' },
      { id: 'emergency', label: '緊急聯絡資訊（紙本一份）' },
    ],
  },
  {
    id: 'tickets',
    title: '票券與離線資料',
    icon: '🎫',
    items: [
      {
        id: 'offline-tickets',
        label: '四張離線必備票券已存手機',
        essential: true,
        why: 'Mykines、Kalsoy、Seceda、Tre Cime 都在沒訊號的地方',
      },
      { id: 'dunnesdrangar', label: 'Dunnesdrangar 確認信已離線保存' },
      { id: 'offline-maps', label: 'Google Maps 離線地圖（法羅 + 多洛米蒂）', essential: true },
      { id: 'boarding', label: '登機證已下載' },
      { id: 'car-docs', label: '兩份租車訂單已離線保存' },
      { id: 'hotel-docs', label: '住宿確認信（含 Cozy hut 鑰匙盒密碼）' },
    ],
  },
  {
    id: 'electronics',
    title: '電子產品',
    icon: '🔌',
    items: [
      { id: 'phone-charger', label: '手機充電器與線材', essential: true },
      { id: 'powerbank', label: '行動電源（充飽）', essential: true, why: '整日健行 + 導航很耗電' },
      {
        id: 'adapter',
        label: '歐規轉接頭 Type C／F ×2',
        essential: true,
        why: '丹麥、法羅、義大利同一規格',
      },
      { id: 'car-mount', label: '手機車架', why: '兩段自駕全程靠導航' },
      { id: 'car-charger', label: '車用充電器' },
      { id: 'headlamp', label: '頭燈', essential: true, why: 'Tre Cime 06:00 進場時天還沒亮' },
      { id: 'camera', label: '相機、備用電池、記憶卡' },
      { id: 'drybag-phone', label: '手機防水袋或防水殼', why: '法羅的雨是橫著下的' },
    ],
  },
  {
    id: 'hiking',
    title: '健行裝備',
    icon: '🥾',
    items: [
      {
        id: 'boots',
        label: '防滑登山鞋（已穿過、不磨腳）',
        essential: true,
        why: 'Kallur、Trælanípan、Seceda、Tre Cime 都要走',
      },
      { id: 'rain-jacket', label: '防水外套（有帽子）', essential: true, why: '法羅天氣一天變好幾次' },
      { id: 'rain-pants', label: '防水褲' },
      { id: 'midlayer', label: '保暖中層（刷毛或羽絨）', essential: true },
      { id: 'hiking-socks', label: '健行襪 ×4', why: '濕了要有得換' },
      { id: 'gloves-beanie', label: '手套與毛帽', why: '八月的法羅山上與 Seceda 稜線都會冷' },
      { id: 'daypack', label: '小背包 20–30L', essential: true },
      { id: 'water-bottle', label: '水壺 ×2' },
      { id: 'poles', label: '登山杖', why: 'Tre Cime 環線下坡多' },
      { id: 'sunglasses', label: '太陽眼鏡與防曬' },
    ],
  },
  {
    id: 'clothing',
    title: '衣物',
    icon: '👕',
    items: [
      { id: 'baselayer', label: '快乾排汗衣物' },
      { id: 'warm-layers', label: '保暖衣物（法羅八月約 10–14°C）' },
      { id: 'casual', label: '市區與餐廳的一般衣物' },
      { id: 'sleepwear', label: '睡衣' },
      { id: 'swim', label: '泳衣（飯店可能有 spa）' },
      { id: 'shoes-casual', label: '好走的休閒鞋' },
    ],
  },
  {
    id: 'health',
    title: '藥品與盥洗',
    icon: '💊',
    items: [
      {
        id: 'seasick',
        label: '暈船藥',
        essential: true,
        why: 'Mykines 與 Kalsoy 兩段船班，北大西洋浪不小',
      },
      { id: 'personal-meds', label: '個人常備藥（原包裝）', essential: true },
      { id: 'painkiller', label: '止痛藥、腸胃藥、感冒藥' },
      { id: 'blister', label: '水泡貼與 OK 繃', why: '連續多天健行' },
      { id: 'toiletries', label: '盥洗用品' },
      { id: 'lipbalm', label: '護唇膏與乳液', why: '高山乾冷' },
    ],
  },
  {
    id: 'misc',
    title: '其他',
    icon: '🎒',
    items: [
      { id: 'snacks', label: '行動糧與零食', why: '離島與山上不一定買得到' },
      { id: 'laundry', label: '洗衣袋、少量洗衣精', why: 'Airbnb 住 4 晚可以洗一次' },
      { id: 'shopping-bag', label: '購物袋', why: '北歐塑膠袋要錢' },
      { id: 'earplugs', label: '耳塞與眼罩', why: '長途飛行與清晨早起' },
      { id: 'ziplock', label: '夾鏈袋（裝濕衣物）' },
      { id: 'tissue', label: '衛生紙與濕紙巾' },
    ],
  },
];

export const packingTotal = packingGroups.reduce((n, g) => n + g.items.length, 0);

export const packingEssentialIds = packingGroups.flatMap((g) =>
  g.items.filter((i) => i.essential).map((i) => `packing.${g.id}.${i.id}`)
);

export function packingKey(groupId: string, itemId: string): string {
  return `packing.${groupId}.${itemId}`;
}
