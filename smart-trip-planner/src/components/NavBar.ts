export class Navbar {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = `
      <nav class="navbar">
        <div class="navbar__inner">
          <a href="#/" data-link class="navbar__logo">
            <span class="navbar__logo-icon">✈️</span>
            <span class="navbar__logo-text">Smart Trip Planner</span>
          </a>
          <a href="#/" data-link class="navbar__cta">Мої подорожі</a>
        </div>
      </nav>
    `;
  }
}