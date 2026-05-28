import type { Trip, TripFormData, ActivityFormData, DayPlan, Activity } from "../models/types.js";

const DATA_URL = "../data/trips.json";
const STORAGE_KEY = "smart_trip_planner_trips";

export class TripService {
  private trips: Trip[] = [];

  async loadTrips(): Promise<Trip[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.trips = JSON.parse(stored) as Trip[];
      return this.trips;
    }
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Не вдалося завантажити дані");
    this.trips = (await response.json()) as Trip[];
    this.persist();
    return this.trips;
  }

  getAll(): Trip[] {
    return this.trips;
  }

  getById(id: string): Trip | undefined {
    return this.trips.find((t) => t.id === id);
  }

  create(data: TripFormData): Trip {
    const trip: Trip = {
      id: crypto.randomUUID(),
      ...data,
      dayPlans: this.generateDayPlans(data.startDate, data.endDate),
    };
    this.trips.push(trip);
    this.persist();
    return trip;
  }

  update(id: string, data: TripFormData): Trip {
    const index = this.trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Подорож не знайдена");
    const existing = this.trips[index]!;
    const updated: Trip = {
      ...existing,
      ...data,
      dayPlans:
        existing.startDate !== data.startDate || existing.endDate !== data.endDate
          ? this.generateDayPlans(data.startDate, data.endDate)
          : existing.dayPlans,
    };
    this.trips[index] = updated;
    this.persist();
    return updated;
  }

  delete(id: string): void {
    this.trips = this.trips.filter((t) => t.id !== id);
    this.persist();
  }

  addActivity(tripId: string, dayPlanId: string, data: ActivityFormData): Activity {
    const trip = this.getById(tripId);
    if (!trip) throw new Error("Подорож не знайдена");
    const dayPlan = trip.dayPlans.find((dp) => dp.id === dayPlanId);
    if (!dayPlan) throw new Error("День не знайдено");
    const activity: Activity = { id: crypto.randomUUID(), ...data };
    dayPlan.activities.push(activity);
    this.persist();
    return activity;
  }

  deleteActivity(tripId: string, dayPlanId: string, activityId: string): void {
    const trip = this.getById(tripId);
    if (!trip) return;
    const dayPlan = trip.dayPlans.find((dp) => dp.id === dayPlanId);
    if (!dayPlan) return;
    dayPlan.activities = dayPlan.activities.filter((a) => a.id !== activityId);
    this.persist();
  }

  private generateDayPlans(startDate: string, endDate: string): DayPlan[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const plans: DayPlan[] = [];
    let current = new Date(start);
    let day = 1;
    while (current <= end) {
      plans.push({
        id: crypto.randomUUID(),
        day,
        date: current.toISOString().split("T")[0]!,
        activities: [],
      });
      current.setDate(current.getDate() + 1);
      day++;
    }
    return plans;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.trips));
  }

  getDuration(trip: Trip): number {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}
