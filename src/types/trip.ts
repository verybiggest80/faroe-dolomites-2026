/* =========================================================================
 * 2026-08 法羅群島 + 多洛米蒂 — 完整資料型別
 * =========================================================================
 * 規則：
 * - 所有時間皆為「當地時間」，以 "HH:mm" 字串儲存，不做時區換算。
 * - 日期一律 "YYYY-MM-DD"。
 * - 這個檔案只定義型別，不含任何實際票券內容。
 * ========================================================================= */

/** 旅行區域 */
export type TripRegion = 'transit' | 'faroe-islands' | 'dolomites' | 'venice';

/** 時區（僅供顯示用，不做自動換算） */
export type TripTimezone = 'Atlantic/Faroe' | 'Europe/Rome' | 'Asia/Taipei';

/**
 * 行程狀態
 * - confirmed          已有機票、住宿、船票、纜車票或停車票
 * - planned            推薦安排，但沒有指定票券
 * - open               尚未決定
 * - weather_flexible   可依天氣調換
 * - action_required    出發前需要確認
 * - informational_only 訂單內資料，但不是實際時間軸
 * - backup_only        只作備用，不顯示於主要行程
 */
export type ItemStatus =
  | 'confirmed'
  | 'planned'
  | 'open'
  | 'weather_flexible'
  | 'action_required'
  | 'informational_only'
  | 'backup_only';

/** 行程項目分類 */
export type ItemCategory =
  | 'flight'
  | 'accommodation'
  | 'car'
  | 'ferry'
  | 'tour'
  | 'cable_car'
  | 'parking'
  | 'hike'
  | 'attraction'
  | 'transfer'
  | 'public_transport'
  | 'task';

/** 地點類型 — Map 頁面用來分圖層 */
export type LocationKind =
  | 'airport'
  | 'hotel'
  | 'airbnb'
  | 'car_rental'
  | 'car_return'
  | 'ferry_terminal'
  | 'parking'
  | 'cable_car'
  | 'bus_stop'
  | 'vaporetto'
  | 'trailhead'
  | 'mountain_hut'
  | 'attraction'
  | 'viewpoint'
  | 'village'
  | 'fuel'
  | 'restaurant'
  | 'shop';

/* ---------------------------------------------------------------- 地點 */

export interface TripLocation {
  /** 內部識別碼，itinerary / bookings 以此引用 */
  id: string;
  name: string;
  address: string;
  googleMapsQuery: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl: string;
  googleMapsDirectionsUrl: string;
  region: TripRegion;
  kind: LocationKind;
  /** 地圖與卡片上的補充說明（停車、隧道、注意事項） */
  hint?: string;
}

/** 建立 TripLocation 時的輸入（URL 由 helper 自動產生） */
export type TripLocationInput = Omit<
  TripLocation,
  'googleMapsUrl' | 'googleMapsDirectionsUrl'
>;

/* ---------------------------------------------------------------- 船班 */

export interface FerryTerminalInfo {
  routeName: string;
  departureTerminal: TripLocation;
  arrivalTerminal: TripLocation;
  /** 去程開船時間 HH:mm */
  departureTime: string;
  /** 建議抵達碼頭時間 HH:mm */
  recommendedArrivalTime: string;
  /** 回程開船時間 HH:mm */
  returnDepartureTime?: string;
  /** 回程建議抵達碼頭時間 HH:mm */
  returnRecommendedArrivalTime?: string;
  /** 回程出發碼頭（未填則沿用 arrivalTerminal） */
  returnDepartureTerminal?: TripLocation;
  /** 回程抵達碼頭（未填則沿用 departureTerminal） */
  returnArrivalTerminal?: TripLocation;
  vehicleIncluded?: boolean;
  vehiclePlateRequired?: boolean;
  passengerCountNeedsVerification?: boolean;
  parkingInstructions?: string;
  vehicleInstructions?: string;
  weatherSensitive: boolean;
  /** 前一晚必做的確認事項 */
  previousNightChecklist?: string[];
  /** 票券是否已離線保存（由使用者在 App 內勾選，此為預設值） */
  ticketSavedOffline?: boolean;
  /** 停航／異動查詢的官方資訊來源（純文字，不含票券資料） */
  operatorNote?: string;
}

/* ------------------------------------------------------ 條件式方案 */

/**
 * 一日之內的替代方案。
 * 例如 8/16 天氣好就先走 Trælanípan（conditionalPlan），
 * 天氣差就直接進 Tórshavn（fallbackPlan）。
 */
export interface DayPlan {
  id: string;
  /** 完整名稱，顯示在方案卡上 */
  label: string;
  /** 按鈕文字 */
  buttonLabel: string;
  description: string;
  /** 什麼情況下適用這個方案 */
  activationConditions?: string[];
  /** 屬於這個方案的行程項目 id */
  itemIds: string[];
}

/* ---------------------------------------------------------------- 行程 */

export interface ItineraryItem {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  startTime?: string;
  /** HH:mm */
  endTime?: string;
  title: string;
  category: ItemCategory;
  region: TripRegion;
  status: ItemStatus[];
  location?: TripLocation;
  /** 同一項目牽涉多個地點時（例如市區散步的多個點） */
  extraLocations?: TripLocation[];
  notes?: string[];
  previousNightChecklist?: string[];
  badWeatherFallback?: string[];
  relatedBookingId?: string;
  ferry?: FerryTerminalInfo;
  isPrivate?: boolean;
  /**
   * 這個項目屬於哪一個 DayPlan。
   * 未設定 = 不論選哪個方案都會出現（例如航班、取車）。
   */
  planId?: string;
  /**
   * 這個活動可以在不同日期完成，完成狀態共用一個旗標。
   * 例如 Trælanípan 出現在 8/16 與 8/22，兩邊共用 'traelanipa'。
   * 一旦標記完成，另一天就不再顯示為必做行程。
   */
  completedOnAlternateDate?: string;
  /** 預設 true；設 false 代表不進主要時間軸 */
  displayInTimeline?: boolean;
  /** 預設 true */
  displayOnMap?: boolean;
  /** 預設 false */
  displayOnDashboard?: boolean;
  /** 只作備用，不顯示於任何主要畫面 */
  isBackupOnly?: boolean;
  /** 是否可由使用者在「天氣彈性」面板中手動對調 */
  weatherSwappable?: boolean;
}

/* -------------------------------------------------------------- 每日 */

export interface TripDay {
  /** YYYY-MM-DD */
  date: string;
  /** 星期幾（繁中） */
  weekday: string;
  title: string;
  region: TripRegion;
  timezone: TripTimezone;
  summary?: string;
  /** 當晚住宿的 booking id；null 代表機上或不過夜 */
  accommodationBookingId?: string | null;
  /** 整日層級的雨天備案 */
  badWeatherFallback?: string[];
  /** 整日層級的前一晚提醒 */
  previousNightChecklist?: string[];
  /** 整天行程是否可與其他日對調 */
  weatherSwappable?: boolean;

  /* --------------------------------------------------- 條件式行程 */

  /** 主要方案（Plan A）。有設就代表這天是條件式行程。 */
  conditionalPlan?: DayPlan;
  /** 備案（Plan B） */
  fallbackPlan?: DayPlan;
  /**
   * 方案由使用者手動選擇。
   * 值是 localStorage 的 key 後綴，例如 '2026-08-16'。
   */
  planStorageKey?: string;
  /**
   * 方案由某個活動的完成狀態自動決定，不需使用者選。
   * 值是 completedOnAlternateDate 的旗標名。
   * 未完成 → conditionalPlan；已完成 → fallbackPlan。
   */
  planDeterminedByFlag?: string;
}

/* -------------------------------------------------------------- 訂位 */

export interface BookingDetail {
  label: string;
  value: string;
}

export interface Booking {
  id: string;
  category: ItemCategory;
  title: string;
  provider?: string;
  region: TripRegion;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate?: string;
  status: ItemStatus[];
  location?: TripLocation;
  /** 還車／下機等第二地點 */
  secondaryLocation?: TripLocation;
  details: BookingDetail[];
  notes?: string[];
  /** 是否有 QR code / 序號等私人資料（內容不進 repo） */
  hasPrivateTicket?: boolean;
  /** 對應 private ticket store 的 key */
  privateTicketId?: string;
  /** 票券是否已離線保存 */
  ticketSavedOffline?: boolean;
  isBackupOnly?: boolean;
  displayInTimeline?: boolean;
  displayOnMap?: boolean;
  displayOnDashboard?: boolean;
  displayAsConflict?: boolean;
}

/** 租車專用欄位（訂單預設時間 ≠ 實際行程時間） */
export interface CarRentalBooking extends Booking {
  category: 'car';
  pickupDateTime: string;
  bookedReturnDateTime: string;
  /** 實際計畫的還車時間 */
  plannedReturnDateTime: string;
  bookedReturnTimeIsDefault: boolean;
  displayBookedReturnInTimeline: boolean;
  requiresConfirmation: boolean;
}

/* -------------------------------------------------------------- 待辦 */

export type TaskPriority = 'critical' | 'important' | 'normal';

export interface TripTask {
  id: string;
  title: string;
  priority: TaskPriority;
  /** YYYY-MM-DD */
  dueDate?: string;
  completed: boolean;
  relatedItemIds?: string[];
  relatedBookingIds?: string[];
  description?: string;
  /** 建議處理方式 */
  howTo?: string[];
  region?: TripRegion;
}

/* ------------------------------------------------------ 私人票券資料 */

/**
 * 私人票券內容（QR code、序號、PIN、訂位編號）**絕對不進 repo，也絕不上傳**。
 *
 * 實際資料存在使用者裝置的 IndexedDB，型別見 src/data/private/store.ts。
 * 這個檔案裡只有 Booking.hasPrivateTicket / privateTicketId 兩個「指標」，
 * 指向裝置上的票券槽位，本身不含任何票券內容。
 */

/* -------------------------------------------------------------- 天氣 */

/** 可手動對調的日期組合 */
export interface WeatherSwapGroup {
  id: string;
  label: string;
  /** 可互換的日期 */
  dates: string[];
  description: string;
}

/** 固定不可自動移動的項目 id（航班、住宿、船班、纜車、Tre Cime） */
export type LockedItemId = string;
