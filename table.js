// --- Dynamic Page Rendering Core Logic ---
const contentArea = document.getElementById('contentArea');

/**
 * Renders a generic table for list-based data.
 * @param {Array<Object>} data - Array of objects to display.
 * @param {Array<Object>} columns - Array of column definitions: [{ header: 'Header', field: 'fieldName', render: (value) => value }]
 * @param {string} tableId - ID for the table element.
 * @param {string} paginationId - ID for the pagination controls container.
 */
function renderTable(data, columns, tableId, paginationId) {
    currentPageData = data; // Store raw data for filtering/sorting
    currentTableColumns = columns; // Store column definitions

    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = `
        <div style="overflow-x: auto;">
            <table class="data-table" id="${tableId}">
                <thead>
                    <tr>
                        ${columns.map(col => `
                            <th data-field="${col.field}" ${col.sortable ? 'class="sortable"' : ''}>
                                ${col.header}
                                ${col.sortable ? `<span class="material-icons sort-icon" id="sort-icon-${col.field}">unfold_more</span>` : ''}
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <!-- Data will be inserted here by updateTableRows -->
                </tbody>
            </table>
        </div>
        <div class="pagination-controls" id="${paginationId}">
            <button id="prevPageBtn">Previous</button>
            <span id="pageInfo">Page 1 of 1</span>
            <button id="nextPageBtn">Next</button>
        </div>
    `;
    return tableContainer;
}

/**
 * Updates table rows based on current filters, search, sort, and pagination.
 * @param {Array<Object>} rawData - The complete, unfiltered data.
 * @param {Array<Object>} columns - Column definitions.
 * @param {string} tableId - ID of the table body to update.
 * @param {string} paginationId - ID of the pagination controls container.
 * @param {Object} filters - Current filter values.
 * @param {string} searchTerm - Current search term.
 */
function updateTableRows(rawData, columns, tableId, paginationId, filters = {}, searchTerm = '') {
    let filteredData = [...rawData];

    // Apply filters
    if (filters) {
        filteredData = filteredData.filter(row => {
            let match = true;
            for (const key in filters) {
                const filterValue = filters[key];
                if (filterValue && row[key] !== undefined) {
                    if (key.includes('_date_start')) { // Handle date range start filters
                        const rowDate = new Date(row[key.replace('_date_start', '')]);
                        if (rowDate < new Date(filterValue)) {
                            match = false;
                            break;
                        }
                    } else if (key.includes('_date_end')) { // Handle date range end filters
                        const rowDate = new Date(row[key.replace('_date_end', '')]);
                        if (rowDate > new Date(filterValue)) {
                            match = false;
                            break;
                        }
                    } else if (String(row[key]).toLowerCase() !== String(filterValue).toLowerCase()) {
                        match = false;
                        break;
                    }
                }
            }
            return match;
        });
    }

    // Apply global search
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredData = filteredData.filter(row => {
            return columns.some(col => {
                const value = row[col.field];
                return value !== undefined && String(value).toLowerCase().includes(lowerCaseSearchTerm);
            });
        });
    }

    // Apply sorting
    if (currentSortColumn) {
        filteredData.sort((a, b) => {
            const valA = a[currentSortColumn];
            const valB = b[currentSortColumn];

            if (typeof valA === 'string' && typeof valB === 'string') {
                return currentSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return currentSortDirection === 'asc' ? valA - valB : valB - valA;
            }
            // Fallback for other types or mixed types
            return 0;
        });
    }


    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) return; // Ensure table body exists

    tableBody.innerHTML = ''; // Clear existing rows

    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; color: rgba(var(--on-surface), 0.6); padding: 20px;">No data found.</td></tr>`;
    } else {
        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = columns.map(col => `<td>${col.render ? col.render(row[col.field], row) : (row[col.field] !== undefined ? row[col.field] : '')}</td>`).join('');
            tableBody.appendChild(tr);
        });
    }

    // Update pagination controls
    const prevBtn = document.querySelector(`#${paginationId} #prevPageBtn`);
    const nextBtn = document.querySelector(`#${paginationId} #nextPageBtn`);
    const pageInfo = document.querySelector(`#${paginationId} #pageInfo`);

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    if (pageInfo) pageInfo.textContent = `Page ${totalPages === 0 ? 0 : currentPage} of ${totalPages}`;

    // Re-attach sort listeners to new headers
    document.querySelectorAll(`#${tableId} th.sortable`).forEach(header => {
        header.removeEventListener('click', handleSortClick); // Remove old listener
        header.addEventListener('click', handleSortClick); // Add new listener
        const field = header.dataset.field;
        const icon = header.querySelector('.sort-icon');
        if (icon) {
            if (field === currentSortColumn) {
                icon.textContent = currentSortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
            } else {
                icon.textContent = 'unfold_more';
            }
        }
    });
}

/**
 * Handles sorting when a table header is clicked.
 * @param {Event} event - The click event.
 */
function handleSortClick(event) {
    const columnField = event.currentTarget.dataset.field;
    if (currentSortColumn === columnField) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = columnField;
        currentSortDirection = 'asc';
    }
    // Re-render the current page with new sort order
    updateTableRows(currentPageData, currentTableColumns, `${activePage}-table`, `${activePage}-pagination`, getActiveFilters(), globalSearchBar.value);
}

/**
 * Gets the currently active filters from the UI.
 * This function needs to be customized for each page's filters.
 */
function getActiveFilters() {
    const filters = {};
    // Helper to get value from element if it exists and has a value
    const getFilterValue = (id) => {
        const el = document.getElementById(id);
        return el && el.value ? el.value : '';
    };

    if (activePage === 'student-profiles') {
        filters.class = getFilterValue('studentClassFilter');
        filters.section = getFilterValue('studentSectionFilter');
        filters.gender = getFilterValue('studentGenderFilter');
    } else if (activePage === 'attendance-records') {
        filters.class = getFilterValue('attendanceRecordsClassFilter');
        filters.section = getFilterValue('attendanceRecordsSectionFilter');
        filters.status = getFilterValue('attendanceRecordsStatusFilter');
        filters.attendance_date_start = getFilterValue('attendanceRecordsStartDate');
        filters.attendance_date_end = getFilterValue('attendanceRecordsEndDate');
    } else if (activePage === 'leaves') {
        filters.student_id = getFilterValue('leavesStudentIdFilter');
        filters.status = getFilterValue('leavesStatusFilter');
        filters.start_date_start = getFilterValue('leavesStartDate');
        filters.end_date_end = getFilterValue('leavesEndDate');
    } else if (activePage === 'achievements') {
        filters.student_id = getFilterValue('achievementsStudentIdFilter');
        filters.class = getFilterValue('achievementsClassFilter');
        filters.section = getFilterValue('achievementsSectionFilter');
        filters.type = getFilterValue('achievementsTypeFilter');
        filters.date_start = getFilterValue('achievementsStartDate');
        filters.date_end = getFilterValue('achievementsEndDate');
    } else if (activePage === 'certificates') {
        filters.student_id = getFilterValue('certificatesStudentIdFilter');
        filters.class = getFilterValue('certificatesClassFilter');
        filters.section = getFilterValue('certificatesSectionFilter');
        filters.issuing_organization = getFilterValue('certificatesOrganizationFilter');
        filters.issue_date_start = getFilterValue('certificatesIssueStartDate');
        filters.issue_date_end = getFilterValue('certificatesIssueEndDate');
    } else if (activePage === 'exams') {
        filters.class = getFilterValue('examsClassFilter');
        filters.subject = getFilterValue('examsSubjectFilter');
        filters.exam_date_start = getFilterValue('examsStartDate');
        filters.exam_date_end = getFilterValue('examsEndDate');
    } else if (activePage === 'report-cards') {
        filters.student_id = getFilterValue('reportCardsStudentIdFilter');
        filters.class = getFilterValue('reportCardsClassFilter');
        filters.section = getFilterValue('reportCardsSectionFilter');
        filters.academic_year = getFilterValue('reportCardsAcademicYearFilter');
        filters.term_semester = getFilterValue('reportCardsTermFilter');
    } else if (activePage === 'daily-diary') {
        filters.class = getFilterValue('diaryClassFilter');
        filters.section = getFilterValue('diarySectionFilter');
        filters.subject = getFilterValue('diarySubjectFilter');
        filters.date_start = getFilterValue('diaryStartDate');
        filters.date_end = getFilterValue('diaryEndDate');
    } else if (activePage === 'study-materials') {
        filters.class = getFilterValue('studyMaterialClassFilter');
        filters.subject = getFilterValue('studyMaterialSubjectFilter');
    } else if (activePage === 'video-classes') {
        filters.class = getFilterValue('videoClassClassFilter');
        filters.subject = getFilterValue('videoClassSubjectFilter');
    } else if (activePage === 'class-timetables') {
        filters.class = getFilterValue('timetableClassFilter');
        filters.section = getFilterValue('timetableSectionFilter');
    } else if (activePage === 'fees') {
        filters.student_id = getFilterValue('feesStudentIdFilter');
        filters.status = getFilterValue('feesStatusFilter');
        filters.payment_method = getFilterValue('feesMethodFilter');
        filters.payment_date_start = getFilterValue('feesStartDate');
        filters.payment_date_end = getFilterValue('feesEndDate');
    } else if (activePage === 'orders') {
        filters.student_id = getFilterValue('ordersStudentIdFilter');
        filters.class = getFilterValue('ordersClassFilter');
        filters.section = getFilterValue('ordersSectionFilter');
        filters.type = getFilterValue('ordersTypeFilter');
        filters.item = getFilterValue('ordersItemFilter');
        filters.date_start = getFilterValue('ordersStartDate');
        filters.date_end = getFilterValue('ordersEndDate');
    } else if (activePage === 'announcements') {
        filters.student_id = getFilterValue('announcementsStudentIdFilter');
        filters.type = getFilterValue('announcementsTypeFilter');
        filters.is_common = getFilterValue('announcementsCommonFilter');
    } else if (activePage === 'feedback') {
        filters.category = getFilterValue('feedbackCategoryFilter');
    } else if (activePage === 'holidays') {
        filters.type = getFilterValue('holidaysTypeFilter');
        filters.date_start = getFilterValue('holidaysStartDate');
        filters.date_end = getFilterValue('holidaysEndDate');
    }
    return filters;
}

/**
 * Resets all filters for the current page.
 */
function resetFilters() {
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) {
        filterControls.querySelectorAll('select, input[type="text"], input[type="date"]').forEach(input => {
            input.value = '';
        });
    }
    globalSearchBar.value = ''; // Clear global search as well
    currentPage = 1; // Reset pagination
    currentSortColumn = null; // Reset sorting
    currentSortDirection = 'asc';
    // Re-render the table with no filters or search
    updateTableRows(currentPageData, currentTableColumns, `${activePage}-table`, `${activePage}-pagination`, {}, '');
}

/**
 * Attaches event listeners for view, edit, and delete buttons on a table.
 * @param {string} tableId - The ID of the table container.
 * @param {Array<Object>} rawData - The original data array for the table.
 * @param {Array<Object>} columns - The column definitions for the table.
 * @param {string} apiEndpoint - The base API endpoint for the table (e.g., '/students').
 */
function attachTableActionListeners(tableId, rawData, columns, apiEndpoint) {
    const tableContainer = document.getElementById(tableId).closest('div[id$="-table-container"]');
    if (!tableContainer) return;

    // Use event delegation for action buttons
    tableContainer.addEventListener('click', async (e) => {
        const target = e.target.closest('.action-btn');
        if (!target) return;

        const id = target.dataset.id;
        const table = target.dataset.table; // This is the table name, e.g., 'student_profile', 'attendance'
        const action = target.dataset.action; // New: for specific actions like 'view-receipt'

        // Helper to find item by dynamic primary key
        const findItem = (data, tableKey, itemId) => {
            return data.find(d => {
                if (tableKey === 'student_profile') return d.student_id === itemId;
                if (tableKey === 'attendance') return String(d.attendance_id) === itemId;
                if (tableKey === 'holidays') return d.date === itemId; // Holiday PK is date
                if (tableKey === 'report_cards') return d.report_id === itemId;
                if (tableKey === 'orders') return d.order_id === itemId;
                if (tableKey === 'fees') return String(d.id) === itemId; // Fees uses 'id'
                if (tableKey === 'notifications') return String(d.id) === itemId; // Announcements use 'id'
                if (tableKey === 'student_achievements') return String(d.id) === itemId; // Achievements use 'id'
                if (tableKey === 'certificates') return String(d.id) === itemId; // Certificates use 'id'
                if (tableKey === 'exams') return String(d.id) === itemId; // Exams use 'id'
                if (tableKey === 'diary') return String(d.id) === itemId; // Diary uses 'id'
                if (tableKey === 'study_materials') return String(d.id) === itemId; // Study materials use 'id'
                if (tableKey === 'video_classes') return String(d.id) === itemId; // Video classes use 'id'
                if (tableKey === 'class_timetables_links') return String(d.id) === itemId; // Timetables use 'id'
                if (tableKey === 'feedback') return String(d.id) === itemId; // Feedback uses 'id'
                return String(d.id) === itemId; // Default to 'id'
            });
        };

        if (target.classList.contains('view-btn')) {
            const item = findItem(rawData, table, id);
            if (item) {
                let detailsHtml = '<p><strong>Details:</strong></p>';
                for (const key in item) {
                    let value = item[key];
                    if (key.includes('_date') || (key === 'date' && table === 'holidays')) {
                        value = new Date(value).toLocaleDateString();
                    } else if (key.includes('_time')) {
                        value = value ? value.substring(0, 5) : 'N/A';
                    } else if (['transaction_amount', 'price', 'total_fee', 'fee_concession', 'current_due_amount', 'overall_amount_paid'].includes(key)) {
                        value = `₹${parseFloat(value).toLocaleString()}`;
                    } else if (Array.isArray(value)) {
                        value = value.join(', ');
                    } else if (typeof value === 'boolean') {
                        value = value ? 'Yes' : 'No';
                    }
                    detailsHtml += `<p><strong>${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong> ${value}</p>`;
                }
                viewStudentModalBody.innerHTML = detailsHtml;
                viewStudentModal.classList.add('active');
            } else {
                showMessageBox('Error', 'Item not found for details.', 'error');
            }
        } else if (action === 'view-receipt' && table === 'fees') {
            const feeRecord = findItem(rawData, table, id);
            if (feeRecord) {
                await displayReceipt(feeRecord);
            } else {
                showMessageBox('Error', 'Fee record not found for receipt.', 'error');
            }
        }
        else if (target.classList.contains('edit-btn')) {
            // This section is now handled by all-features-management.js
            // The showMessageBox call here is removed as all-features-management.js will handle the specific modal opening.
            // No explicit call needed here as the event delegation in all-features-management.js will catch it.
        } else if (target.classList.contains('delete-btn')) {
            const confirmDelete = await showMessageBox('Confirm Deletion', `Are you sure you want to delete this ${table.replace(/_/g, ' ')} record (ID: ${id})?`, 'error', true);

            if (confirmDelete) {
                const deleteEndpoint = `${apiEndpoint}/${id}`; // Use the ID directly
                const result = await sendData(deleteEndpoint, {}, 'DELETE');
                if (result && result.message && result.message.includes('deleted successfully')) {
                    showMessageBox('Success', `${table.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} deleted successfully!`, 'success');
                    renderPage(activePage); // Re-render the current page to refresh data
                }
            }
        }
    });
}


/**
 * Renders content for a specific page/tab.
 * @param {string} pageName - The identifier for the page.
 */
