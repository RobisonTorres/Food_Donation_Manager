/**
 * Base URL endpoint for the backend REST API.
 * @type {string}
 */
const API_BASE = 'http://localhost:8080';

/**
 * Returns the current month string formatted as "01/MM/YYYY".
 * 
 * @returns {string} Formatted month string.
 */
const currentMonth = () => `01/${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`;

/**
 * Generates API endpoint URL for active families by specific month.
 * 
 * @param {string} month - Month formatted as 01/MM/YYYY.
 * @returns {string} Endpoint URL.
 */
const getActiveFamiliesByMonth = (month) => `${API_BASE}/get_all_families_active_by_month?month=${month}`;

/**
 * Central application state store managing global routing and API cache.
 * @type {Object}
 */
const appState = {
    cache: {},
    currentRoute: 'donation',
    /**
     * Clears all cached response promises from the local store.
     */
    invalidate: () => appState.cache = {}
};

/**
 * Configuration mapping for application single-page routes,
 * templates, data endpoints, and component render callbacks.
 * @type {Object<string, Object>}
 */
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

/**
 * Handles client-side view navigation, asynchronous template fetching,
 * data caching, and dynamic view rendering in the primary viewport.
 * 
 * @param {string} pageKey - Registered route key name.
 * @param {string} [month=currentMonth()] - Selected target month for filtering.
 */
async function navigateTo(pageKey, month = currentMonth()) {
    const route = routes[pageKey];
    const viewport = document.getElementById('content-viewport');
    appState.currentRoute = pageKey;

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

/**
 * Triggers native browser print dialog, or issues a inter-process command code
 * if running embedded inside a JavaFX WebView environment.
 */
function hideAndPrint() {
    const isJavaFX = navigator.userAgent.includes("JavaFX");

    if (isJavaFX) {
        const activeRoute = appState.currentRoute || 'donation';
        const targetUrl = `${API_BASE}/?route=${activeRoute}&autoPrint=true`;
        alert("COMMAND:OPEN_BROWSER:" + targetUrl);
    } else {
        window.print();
    }
}

/**
 * Parses initial URL search parameters and routes the view accordingly,
 * configuring print mode and auto-close behaviors if invoked for printing.
 */
async function handleInitialRoute() {
    const urlParams = new URLSearchParams(window.location.search);
    const routeParam = urlParams.get('route');
    const autoPrint = urlParams.get('autoPrint') === 'true';

    if (routeParam && routes[routeParam]) {
        await navigateTo(routeParam);

        if (autoPrint) {
            document.body.classList.add('print-mode');

            setTimeout(() => {
                window.print();
            }, 1000);

            window.onafterprint = () => {
                window.close();
            };
        }
    } else {
        navigateTo('donation');
    }
}

/**
 * Invalidate internal state cache and re-navigates to the family management view 
 * following data modifications.
 */
function onFamilyDataChanged() { 
    appState.invalidate(); 
    navigateTo('family'); 
}

document.addEventListener('DOMContentLoaded', handleInitialRoute);