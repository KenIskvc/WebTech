import { WeatherData } from "../models/WeatherData";

const API_URL = "https://localhost:7050";

async function getCityByIP(): Promise<string | null> {
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    console.log(data);
    return data.city || null;
  } catch (error) {
    console.error("Failed to get city from IP:", error);
    return null;
  }
}

async function getWeatherByCity(city: string): Promise<WeatherData | null> {
  try {
    const res = await fetch(`${API_URL}/WeatherForecast/${encodeURIComponent(city)}`);
    if (!res.ok) {
      console.error("Weather fetch failed:", await res.text());
      return null;
    }
    const result = await res.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Weather API error:", error);
    return null;
  }
}

function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

const WeatherService = {
  getCityByIP,
  getWeatherByCity,
  getIconUrl
};

export default WeatherService;
