fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            .then(response => response.json())
            .then(data => {
                userData = data;
                renderTable(1);
            })
            .catch(error => console.error('Error fetching data:', error));

        let userData = [];

        const pageSize = 10;

        const selectedRows = new Set();

        function renderTable(page) {

            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const tableBody = document.getElementById('userTableBody');
            tableBody.innerHTML = '';

            for (let i = startIndex; i < endIndex && i < userData.length; i++) {
                const user = userData[i];

                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td> <input type="checkbox" onclick="toggleRowSelection(${user.id})" ${selectedRows.has(user.id) ? 'checked' : ''}></td>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn edit-btn" onclick="editRow(${user.id})">Edit</button>
                    <button class="btn delete-btn" onclick="deleteRow(${user.id})">Delete</button>
                    <button class="btn save-btn" onclick="saveRow(${user.id})" style="display: none;">Save</button>
                    <button class="btn cancel-btn" onclick="cancelEdit(${user.id})" style="display: none;">Cancel</button>
                </td>
            `;

                tableBody.appendChild(tr);
            }

            updatePagination(page);
        }

        function updatePagination(currentPage) {
            document.getElementById('currentPage').innerText = currentPage;
        }

        function goToPage(page) {
            renderTable(page);
        }

        function goToPreviousPage() {
            const currentPage = parseInt(document.getElementById('currentPage').innerText);
            if (currentPage > 1) {
                renderTable(currentPage - 1);
            }
        }

        function goToNextPage() {
            const currentPage = parseInt(document.getElementById('currentPage').innerText);
            if (currentPage < (userData.length / pageSize)) {
                renderTable(currentPage + 1);
            }

        }

        function toggleRowSelection(userId) {
            selectedRows.has(userId) ? selectedRows.delete(userId) : selectedRows.add(userId);
            console.log(userId);
        }

        function toggleSelectAll() {
            const checkboxes = document.querySelectorAll('#userTableBody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
                toggleRowSelection(parseInt(checkbox.parentElement.nextElementSibling.innerText));
            });
        }

        function deleteSelected() {
            selectedRows.forEach(userId => {
                const tr = document.querySelector(`#userTableBody tr:nth-child(${userId})`);
                tr.remove();
            });

            selectedRows.clear();
        }

        function performSearch() {
            const searchInput = document.getElementById('search').value.toLowerCase();
            const filteredData = userData.filter(user =>
                user.name.toLowerCase().includes(searchInput) ||
                user.email.toLowerCase().includes(searchInput)
            );

            userData = filteredData;

            renderTable(1);
        }

        function editRow(userId) {
            const tr = document.querySelector(`#userTableBody tr:nth-child(${userId})`);
            tr.classList.add('selected');

            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            const saveBtn = tr.querySelector('.save-btn');
            const cancelBtn = tr.querySelector('.cancel-btn');

            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';

            tr.querySelectorAll('td:not(:first-child):not(:last-child)').forEach(td => {
                const originalValue = td.innerText;
                td.innerHTML = `<input type="text" value="${originalValue}">`;
            });

        }

        function deleteRow(userId) {
            const tr = document.querySelector(`#userTableBody tr:nth-child(${userId})`);
            tr.remove();

            selectedRows.delete(userId);
        }

        function saveRow(userId) {
            const tr = document.querySelector(`#userTableBody tr:nth-child(${userId})`);
            tr.classList.remove('selected');

            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            const saveBtn = tr.querySelector('.save-btn');
            const cancelBtn = tr.querySelector('.cancel-btn');

            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';

            tr.querySelectorAll('td:not(:first-child)').forEach(td => {
                const editedValue = td.querySelector('input').value;
                td.innerText = editedValue;
            });
        }

        function cancelEdit(userId) {
            const tr = document.querySelector(`#userTableBody tr:nth-child(${userId})`);
            tr.classList.remove('selected');

            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            const saveBtn = tr.querySelector('.save-btn');
            const cancelBtn = tr.querySelector('.cancel-btn');

            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }