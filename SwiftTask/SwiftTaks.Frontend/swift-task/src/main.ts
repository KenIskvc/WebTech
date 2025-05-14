import "./style.css";
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

await Alpine.store('auth').init();

setupRoutes();