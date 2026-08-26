/** OpenWeatherMap AQI pollutant thresholds (μg/m³): Good, Fair, Moderate, Poor, Very Poor */
export const POLLUTANTS = [
    {
        key: 'pm2_5',
        label: 'PM2.5 (Fine Dust)',
        thresholds: [10, 25, 50, 75],
        info: 'Fine particles ≤2.5 μm that can enter the lungs and bloodstream. Main sources: combustion, traffic, and industry.',
    },
    {
        key: 'pm10',
        label: 'PM10 (Coarse Dust)',
        thresholds: [20, 50, 100, 200],
        info: 'Coarse particles ≤10 μm that irritate the eyes, nose, and throat. Sources include dust, pollen, and construction.',
    },
    {
        key: 'o3',
        label: 'O₃ (Ozone)',
        thresholds: [60, 100, 140, 180],
        info: 'Ground-level ozone forms when sunlight reacts with traffic and industrial emissions. Can trigger breathing problems.',
    },
    {
        key: 'no2',
        label: 'NO₂ (Nitrogen Dioxide)',
        thresholds: [40, 70, 150, 200],
        info: 'Gas mainly from vehicle exhaust and combustion. Linked to airway inflammation and worse asthma symptoms.',
    },
    {
        key: 'so2',
        label: 'SO₂ (Sulfur Dioxide)',
        thresholds: [20, 80, 250, 350],
        info: 'Gas from burning coal and oil, and from industrial processes. Can irritate the respiratory tract.',
    },
    {
        key: 'co',
        label: 'CO (Carbon Monoxide)',
        thresholds: [4400, 9400, 12400, 15400],
        info: 'Colorless gas from incomplete combustion. High levels reduce oxygen delivery in the blood.',
    },
];

export function clampPercent(value) {
    return Math.max(0, Math.min(100, value));
}

export function markerPercent(value, max) {
    return clampPercent((value / max) * 100);
}
