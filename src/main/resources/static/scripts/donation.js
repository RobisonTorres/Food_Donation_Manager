/**
 * Displays the information modal/popup for the selected family.
 */
function displayInfo() {
    const form = document.getElementById('showFamily');
    if (form) form.style.display = 'block';
}

/**
 * Closes the information modal/popup and prevents default event actions.
 * 
 * @param {Event} [event] - The optional click or submit event.
 */
function closeInfo(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('showFamily');
    if (form) form.style.display = 'none';
}

/**
 * Gets the current system date formatted as DD/MM/YYYY.
 * 
 * @returns {string} The formatted date string.
 */
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Formats and updates the current date label in the DOM (e.g., "24 of july/26").
 */
function updateCurrentDateLabel() {
    const date = new Date();
    const today = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'long' }).toLowerCase();
    const year = date.getFullYear().toString().slice(-2);
    document.getElementById('date').innerText = `${today} of ${month}/${year}`;
}

/**
 * Populates the table DOM with family donation statuses for the current month 
 * and updates summary metrics.
 * 
 * @param {Array<Object>} donations - List of family donation status objects.
 */
async function showFamilyStatus(donations) {
    const tableBody = document.getElementById("familyTableNewBody");
    const template = document.getElementById("familyRowTemplate");

    tableBody.innerHTML = "";
    let totalDelivered = 0;

    donations.forEach((family, index) => {
        const clone = template.content.cloneNode(true);
        const id = family.familyId;
        const status = family.status ?? "PENDING";

        if (status === "DELIVERED") {
            totalDelivered++;
        }

        clone.querySelector(".family-number").textContent = index + 1;
        clone.querySelector(".family-id").id = id;
        clone.querySelector(".family-name").textContent = family.familyName;
        clone.querySelector(".family-delivery").textContent = family.delivery ?? "N/A";

        const select = clone.querySelector(".family-select");
        select.id = `family-select-${id}`;
        select.value = status;

        applySelectStyle(select);
        select.addEventListener("change", () => updateFamilyStatus(id));

        clone.querySelector(".family-info")
            .addEventListener("click", () => showFamilyInfo(id));

        tableBody.appendChild(clone);
    });

    document.getElementById("totalFamilies").textContent = donations.length;
    document.getElementById("totalDelivered").textContent = totalDelivered;
    document.getElementById("totalPending").textContent = donations.length - totalDelivered;
}

/**
 * Sends an API request to update a family's donation status for the current month 
 * and updates local cache and UI elements accordingly.
 * 
 * @param {number|string} familyId - The unique identifier of the family.
 */
function updateFamilyStatus(familyId) {
    const date = getCurrentDate();
    const month = currentMonth();
    const select = document.getElementById(`family-select-${familyId}`);
    const selectedStatus = select.value;

    let deliveryUpdate = selectedStatus === "DELIVERED" ? date : null;

    const familyDonationDto = {
        familyId: familyId,
        status: selectedStatus,
        delivery: deliveryUpdate
    };

    fetch(`${API_BASE}/update_donation?month=${month}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(familyDonationDto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error updating donation");
        }

        const url = `${API_BASE}/get_all_families_active_by_month?month=${month}`;
        if (appState.cache[url]) {
            appState.cache[url].then(data => {
                const family = data.find(f => f.familyId === familyId);
                if (family) {
                    family.status = selectedStatus;
                    family.delivery = deliveryUpdate;
                }
            });
        }

        updateDonationRow(familyId, selectedStatus, deliveryUpdate);
    })
    .catch(error => console.error(error));
}

/**
 * Dynamically applies Bootstrap contextual color classes to the status select element 
 * based on its current value.
 * 
 * @param {HTMLSelectElement} selectElement - The select DOM element to style.
 */
function applySelectStyle(selectElement) {
    if (!selectElement) return;

    selectElement.classList.remove(
        'bg-success-subtle', 'text-success', 'border-success-subtle',
        'bg-danger-subtle', 'text-danger', 'border-danger-subtle'
    );

    if (selectElement.value === "DELIVERED") {
        selectElement.classList.add('bg-success-subtle', 'text-success', 'border-success-subtle');
    } else {
        selectElement.classList.add('bg-danger-subtle', 'text-danger', 'border-danger-subtle');
    }
}

/**
 * Updates the donation row status and recalculates total delivered and pending counters in the DOM.
 * 
 * @param {number|string} id - The family ID corresponding to the row.
 * @param {string} status - The updated status ("DELIVERED" or pending).
 * @param {string} [delivery] - The updated delivery date text.
 */
function updateDonationRow(id, status, delivery) {
    const select = document.getElementById(`family-select-${id}`);
    if (!select) return;

    let currentDelivered = Number(document.getElementById("totalDelivered").textContent);
    let currentPending = Number(document.getElementById("totalPending").textContent);

    applySelectStyle(select);

    const row = select.closest("tr");
    if (row) {
        row.querySelector(".family-delivery").textContent = delivery ?? "N/A";
        if (status === "DELIVERED") {
            currentDelivered += 1;
            currentPending -= 1;
        } else {
            currentDelivered -= 1;
            currentPending += 1;
        }
    }

    document.getElementById("totalDelivered").textContent = currentDelivered;
    document.getElementById("totalPending").textContent = currentPending;
}

/**
 * Fetches detailed family information and donation history from the backend 
 * and populates the modal dialog.
 * 
 * @param {number|string} familyId - The unique identifier of the family.
 */
async function showFamilyInfo(familyId) {
    const resultContainer = document.getElementById('showFamily');
    resultContainer.innerHTML = '';

    const template = document.getElementById('info-template');
    const clone = template.content.cloneNode(true);

    try {
        const response = await fetch(
            `${API_BASE}/get_all_donation_by_family/${familyId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const data = await response.json();

        clone.querySelector('#family-name-show').textContent = data.name;
        clone.querySelector('#family-address-show').textContent = data.address;
        clone.querySelector('#family-neighborhood-show').textContent = data.neighborhood;
        clone.querySelector('#family-phone-show').textContent = data.phone;
        clone.querySelector('#family-residents-show').textContent = data.men + data.women + data.children;
        clone.querySelector('#family-men-show').textContent = data.men;
        clone.querySelector('#family-women-show').textContent = data.women;
        clone.querySelector('#family-children-show').textContent = data.children;

        populateTable(clone, data.donationList);

        resultContainer.appendChild(clone);
        displayInfo();
        
    } catch (error) {
        console.error(error);
        alert("Error loading donations.");
    }
}

/**
 * Populates the family modal table with the last 6 donation records.
 * 
 * @param {DocumentFragment} clone - The template clone fragment containing the table.
 * @param {Array<Object>} donationList - List of historical donation objects for the family.
 */
function populateTable(clone, donationList) {
    const table = clone.querySelector('#family-donation-show');
    if (!table) return;

    if (!donationList || donationList.length === 0) {
        table.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No donations</td></tr>`;
        return;
    }

    let rows = '';
    donationList.slice(-6).forEach(donation => {
        const date = new Date(donation.month);
        const month = date.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' }).toLowerCase();
        const deliveryDate = formatDeliveryDate(donation.delivery);

        rows += `
            <tr>
                <td>${month}</td>
                <td>${donation.status}</td>
                <td>${deliveryDate}</td>
            </tr>
        `;
    });

    table.innerHTML = rows;
}

/**
 * Formats raw backend delivery date strings into DD/MM/YY format using UTC getters.
 * 
 * @param {string|Date} delivery - Raw delivery date string from backend.
 * @returns {string} Formatted date string (DD/MM/YY) or 'N/A' if empty/invalid.
 */
function formatDeliveryDate(delivery) {
    if (!delivery) return 'N/A';

    const deliveryDay = new Date(delivery);
    if (isNaN(deliveryDay.getTime())) return 'N/A';

    const day = String(deliveryDay.getUTCDate()).padStart(2, '0');
    const month = String(deliveryDay.getUTCMonth() + 1).padStart(2, '0');
    const year = String(deliveryDay.getUTCFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
}