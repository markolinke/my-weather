export function showError(message) {
    document.getElementById('status').classList.add('hidden');
    const errorDiv = document.getElementById('error');
    errorDiv.innerText = message;
    errorDiv.classList.remove('hidden');
}
