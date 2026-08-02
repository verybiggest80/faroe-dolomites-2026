import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';
import {
  assertAllLocationsMappable,
  assertBackupIsolation,
  assertPlanIntegrity,
} from '@/lib/trip';
import type { Metadata, Viewport } from 'next';
import './globals.css';

// GitHub Pages 會把網站放在 /<repo>/ 底下，這些路徑要跟著加前綴
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: '法羅群島 × 多洛米蒂 2026',
  description: '2026 年 8 月 15 日 – 31 日 自助旅行',
  manifest: `${base}/manifest.webmanifest`,
  icons: {
    icon: [{ url: `${base}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' }],
    apple: [{ url: `${base}/icons/apple-touch-icon.png`, sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '法羅 × 多洛米蒂',
  },
};

export const viewport: Viewport = {
  themeColor: '#255A72',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 開發時檢查：備用票沒外洩、所有地點都能跳 Google Maps
  if (process.env.NODE_ENV !== 'production') {
    const problems = [
      ...assertBackupIsolation(),
      ...assertAllLocationsMappable(),
      ...assertPlanIntegrity(),
    ];
    if (problems.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('[資料檢查] 發現問題：\n' + problems.join('\n'));
    }
  }

  return (
    <html lang="zh-Hant-TW">
      <body>
        <div className="mx-auto min-h-screen max-w-lg pb-24">{children}</div>
        <BottomNav />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
