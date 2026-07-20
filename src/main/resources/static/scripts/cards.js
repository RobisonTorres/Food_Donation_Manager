function currentMonth() {

    // This function...
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `01/${month}/${year}`;
}

async function generateCards() {

    // This function
    const container = document.getElementById('representatives');
    if (!container) return;
    container.innerHTML = "";
    
    try {
        const month = currentMonth();
        const response = await fetch(`http://localhost:8080/get_all_families_active_by_month?month=${month}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const families = await response.json();

        if (families.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-5 no-print fw-medium">No active families found for this month.</div>`;
            return;
        }

        families.forEach(family => {
            container.insertAdjacentHTML('beforeend', `
                <div class="label-card text-dark fw-bold text-uppercase">
                    ${family.familyName ?? 'N/A'}
                </div>
            `);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="col-12 text-center text-danger py-5 no-print fw-medium">Error loading families.</div>`;
    } 
}

function hideAndPrint() {

    // This function...
    const panel = document.getElementById('printPanel');
    panel.style.display = 'none';
    window.print();
    setTimeout(() => {
        panel.style.display = '';
    }, 500);
}

generateCards();