import "./style.css";
import { setupRoutes } from "./router";
import Alpine from 'alpinejs';
// import { router } from "./router";
import { authStore } from "./stores/auth-store";
import { weatherStore } from "./stores/weather-store";


declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;

Alpine.store("auth", authStore);
Alpine.store("weather", weatherStore);

Alpine.start();

await Alpine.store('auth').init();

setupRoutes();