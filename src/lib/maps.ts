import type { TripLocation, TripLocationInput } from '@/types/trip';

/**
 * Google Maps 搜尋連結（點地點名稱時開啟）
 */
export function createGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Google Maps 路線導航連結（點「開始導航」時開啟）
 */
export function createGoogleMapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/**
 * 建立 TripLocation。
 * 座標優先：有經緯度時，Google Maps 用座標定位最準；
 * 否則使用英文正式名稱作為 query。
 */
export function defineLocation(input: TripLocationInput): TripLocation {
  const query =
    input.latitude !== undefined && input.longitude !== undefined
      ? `${input.latitude},${input.longitude}`
      : input.googleMapsQuery;

  return {
    ...input,
    googleMapsUrl: createGoogleMapsSearchUrl(input.googleMapsQuery),
    googleMapsDirectionsUrl: createGoogleMapsDirectionsUrl(query),
  };
}

/**
 * Apple Maps 備援（iPhone 上有些人偏好；不強制使用）
 */
export function createAppleMapsUrl(query: string): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}
