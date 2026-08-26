import {
    POLLUTANTS,
    clampPercent,
    markerPercent,
} from '../domain/pollutants.js';

const AQI_LABELS = {
    1: '1 (Good)',
    2: '2 (Fair)',
    3: '3 (Moderate)',
    4: '4 (Poor)',
    5: '5 (Very Poor)',
};

export function renderAir(air) {
    const aqiValue = air.list[0].main.aqi;
    document.getElementById('aqi-display').innerText = AQI_LABELS[aqiValue] || aqiValue;
    document.getElementById('aqi-marker').style.left = `${((aqiValue - 0.5) / 5) * 100}%`;

    const components = air.list[0].components;
    const list = document.getElementById('pollutant-list');
    list.innerHTML = POLLUTANTS.map(({ key, label, thresholds, info }) => {
        const value = components[key];
        const fairMax = thresholds[1];
        const scaleMax = thresholds[3];
        const acceptableWidth = clampPercent((fairMax / scaleMax) * 100);
        const currentLeft = markerPercent(value, scaleMax);
        return `
            <div class="pollutant-item">
                <div class="pollutant-header">
                    <span class="pollutant-name-row">
                        <span class="pollutant-name">${label}</span>
                        <span class="pollutant-info">
                            <button type="button" class="pollutant-info-btn" aria-label="About ${label}" aria-describedby="tip-${key}">i</button>
                            <span class="pollutant-tooltip" id="tip-${key}" role="tooltip">${info}</span>
                        </span>
                    </span>
                    <span class="pollutant-val">${value.toFixed(1)}</span>
                </div>
                <div class="pollutant-scale">
                    <div class="pollutant-acceptable" style="width: ${acceptableWidth}%;" title="Acceptable up to ${fairMax} μg/m³"></div>
                    <div class="pollutant-marker" style="left: ${currentLeft}%;" title="Current: ${value.toFixed(1)}"></div>
                </div>
            </div>
        `;
    }).join('');

    list.querySelectorAll('.pollutant-info').forEach((wrap) => {
        const btn = wrap.querySelector('.pollutant-info-btn');
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const wasOpen = wrap.classList.contains('is-open');
            list.querySelectorAll('.pollutant-info.is-open').forEach((el) => el.classList.remove('is-open'));
            if (!wasOpen) wrap.classList.add('is-open');
        });
    });
}

export function bindPollutantTooltipDismiss() {
    document.addEventListener('click', () => {
        document.querySelectorAll('.pollutant-info.is-open').forEach((el) => el.classList.remove('is-open'));
    });
}
