export type ActivityCategory =
  | "музей"
  | "ресторан"
  | "парк"
  | "визначна_пам'ятка"
  | "розваги"
  | "шопінг"
  | "інше";

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  time: string;
}

export interface DayPlan {
  id: string;
  day: number;
  date: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  dayPlans: DayPlan[];
}

export interface TripFormData {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

export interface ActivityFormData {
  title: string;
  description: string;
  category: ActivityCategory;
  time: string;
}

export type RouteHandler = (params?: Record<string, string>) => void;