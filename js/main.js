import { fetchAtmosphere } from './api/fetchAtmosphere.js';
import { bindPollutantTooltipDismiss } from './ui/air.js';
import { renderDashboard } from './ui/dashboard.js';
import { showError } from './ui/error.js';
import { bindDayNav } from './ui/forecast.js';

async function handleLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById('status').innerText = 'Location found. Synchronizing API feeds...';

    try {
        const { weather, air, forecast } = await fetchAtmosphere(lat, lon);
        renderDashboard(weather, air, forecast);
    } catch (err) {
        showError(err.message);
    }
}

function handleLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            showError('Location access denied. Please verify browser or device permissions.');
            break;
        default:
            showError('Unable to identify exact regional coordinates.');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    bindDayNav();
    bindPollutantTooltipDismiss();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});
