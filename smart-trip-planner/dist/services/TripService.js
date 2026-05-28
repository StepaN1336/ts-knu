const DATA_URL = "/data/trips.json";
const STORAGE_KEY = "smart_trip_planner_trips";
export class TripService {
    constructor() {
        this.trips = [];
    }
    async loadTrips() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.trips = JSON.parse(stored);
            return this.trips;
        }
        const response = await fetch(DATA_URL);
        if (!response.ok)
            throw new Error("Не вдалося завантажити дані");
        this.trips = (await response.json());
        this.persist();
        return this.trips;
    }
    getAll() {
        return this.trips;
    }
    getById(id) {
        return this.trips.find((t) => t.id === id);
    }
    create(data) {
        const trip = {
            id: crypto.randomUUID(),
            ...data,
            dayPlans: this.generateDayPlans(data.startDate, data.endDate),
        };
        this.trips.push(trip);
        this.persist();
        return trip;
    }
    update(id, data) {
        const index = this.trips.findIndex((t) => t.id === id);
        if (index === -1)
            throw new Error("Подорож не знайдена");
        const existing = this.trips[index];
        const updated = {
            ...existing,
            ...data,
            dayPlans: existing.startDate !== data.startDate || existing.endDate !== data.endDate
                ? this.generateDayPlans(data.startDate, data.endDate)
                : existing.dayPlans,
        };
        this.trips[index] = updated;
        this.persist();
        return updated;
    }
    delete(id) {
        this.trips = this.trips.filter((t) => t.id !== id);
        this.persist();
    }
    addActivity(tripId, dayPlanId, data) {
        const trip = this.getById(tripId);
        if (!trip)
            throw new Error("Подорож не знайдена");
        const dayPlan = trip.dayPlans.find((dp) => dp.id === dayPlanId);
        if (!dayPlan)
            throw new Error("День не знайдено");
        const activity = { id: crypto.randomUUID(), ...data };
        dayPlan.activities.push(activity);
        this.persist();
        return activity;
    }
    deleteActivity(tripId, dayPlanId, activityId) {
        const trip = this.getById(tripId);
        if (!trip)
            return;
        const dayPlan = trip.dayPlans.find((dp) => dp.id === dayPlanId);
        if (!dayPlan)
            return;
        dayPlan.activities = dayPlan.activities.filter((a) => a.id !== activityId);
        this.persist();
    }
    generateDayPlans(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const plans = [];
        let current = new Date(start);
        let day = 1;
        while (current <= end) {
            plans.push({
                id: crypto.randomUUID(),
                day,
                date: current.toISOString().split("T")[0],
                activities: [],
            });
            current.setDate(current.getDate() + 1);
            day++;
        }
        return plans;
    }
    persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.trips));
    }
    getDuration(trip) {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }
}
//# sourceMappingURL=TripService.js.map