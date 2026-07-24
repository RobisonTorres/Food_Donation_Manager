/**
* Renders a table row in the DOM for an active child eligible to receive a toy.
*/
async function showAllChildren(children) {
    const container = document.getElementById('showAllChildren');
    if (!container) return;
    
    container.innerHTML = '';

    const childrenCountElement = document.getElementById('active-children');
    let activeChildrenTotal = 0;
    let count = 1;

    children.forEach(family => {
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
}

/**
* Uses an HTML template to clone and populate a table row with child and family data.
*/
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

/**
* Calculates a child's age in years from their birth date.
*/
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