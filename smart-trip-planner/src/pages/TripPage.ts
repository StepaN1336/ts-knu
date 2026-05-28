import type { TripService } from "../services/TripService.js";
import type { Router } from "../router/Router.js";
import type { DayPlan } from "../models/types.js";
import { renderActivityForm, getCategoryIcon } from "../components/ActivityForm.js";

export class TripPage {
  private container: HTMLElement;
  private tripService: TripService;
  private router: Router;

  constructor(container: HTMLElement, tripService: TripService, router: Router) {
    this.container = container;
    this.tripService = tripService;
    this.router = router;
  }

  render(tripId: string): void {
    const trip = this.tripService.getById(tripId);
    if (!trip) {
      this.container.innerHTML = `<div class="container"><p class="error-msg">Подорож не знайдена.</p></div>`;
      return;
    }

    const duration = this.tripService.getDuration(trip);

    this.container.innerHTML = `
      <div class="trip-hero" style="background-image: url('${trip.imageUrl || ""}')">
        <div class="trip-hero__overlay">
          <div class="container">
            <a href="#/" data-link class="btn btn--ghost btn--sm back-btn">← Назад</a>
            <h1 class="trip-hero__city">${trip.city}</h1>
            <p class="trip-hero__meta">
              ${trip.country} · 
              ${this.tripService.formatDate(trip.startDate)} — ${this.tripService.formatDate(trip.endDate)} · 
              ${duration} дн.
            </p>
            <a href="#/trips/${trip.id}/edit" data-link class="btn btn--outline btn--sm">✏️ Редагувати подорож</a>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="itinerary" id="itinerary">
          ${trip.dayPlans.map((dp) => this.renderDayPlan(dp, trip.id)).join("")}
        </div>
      </div>
      <div id="modal-activity" class="modal-overlay hidden"></div>
    `;

    this.bindDayEvents(trip.id);
  }

  private renderDayPlan(dp: DayPlan, tripId: string): string {
    const dateLabel = new Date(dp.date).toLocaleDateString("uk-UA", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const activitiesHtml =
      dp.activities.length === 0
        ? `<p class="day__empty">Активностей поки немає</p>`
        : dp.activities
            .map(
              (a) => `
          <div class="activity" data-activity-id="${a.id}" data-day-id="${dp.id}">
            <div class="activity__time">${a.time}</div>
            <div class="activity__icon">${getCategoryIcon(a.category)}</div>
            <div class="activity__content">
              <strong class="activity__title">${a.title}</strong>
              <p class="activity__desc">${a.description}</p>
              <span class="activity__tag">${a.category}</span>
            </div>
            <button class="activity__delete js-delete-activity"
              data-trip-id="${tripId}" data-day-id="${dp.id}" data-activity-id="${a.id}">✕</button>
          </div>`
            )
            .join("");

    return `
      <div class="day-plan" data-day-plan-id="${dp.id}">
        <div class="day-plan__header">
          <div class="day-plan__number">День ${dp.day}</div>
          <div class="day-plan__date">${dateLabel}</div>
          <button class="btn btn--primary btn--sm js-add-activity"
            data-trip-id="${tripId}" data-day-id="${dp.id}">+ Додати</button>
        </div>
        <div class="day-plan__activities" id="activities-${dp.id}">
          ${activitiesHtml}
        </div>
      </div>
    `;
  }

  private bindDayEvents(tripId: string): void {
    this.container.querySelectorAll<HTMLButtonElement>(".js-add-activity").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dayId = btn.dataset["dayId"]!;
        this.openActivityModal(tripId, dayId);
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>(".js-delete-activity").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { tripId: tId, dayId, activityId } = btn.dataset as {
          tripId: string;
          dayId: string;
          activityId: string;
        };
        this.tripService.deleteActivity(tId, dayId, activityId);
        this.render(tripId);
      });
    });
  }

  private openActivityModal(tripId: string, dayPlanId: string): void {
    const overlay = document.querySelector<HTMLElement>("#modal-activity") ??
      document.querySelector<HTMLElement>("#modal-overlay")!;
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">➕ Нова активність</h3>
          <button class="modal__close js-close">✕</button>
        </div>
        <div class="modal__body" id="act-form-body"></div>
      </div>
    `;

    renderActivityForm(
      overlay.querySelector<HTMLElement>("#act-form-body")!,
      (data) => {
        this.tripService.addActivity(tripId, dayPlanId, data);
        overlay.classList.add("hidden");
        this.render(tripId);
      },
      () => {
        overlay.classList.add("hidden");
      }
    );

    overlay.querySelector(".js-close")?.addEventListener("click", () => {
      overlay.classList.add("hidden");
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.add("hidden");
    });
  }
}