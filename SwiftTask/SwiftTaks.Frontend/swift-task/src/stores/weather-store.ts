import WeatherService from "../services/weather-service";
import { WeatherData } from "../models/WeatherData";

export const weatherStore = {
  city: null as string | null,
  data: null as WeatherData | null,
  loading: true,

  async init() {
    try {
      this.city = await WeatherService.getCityByIP();
      if (!this.city) throw new Error("City not found");

      this.data = await WeatherService.getWeatherByCity(this.city);
    } catch (error) {
      console.error("WeatherStore init failed:", error);
    } finally {
      this.loading = false;
    }
  }
};
