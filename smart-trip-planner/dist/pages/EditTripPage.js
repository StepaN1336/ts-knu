import { renderTripForm } from "../components/TripForm.js";
export class EditTripPage {
    constructor(container, tripService, router) {
        this.container = container;
        this.tripService = tripService;
        this.router = router;
    }
    render(tripId) {
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
        renderTripForm(this.container.querySelector("#edit-form-container"), trip, (data) => {
            this.tripService.update(tripId, data);
            this.router.navigate(`#/trips/${tripId}`);
        }, () => this.router.navigate(`#/trips/${tripId}`));
    }
}
//# sourceMappingURL=EditTripPage.js.map