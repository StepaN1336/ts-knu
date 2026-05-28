import { TripService } from "./services/TripService.js";
import { Router } from "./router/Router.js";
import { Navbar } from "./components/NavBar.js";
import { HomePage } from "./pages/HomePage.js";
import { TripPage } from "./pages/TripPage.js";
import { EditTripPage } from "./pages/EditTripPage.js";

async function main(): Promise<void> {
  const tripService = new TripService();
  await tripService.loadTrips();

  const navbarEl = document.getElementById("navbar")!;
  const appEl = document.getElementById("app")!;

  new Navbar(navbarEl).render();

  const router = new Router();

  const homePage = new HomePage(appEl, tripService, router);
  const tripPage = new TripPage(appEl, tripService, router);
  const editPage = new EditTripPage(appEl, tripService, router);

  router
    .add("/", () => homePage.render())
    .add("/trips/:id", (p) => tripPage.render(p!["id"]!))
    .add("/trips/:id/edit", (p) => editPage.render(p!["id"]!))
    .onNotFound(() => homePage.render())
    .init();
}

main().catch(console.error);