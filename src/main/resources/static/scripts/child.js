async function showAllChildren() {

    // This function
    const container = document.getElementById('showAllChildren');
    if (!container) return;
    container.innerHTML = '';

    try {
        const response = await fetch('http://localhost:8080/get_children_family', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) { throw new Error('Network response was not ok'); }

        const families = await response.json();
        const children = document.getElementById('active-children');
        let active = 0;
        families.forEach(family => {
            container.appendChild(createChildCard(family));
            active += family.childList.length;
        });

        children.innerHTML = active;

    } catch (error) {
        console.error(error);
        container.innerHTML =
            '<div class="col-12 text-center text-danger">Error loading Children.</div>';
    }
}

function createChildCard(family) {

    // This function
    const template = document.getElementById('family-child-card-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.family-name').textContent = family.familyName ?? 'N/A';
    clone.querySelector('.family-address').textContent = family.familyAddress ?? 'N/A';
    clone.querySelector('.family-phone').textContent = family.phone ?? 'N/A';

    const childList = clone.querySelector('.child-list');

    if (family.childList && family.childList.length > 0) {

        family.childList.forEach(child => {
            const li = document.createElement('li');
            let age = calculateAge(child.birthDate)
            
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>${child.name}</strong><br>
                    <small class="text-muted">
                        <i class="fas me-1"></i>
                        age ${age}
                    </small>
                </div>
            `;
            childList.appendChild(li);
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

    // This function...
    if (!dateString) return '';
    const birthDate = new Date(dateString)
    birthDate.setDate(birthDate.getDate() + 1);
    const day = String(birthDate.getDate()).padStart(2, "0")
    const month = String(birthDate.getMonth() + 1).padStart(2, "0"); 
    const year = birthDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function calculateAge(birthDateString) {

    // This function...
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

showAllChildren();