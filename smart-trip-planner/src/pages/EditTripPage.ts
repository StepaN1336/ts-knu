import type { TripService } from "../services/TripService.js";
import type { Router } from "../router/Router.js";
import { renderTripForm } from "../components/TripForm.js";
import type { TripFormData } from "../models/types.js";

export class EditTripPage {
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

    this.container.innerHTML = `
      <div class="container">
        <div class="page-header">
          <a href="#/trips/${tripId}" data-link class="btn btn--ghost btn--sm">← Назад</a>
          <h1 class="page-header__title">Редагування: ${trip.city}</h1>
        </div>
        <div class="form-card" id="edit-form-container"></div>
      </div>
    `;

    renderTripForm(
      this.container.querySelector<HTMLElement>("#edit-form-container")!,
      trip,
      (data: TripFormData) => {
        this.tripService.update(tripId, data);
        this.router.navigate(`#/trips/${tripId}`);
      },
      () => this.router.navigate(`#/trips/${tripId}`)
    );
  }
}