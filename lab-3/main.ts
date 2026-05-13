interface Category {
  id: number;
  name: string;
  shortname: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  shortname: string;
  description: string;
  price: number;
}

interface CategoryData {
  categoryName: string;
  items: Product[];
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Помилка завантаження: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Рендер каталогу
async function loadCatalog(): Promise<void> {
  const contentEl = document.getElementById("content") as HTMLDivElement;
  contentEl.innerHTML = `<div class="loader"><span class="loader-dot"></span><span class="loader-dot"></span><span class="loader-dot"></span></div>`;

  try {
    const categories: Category[] = await fetchJSON<Category[]>("data/categories.json");

    let html = `<section class="catalog-section">
      <h2 class="section-title">Каталог товарів</h2>
      <div class="category-grid">`;

    for (const cat of categories) {
      html += `
        <div class="category-card" data-shortname="${cat.shortname}">
          <div class="category-icon">${getCategoryIcon(cat.shortname)}</div>
          <h3 class="category-name">${cat.name}</h3>
          ${cat.notes ? `<p class="category-notes">${cat.notes}</p>` : ""}
          <button class="btn-category" onclick="loadCategory('${cat.shortname}', '${cat.name}')">
            Переглянути →
          </button>
        </div>`;
    }

    html += `</div>

      <div class="specials-banner" onclick="loadSpecials()">
        <span class="specials-icon">⚡</span>
        <div>
          <strong>Specials</strong>
          <p>Відкрий випадкову категорію — можливо, знайдеш щось цікаве!</p>
        </div>
        <span class="specials-arrow">→</span>
      </div>
    </section>`;

    contentEl.innerHTML = html;
  } catch (err) {
    showError(contentEl, err as Error);
  }
}

// Рендер товарів категорії
async function loadCategory(shortname: string, _displayName?: string): Promise<void> {
  const contentEl = document.getElementById("content") as HTMLDivElement;
  contentEl.innerHTML = `<div class="loader"><span class="loader-dot"></span><span class="loader-dot"></span><span class="loader-dot"></span></div>`;

  try {
    const data: CategoryData = await fetchJSON<CategoryData>(`data/${shortname}.json`);

    let html = `
      <section class="products-section">
        <button class="btn-back" onclick="loadCatalog()">← Назад до каталогу</button>
        <h2 class="section-title">${data.categoryName}</h2>
        <div class="products-grid">`;

    for (const product of data.items) {
      const imgUrl: string = getPlaceholderImage(product.shortname);
      html += `
        <article class="product-card">
          <div class="product-img-wrap">
            <img
              src="${imgUrl}"
              alt="${product.name}"
              class="product-img"
              width="180"
              height="180"
              loading="lazy"
            />
          </div>
          <div class="product-body">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">${formatPrice(product.price)} ₴</span>
              <button class="btn-buy">До кошика</button>
            </div>
          </div>
        </article>`;
    }

    html += `</div></section>`;
    contentEl.innerHTML = html;
  } catch (err) {
    showError(contentEl, err as Error);
  }
}

// Випадкова категорія
async function loadSpecials(): Promise<void> {
  try {
    const categories: Category[] = await fetchJSON<Category[]>("data/categories.json");
    const randomIndex: number = Math.floor(Math.random() * categories.length);
    const randomCategory: Category = categories[randomIndex];
    await loadCategory(randomCategory.shortname, randomCategory.name);
  } catch (err) {
    const contentEl = document.getElementById("content") as HTMLDivElement;
    showError(contentEl, err as Error);
  }
}

// Головна сторінка (Hero)
function loadHome(): void {
  const contentEl = document.getElementById("content") as HTMLDivElement;
  contentEl.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <h1 class="hero-title">Ласкаво просимо до <span class="accent">TechStore</span></h1>
        <p class="hero-subtitle">Найкраща техніка за найкращими цінами. Ноутбуки, смартфони, навушники, планшети — все в одному місці.</p>
        <button class="btn-primary" onclick="loadCatalog()">Переглянути каталог →</button>
      </div>
      <div class="hero-visual">
        <div class="hero-badge">🛒</div>
      </div>
    </section>
  `;
}

// Допоміжні функції
function getPlaceholderImage(shortname: string): string {
  const colors: Record<string, string> = {
    "asus-vivobook": "1a1a2e/e0e0ff",
    "macbook-air":   "0d3b66/ffd166",
    "thinkpad-x1":   "2d3436/74b9ff",
    "dell-xps":      "2c3e50/a29bfe",
    "hp-pavilion":   "1e3a5f/55efc4",
    "samsung-s24":   "1565c0/bbdefb",
    "iphone-15":     "37474f/eceff1",
    "pixel-8":       "1b5e20/a5d6a7",
    "xiaomi-14":     "880e4f/f8bbd0",
    "oneplus-12":    "b71c1c/ffcdd2",
    "xperia-1":      "4a148c/e1bee7",
    "sony-xm5":      "263238/cfd8dc",
    "airpods-pro":   "212121/f5f5f5",
    "bose-qc45":     "1a237e/c5cae9",
    "sennheiser-m4": "33691e/dcedc8",
    "jbl-tour":      "e65100/ffe0b2",
    "ipad-pro":      "006064/b2ebf2",
    "tab-s9":        "01579b/b3e5fc",
    "lenovo-tab":    "4e342e/d7ccc8",
    "surface-pro":   "0277bd/e1f5fe",
    "xiaomi-pad":    "ad1457/fce4ec",
    "fire-hd":       "f57f17/fff9c4",
  };
  const colorPair: string = colors[shortname] ?? "2d3436/dfe6e9";
  return `https://placehold.co/180x180/${colorPair}?text=${encodeURIComponent(shortname)}`;
}

function getCategoryIcon(shortname: string): string {
  const icons: Record<string, string> = {
    laptops:    "💻",
    phones:     "📱",
    headphones: "🎧",
    tablets:    "⊡",
  };
  return icons[shortname] ?? "📦";
}

function formatPrice(price: number): string {
  return price.toLocaleString("uk-UA");
}

function showError(container: HTMLElement, err: Error): void {
  container.innerHTML = `
    <div class="error-box">
      <span class="error-icon">⚠️</span>
      <p>Не вдалось завантажити дані.</p>
      <code>${err.message}</code>
    </div>`;
}

// Ініціалізація при завантаженні сторінки
document.addEventListener("DOMContentLoaded", (): void => {
  loadHome();
});
