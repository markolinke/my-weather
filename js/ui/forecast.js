import {
    buildDayForecast,
    buildDeltas,
    buildHourlyForecast,
} from '../domain/forecast.js';
import { setDelta } from './deltas.js';
import {
    precipMarkup,
    tempToneClass,
    weatherIconSvg,
    weatherToneClass,
} from './icons.js';

export function renderForecast(weather, forecast) {
    const sections = document.getElementById('forecast-sections');
    const unavailable = document.getElementById('forecast-unavailable');

    if (!forecast || !forecast.hourly || !forecast.hourly.time?.length) {
        sections.classList.add('hidden');
        unavailable.classList.remove('hidden');
        ['temp-delta', 'humidity-delta', 'wind-delta'].forEach((id) => {
            document.getElementById(id).classList.add('hidden');
        });
        return;
    }

    unavailable.classList.add('hidden');
    sections.classList.remove('hidden');

    const deltas = buildDeltas(weather, forecast.hourly);
    setDelta(document.getElementById('temp-delta'), deltas.temp, 1, '°C');
    setDelta(document.getElementById('humidity-delta'), deltas.humidity, 0, '%');
    setDelta(document.getElementById('wind-delta'), deltas.wind, 1, ' m/s');

    document.getElementById('hour-strip').innerHTML = buildHourlyForecast(forecast.hourly).map((row) => `
        <div class="hour-cell ${weatherToneClass(row.code)}">
            <div class="hour-time">${row.timeLabel}</div>
            <div class="wx-icon">${weatherIconSvg(row.code)}</div>
            <div class="hour-temp ${tempToneClass(row.temp)}">${row.temp.toFixed(0)}°</div>
            <div class="hour-cond">${row.cond}</div>
            ${precipMarkup(row.precip)}
        </div>
    `).join('');

    document.getElementById('day-forecast-list').innerHTML = buildDayForecast(forecast.hourly).map((day) => `
        <div class="day-forecast">
            <div class="day-forecast-label">${day.label}</div>
            <div class="day-slots">
                ${day.slots.map((slot) => `
                    <div class="day-slot ${slot.code == null ? '' : weatherToneClass(slot.code)}" title="${slot.name}: ${slot.cond}">
                        <div class="wx-icon">${slot.code == null ? '' : weatherIconSvg(slot.code)}</div>
                        <div class="day-slot-temp ${tempToneClass(slot.temp)}">${slot.temp == null ? '—' : `${slot.temp.toFixed(0)}°`}</div>
                        ${precipMarkup(slot.precip)}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}
