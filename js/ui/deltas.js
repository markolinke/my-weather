function formatSigned(value, digits, suffix) {
    const rounded = Number(value.toFixed(digits));
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded.toFixed(digits)}${suffix}`;
}

export function setDelta(el, delta, digits, suffix) {
    if (delta == null || Number.isNaN(delta)) {
        el.classList.add('hidden');
        return;
    }
    el.classList.remove('hidden', 'up', 'down', 'flat');
    const tone = Math.abs(delta) < (digits === 0 ? 0.5 : 0.05) ? 'flat' : (delta > 0 ? 'up' : 'down');
    el.classList.add(tone);
    el.textContent = `${formatSigned(delta, digits, suffix)} vs 24h ago`;
}
