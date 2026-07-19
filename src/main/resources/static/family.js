document.addEventListener('DOMContentLoaded', () => {
    
    
    const btnAddNewFamily = document.getElementById('addNewFamily');
    if (btnAddNewFamily) btnAddNewFamily.addEventListener('click', displayForm);

    const btnCloseForm = document.getElementById('closeForm');
    if (btnCloseForm) btnCloseForm.addEventListener('click', closeForm);

    const btnCloseFormUpdate = document.getElementById('closeFormUpdate');
    if (btnCloseFormUpdate) btnCloseFormUpdate.addEventListener('click', closeFormUpdate);

    const btnCloseFormUpdateChildren = document.getElementById('closeFormUpdateChildren');
    if (btnCloseFormUpdateChildren) btnCloseFormUpdateChildren.addEventListener('click', closeFormUpdateChildren);

    const search = document.querySelector('#searchFamily');
    if (search) {
        search.addEventListener('input', () => {
            const value = search.value.toLowerCase();
            const allFamilies = document.querySelector('#showAllFamilies');
            
            if (allFamilies) {
                const families = allFamilies.querySelectorAll('.col-md-6');
                families.forEach(family => {
                    const info = family.querySelector('.family-name');
                    if (info) {
                        const familyName = info.textContent.toLowerCase();
                        family.style.display = familyName.includes(value) ? '' : 'none';
                    }
                });
            }
        });
    }


    const editBtn = document.querySelector('.btn-edit-children');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            
            const familyIdInput = document.getElementById('familyId');
            
            if (familyIdInput && familyIdInput.value) {
                updateChildren(familyIdInput.value);
            }
        });
    }


    orderFamilies();
});

function displayForm(event) {
    closeFormUpdate(event);
    const form = document.getElementById('popForm');
    form.style.display = 'block';
}

function closeForm(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('popForm');
    form.scrollTop = 0;
    form.style.display = 'none';
    const container = document.getElementById('childrenContainer');
    container.innerHTML = '';
}

function displayFormUpdate() {
    closeForm();
    const form = document.getElementById('popFormUpdate');
    form.style.display = 'block';
}

function closeFormUpdate(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('popFormUpdate');
    form.scrollTop = 0;
    form.style.display = 'none';
    orderFamilies();
}

function displayFormUpdateChildren() {
    //closeForm();
    const form = document.getElementById('popFormUpdateChildren');
    form.style.display = 'block';
}

function closeFormUpdateChildren(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('popFormUpdateChildren');
    form.scrollTop = 0;
    form.style.display = 'none';
    const container = document.getElementById("childrenContainerUpdate");
    //const row = document.createElement("tr");
    //row.className = "child-update-item";
    container.innerHTML = "";
}

async function showAllFamilies() {
    const container = document.getElementById('showAllFamilies');
    const numberFamily = document.getElementById('totalFamilies');
    if (!container) return;
    container.innerHTML = '';

    try {
        const response = await fetch('http://localhost:8080/get_families', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        numberFamily.innerHTML = data.length
        console.log(data.length)
        data.forEach(family => {
            container.appendChild(createFamilyCard(family));
        });
    } catch (error) {
        console.error('Error fetching families:', error);
        container.innerHTML = '<div class="col-12 text-center text-danger">Error loading families.</div>';
    }
}

function createFamilyCard(family) {
    const template = document.getElementById('family-card-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.family-name').textContent = family.name;
    clone.querySelector('.family-address').textContent = family.address;
    clone.querySelector('.family-neighborhood').textContent = family.neighborhood;
    clone.querySelector('.family-phone').textContent = family.phone;
    clone.querySelector('.family-residents').textContent = family.men + family.women + family.children;
    family.residents = family.men + family.women + family.children;
    clone.querySelector('.family-men').textContent = family.men;
    clone.querySelector('.family-women').textContent = family.women;
    clone.querySelector('.family-children').textContent = family.children;
    clone.querySelector('.family-status').textContent = family.status;

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
        //residents: parseInt(document.getElementById('residents').value) || 0,
        men: parseInt(document.getElementById('men').value) || 0,
        women: parseInt(document.getElementById('women').value) || 0,
        children: children.length,
        status: document.getElementById('status').value.trim(),
    };
    console.log(children.length)
    console.log(family)
    if (!family.name || !family.address || !family.neighborhood || !family.phone) {
        alert("Please fill in all required fields.");
        return;
    }
    

    const familyChildWrapperDto = {
        familyDto: family,
        childrenDto: children
    };

    fetch('http://localhost:8080/create_family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyChildWrapperDto)
    })
    .then(response => {
        if (response.ok) {
            alert('Family created successfully!');
            document.getElementById('popForm').reset();
            orderFamilies();
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

function editFamilyLoad(id) {
    
    displayFormUpdate();
    /*
    const editBtn = document.querySelector('.btn-edit-children');
    editBtn.addEventListener('click', () => updateChildren(id));
    */
    fetch(`http://localhost:8080/get_family/${id}`)
        .then(response => response.json())
        .then(family => {
            document.getElementById('familyId').value = family.id;
            document.getElementById('nameUpdate').value = family.name;
            document.getElementById('addressUpdate').value = family.address;
            document.getElementById('neighborhoodUpdate').value = family.neighborhood;
            document.getElementById('phoneUpdate').value = family.phone;
            //document.getElementById('residentsUpdate').value = family.residents;
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
        //residents: parseInt(document.getElementById('residentsUpdate').value) || 0,
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

    fetch(`http://localhost:8080/update_family/${family.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyChildWrapperDto)
    })
    .then(response => {
        if (response.ok) {
            alert("Family updated successfully!");
            orderFamilies();
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

    fetch(`http://localhost:8080/delete_family/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert("Family deleted successfully.");
            orderFamilies();
        } else {
            alert("Failed to delete family.");
        }
    })
    .catch(error => console.error(error));
}

async function orderFamilies() {
    await showAllFamilies();

    const allFamilies = document.querySelector('#showAllFamilies');
    const families = Array.from(allFamilies.querySelectorAll('.col-md-6'));

    families.sort((a, b) => {
    const statusA = a.querySelector('.family-status').textContent.trim().toLowerCase();
    const statusB = b.querySelector('.family-status').textContent.trim().toLowerCase();

    if (statusA !== statusB) {
        return statusA === 'yes' ? -1 : 1;
    }

    const nameA = a.querySelector('.family-name').textContent.trim().toLowerCase();
    const nameB = b.querySelector('.family-name').textContent.trim().toLowerCase();
    
    return nameA.localeCompare(nameB);
});

    allFamilies.innerHTML = '';
    families.forEach(family => allFamilies.appendChild(family));
}

function addChild(item) {
    const container = document.getElementById(item);
    if (!container) return; // Evita erros caso o container não exista na tela

    const row = document.createElement("tr");
    
    // Definimos as classes dos inputs dinamicamente com base no container
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
    displayFormUpdateChildren();
    
    // Limpa a tabela antes de carregar os filhos da nova família consultada
    const container = document.getElementById("childrenContainerUpdate");
    container.innerHTML = ""; 
    
    document.getElementById('familyIdChildrenUpdate').value = id;
    
    const response = await fetch(`http://localhost:8080/get_children_by_family/${id}`, {
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
        //residents: parseInt(document.getElementById('residentsUpdate').value) || 0,
        men: parseInt(document.getElementById('menUpdate').value) || 0,
        women: parseInt(document.getElementById('womenUpdate').value) || 0,
        children: parseInt(document.getElementById('childrenUpdate').value) || 0,
        status: document.getElementById('statusUpdate').value.trim(),
    };

    const familyChildWrapperDto = {
        familyDto: family,
        childrenDto: childrenUpdate
    };

    console.log(childrenUpdate)
    fetch(`http://localhost:8080/update_children_by_family_id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyChildWrapperDto)
    })
    .then(response => {
        if (response.ok) {
            alert("Family updated successfully!");
            //orderFamilies();
            //closeFormUpdate();
            closeFormUpdateChildren();
        } else {
            alert("Failed to update children.");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Error updating children.");
    });
}