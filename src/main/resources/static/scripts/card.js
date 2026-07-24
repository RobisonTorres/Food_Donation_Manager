async function generateCards(cards) {
    const container = document.getElementById('representatives');
    if (!container) return;
    
    container.innerHTML = "";

    if (cards.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5 no-print fw-medium">No active families found for this month.</div>`;
        return;
    }

    cards.forEach(family => {
        container.insertAdjacentHTML('beforeend', `
            <div class="label-card text-dark fw-bold text-uppercase">
                ${family.familyName ?? 'N/A'}
            </div>
        `);
    });
}