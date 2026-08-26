import {
    API_KEY,
    FORECAST_DAYS,
    FORECAST_PAST_HOURS,
} from '../config.js';

/**
 * Fetch current weather, air quality, and hourly forecast for a location.
 * Forecast may be null if Open-Meteo fails while OpenWeather succeeds.
 */
export async function fetchAtmosphere(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&wind_speed_unit=ms&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability&past_hours=${FORECAST_PAST_HOURS}&forecast_days=${FORECAST_DAYS}`;

    const [weatherRes, aqiRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl),
        fetch(forecastUrl),
    ]);

    if (!weatherRes.ok || !aqiRes.ok) {
        throw new Error('Failed to communicate with OpenWeather data servers.');
    }

    const weather = await weatherRes.json();
    const air = await aqiRes.json();
    const forecast = forecastRes.ok ? await forecastRes.json() : null;

    return { weather, air, forecast };
}
