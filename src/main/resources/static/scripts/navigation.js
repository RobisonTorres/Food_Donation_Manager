API_BASE = 'http://localhost:8080'

const currentMonth = () => `01/${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`;
const getActiveFamiliesByMonth = (month) => `${API_BASE}/get_all_families_active_by_month?month=${month}`;

const appState = {
    cache: {},
    invalidate: () => appState.cache = {}
};


const routes = {
    donation: {
        template: './templates/donation.html',
        endpoint: getActiveFamiliesByMonth,
        render: (data) => {
            typeof showFamilyStatus === 'function' && showFamilyStatus(data);
            typeof updateCurrentDateLabel === 'function' && updateCurrentDateLabel();
        }
    },
    card: {
        template: './templates/card.html',
        endpoint: getActiveFamiliesByMonth,
        render: (data) => typeof generateCards === 'function' && generateCards(data)
    },
    family: {
        template: './templates/family.html',
        endpoint: () => `${API_BASE}/get_families`,
        render: (data) => typeof showAllFamilies === 'function' && showAllFamilies(data)
    },
    child: {
        template: './templates/child.html',
        endpoint: () => `${API_BASE}/get_children_family`,
        render: (data) => typeof showAllChildren === 'function' && showAllChildren(data)
    }
};

async function navigateTo(pageKey, month = currentMonth()) {
    const route = routes[pageKey];
    const viewport = document.getElementById('content-viewport');

    try {
        const url = route.endpoint(month);

        if (!appState.cache[url]) {
            appState.cache[url] = fetch(url).then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`));
        }

        const [htmlResponse, data] = await Promise.all([
            fetch(route.template).then(r => r.text()),
            appState.cache[url]
        ]);

        viewport.innerHTML = htmlResponse;
        route.render(data);

    } catch (error) {
        console.error("Error:", error);
        viewport.innerHTML = `
            <div class="container py-4">
                <div class="alert alert-danger shadow-sm rounded-3" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                     An error has occurred.
                </div>
            </div>`;
    }
}

function hideAndPrint() {
    window.print();
}

function onFamilyDataChanged() { appState.invalidate(); navigateTo('family'); }
document.addEventListener('DOMContentLoaded', () => navigateTo('donation'));