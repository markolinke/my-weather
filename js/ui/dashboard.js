import { buildObservationStatus } from '../domain/observation.js';
import { buildRainIndicator } from '../domain/rain.js';
import { renderAir } from './air.js';
import { renderForecast } from './forecast.js';
import { iconSvgByKind, rainStatusIconKind } from './icons.js';

const RAIN_TONE = {
    dry: 'wx-sun',
    approaching: 'wx-sky',
    raining: 'wx-sky',
};

export function renderDashboard(weather, air, forecast) {
    document.getElementById('status').innerText = buildObservationStatus({
        dt: weather.dt,
        placeLabel: weather.name,
    });
    document.getElementById('dashboard').classList.remove('hidden');

    document.getElementById('temp').innerText = weather.main.temp.toFixed(1);
    document.getElementById('humidity').innerText = weather.main.humidity;
    document.getElementById('wind').innerText = weather.wind.speed.toFixed(1);

    const rain = buildRainIndicator(forecast?.hourly);
    const kind = rain?.kind ?? 'unknown';

    const rainEl = document.getElementById('rain-indicator');
    rainEl.textContent = rain?.message ?? 'Unavailable';
    rainEl.dataset.kind = kind;

    document.getElementById('rain-icon').innerHTML = iconSvgByKind(rainStatusIconKind(kind));

    const rainMetric = document.getElementById('rain-metric');
    rainMetric.classList.remove('wx-sun', 'wx-sky', 'wx-cloud');
    if (RAIN_TONE[kind]) rainMetric.classList.add(RAIN_TONE[kind]);

    renderForecast(weather, forecast);
    renderAir(air);
}
