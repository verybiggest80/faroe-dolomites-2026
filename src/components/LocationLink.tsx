import type { TripLocation } from '@/types/trip';

/**
 * 地點名稱 — 一律可點，開啟 Google Maps 搜尋。
 * 這是全 App 的硬性規則：任何地點都要用這個元件顯示。
 */
export function LocationLink({
  location,
  className = '',
  showAddress = false,
}: {
  location: TripLocation;
  className?: string;
  showAddress?: boolean;
}) {
  return (
    <span className={className}>
      <a
        href={location.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-baseline gap-1 font-medium text-faroe-700 underline decoration-faroe-200 underline-offset-[3px] active:text-faroe-800"
      >
        <MapPin />
        <span>{location.name}</span>
      </a>
      {showAddress && (
        <span className="mt-0.5 block text-xs text-ink-faint">{location.address}</span>
      )}
    </span>
  );
}

/** 「開始導航」按鈕 */
export function DirectionsButton({
  location,
  label = '開始導航',
  className = '',
}: {
  location: TripLocation;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={location.googleMapsDirectionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-quiet ${className}`}
    >
      <Navigation />
      {label}
    </a>
  );
}

/** 地點 + 地址 + 導航按鈕的完整區塊 */
export function LocationBlock({
  location,
  label,
}: {
  location: TripLocation;
  label?: string;
}) {
  return (
    <div className="rounded-xl border border-stone2-100 bg-stone2-100/40 p-3">
      {label && <div className="mb-1 text-[11px] font-semibold text-ink-faint">{label}</div>}
      <LocationLink location={location} showAddress />
      {location.hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{location.hint}</p>
      )}
      <div className="mt-2">
        <DirectionsButton location={location} />
      </div>
    </div>
  );
}

export function MapPin({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-[0.95em] w-[0.95em] shrink-0 translate-y-[0.1em] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Navigation({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
