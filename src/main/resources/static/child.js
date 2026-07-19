async function showAllFamilies() {
    const container = document.getElementById('showAllFamilies');
    if (!container) return;

    container.innerHTML = '';

    try {
        const response = await fetch('http://localhost:8080/get_children_family', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const families = await response.json();

        const children = document.getElementById('active-children');
        let active = 0;
        //let count = 0;  

        families.forEach(family => {
            container.appendChild(createFamilyCard(family));
            active += family.childList.length;
            //count += 1
        });

        children.innerHTML = active;

    } catch (error) {
        console.error(error);
        container.innerHTML =
            '<div class="col-12 text-center text-danger">Error loading families.</div>';
    }
}

let count = 0

function createFamilyCard(family) {

    const template = document.getElementById('family-child-card-template');
    const clone = template.content.cloneNode(true);

    //let count = 0;

    clone.querySelector('.family-name').textContent =
        family.familyName ?? 'N/A';

    clone.querySelector('.family-address').textContent =
        family.familyAddress ?? 'N/A';

    clone.querySelector('.family-phone').textContent =
        family.phone ?? 'N/A';

    const childList = clone.querySelector('.child-list');

    if (family.childList && family.childList.length > 0) {

        family.childList.forEach(child => {
            count += 1
            const li = document.createElement('li');
            let age = calculateAge(child.birthDate)
            console.log(age);
            li.className =
                'list-group-item d-flex justify-content-between align-items-center';

            li.innerHTML = `
                <div>
                    <p>${count}</p>
                    <strong>${child.name}</strong><br>
                    <small class="text-muted">
                        <i class="fas fa-cake-candles me-1"></i>
                        ${formatDate(child.birthDate)}
                        age ${age}
                    </small>
                </div>
            `;
            //count += 1;
            childList.appendChild(li);
            //console.log(family.childList.length)

        });

    } else {

        const li = document.createElement('li');
        li.className = 'list-group-item text-center text-muted';
        li.textContent = 'No registered children';

        childList.appendChild(li);
    }

    return clone;
}

function formatDate(dateString) {

    if (!dateString) return '';
    const birthDate = new Date(dateString) //.toLocaleDateString('pt-BR') + 30;
    birthDate.setDate(birthDate.getDate() + 1);
    const day = String(birthDate.getDate()).padStart(2, "0")
    const month = String(birthDate.getMonth() + 1).padStart(2, "0"); 
    const year = birthDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function calculateAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);

    // Initial year difference
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Check if the birthday has not happened yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

showAllFamilies();