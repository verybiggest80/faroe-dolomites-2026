# 法羅群島 × 多洛米蒂 2026

2026-08-15 – 2026-08-31，2 位成人自助旅行的個人行程 App。
Next.js + TypeScript + Tailwind，mobile-first，可安裝到 iPhone 主畫面。

---

## 本機執行

需要 Node.js 20 以上。

```bash
npm install
```

```bash
npm run dev
```

打開 http://localhost:3000

正式建置（產生純靜態檔案到 `out/`）：

```bash
npm run build
```

在本機預覽建置結果：

```bash
npm run preview
```

Service worker（離線功能）只在建置後的正式版啟用，`npm run dev` 不會註冊，
避免快取干擾開發。

## 部署到 GitHub Pages

`.github/workflows/deploy.yml` 已設定好，推到 `main` 分支就會自動建置並部署。

`basePath` 由 workflow 從 repo 名稱自動帶入（`NEXT_PUBLIC_BASE_PATH`），
所以 repo 取什麼名字都不用改程式碼。

首次部署後，到 GitHub repo 的 **Settings → Pages**，把 Source 設為
**GitHub Actions**。

要在本機模擬 GitHub Pages 的子路徑：

```bash
NEXT_PUBLIC_BASE_PATH=/你的repo名 npm run build
```

### 安裝到 iPhone 主畫面

部署完成後，用 iPhone Safari 開部署網址 → 分享 → 加入主畫面。
之後即使沒訊號，看過的頁面都還打得開。

⚠ GitHub Pages 免費方案的網站一律是公開的（就算 repo 設為 private）。
行程的日期、時間、地點會公開；QR code、訂位編號、鑰匙盒密碼不會，
那些只存在裝置的 localStorage。

---

## 資料夾結構

```
trip-app/
├── public/
│   ├── manifest.webmanifest      PWA 設定
│   ├── sw.js                     service worker（離線快取）
│   └── icons/                    App 圖示
└── src/
    ├── types/
    │   └── trip.ts               所有 TypeScript 型別
    ├── lib/
    │   ├── maps.ts               Google Maps 連結產生器
    │   ├── dates.ts              日期與時區顯示
    │   ├── trip.ts               資料查詢、狀態標籤、自我檢查
    │   └── useLocalToggle.ts     本機勾選狀態
    ├── data/
    │   ├── locations.ts          所有地點（Google Maps 來源）
    │   ├── itinerary.ts          17 天完整行程
    │   ├── bookings.ts           航班／住宿／租車／船票／纜車／停車
    │   ├── tasks.ts              待辦事項
    │   └── private/
    │       ├── store.ts          私人票券（localStorage）
    │       └── tickets.local.example.ts
    ├── components/
    │   ├── LocationLink.tsx      地點連結 + 開始導航（全 App 通用）
    │   ├── FerryTerminalCard.tsx 船班碼頭卡
    │   ├── ItineraryItemCard.tsx 行程卡
    │   ├── StatusBadge.tsx       狀態標籤
    │   ├── CheckItem.tsx         可勾選項目
    │   ├── BottomNav.tsx         底部導覽
    │   └── PageHeader.tsx
    └── app/
        ├── page.tsx              Dashboard
        ├── itinerary/page.tsx    日期總覽
        ├── day/[date]/page.tsx   每日時間軸
        ├── map/page.tsx          地圖（每日地點與導航）
        ├── bookings/page.tsx     訂位
        ├── tasks/page.tsx        待辦
        ├── private/page.tsx      私人票券（本機）
        └── offline/page.tsx      離線提示頁
```

---

## 資料原則

**不杜撰。** 這個專案裡沒有任何自行編造的票券、班次、門牌、QR code 或訂位編號。
沒有可靠門牌的地方，使用碼頭／村落／景點的正式名稱與行政區。
只有一組經確認的座標（Sandavágur 小屋 62.07494, -7.15024）被寫入。

**隱私。** QR code、票券序號、訂位 PIN、信用卡、護照資料一律不在程式碼裡。
- 瀏覽器 localStorage：`/private` 頁面填寫，只存在該裝置
- 或檔案式：複製 `src/data/private/tickets.local.example.ts` 為 `tickets.local.ts`（已 gitignore）

**時間。** 全部是當地時間，不做時區換算。
法羅群島 `Atlantic/Faroe`、義大利 `Europe/Rome`、台灣 `Asia/Taipei`。

**租車預設時間不是行程。**
- SIXT 訂單預設還車 8/23 13:30 → 只在 Bookings 顯示，標記為「僅供參考」
- 建議實際還車 8/23 07:45 → 這才是時間軸上的項目
- Autovia 原訂還車 8/30 10:00 → 不進時間軸
- 實際計畫 8/29 約 11:00 提早還車 → 這才在時間軸上

**8/27 的 Tre Cime 備用停車票完全隔離。**
只存在 `backupBookings`，`displayInTimeline / displayOnMap / displayOnDashboard /
displayAsConflict` 全部 `false`，沒有任何行程項目或待辦引用它。
只有在 Bookings 頁手動展開「備用票券」才看得到。
`assertBackupIsolation()` 在開發模式會自動驗證這件事。

---

## 待確認事項（出發前）

App 首頁會列出這些，這裡只是備份清單：

1. SIXT 8/23 清晨還車方式（人工櫃檯？鑰匙箱？鑰匙放哪？）
2. Mykines 前一晚確認船班及天候
3. Kalsoy 船票補登租車車牌
4. Ca' Tessera 8/29 可否提前寄放行李
5. Autovia 接受 8/29 約 11:00 提早還車
6. Ca' Tessera 8/29 晚間及 8/30 清晨機場接駁
7. Mykines、Kalsoy、Seceda、Tre Cime 票券離線保存
8. 法羅群島及多洛米蒂 Google Maps 離線地圖

Kalsoy 人數已確認，不需再處理：車資已包含 1 位駕駛的船票，另購 1 張成人票，兩人都有票。

---

## 天氣彈性

可手動對調（僅限非住宿活動）：**8/17、8/20、8/21、8/22**

絕對不會自動移動：Mykines、Kalsoy、所有航班、所有住宿、Seceda、Tre Cime。
