import { MapDaySection } from '@/components/MapDaySection';
import { PageHeader } from '@/components/PageHeader';
import { tripDays } from '@/data/itinerary';

export default function MapPage() {
  return (
    <main>
      <PageHeader
        eyebrow="地圖"
        title="每日路線與地點"
        subtitle="每個地點都可以點開 Google Maps，或直接開始導航。山區與離島訊號差，出發前記得下載離線地圖。"
      />

      <div className="space-y-6 px-5 pb-10">
        {tripDays.map((day) => (
          <MapDaySection key={day.date} day={day} />
        ))}
      </div>
    </main>
  );
}
