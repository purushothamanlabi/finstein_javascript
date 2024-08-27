
async function fetchData() {
    try {
        const response = await fetch('https://api.restful-api.dev/objects');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayData(data);
        console.log(data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

    

function displayData(data) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 
    console.log(data);

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.data && item.data.color ? item.data.color : 'Not mentioned '}</td>
            <td>
                <button class="edit-btn" data-id="${item.id}">Edit</button>
                
            </td>
            <td><button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>

                    `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', fetchData);

async function deleteItem(id) {
    // console.log(id);
    try {
        const response = await fetch(`https://api.restful-api.dev/objects/${id}`, {
            method: 'DELETE',
        });
        console.log("response",response);
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
        alert('Item deleted successfully');
        fetchData(); 
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item: ' + error.message);
    }
}

document.querySelector('tbody').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
       
            deleteItem(id);
        
    }
});

document.getElementById('addItemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const color = document.getElementById('color').value;
    const editId = this.dataset.editId;

    if (editId) {
        // If we're editing an existing item
        await updateItem(editId, name, color);
    } else {
        // If we're adding a new item
        await addNewItem(name, color);
    }

    // Reset form
    this.reset();
    document.querySelector('#addItemForm h2').textContent = 'Add New Item';
    document.querySelector('#addItemForm button').textContent = 'Add Item';
    delete this.dataset.editId;
});

async function addNewItem(name, color) {
    try {
        const response = await fetch('https://api.restful-api.dev/objects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                data: {
                    color: color
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add new item');
        }

        const result = await response.json();
        console.log('New item added:', result);
        alert('New item added successfully');
        
        // Add the new item to the table once
        const tbody = document.querySelector('tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${result.id}</td>
            <td>${result.name}</td>
            <td>${result.data.color}</td>
            <td><button class="edit-btn" data-id="${result.id}">Edit</button></td>
            <td><button class="delete-btn" data-id="${result.id}">Delete</button></td>
        `;
        tbody.appendChild(newRow);

    } catch (error) {
        console.error('Error adding new item:', error);
        alert('Failed to add new item: ' + error.message);
    }
}

// Function to handle edit button click
function handleEdit(event) {
    if (event.target.classList.contains('edit-btn')) {
        const row = event.target.closest('tr');
        const id = event.target.dataset.id;
        const name = row.cells[1].textContent;
        const color = row.cells[2].textContent;

        // Populate form with existing data
        document.getElementById('name').value = name;
        document.getElementById('color').value = color;

        // Change form text
        document.querySelector('#addItemForm h2').textContent = 'Edit Item';
        document.querySelector('#addItemForm button').textContent = 'Update Item';

        // Store the ID of the item being edited
        document.getElementById('addItemForm').dataset.editId = id;
    }
}

// Add event listener for edit buttons
document.querySelector('tbody').addEventListener('click', handleEdit);

async function updateItem(id, name, color) {
    console.log(id, name, color);
    try {
        const response = await fetch(`https://api.restful-api.dev/objects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                data: {
                    color: color
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update item');
        }

        const result = await response.json();
        console.log('Item updated:', result);
        alert('Item updated successfully');
        
        // Update the item in the table immediately
        const row = document.querySelector(`button.edit-btn[data-id="${id}"]`).closest('tr');
        if (row) {
            row.cells[1].textContent = name;
            row.cells[2].textContent = color;
        } else {
            console.warn(`Row with id ${id} not found`);
        }

    } catch (error) {
        console.error('Error updating item:', error);
        alert('Failed to update item: ' + error.message);
    }
}






// {
//     "id": "ff80818191937f84019193a3c64b008b",
//     "name": "asdasa",
//     "createdAt": "2024-08-27T11:41:09.580+00:00",
//     "data": {
//         "color": "sd"
//     }
// }

