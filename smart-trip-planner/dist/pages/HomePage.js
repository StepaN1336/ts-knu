import { renderTripCard } from "../components/TripCard.js";
import { renderTripForm } from "../components/TripForm.js";
export class HomePage {
    constructor(container, tripService, router) {
        this.container = container;
        this.tripService = tripService;
        this.router = router;
    }
    render() {
        const trips = this.tripService.getAll();
        this.container.innerHTML = `
      <section class="hero">
        <div class="hero__inner">
          <h1 class="hero__title">Плануй подорожі <span class="hero__accent">розумно</span></h1>
          <p class="hero__subtitle">Створюй маршрути, плануй активності, зберігай спогади</p>
          <button class="btn btn--primary btn--lg js-new-trip">✈️ Нова подорож</button>
        </div>
      </section>

      <section class="trips-section">
        <div class="container">
          <div class="trips-section__header">
            <h2 class="trips-section__title">Мої подорожі</h2>
            <span class="trips-section__count">${trips.length}</span>
          </div>
          <div id="trips-grid" class="trips-grid">
            ${trips.length === 0 ? this.renderEmpty() : ""}
          </div>
        </div>
      </section>
    `;
        const grid = this.container.querySelector("#trips-grid");
        trips.forEach((trip) => {
            const duration = this.tripService.getDuration(trip);
            const card = renderTripCard(trip, duration, (id) => this.handleDelete(id), (id) => this.openEditForm(id));
            grid.appendChild(card);
        });
        this.container.querySelector(".js-new-trip")?.addEventListener("click", () => {
            this.openCreateForm();
        });
    }
    renderEmpty() {
        return `
      <div class="empty-state">
        <div class="empty-state__icon">🗺️</div>
        <p class="empty-state__text">У вас поки немає подорожей</p>
        <p class="empty-state__hint">Натисніть «Нова подорож», щоб почати планувати</p>
      </div>
    `;
    }
    openCreateForm() {
        const overlay = document.querySelector("#modal-overlay");
        overlay.classList.remove("hidden");
        overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">✈️ Нова подорож</h3>
          <button class="modal__close js-close-modal">✕</button>
        </div>
        <div class="modal__body" id="modal-form-body"></div>
      </div>
    `;
        renderTripForm(overlay.querySelector("#modal-form-body"), {}, (data) => {
            this.tripService.create(data);
            this.closeModal();
            this.render();
        }, () => this.closeModal());
        overlay.querySelector(".js-close-modal")?.addEventListener("click", () => this.closeModal());
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay)
                this.closeModal();
        });
    }
    openEditForm(id) {
        const trip = this.tripService.getById(id);
        if (!trip)
            return;
        const overlay = document.querySelector("#modal-overlay");
        overlay.classList.remove("hidden");
        overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">✏️ Редагування: ${trip.city}</h3>
          <button class="modal__close js-close-modal">✕</button>
        </div>
        <div class="modal__body" id="modal-form-body"></div>
      </div>
    `;
        renderTripForm(overlay.querySelector("#modal-form-body"), trip, (data) => {
            this.tripService.update(id, data);
            this.closeModal();
            this.render();
        }, () => this.closeModal());
        overlay.querySelector(".js-close-modal")?.addEventListener("click", () => this.closeModal());
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay)
                this.closeModal();
        });
    }
    handleDelete(id) {
        if (!confirm("Видалити цю подорож?"))
            return;
        this.tripService.delete(id);
        this.render();
    }
    closeModal() {
        const overlay = document.querySelector("#modal-overlay");
        overlay.classList.add("hidden");
        overlay.innerHTML = "";
    }
}
//# sourceMappingURL=HomePage.js.map