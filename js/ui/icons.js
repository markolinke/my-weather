import { weatherIconKind } from '../domain/wmo.js';

const ICONS = {
    sun: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.4 5.4l1.6 1.6M17 17l1.6 1.6M5.4 18.6l1.6-1.6M17 7l1.6-1.6"/></g></svg>`,
    partly: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="2.6" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 4.2v1.3M4.2 8.5h1.3M5.4 5.4l.9.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8.2 17.5h9.2a3.2 3.2 0 0 0 .2-6.4 4.6 4.6 0 0 0-8.7 1.3A2.9 2.9 0 0 0 8.2 17.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    cloud: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 17.5h10a3.3 3.3 0 0 0 .3-6.6 4.9 4.9 0 0 0-9.4 1.5A3.1 3.1 0 0 0 7.2 17.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    rain: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 13.2h10a3.1 3.1 0 0 0 .2-6.2 4.6 4.6 0 0 0-8.8 1.3A2.9 2.9 0 0 0 7.2 13.2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9 15.8v2.3M12 15.2v3M15 15.8v2.3"/></g></svg>`,
    snow: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 13h10a3.1 3.1 0 0 0 .2-6.2 4.6 4.6 0 0 0-8.8 1.3A2.9 2.9 0 0 0 7.2 13z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><g fill="currentColor"><circle cx="9" cy="16.2" r="0.9"/><circle cx="12" cy="15.5" r="0.9"/><circle cx="15" cy="16.2" r="0.9"/><circle cx="10.5" cy="18" r="0.9"/><circle cx="13.5" cy="18" r="0.9"/></g></svg>`,
    fog: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9h16M5 12.2h14M6 15.4h12"/></g></svg>`,
    thunder: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 12.2h10a3.1 3.1 0 0 0 .2-6.2 4.6 4.6 0 0 0-8.8 1.3A2.9 2.9 0 0 0 7.2 12.2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12.8 12.8l-2.6 4.4h2.2L11.2 21l3.5-5.2h-2Z" fill="currentColor"/></svg>`,
};

export function weatherToneClass(code) {
    const kind = weatherIconKind(code);
    if (kind === 'sun') return 'wx-sun';
    if (kind === 'partly' || kind === 'rain' || kind === 'snow' || kind === 'thunder') return 'wx-sky';
    return 'wx-cloud';
}

export function iconSvgByKind(kind) {
    return ICONS[kind] || ICONS.cloud;
}

export function weatherIconSvg(code) {
    return iconSvgByKind(weatherIconKind(code));
}

/** Icon for rain-indicator kinds: dry | approaching | raining */
export function rainStatusIconKind(kind) {
    if (kind === 'raining') return 'rain';
    if (kind === 'approaching') return 'partly';
    return 'sun';
}

export function tempToneClass(temp) {
    if (temp == null || Number.isNaN(temp)) return '';
    if (temp < 5) return 'temp-cold';
    if (temp < 15) return 'temp-cool';
    if (temp < 22) return 'temp-mild';
    if (temp < 28) return 'temp-warm';
    return 'temp-hot';
}

export function precipMarkup(precip) {
    if (precip == null || Number.isNaN(precip)) {
        return `<div class="precip-row is-dry">—</div>`;
    }
    const lit = precip < 15 ? 0 : precip < 40 ? 1 : precip < 70 ? 2 : 3;
    const drops = [0, 1, 2].map((i) => `<span class="precip-drop${i < lit ? ' on' : ''}"></span>`).join('');
    const dry = precip < 15;
    return `
        <div class="precip-row${dry ? ' is-dry' : ''}" title="${precip}% chance of rain">
            <span class="precip-drops">${drops}</span>
            <span>${precip}%</span>
        </div>
    `;
}
