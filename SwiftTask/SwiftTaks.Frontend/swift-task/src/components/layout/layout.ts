import { weatherStore } from "../../stores/weather-store";
import WeatherService from "../../services/weather-service";
import Alpine from "alpinejs";
import { User } from "../../models/User";

export function mountLayout(): void {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <header>
      <div class="header-left">
        <button type="button" id="burgerBtn" class="burger-btn material-icons">menu</button>
        <span class="logo1">SwiftTask</span>
      </div>
      <div id="userInfo">

      </div>
      <div class="header-right">
        <div id="weather">

        </div>
        <button type="button" id="logoutButton" class="logout-button">Logout</button>
      </div>
    </header>

    <div class="sidebar-layout">
      <aside class="sidebar">
        <nav class="nav">
          <ul>
            <li><a href="/home" data-navigo><span class="material-icons">home</span> Home</a></li>
            <li><a href="/tasks" data-navigo><span class="material-icons">checklist</span> Tasks</a></li>
            <li><a href="/dashboard" data-navigo><span class="material-icons">dashboard</span> Dashboard</a></li>
            <li><a href="/about" data-navigo><span class="material-icons">info</span> About</a></li>
          </ul>
        </nav>
      </aside>

      <div class="content-wrapper" style="position: relative; flex-grow: 1;">
        <div id="overlay" class="overlay"></div>
        <main id="app-content"></main>
      </div>
    </div>
  `;
}

// <li class="sidebar-profile">
//   <a href="/profile" data-navigo>
//     <span class="material-icons">account_circle</span> Profile
//   </a>
// </li>;
// <button id="darkToggle" class="dark-toggle material-icons">dark_mode</button>

export async function setUpLayout(): Promise<void> {
  const burgerBtn = document.getElementById("burgerBtn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("overlay");
  const content = document.getElementById("app-content");

  if (!burgerBtn || !sidebar || !overlay || !content) {
    console.warn("Burger menu setup failed.");
    return;
  }

  burgerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  content.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  document
    .getElementById("logoutButton")
    ?.addEventListener("click", async () => {
      await await Alpine.store("auth").logout();
    });
  await Alpine.store("weather").init();
  await renderUserInfo();
  renderWeather();
}

async function renderUserInfo() {
  const container = document.getElementById("userInfo");
  if (!container) return;

  const user: User = (await Alpine.store("auth").user) as User;
  if (user && user.userName) {
    container.textContent = `Hello, ${user.userName} 👋`;
  } else {
    container.textContent = "";
  }
}

function renderWeather() {
  const container = document.getElementById("weather");
  if (!container) return;

  if (weatherStore.loading) {
    container.textContent = "Loading weather...";
    return;
  }

  const city = weatherStore.city;
  const data = weatherStore.data;

  if (!city || !data) {
    container.textContent = "Weather unavailable";
    return;
  }

  const iconUrl = WeatherService.getIconUrl(data.icon);
  container.innerHTML = `
    <img src="${iconUrl}" alt="weather-icon" width="40" height="40" />
    <span>${Math.round(data.temperature)}°C in ${city}</span>
  `;
}
