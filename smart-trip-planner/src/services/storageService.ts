import type { Trip, DayPlan, AppState } from '../models';

const LS_KEY = 'smart_trip_planner_v1';

const BASE_URL: string = import.meta.env.BASE_URL ?? '/';

async function loadInitialData(): Promise<AppState> {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    return JSON.parse(raw) as AppState;
  }
  // First visit — fetch seed data
  const res = await fetch(`${BASE_URL}data/db.json`);
  if (!res.ok) throw new Error('Failed to load seed data');
  const data = (await res.json()) as AppState;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  return data;
}

function saveState(state: AppState): void {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function getState(): AppState {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return { trips: [], dayPlans: [] };
  return JSON.parse(raw) as AppState;
}

// ── Trip CRUD ──────────────────────────────────────────────────────

export async function fetchTrips(): Promise<Trip[]> {
  const state = await loadInitialData();
  return state.trips;
}

export function createTrip(trip: Omit<Trip, 'id' | 'createdAt'>): Trip {
  const state = getState();
  const newTrip: Trip = {
    ...trip,
    id: `trip-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  state.trips.push(newTrip);
  saveState(state);
  return newTrip;
}

export function updateTrip(id: string, patch: Partial<Omit<Trip, 'id' | 'createdAt'>>): Trip {
  const state = getState();
  const idx = state.trips.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`Trip ${id} not found`);
  state.trips[idx] = { ...state.trips[idx], ...patch };
  saveState(state);
  return state.trips[idx];
}

export function deleteTrip(id: string): void {
  const state = getState();
  state.trips = state.trips.filter((t) => t.id !== id);
  state.dayPlans = state.dayPlans.filter((dp) => dp.tripId !== id);
  saveState(state);
}

export function getTripById(id: string): Trip | undefined {
  return getState().trips.find((t) => t.id === id);
}

// ── DayPlan CRUD ───────────────────────────────────────────────────

export function getDayPlansForTrip(tripId: string): DayPlan[] {
  return getState()
    .dayPlans.filter((dp) => dp.tripId === tripId)
    .sort((a, b) => a.dayNumber - b.dayNumber);
}

export function upsertDayPlan(dayPlan: DayPlan): DayPlan {
  const state = getState();
  const idx = state.dayPlans.findIndex((dp) => dp.id === dayPlan.id);
  if (idx === -1) {
    state.dayPlans.push(dayPlan);
  } else {
    state.dayPlans[idx] = dayPlan;
  }
  saveState(state);
  return dayPlan;
}

export function addActivityToDayPlan(
  tripId: string,
  dayNumber: number,
  date: string,
  activity: import('../models').Activity,
): DayPlan {
  const state = getState();
  let dp = state.dayPlans.find(
    (d) => d.tripId === tripId && d.dayNumber === dayNumber,
  );
  if (!dp) {
    dp = {
      id: `dp-${Date.now()}`,
      tripId,
      dayNumber,
      date,
      activities: [],
    };
    state.dayPlans.push(dp);
  }
  dp.activities.push(activity);
  saveState(state);
  return dp;
}

export function deleteActivity(tripId: string, dayPlanId: string, activityId: string): void {
  const state = getState();
  const dp = state.dayPlans.find((d) => d.id === dayPlanId && d.tripId === tripId);
  if (dp) {
    dp.activities = dp.activities.filter((a) => a.id !== activityId);
  }
  saveState(state);
}
