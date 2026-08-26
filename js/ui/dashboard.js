import { renderAir } from './air.js';
import { renderForecast } from './forecast.js';

export function renderDashboard(weather, air, forecast) {
    document.getElementById('status').innerText = `Location: ${weather.name}`;
    document.getElementById('dashboard').classList.remove('hidden');

    document.getElementById('temp').innerText = weather.main.temp.toFixed(1);
    document.getElementById('humidity').innerText = weather.main.humidity;
    document.getElementById('wind').innerText = weather.wind.speed.toFixed(1);
    const description = weather.weather[0].description;
    document.getElementById('desc').innerText = description.charAt(0).toUpperCase() + description.slice(1);

    renderForecast(weather, forecast);
    renderAir(air);
}
