import loginPageHtml from './pages/login/login.html?raw';
import "./style.css";
import swifttaskLogo from "/swifttask-icon.png";
import { setupRoutes } from "./router";
import Alpine from 'alpinejs';

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;

Alpine.store('auth', {
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  isAuthenticated: false,

  async init() {
    if (this.token) {
      this.isAuthenticated = true;
      await this.fetchUser();
    }
  },

  async fetchUser() {
    const res = await fetch('https://localhost:7050/me', {
      headers: { Authorization: `Bearer ${this.token}` }
    });

    if (res.ok) {
      this.user = await res.json();
    } else {
      await this.tryRefreshToken();
    }
  },

  async tryRefreshToken() {
    const refreshToken = this.refreshToken;
    if (!refreshToken) return this.logout();

    const res = await fetch('https://localhost:7050/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      this.token = data.accessToken;
      this.refreshToken = data.refreshToken;
      localStorage.setItem('accessToken', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      this.isAuthenticated = true;
      await this.fetchUser();
    } else {
      this.logout();
    }
  },

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.isAuthenticated = false;
    localStorage.clear();
    window.location.hash = '/login';
  }
});

Alpine.start();

setupRoutes();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>    
    <a href="#">
      <img src="${swifttaskLogo}" class="logo vanilla" alt="SwitftTask logo" />
    </a>
    <h1>Swift Task</h1>
    <div class="card">
       <button id="start-btn" type="button">Start</button>
    </div>
    <p class="read-the-docs">
      Welcome to your personal To-Do List Manager 😊
    </p>
  </div>
`;

// <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//<button id="counter" type="button"></button>

//setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);


document.getElementById("start-btn")?.addEventListener("click", () => {
const startBtn = document.getElementById('start-btn')!;
const app = document.querySelector<HTMLDivElement>('#app')!;

startBtn.addEventListener('click', () => {
  app.innerHTML = loginPageHtml;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/src/pages/login/login.css';
  document.head.append(link);
});
});