export type ActivityCategory =
  | 'museum'
  | 'restaurant'
  | 'park'
  | 'landmark'
  | 'shopping'
  | 'entertainment'
  | 'transport'
  | 'accommodation'
  | 'other';

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  time: string; // "HH:MM"
  duration: number; // minutes
}

export interface DayPlan {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string; // ISO date string
  activities: Activity[];
}

export interface Trip {
  id: string;
  city: string;
  country: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  imageUrl: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// ──────────────────────────────────────────
//  Derived / utility types
// ──────────────────────────────────────────

export type TripWithDuration = Trip & { durationDays: number };

export interface AppState {
  trips: Trip[];
  dayPlans: DayPlan[];
}
