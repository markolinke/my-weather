import { DAY_FORECAST_COUNT, HOUR_FORECAST_COUNT } from '../config.js';
import { wmoLabel } from './wmo.js';

/** Open-Meteo timezone=auto returns local wall time without offset, e.g. 2026-08-26T14:00 */
export function parseLocalHour(isoLocal) {
    const [datePart, timePart] = isoLocal.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute = 0] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
}

export function nearestHourIndex(times, targetMs) {
    let bestIdx = 0;
    let bestDiff = Infinity;
    times.forEach((iso, idx) => {
        const diff = Math.abs(parseLocalHour(iso).getTime() - targetMs);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = idx;
        }
    });
    return bestIdx;
}

export function buildDeltas(weather, hourly) {
    const pastIdx = nearestHourIndex(hourly.time, Date.now() - 24 * 60 * 60 * 1000);
    return {
        temp: weather.main.temp - hourly.temperature_2m[pastIdx],
        humidity: weather.main.humidity - hourly.relative_humidity_2m[pastIdx],
        wind: weather.wind.speed - hourly.wind_speed_10m[pastIdx],
    };
}

export function buildHourlyForecast(hourly) {
    const nowIdx = nearestHourIndex(hourly.time, Date.now());
    // Prefer the current hour or the next one if we landed slightly in the past
    let start = nowIdx;
    if (parseLocalHour(hourly.time[start]).getTime() < Date.now() - 30 * 60 * 1000) {
        start = Math.min(start + 1, hourly.time.length - 1);
    }
    const end = Math.min(start + HOUR_FORECAST_COUNT, hourly.time.length);
    const rows = [];
    for (let i = start; i < end; i++) {
        const when = parseLocalHour(hourly.time[i]);
        rows.push({
            timeLabel: when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: hourly.temperature_2m[i],
            code: hourly.weather_code[i],
            cond: wmoLabel(hourly.weather_code[i]),
            precip: hourly.precipitation_probability[i],
        });
    }
    return rows;
}

export function tomorrowMidnight() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + 1);
    return start;
}

const DAY_SLOTS = [
    { name: 'Morning', hour: 8 },
    { name: 'Midday', hour: 14 },
    { name: 'Evening', hour: 20 },
];

/** Upcoming days (from tomorrow), each with morning / midday / evening slots. */
export function buildDayForecast(hourly) {
    const byDayHour = new Map();
    hourly.time.forEach((iso, idx) => {
        const when = parseLocalHour(iso);
        const key = `${when.getFullYear()}-${when.getMonth()}-${when.getDate()}-${when.getHours()}`;
        byDayHour.set(key, idx);
    });

    const days = [];
    const start = tomorrowMidnight();

    for (let d = 0; d < DAY_FORECAST_COUNT; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + d);
        const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-`;
        const hasAnyHour = [...byDayHour.keys()].some((k) => k.startsWith(dayKey));
        if (!hasAnyHour) break;

        const label = day.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
        const slots = DAY_SLOTS.map(({ name, hour }) => {
            const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${hour}`;
            const idx = byDayHour.get(key);
            if (idx == null) return { name, temp: null, code: null, cond: '—', precip: null };
            return {
                name,
                temp: hourly.temperature_2m[idx],
                code: hourly.weather_code[idx],
                cond: wmoLabel(hourly.weather_code[idx]),
                precip: hourly.precipitation_probability[idx],
            };
        });
        days.push({ label, slots });
    }
    return days;
}
