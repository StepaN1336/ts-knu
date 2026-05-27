import type { Trip, ActivityCategory } from '../models';

export function tripDurationDays(trip: Trip): number {
  const ms =
    new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function generateDayDates(startDate: string, durationDays: number): string[] {
  const dates: string[] = [];
  const base = new Date(startDate);
  for (let i = 0; i < durationDays; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  museum: '🏛 Музей',
  restaurant: '🍽 Ресторан',
  park: '🌿 Парк',
  landmark: '🗺 Пам\'ятка',
  shopping: '🛍 Шопінг',
  entertainment: '🎭 Розваги',
  transport: '🚌 Транспорт',
  accommodation: '🏨 Готель',
  other: '📍 Інше',
};

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  museum: 'bg-purple-100 text-purple-800',
  restaurant: 'bg-orange-100 text-orange-800',
  park: 'bg-green-100 text-green-800',
  landmark: 'bg-blue-100 text-blue-800',
  shopping: 'bg-pink-100 text-pink-800',
  entertainment: 'bg-yellow-100 text-yellow-800',
  transport: 'bg-gray-100 text-gray-700',
  accommodation: 'bg-indigo-100 text-indigo-800',
  other: 'bg-sand-100 text-sand-700',
};
