const btnCloseFormUpdate = document.getElementById('closeFormUpdate');
    if (btnCloseFormUpdate) btnCloseFormUpdate.addEventListener('click', closeForm);

function displayForm(event) {

    // This function...
    const form = document.getElementById('showFamily');
    form.style.display = 'block';
}

function closeForm(event) {

    // This function...
    if (event) event.preventDefault();
    const form = document.getElementById('showFamily');
    form.scrollTop = 0;
    form.style.display = 'none';
}

function currentMonth() {

    // This function returns the current month.
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `01/${month}/${year}`;
}

function getCurrentDate() {

    // This function returns the current date.
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

function updateCurrentDateLabel() {

    // This function populates the html element.
    const date = new Date();
    const today = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'long' }).toLowerCase();
    const year = date.getFullYear().toString().slice(-2)
    document.getElementById('date').innerText = `${today} de ${month}/${year}`;
}

async function showFamilyStatus() {

    // This function show all families with its current status of donation.
    const month = currentMonth();
    //const month = "01/08/2026"
    const response = await fetch(
      `http://localhost:8080/get_all_families_active_by_month?month=${month}`,
        {
            method: "GET",
            headers: {
                    "Content-Type": "application/json"
            }
        }
  );
    const data = await response.json();
    const tableBody = document.getElementById("familyTableNewBody");
    const template = document.getElementById("familyRowTemplate");
    tableBody.innerHTML = "";

    let totalFamilies = data.length;
    let totalDelivered = 0;
    let totalPending = 0;
    let count = 1;

    data.forEach(family => {
        const clone = template.content.cloneNode(true);
        const familyId = clone.querySelector(".family-id");
        const nameCell = clone.querySelector(".family-name");
        const deliveryCell = clone.querySelector(".family-delivery");
        const select = clone.querySelector(".family-select");
        const number = clone.querySelector(".family-number");
        const show = clone.querySelector(".family-info");

        const currentStatus = family.status ?? "PENDENT";

        if (currentStatus === "OK") {
        totalDelivered++;
        } else {
        totalPending++;
        }

        number.textContent = count;
        familyId.id = `${family.familyId}`;
        const familyIdShow = `${family.familyId}`;
        show.addEventListener("click", () => {showFamilyInfo(family.familyId)})
        nameCell.textContent = family.familyName;
        deliveryCell.textContent = family.delivery ?? "N/A";
        select.id = `family-select-${family.familyId}`;
        select.value = currentStatus;
        select.addEventListener("change", () => { updateFamilyStatus(Number(familyIdShow)); });
        tableBody.appendChild(clone);
        count += 1;
    });

    document.getElementById("totalFamilies").textContent = totalFamilies;
    document.getElementById("totalDelivered").textContent = totalDelivered;
    document.getElementById("totalPending").textContent = totalPending;
}

function updateFamilyStatus(familyId) {

    // This function update the donation status.
    const date = getCurrentDate();
    const month = currentMonth();
    const familyStatusSelect = document.getElementById(`family-select-${familyId}`);
    const selectedStatus = familyStatusSelect.value;
    let deliveryUpdate = null;

    if (selectedStatus === "OK") {
        deliveryUpdate = date;
    }

    const familyDonationDto = {
        familyId: familyId,
        status: selectedStatus,
        delivery: deliveryUpdate
    };

    fetch(
        `http://localhost:8080/update_donation?month=${month}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(familyDonationDto)
        }
    )
    .then(() => showFamilyStatus())
    .catch(error => console.error(error));
}

async function showFamilyInfo(familyId) {

    // This function...
    displayForm();
    const resultContainer = document.getElementById('showFamily');
    resultContainer.innerHTML = '';

    const template = document.getElementById('info-template');
    const clone = template.content.cloneNode(true);

    try {
        const response = await fetch(
            `http://localhost:8080/get_all_donation_by_family/${familyId}`,
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
        clone.querySelector('#family-residents-show').textContent =
            data.men + data.women + data.children;
        clone.querySelector('#family-men-show').textContent = data.men;
        clone.querySelector('#family-women-show').textContent = data.women;
        clone.querySelector('#family-children-show').textContent = data.children;

        populateTable(clone, data.donationList);

        resultContainer.appendChild(clone);

    } catch (error) {
        console.error(error);
        alert("Error loading donations.");
    }
}

function populateTable(clone, donationList) {

    // This function...
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

function formatDeliveryDate(delivery) {

    // This function...
    if (!delivery) return 'N/A';

    const deliveryDay = new Date(delivery);
    if (isNaN(deliveryDay.getTime())) return 'N/A';

    const day = String(deliveryDay.getUTCDate()).padStart(2, '0');
    const month = String(deliveryDay.getUTCMonth() + 1).padStart(2, '0');
    const year = String(deliveryDay.getUTCFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
}

showFamilyStatus();
updateCurrentDateLabel();