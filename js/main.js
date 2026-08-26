import { fetchAtmosphere, fetchForecast } from './api/fetchAtmosphere.js';
import {
    loadStoredModelId,
    saveStoredModelId,
} from './domain/forecastModels.js';
import { bindPollutantTooltipDismiss } from './ui/air.js';
import { applyForecast, renderDashboard } from './ui/dashboard.js';
import { showError } from './ui/error.js';
import {
    bindForecastModelChange,
    populateForecastModelSelect,
    setForecastModelCredit,
    setForecastUpdating,
} from './ui/forecast.js';

let lastCoords = null;
let lastWeather = null;
let currentModelId = loadStoredModelId();

async function handleLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    lastCoords = { lat, lon };

    document.getElementById('status').innerText = 'Location found. Synchronizing API feeds...';

    try {
        const { weather, air, forecast } = await fetchAtmosphere(lat, lon, currentModelId);
        lastWeather = weather;
        renderDashboard(weather, air, forecast, currentModelId);
    } catch (err) {
        showError(err.message);
    }
}

async function handleModelChange(modelId) {
    currentModelId = modelId;
    saveStoredModelId(modelId);
    setForecastModelCredit(modelId);

    if (!lastCoords || !lastWeather) return;

    const updating = document.getElementById('forecast-updating');
    if (updating) updating.textContent = 'Updating forecast…';
    setForecastUpdating(true);

    try {
        const forecast = await fetchForecast(lastCoords.lat, lastCoords.lon, modelId);
        if (forecast?.hourly?.time?.length) {
            applyForecast(lastWeather, forecast, modelId);
            setForecastUpdating(false);
            return;
        }
        if (updating) updating.textContent = 'Model unavailable for this location.';
    } catch {
        if (updating) updating.textContent = 'Could not update forecast.';
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
    bindPollutantTooltipDismiss();
    populateForecastModelSelect(currentModelId);
    bindForecastModelChange(handleModelChange);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});
