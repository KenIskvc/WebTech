import { router } from "../router";
import { User } from "../models/User";

export const authStore = {
  token: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null as User | null,
  isAuthenticated: false,

  async init() {
    if (this.token) {
      this.isAuthenticated = true;
      await this.fetchUser();
    }
  },

  async fetchUser() {
    const res = await fetch("https://localhost:7050/me", {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (res.ok) {
      this.user = await res.json() as User;
    } else {
      await this.tryRefreshToken();
    }
  },

  async tryRefreshToken() {
    const res = await fetch("https://localhost:7050/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      this.token = data.accessToken;
      this.refreshToken = data.refreshToken;

      if (this.token && this.refreshToken) {
        localStorage.setItem("accessToken", this.token);
        localStorage.setItem("refreshToken", this.refreshToken);
      }

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
    router.navigate("/login");
  },
};
