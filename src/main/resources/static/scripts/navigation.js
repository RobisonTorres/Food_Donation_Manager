function currentMonth() {

    // This function returns the current month.
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `01/${month}/${year}`;
}

const appState = {
    families: { data: null, isDirty: true },
    children: { data: null, isDirty: true },
    donationsByMonth: {}, 
    cardsByMonth: {}      
};

const pages = {
    donation: './templates/donation.html',
    family: './templates/family.html',
    child: './templates/child.html',
    card: './templates/card.html'
};

async function navigateTo(pageKey, month = currentMonth()) {
    const viewport = document.getElementById('content-viewport');
    
    if (!pages[pageKey]) {
        console.error(`Page "${pageKey}" is not mapped in pages.`);
        return;
    }

    try {
        const response = await fetch(pages[pageKey]);
        if (!response.ok) throw new Error(`Could not load page: ${pages[pageKey]}`);
        
        const htmlContent = await response.text();
        viewport.innerHTML = htmlContent;

        switch (pageKey) {
            case 'donation': {
                if (!appState.donationsByMonth[month] || appState.donationsByMonth[month].isDirty) {
                    const res = await fetch(`http://localhost:8080/get_all_families_active_by_month?month=${month}`);
                    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                    appState.donationsByMonth[month] = { data: await res.json(), isDirty: false };
                }
                
                const donations = appState.donationsByMonth[month].data;
                if (typeof showFamilyStatus === 'function') showFamilyStatus(donations);
                if (typeof updateCurrentDateLabel === 'function') updateCurrentDateLabel();
                break;
            }

            case 'family': {
                if (appState.families.isDirty || !appState.families.data) {
                    const res = await fetch('http://localhost:8080/get_families');
                    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                    appState.families.data = await res.json();
                    appState.families.isDirty = false;
                }

                const families = appState.families.data;
                if (typeof showAllFamilies === 'function') showAllFamilies(families);
                break;
            }

            case 'child': {
                if (appState.children.isDirty || !appState.children.data) {
                    const res = await fetch('http://localhost:8080/get_children_family');
                    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                    appState.children.data = await res.json();
                    appState.children.isDirty = false;
                }

                const children = appState.children.data;
                if (typeof showAllChildren === 'function') showAllChildren(children);
                break;
            }

            case 'card': {
                if (!appState.cardsByMonth[month] || appState.cardsByMonth[month].isDirty) {
                    const res = await fetch(`http://localhost:8080/get_all_families_active_by_month?month=${month}`);
                    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                    appState.cardsByMonth[month] = { data: await res.json(), isDirty: false };
                }

                const cards = appState.cardsByMonth[month].data;
                if (typeof generateCards === 'function') generateCards(cards);
                break;
            }
        }

    } catch (error) {
        console.error("Error during navigation:", error);
        viewport.innerHTML = `
            <div class="container py-4">
                <div class="alert alert-danger shadow-sm rounded-3" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    An error occurred while loading content. Please check if the backend server is running.
                </div>
            </div>`;
    }
}

function onFamilyDataChanged() {
    appState.families.isDirty = true;
    appState.children.isDirty = true;
    appState.cardsByMonth = {};
    appState.donationsByMonth = {};
}

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('donation');
});