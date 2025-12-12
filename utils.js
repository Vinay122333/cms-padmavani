// --- Utility Functions ---

/**
 * Shows the global loading overlay.
 */
function showLoading() {
    loadingOverlay.classList.add('active');
}

/**
 * Hides the global loading overlay.
 */
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

/**
 * Displays a custom message box.
 * @param {string} title - The title of the message.
 * @param {string} message - The main message text.
 * @param {string} type - 'success', 'error', or 'info' to change icon/color.
 * @param {boolean} showCancel - Whether to show a cancel button (for confirmation).
 * @returns {Promise<boolean>} - Resolves with true if OK/Confirm is clicked, false if Cancel/outside click.
 */
function showMessageBox(title, message, type = 'info', showCancel = false) {
    messageBoxTitle.textContent = title;
    messageBoxText.textContent = message;

    // Set icon based on type
    messageBoxIcon.textContent = ''; // Clear existing icon
    messageBoxIcon.style.color = ''; // Reset color
    if (type === 'success') {
        messageBoxIcon.textContent = 'check_circle';
        messageBoxIcon.style.color = 'var(--success)';
    } else if (type === 'error') {
        messageBoxIcon.textContent = 'error';
        messageBoxIcon.style.color = 'var(--error)';
    } else {
        messageBoxIcon.textContent = 'info';
        messageBoxIcon.style.color = 'var(--info)';
    }

    // Handle actions for confirmation dialogs
    const messageBoxActions = document.createElement('div');
    messageBoxActions.classList.add('message-box-actions');
    messageBoxActions.innerHTML = `
        ${showCancel ? '<button class="btn btn-outline" id="messageBoxCancelBtn">Cancel</button>' : ''}
        <button class="btn btn-primary" id="messageBoxConfirmBtn">${showCancel ? 'Confirm' : 'OK'}</button>
    `;

    // Clear previous actions and append new ones
    const existingActions = messageBoxOverlay.querySelector('.message-box-actions');
    if (existingActions) {
        existingActions.remove();
    }
    messageBoxOverlay.querySelector('.message-box').appendChild(messageBoxActions);

    messageBoxOverlay.classList.add('active');

    return new Promise(resolve => {
        const confirmBtn = document.getElementById('messageBoxConfirmBtn');
        const cancelBtn = document.getElementById('messageBoxCancelBtn');

        const cleanup = () => {
            messageBoxOverlay.classList.remove('active');
            confirmBtn.removeEventListener('click', onConfirm);
            if (cancelBtn) cancelBtn.removeEventListener('click', onCancel);
            messageBoxOverlay.removeEventListener('click', onOverlayClick);
        };

        const onConfirm = () => {
            cleanup();
            resolve(true);
        };

        const onCancel = () => {
            cleanup();
            resolve(false);
        };

        const onOverlayClick = (e) => {
            if (e.target === messageBoxOverlay) {
                cleanup();
                resolve(false);
            }
        };

        confirmBtn.addEventListener('click', onConfirm);
        if (cancelBtn) cancelBtn.addEventListener('click', onCancel);
        messageBoxOverlay.addEventListener('click', onOverlayClick);
    });
}

// Close message box (for simple OK messages)
messageBoxOkBtn.addEventListener('click', () => {
    messageBoxOverlay.classList.remove('active');
});


/**
 * Fetches data from a given API endpoint.
 * @param {string} endpoint - The API endpoint (e.g., '/students').
 * @returns {Promise<Object|null>} - The JSON response data or null on error.
 */
async function fetchData(endpoint) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        showMessageBox('Error', `Failed to load data: ${error.message}`, 'error');
        return null;
    } finally {
        hideLoading();
    }
}

/**
 * Sends data to a given API endpoint.
 * @param {string} endpoint - The API endpoint.
 * @param {Object} data - The data to send.
 * @param {string} method - HTTP method (POST, PUT, DELETE).
 * @returns {Promise<Object|null>} - The JSON response data or null on error.
 */
async function sendData(endpoint, data, method = 'POST') {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error sending data to ${endpoint}:`, error);
        showMessageBox('Error', `Operation failed: ${error.message}`, 'error');
        return null;
    } finally {
        hideLoading();
    }
}

/**
 * Loads the attendance modal with students for the selected class/section.
 */
async function loadAttendanceModal() {
    attendanceModal.classList.add('active');
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    attendanceDateInput.value = today;
    await loadStudentsForAttendance();
}

/**
 * Loads students for attendance table based on filters.
 */
async function loadStudentsForAttendance() {
    const selectedClass = attendanceClassSelect.value;
    const selectedSection = attendanceSectionSelect.value;
    let endpoint = '/students-for-attendance';
    const params = new URLSearchParams();
    if (selectedClass) params.append('class', selectedClass);
    if (selectedSection) params.append('section', selectedSection);
    if (params.toString()) {
        endpoint += `?${params.toString()}`;
    }

    const students = await fetchData(endpoint);
    attendanceTableBody.innerHTML = ''; // Clear existing rows

    if (students && students.length > 0) {
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.section}</td>
                <td>
                    <select class="attendance-status" data-student-id="${student.student_id}" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                        <option value="full-present">Present</option>
                        <option value="full-absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="holiday">Holiday</option>
                        <option value="split">Split</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="attendance-reason" data-student-id="${student.student_id}" placeholder="Morning Status (e.g., Present)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd; width: 100%;">
                </td>
                <td>
                    <input type="text" class="attendance-reason" data-student-id="${student.student_id}" placeholder="Afternoon Status (e.g., Absent)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd; width: 100%;">
                </td>
                <td>
                    <input type="text" class="attendance-reason" data-student-id="${student.student_id}" placeholder="Reason (if absent/late)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd; width: 100%;">
                </td>
            `;
            attendanceTableBody.appendChild(row);
        });
    } else {
        attendanceTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: rgba(var(--on-surface), 0.6);">No students found for selected criteria.</td></tr>`;
    }
}

/**
 * Loads the record payment modal.
 */
async function loadRecordPaymentModal(studentId = '') {
    paymentForm.reset();
    paymentStudentIdInput.value = studentId;
    paymentDateInput.value = new Date().toISOString().split('T')[0]; // Set today's date
    recordPaymentModal.classList.add('active');
}

/**
 * Displays a receipt modal for fee payment.
 */
async function displayReceipt(feeRecord) {
    const schoolSettings = await fetchData('/settings'); // Fetch school details for receipt header
    const schoolName = schoolSettings ? schoolSettings.schoolName : 'Padmavani E/M High School';
    const schoolAddress = schoolSettings ? schoolSettings.schoolAddress : 'Vijaynagar colony, Tadipatri - 515411, Andhra Pradesh, India';

    const studentDetails = await fetchData(`/students/${feeRecord.student_id}`);
    const studentName = studentDetails ? studentDetails.name : 'N/A';
    const studentClass = studentDetails ? studentDetails.class : 'N/A';
    const studentSection = studentDetails ? studentDetails.section : 'N/A';
    const studentParent = studentDetails ? studentDetails.parent_name : 'N/A';

    receiptModalBody.innerHTML = `
        <div style="font-family: 'Roboto', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 550px; margin: auto;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: var(--primary-dark); margin-bottom: 5px;">${schoolName}</h2>
                <p style="font-size: 14px; color: rgba(var(--on-surface), 0.7);">${schoolAddress}</p>
                <h3 style="margin-top: 20px; color: var(--on-surface);">FEE PAYMENT RECEIPT</h3>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #ddd;">
                <div>
                    <p style="font-size: 14px; color: rgba(var(--on-surface), 0.8);"><strong>Receipt No:</strong> ${feeRecord.transaction_id}</p>
                    <p style="font-size: 14px; color: rgba(var(--on-surface), 0.8);"><strong>Date:</strong> ${new Date(feeRecord.payment_date).toLocaleDateString()}</p>
                </div>
                <div>
                    <p style="font-size: 14px; color: rgba(var(--on-surface), 0.8);"><strong>Payment Method:</strong> ${feeRecord.payment_method}</p>
                </div>
            </div>
            <div style="margin-bottom: 25px;">
                <p style="font-size: 15px; margin-bottom: 8px;"><strong>Received From:</strong> ${studentName} (ID: ${feeRecord.student_id})</p>
                <p style="font-size: 14px; color: rgba(var(--on-surface), 0.7);"><strong>Class:</strong> ${studentClass}, <strong>Section:</strong> ${studentSection}</p>
                <p style="font-size: 14px; color: rgba(var(--on-surface), 0.7);"><strong>Parent/Guardian:</strong> ${studentParent}</p>
            </div>
            <div style="margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: rgba(var(--primary-color), 0.08);">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd; color: var(--primary-color);">Description</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #ddd; color: var(--primary-color);">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; color: var(--on-surface);">${feeRecord.fee_type || 'General Fee Payment'} ${feeRecord.description ? `(${feeRecord.description})` : ''}</td>
                            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: var(--on-surface);">₹${parseFloat(feeRecord.transaction_amount).toLocaleString()}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style="background-color: rgba(var(--primary-color), 0.05);">
                            <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd; color: var(--on-surface);">Total Amount Paid:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd; color: var(--primary-dark);">₹${parseFloat(feeRecord.transaction_amount).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div style="text-align: center; font-size: 14px; color: rgba(var(--on-surface), 0.6);">
                <p>Thank you for your payment.</p>
                <p style="margin-top: 15px;">_________________________</p>
                <p>Authorized Signature</p>
            </div>
        </div>
    `;
    receiptModal.classList.add('active');
}
