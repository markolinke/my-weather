import { nearestHourIndex, parseLocalHour } from './forecast.js';

const RAIN_CODES = new Set([
    51, 53, 55, 56, 57,
    61, 63, 65, 66, 67,
    80, 81, 82,
    95, 96, 99,
]);

/** How far ahead to look for approaching rain (hours). */
const LOOKAHEAD_HOURS = 12;

export function isRainCode(code) {
    return RAIN_CODES.has(code);
}

export function formatRainDuration(ms) {
    const minutes = Math.max(0, Math.round(ms / 60_000));
    if (minutes < 20) return 'soon';
    if (minutes < 45) return 'in about 30 minutes';
    if (minutes < 75) return 'in about an hour';
    const hours = Math.round(minutes / 60);
    if (hours === 1) return 'in about an hour';
    if (hours === 2) return 'in two hours';
    return `in ${hours} hours`;
}

/**
 * Summarize rain timing from Open-Meteo hourly weather codes.
 * @returns {{ kind: 'dry'|'approaching'|'raining', message: string } | null}
 */
export function buildRainIndicator(hourly, nowMs = Date.now()) {
    if (!hourly?.time?.length || !hourly.weather_code?.length) return null;

    const nowIdx = nearestHourIndex(hourly.time, nowMs);
    const rainingNow = isRainCode(hourly.weather_code[nowIdx]);
    const horizonMs = nowMs + LOOKAHEAD_HOURS * 60 * 60 * 1000;

    if (rainingNow) {
        let stopIdx = null;
        for (let i = nowIdx + 1; i < hourly.time.length; i++) {
            const when = parseLocalHour(hourly.time[i]).getTime();
            if (when > horizonMs) break;
            if (!isRainCode(hourly.weather_code[i])) {
                stopIdx = i;
                break;
            }
        }
        if (stopIdx == null) {
            return { kind: 'raining', message: 'Raining. No clear end in the next few hours.' };
        }
        const untilStop = parseLocalHour(hourly.time[stopIdx]).getTime() - nowMs;
        return {
            kind: 'raining',
            message: `Raining. Should stop ${formatRainDuration(untilStop)}.`,
        };
    }

    for (let i = nowIdx + 1; i < hourly.time.length; i++) {
        const when = parseLocalHour(hourly.time[i]).getTime();
        if (when > horizonMs) break;
        if (isRainCode(hourly.weather_code[i])) {
            return {
                kind: 'approaching',
                message: `Rain expected ${formatRainDuration(when - nowMs)}.`,
            };
        }
    }

    return { kind: 'dry', message: 'No rain expected soon.' };
}
