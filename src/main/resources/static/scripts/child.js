async function showAllChildren() {
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
        const childrenCountElement = document.getElementById('active-children');
        let activeChildrenTotal = 0;
        let count = 1;

        families.forEach(family => {
            if (family.childList && family.childList.length > 0) {
                family.childList.forEach(child => {
                    container.appendChild(createChildRow(family, child, count));
                    activeChildrenTotal++;
                    count++;
                });
            }
        });

        if (childrenCountElement) {
            childrenCountElement.innerHTML = activeChildrenTotal;
        }

        if (activeChildrenTotal === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4 fw-medium">No registered children found.</td></tr>';
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4 fw-medium">Error loading Children.</td></tr>';
    }
}

function createChildRow(family, child, count) {

    const template = document.getElementById('family-child-row-template');
    const clone = template.content.cloneNode(true);
    let age = typeof calculateAge === 'function' ? calculateAge(child.birthDate) : 'N/A';

    clone.querySelector('.child-number').textContent = count;
    clone.querySelector('.child-name').textContent = child.name ?? 'N/A';
    clone.querySelector('.child-age').textContent = `${age} yrs`;
    clone.querySelector('.family-name').textContent = family.familyName ?? 'N/A';
    clone.querySelector('.family-phone').textContent = family.phone ?? 'N/A';
    clone.querySelector('.family-address').textContent = family.familyAddress ?? 'N/A';

    return clone;
}

function formatDate(dateString) {

    if (!dateString) return '';
    const birthDate = new Date(dateString)
    birthDate.setDate(birthDate.getDate() + 1);
    const day = String(birthDate.getDate()).padStart(2, "0")
    const month = String(birthDate.getMonth() + 1).padStart(2, "0"); 
    const year = birthDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function calculateAge(birthDateString) {

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