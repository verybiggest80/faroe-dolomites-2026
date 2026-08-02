import { PageHeader } from '@/components/PageHeader';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main>
      <PageHeader
        eyebrow="離線"
        title="現在沒有網路"
        subtitle="已經看過的頁面還是可以打開。回到有訊號的地方就會自動恢復。"
      />
      <div className="px-5 pb-10">
        <div className="card p-4">
          <p className="text-[13px] leading-relaxed text-ink-soft">
            這通常發生在 Mykines、Kalsoy 或 Tre Cime 這種沒訊號的地方。
            票券請用手機相簿裡的離線檔，導航請用事先下載的 Google Maps 離線地圖。
          </p>
          <Link href="/" className="btn-primary mt-4 text-[13px]">
            回首頁
          </Link>
        </div>
      </div>
    </main>
  );
}
