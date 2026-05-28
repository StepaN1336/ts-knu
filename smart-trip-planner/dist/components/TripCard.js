export function renderTripCard(trip, durationDays, onDelete, onEdit) {
    const card = document.createElement("article");
    card.className = "trip-card";
    card.innerHTML = `
    <a href="#/trips/${trip.id}" data-link class="trip-card__image-wrap">
      <img
        src="${trip.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"}"
        alt="${trip.city}"
        class="trip-card__image"
        onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'"
      />
      <span class="trip-card__country-badge">${trip.country}</span>
    </a>
    <div class="trip-card__body">
      <h2 class="trip-card__city">${trip.city}</h2>
      <p class="trip-card__dates">
        <span class="trip-card__dates-icon">📅</span>
        ${new Date(trip.startDate).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
        —
        ${new Date(trip.endDate).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" })}
      </p>
      <p class="trip-card__duration">${durationDays} ${pluralDays(durationDays)}</p>
      <div class="trip-card__actions">
        <button class="btn btn--outline btn--sm js-edit-trip" data-id="${trip.id}">✏️ Редагувати</button>
        <button class="btn btn--danger btn--sm js-delete-trip" data-id="${trip.id}">🗑️ Видалити</button>
      </div>
    </div>
  `;
    card.querySelector(".js-edit-trip")?.addEventListener("click", (e) => {
        e.preventDefault();
        onEdit(trip.id);
    });
    card.querySelector(".js-delete-trip")?.addEventListener("click", (e) => {
        e.preventDefault();
        onDelete(trip.id);
    });
    return card;
}
function pluralDays(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 14)
        return "днів";
    if (mod10 === 1)
        return "день";
    if (mod10 >= 2 && mod10 <= 4)
        return "дні";
    return "днів";
}
//# sourceMappingURL=TripCard.js.map