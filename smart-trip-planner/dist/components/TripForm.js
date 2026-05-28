export function renderTripForm(container, initial, onSubmit, onCancel) {
    container.innerHTML = `
    <form class="form" id="trip-form" novalidate>
      <div class="form__row">
        <div class="form__group">
          <label class="form__label" for="city">Місто *</label>
          <input class="form__input" type="text" id="city" name="city"
            value="${initial.city ?? ""}" placeholder="напр. Київ" required />
        </div>
        <div class="form__group">
          <label class="form__label" for="country">Країна *</label>
          <input class="form__input" type="text" id="country" name="country"
            value="${initial.country ?? ""}" placeholder="напр. Україна" required />
        </div>
      </div>
      <div class="form__row">
        <div class="form__group">
          <label class="form__label" for="startDate">Дата початку *</label>
          <input class="form__input" type="date" id="startDate" name="startDate"
            value="${initial.startDate ?? ""}" required />
        </div>
        <div class="form__group">
          <label class="form__label" for="endDate">Дата завершення *</label>
          <input class="form__input" type="date" id="endDate" name="endDate"
            value="${initial.endDate ?? ""}" required />
        </div>
      </div>
      <div class="form__group">
        <label class="form__label" for="imageUrl">Зображення (URL)</label>
        <input class="form__input" type="url" id="imageUrl" name="imageUrl"
          value="${initial.imageUrl ?? ""}" placeholder="https://..." />
        <p class="form__hint">Вставте посилання на фото міста (напр. з unsplash.com)</p>
      </div>
      <div class="form__actions">
        <button type="button" class="btn btn--ghost js-cancel">Скасувати</button>
        <button type="submit" class="btn btn--primary">💾 Зберегти</button>
      </div>
    </form>
  `;
    const form = container.querySelector("#trip-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const city = fd.get("city").trim();
        const country = fd.get("country").trim();
        const startDate = fd.get("startDate");
        const endDate = fd.get("endDate");
        const imageUrl = fd.get("imageUrl").trim();
        if (!city || !country || !startDate || !endDate) {
            showFormError(form, "Будь ласка, заповніть усі обов'язкові поля");
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            showFormError(form, "Дата завершення не може бути раніше дати початку");
            return;
        }
        onSubmit({ city, country, startDate, endDate, imageUrl });
    });
    form.querySelector(".js-cancel")?.addEventListener("click", onCancel);
}
function showFormError(form, message) {
    const existing = form.querySelector(".form__error");
    if (existing)
        existing.remove();
    const err = document.createElement("p");
    err.className = "form__error";
    err.textContent = message;
    form.prepend(err);
}
//# sourceMappingURL=TripForm.js.map