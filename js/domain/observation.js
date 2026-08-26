/**
 * Relative age of an OpenWeather observation (`weather.dt`, unix seconds).
 */
export function formatObservationAge(dtSeconds, nowMs = Date.now()) {
    if (dtSeconds == null) return null;
    const minutes = Math.max(0, Math.round((nowMs - dtSeconds * 1000) / 60_000));
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
}

/** e.g. "6 min ago · Zagreb" */
export function buildObservationStatus({ dt, placeLabel }, nowMs = Date.now()) {
    const age = formatObservationAge(dt, nowMs);
    if (!age) return placeLabel || '';
    if (!placeLabel) return age;
    return `${age} · ${placeLabel}`;
}
