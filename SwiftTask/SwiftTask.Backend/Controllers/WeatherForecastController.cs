using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace SwiftTask.Backend.Controllers;
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase {
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    public WeatherForecastController(IHttpClientFactory httpClientFactory, IConfiguration config) {
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    [HttpGet("{city}")]
    public async Task<IActionResult> GetWeather(string city) {
        var apiKey = _config["OpenWeather:ApiKey"];
        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync($"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric");

        if (!response.IsSuccessStatusCode)
            return BadRequest("Could not fetch weather");

        var json = await response.Content.ReadAsStringAsync();
        var weatherData = JsonDocument.Parse(json).RootElement;

        var result = new {
            city = weatherData.GetProperty("name").GetString(),
            weather = weatherData.GetProperty("weather")[0].GetProperty("description").GetString(),
            temperature = weatherData.GetProperty("main").GetProperty("temp").GetDecimal(),
            icon = weatherData.GetProperty("weather")[0].GetProperty("icon").GetString()
        };

        return Ok(result);
    }
}
