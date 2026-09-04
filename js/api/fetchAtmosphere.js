import { API_KEY, FORECAST_DAYS } from '../config.js';
import { modelsQueryParam } from '../domain/forecastModels.js';

function buildForecastUrl(lat, lon, modelId) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&hourly=temperature_2m,weather_code,precipitation_probability&forecast_days=${FORECAST_DAYS}`;
    const models = modelsQueryParam(modelId);
    if (models) url += `&models=${models}`;
    return url;
}

/**
 * Fetch Open-Meteo hourly forecast only (for model switches).
 * @returns {Promise<object|null>}
 */
export async function fetchForecast(lat, lon, modelId) {
    const res = await fetch(buildForecastUrl(lat, lon, modelId));
    return res.ok ? res.json() : null;
}

/**
 * Fetch current weather, air quality, and hourly forecast for a location.
 * Forecast may be null if Open-Meteo fails while OpenWeather succeeds.
 */
export async function fetchAtmosphere(lat, lon, modelId) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const [weatherRes, aqiRes, forecast] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl),
        fetchForecast(lat, lon, modelId),
    ]);

    if (!weatherRes.ok || !aqiRes.ok) {
        throw new Error('Failed to communicate with OpenWeather data servers.');
    }

    const weather = await weatherRes.json();
    const air = await aqiRes.json();

    return { weather, air, forecast };
}
