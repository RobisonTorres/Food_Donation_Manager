function displayForm(event) {
    closeFormUpdate(event);
    const form = document.getElementById('popForm');
    if (form) form.style.display = 'block';
}

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

function displayFormUpdate() {
    closeForm();
    const form = document.getElementById('popFormUpdate');
    if (form) form.style.display = 'block';
}

function closeFormUpdate(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('popFormUpdate');
    if (form) {
        form.scrollTop = 0;
        form.style.display = 'none';
    }
}

async function displayFormUpdateChildren() {
    const form = document.getElementById('popFormUpdateChildren');
    const familyId = Number(document.getElementById('familyId').value);
    if (form) form.style.display = 'block';
    await updateChildren(familyId);
}

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
    if (numberInactiveFamilies) numberInactiveFamilies.innerHTML = data.length - count;

    setupFamilySearch();
}

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

function addFamily(event) {
    event.preventDefault();
    const children = [];
    document.querySelectorAll('.child-item').forEach(child => {
        const name = child.querySelector('.child-name').value.trim();
        const birthDate = child.querySelector('.child-birth').value;

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
            <input type="date" class="form-control ${birthClass}">
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
                <input type="date" class="form-control child-birth-update" value="${child.birthDate}">
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

function updateChildrenAll(event) {
    event.preventDefault();
    const id = document.getElementById("familyIdChildrenUpdate").value;

    const childrenUpdate = [];
    document.querySelectorAll('.child-update-item').forEach(child => {
        const name = child.querySelector('.child-name-update').value.trim();
        const birthDate = child.querySelector('.child-birth-update').value;

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