function currentMonth() {

    // This function returns the current month.
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `01/${month}/${year}`;
}

function loadFamilies() {

    const month = currentMonth();
    fetch(`http://localhost:8080/get_all_families_active_by_month?month=${month}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        let output = ``;
        data.forEach(family => {
            output += `
<div class="col-6">
    <div class="border rounded p-3 text-center fw-semibold">
        ${family.familyName}
    </div>
</div>
`;
        });
        document.getElementById('representatives').innerHTML = output;
    })
}

loadFamilies();