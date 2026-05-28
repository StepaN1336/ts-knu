import type { ActivityFormData, ActivityCategory } from "../models/types.js";

const CATEGORIES: { value: ActivityCategory; label: string; icon: string }[] = [
  { value: "музей", label: "Музей", icon: "🏛️" },
  { value: "ресторан", label: "Ресторан", icon: "🍽️" },
  { value: "парк", label: "Парк", icon: "🌳" },
  { value: "визначна_пам'ятка", label: "Визначна пам'ятка", icon: "🗿" },
  { value: "розваги", label: "Розваги", icon: "🎭" },
  { value: "шопінг", label: "Шопінг", icon: "🛍️" },
  { value: "інше", label: "Інше", icon: "📌" },
];

export function renderActivityForm(
  container: HTMLElement,
  onSubmit: (data: ActivityFormData) => void,
  onCancel: () => void
): void {
  const options = CATEGORIES.map(
    (c) => `<option value="${c.value}">${c.icon} ${c.label}</option>`
  ).join("");

  container.innerHTML = `
    <form class="form" id="activity-form" novalidate>
      <div class="form__row">
        <div class="form__group">
          <label class="form__label" for="act-title">Назва *</label>
          <input class="form__input" type="text" id="act-title" name="title"
            placeholder="напр. Лувр" required />
        </div>
        <div class="form__group">
          <label class="form__label" for="act-time">Час</label>
          <input class="form__input" type="time" id="act-time" name="time" value="10:00" />
        </div>
      </div>
      <div class="form__group">
        <label class="form__label" for="act-category">Категорія</label>
        <select class="form__input form__select" id="act-category" name="category">
          ${options}
        </select>
      </div>
      <div class="form__group">
        <label class="form__label" for="act-desc">Опис</label>
        <textarea class="form__input form__textarea" id="act-desc" name="description"
          placeholder="Короткий опис місця або події..." rows="3"></textarea>
      </div>
      <div class="form__actions">
        <button type="button" class="btn btn--ghost js-cancel">Скасувати</button>
        <button type="submit" class="btn btn--primary">➕ Додати</button>
      </div>
    </form>
  `;

  const form = container.querySelector<HTMLFormElement>("#activity-form")!;

  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const fd = new FormData(form);
    const title = (fd.get("title") as string).trim();
    if (!title) return;
    onSubmit({
      title,
      description: (fd.get("description") as string).trim(),
      category: fd.get("category") as ActivityCategory,
      time: fd.get("time") as string,
    });
  });

  form.querySelector(".js-cancel")?.addEventListener("click", onCancel);
}

export function getCategoryIcon(category: ActivityCategory): string {
  return CATEGORIES.find((c) => c.value === category)?.icon ?? "📌";
}