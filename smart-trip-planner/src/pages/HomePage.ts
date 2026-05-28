import type { TripService } from "../services/TripService.js";
import type { Router } from "../router/Router.js";
import { renderTripCard } from "../components/TripCard.js";
import { renderTripForm } from "../components/TripForm.js";
import type { TripFormData } from "../models/types.js";

export class HomePage {
  private container: HTMLElement;
  private tripService: TripService;
  private router: Router;

  constructor(container: HTMLElement, tripService: TripService, router: Router) {
    this.container = container;
    this.tripService = tripService;
    this.router = router;
  }

  render(): void {
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

    const grid = this.container.querySelector<HTMLElement>("#trips-grid")!;

    trips.forEach((trip) => {
      const duration = this.tripService.getDuration(trip);
      const card = renderTripCard(
        trip,
        duration,
        (id) => this.handleDelete(id),
        (id) => this.openEditForm(id)
      );
      grid.appendChild(card);
    });

    this.container.querySelector(".js-new-trip")?.addEventListener("click", () => {
      this.openCreateForm();
    });
  }

  private renderEmpty(): string {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">🗺️</div>
        <p class="empty-state__text">У вас поки немає подорожей</p>
        <p class="empty-state__hint">Натисніть «Нова подорож», щоб почати планувати</p>
      </div>
    `;
  }

  private openCreateForm(): void {
    const overlay = document.querySelector<HTMLElement>("#modal-overlay")!;
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

    renderTripForm(
      overlay.querySelector<HTMLElement>("#modal-form-body")!,
      {},
      (data: TripFormData) => {
        this.tripService.create(data);
        this.closeModal();
        this.render();
      },
      () => this.closeModal()
    );

    overlay.querySelector(".js-close-modal")?.addEventListener("click", () => this.closeModal());
    overlay.addEventListener("click", (e: Event) => {
      if (e.target === overlay) this.closeModal();
    });
  }

  private openEditForm(id: string): void {
    const trip = this.tripService.getById(id);
    if (!trip) return;

    const overlay = document.querySelector<HTMLElement>("#modal-overlay")!;
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

    renderTripForm(
      overlay.querySelector<HTMLElement>("#modal-form-body")!,
      trip,
      (data: TripFormData) => {
        this.tripService.update(id, data);
        this.closeModal();
        this.render();
      },
      () => this.closeModal()
    );

    overlay.querySelector(".js-close-modal")?.addEventListener("click", () => this.closeModal());
    overlay.addEventListener("click", (e: Event) => {
      if (e.target === overlay) this.closeModal();
    });
  }

  private handleDelete(id: string): void {
    if (!confirm("Видалити цю подорож?")) return;
    this.tripService.delete(id);
    this.render();
  }

  private closeModal(): void {
    const overlay = document.querySelector<HTMLElement>("#modal-overlay")!;
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}