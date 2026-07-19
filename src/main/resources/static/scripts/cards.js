function currentMonth() {

    // This function returns the current month.
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `01/${month}/${year}`;
}

async function generateCards() {

    // This Function...
    let output = "";
    try {
        const month = currentMonth();
        const response =  await fetch(`http://localhost:8080/get_all_families_active_by_month?month=${month}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const families = await response.json();

        families.forEach(family => {
            output += `
                        <div class="col-6">
                            <div class="border rounded p-3 text-center fw-semibold">
                                ${family.familyName}
                            </div>
                        </div>
                        `;
        });

    } catch (error) {
        console.error(error);
        output = `<div 
                        class="col-12 text-center text-danger">Error loading families.
                   </div>`;
    }   
    document.getElementById('representatives').innerHTML = output;            
}

generateCards();