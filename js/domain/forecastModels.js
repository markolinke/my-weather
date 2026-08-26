const STORAGE_KEY = 'forecastModelId';

/** Omit models= for best match (Open-Meteo default). */
export const DEFAULT_MODEL_ID = 'best_match';

/** Curated Europe-focused Open-Meteo models for the forecast picker. */
export const FORECAST_MODELS = [
    { id: DEFAULT_MODEL_ID, label: 'Best match (auto)' },
    { id: 'icon_seamless', label: 'DWD ICON' },
    { id: 'ecmwf_ifs025', label: 'ECMWF IFS 25 km' },
    { id: 'meteofrance_arpege_europe', label: 'Météo-France ARPEGE Europe' },
    { id: 'chmi_aladin_seamless', label: 'CHMI ALADIN (Central Europe)' },
    { id: 'knmi_harmonie_arome_europe', label: 'KNMI HARMONIE' },
    { id: 'geosphere_arome_austria', label: 'GeoSphere AROME Austria' },
];

export function getModel(id) {
    return FORECAST_MODELS.find((m) => m.id === id) || FORECAST_MODELS[0];
}

export function loadStoredModelId() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && FORECAST_MODELS.some((m) => m.id === stored)) return stored;
    } catch {
        /* private mode / blocked storage */
    }
    return DEFAULT_MODEL_ID;
}

export function saveStoredModelId(id) {
    try {
        localStorage.setItem(STORAGE_KEY, id);
    } catch {
        /* ignore */
    }
}

/** Open-Meteo query value; null means omit models= (best match). */
export function modelsQueryParam(modelId) {
    const id = getModel(modelId).id;
    return id === DEFAULT_MODEL_ID ? null : id;
}
