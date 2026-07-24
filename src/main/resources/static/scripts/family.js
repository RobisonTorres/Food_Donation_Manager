/**
 * Displays the modal form for creating a new family.
 * Closes the update form prior to opening if active.
 * 
 * @param {Event} [event] - Optional trigger event.
 */
function displayForm(event) {
    closeFormUpdate(event);
    const form = document.getElementById('popForm');
    if (form) form.style.display = 'block';
}

/**
 * Closes the family creation modal form, resets its scroll position,
 * and clears dynamically appended children fields.
 * 
 * @param {Event} [event] - Optional trigger event to prevent default behavior.
 */
function closeForm(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('popForm');
    if (form) {
        form.scrollTop = 0;
        form.style.display = 'none';
    }
    const container = document.getElementById('childrenContainer');
    if (container) container.innerHTML = '';
}

/**
 * Displays the modal form for editing family details.
 * Closes the creation form prior to opening if active.
 */
function displayFormUpdate() {
    closeForm();
    const form = document.getElementById('popFormUpdate');
    if (form) form.style.display = 'block';
}

/**
 * Closes the family update modal form and resets its scroll position.
 * 
 * @param {Event} [event] - Optional trigger event to prevent default behavior.
 */
function closeFormUpdate(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('popFormUpdate');
    if (form) {
        form.scrollTop = 0;
        form.style.display = 'none';
    }
}

/**
 * Displays the children update modal form for a specific family
 * and initiates fetching their current registered children.
 */
async function displayFormUpdateChildren() {
    const form = document.getElementById('popFormUpdateChildren');
    const familyId = Number(document.getElementById('familyId').value);
    if (form) form.style.display = 'block';
    await updateChildren(familyId);
}

/**
 * Closes the children update modal form, resets scroll position,
 * and clears the child input list container.
 * 
 * @param {Event} [event] - Optional trigger event.
 */
function closeFormUpdateChild(event) {
    closeFormUpdate();
    const form = document.getElementById('popFormUpdateChildren');
    if (form) {
        form.scrollTop = 0;
        form.style.display = 'none';
    }
    const container = document.getElementById("childrenContainerUpdate");
    if (container) container.innerHTML = "";
}

/**
 * Renders all family cards into the DOM sorted by active status and name,
 * and updates overall, active, and inactive counter metrics.
 * 
 * @param {Array<Object>} data - List of family records retrieved from the backend.
 */
async function showAllFamilies(data) {
    const container = document.getElementById('showAllFamilies');
    const numberFamily = document.getElementById('totalFamilies');
    let numberActiveFamilies = document.getElementById('totalActiveFamilies');
    let numberInactiveFamilies = document.getElementById('totalInactiveFamilies');

    if (!container) return;
    container.innerHTML = '';

    if (numberFamily) numberFamily.innerHTML = data.length;
    let count = 0;

    data.sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === "YES" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });

    data.forEach(family => {
        container.appendChild(createFamilyCard(family));
        if (family.status === "YES") {
            count += 1;
        }
    });

    if (numberActiveFamilies) numberActiveFamilies.innerHTML = count;
    if (numberInactiveFamilies) numberInactiveFamilies.innerHTML = count ? data.length - count : 0;

    setupFamilySearch();
}

/**
 * Creates and populates a family card DOM fragment using an HTML template.
 * Sets up action buttons for edit and delete operations.
 * 
 * @param {Object} family - Family data object.
 * @returns {DocumentFragment} Cloned HTML template populated with family details.
 */
function createFamilyCard(family) {
    const template = document.getElementById('family-card-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.family-name').textContent = family.name;
    clone.querySelector('.family-address').textContent = family.address;
    clone.querySelector('.family-neighborhood').textContent = family.neighborhood;
    clone.querySelector('.family-phone').textContent = family.phone;

    family.residents = (Number(family.men) || 0) + (Number(family.women) || 0) + (Number(family.children) || 0);
    clone.querySelector('.family-residents').textContent = family.residents;

    const statusEl = clone.querySelector('.family-status');
    statusEl.textContent = family.status === "YES" ? "Active" : "Inactive";
    statusEl.classList.add(family.status === "YES" ? "bg-success-subtle" : "bg-danger-subtle");
    statusEl.classList.add(family.status === "YES" ? "text-success" : "text-danger");

    const editBtn = clone.querySelector('.btn-edit');
    editBtn.addEventListener('click', () => editFamilyLoad(family.id));

    const deleteBtn = clone.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteFamily(family.id));

    return clone;
}

/**
 * Handles family creation form submission.
 * Collects form inputs, builds the DTO, and dispatches a POST request to the API.
 * 
 * @param {Event} event - Submit event from form.
 */
function addFamily(event) {
    event.preventDefault();
    const children = [];
    document.querySelectorAll('.child-item').forEach(child => {
        const name = child.querySelector('.child-name').value.trim();
        const birthDate = formatDate(child.querySelector('.child-birth').value, true);

        if (name && birthDate) {
            children.push({ name, birthDate });
        }
    });

    const family = {
        name: document.getElementById('name').value.trim(),
        address: document.getElementById('address').value.trim(),
        neighborhood: document.getElementById('neighborhood').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        men: parseInt(document.getElementById('men').value) || 0,
        women: parseInt(document.getElementById('women').value) || 0,
        children: children.length,
        status: document.getElementById('status').value.trim(),
    };

    if (!family.name || !family.address || !family.neighborhood || !family.phone) {
        alert("Please fill in all required fields.");
        return;
    }

    const familyChildWrapperDto = {
        familyDto: family,
        childrenDto: children
    };

    fetch(`${API_BASE}/create_family`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyChildWrapperDto)
    })
    .then(response => {
        if (response.ok) {
            alert('Family created successfully!');
            document.getElementById('popForm').reset();
            onFamilyDataChanged();
            closeForm();
        } else {
            alert('Failed to create family.');
        }
    })
    .catch(error => {
        console.error(error);
        alert('Error creating family.');
    });
}

/**
 * Fetches family data by ID from backend and populates the update modal form inputs.
 * 
 * @param {number|string} id - The family ID to load.
 */
async function editFamilyLoad(id) {
    displayFormUpdate();

    await fetch(`${API_BASE}/get_family/${id}`)
        .then(response => response.json())
        .then(family => {
            document.getElementById('familyId').value = family.id;
            document.getElementById('nameUpdate').value = family.name;
            document.getElementById('addressUpdate').value = family.address;
            document.getElementById('neighborhoodUpdate').value = family.neighborhood;
            document.getElementById('phoneUpdate').value = family.phone;
            document.getElementById('menUpdate').value = family.men;
            document.getElementById('womenUpdate').value = family.women;
            document.getElementById('childrenUpdate').value = family.children;
            document.getElementById('statusUpdate').value = family.status;
        })
        .catch(error => {
            console.error(error);
            alert("Error loading family.");
        });
}

/**
 * Handles family update form submission.
 * Gathers updated values and issues a PUT request to update family record.
 * 
 * @param {Event} event - Submit event from form.
 */
function updateFamily(event) {
    event.preventDefault();

    const family = {
        id: document.getElementById('familyId').value,
        name: document.getElementById('nameUpdate').value.trim(),
        address: document.getElementById('addressUpdate').value.trim(),
        neighborhood: document.getElementById('neighborhoodUpdate').value.trim(),
        phone: document.getElementById('phoneUpdate').value.trim(),
        men: parseInt(document.getElementById('menUpdate').value) || 0,
        women: parseInt(document.getElementById('womenUpdate').value) || 0,
        children: parseInt(document.getElementById('childrenUpdate').value) || 0,
        status: document.getElementById('statusUpdate').value.trim(),
    };

    if (!family.name || !family.address || !family.neighborhood || !family.phone) {
        alert("Please fill in all required fields.");
        return;
    }

    const familyChildWrapperDto = {
        familyDto: family,
        childrenDto: []
    };

    fetch(`${API_BASE}/update_family/${family.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyChildWrapperDto)
    })
    .then(response => {
        if (response.ok) {
            alert("Family updated successfully!");
            onFamilyDataChanged();
            closeFormUpdate();
        } else {
            alert("Failed to update family.");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Error updating family.");
    });
}

/**
 * Prompts user confirmation and dispatches a DELETE request to remove a family by ID.
 * 
 * @param {number|string} id - The unique identifier of the family to delete.
 */
function deleteFamily(id) {
    if (!confirm("Are you sure you want to delete this family?")) {
        return;
    }

    fetch(`${API_BASE}/delete_family/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert("Family deleted successfully.");
            onFamilyDataChanged();
        } else {
            alert("Failed to delete family.");
        }
    })
    .catch(error => console.error(error));
}

/**
 * Converts date strings between display format (DD/MM/YYYY) 
 * and database format (YYYY-MM-DD) without timezone distortion.
 * 
 * @param {string} dateString - Raw date string to be formatted.
 * @param {boolean} [toDB=false] - Converted to YYYY-MM-DD if true, DD/MM/YYYY if false.
 * @returns {string} Formatted date string or empty string if invalid.
 */
function formatDate(dateString, toDB = false) {
    if (!dateString) return '';
    
    if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        const formattedDay = day.padStart(2, "0");
        const formattedMonth = month.padStart(2, "0");
        return toDB ? `${year}-${formattedMonth}-${formattedDay}` : `${formattedDay}/${formattedMonth}/${year}`;
    }

    const cleanDate = dateString.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length !== 3) return dateString;

    const [year, month, day] = parts;
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");

    return toDB ? `${year}-${formattedMonth}-${formattedDay}` : `${formattedDay}/${formattedMonth}/${year}`;
}

/**
 * Dynamically appends a new child input row into the specified container table.
 * 
 * @param {string} item - DOM container ID where the child row will be added.
 */
function addChild(item) {
    const container = document.getElementById(item);
    if (!container) return;

    const row = document.createElement("tr");
    let rowClass = "child-item";
    let nameClass = "child-name";
    let birthClass = "child-birth";

    if (item === "childrenContainerUpdate") {
        rowClass = "child-update-item";
        nameClass = "child-name-update";
        birthClass = "child-birth-update";
    }

    row.className = rowClass;
    row.innerHTML = `
        <td>
            <input type="text" class="form-control ${nameClass}">
        </td>
        <td>
            <input type="date" placeholder="dd/mm/aaaa" class="form-control ${birthClass}">
        </td>
        <td class="text-center">
            <button
                type="button"
                class="btn btn-outline-danger btn-sm px-2"
                title="Remove child"
                onclick="this.closest('tr').remove()">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    container.appendChild(row);
}

/**
 * Fetches existing children for a given family and populates the child update form table.
 * 
 * @param {number|string} id - The family ID whose children are to be retrieved.
 */
async function updateChildren(id) {
    const container = document.getElementById("childrenContainerUpdate");
    container.innerHTML = "";
    document.getElementById('familyIdChildrenUpdate').value = id;

    const response = await fetch(`${API_BASE}/get_children_by_family/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    data.forEach(child => {
        const row = document.createElement("tr");
        row.className = "child-update-item";
        row.innerHTML = `
            <td>
                <input type="text" class="form-control child-name-update" value="${child.name}">
            </td>
            <td>
                <input type="date" class="form-control child-birth-update" value="${formatDate(child.birthDate)}">
            </td>
            <td class="text-center">
                <button
                    type="button"
                    class="btn btn-outline-danger btn-sm px-2"
                    title="Remove child"
                    onclick="this.closest('tr').remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        container.appendChild(row);
    });
}

/**
 * Submits updated children list for a family via PUT request to backend API.
 * 
 * @param {Event} event - Submit event from form.
 */
function updateChildrenAll(event) {
    event.preventDefault();
    const id = document.getElementById("familyIdChildrenUpdate").value;

    const childrenUpdate = [];
    document.querySelectorAll('.child-update-item').forEach(child => {
        const name = child.querySelector('.child-name-update').value.trim();
        const birthDate = formatDate(child.querySelector('.child-birth-update').value, true);

        if (name && birthDate) {
            childrenUpdate.push({ name, birthDate });
        }
    });

    const family = {
        id: document.getElementById('familyId').value,
        name: document.getElementById('nameUpdate').value.trim(),
        address: document.getElementById('addressUpdate').value.trim(),
        neighborhood: document.getElementById('neighborhoodUpdate').value.trim(),
        phone: document.getElementById('phoneUpdate').value.trim(),
        men: parseInt(document.getElementById('menUpdate').value) || 0,
        women: parseInt(document.getElementById('womenUpdate').value) || 0,
        children: parseInt(document.getElementById('childrenUpdate').value) || 0,
        status: document.getElementById('statusUpdate').value.trim(),
    };

    const familyChildWrapperDto = {
        familyDto: family,
        childrenDto: childrenUpdate
    };

    fetch(`${API_BASE}/update_children_by_family_id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyChildWrapperDto)
    })
    .then(response => {
        if (response.ok) {
            alert("Children updated successfully!");
            closeFormUpdateChild();
            closeFormUpdate();
            onFamilyDataChanged();
        } else {
            alert("Failed to update children.");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Error updating children.");
    });
}

/**
 * Attaches real-time filter event listener to family search input field.
 * Filters displayed family cards based on matched family names.
 */
function setupFamilySearch() {
    const search = document.querySelector('#searchFamily');
    const allFamilies = document.querySelector('#showAllFamilies');

    if (!search || !allFamilies) return;

    search.addEventListener('input', () => {
        const value = search.value.toLowerCase();
        const families = allFamilies.querySelectorAll('.family-data');

        families.forEach(family => {
            const info = family.querySelector('.family-name');
            if (info) {
                const familyName = info.textContent.toLowerCase();
                family.style.display = familyName.includes(value) ? '' : 'none';
            }
        });
    });
}