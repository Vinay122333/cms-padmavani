// all-features-management.js
// This file centralizes the client-side logic for managing various entities
// in the School Management System, including adding, editing, viewing, and deleting records.

// --- DOM Elements ---
// Get references to modals and forms for all management sections.
// These elements are assumed to exist in index.html.

// Leaves Modals and Forms
const addLeaveModal = document.getElementById('addLeaveModal');
const addLeaveModalTitle = document.getElementById('addLeaveModalTitle');
const closeLeaveModalBtn = document.getElementById('closeLeaveModalBtn');
const cancelLeaveBtn = document.getElementById('cancelLeaveBtn');
const leaveForm = document.getElementById('leaveForm');
const saveLeaveBtn = document.getElementById('saveLeaveBtn');
const leaveStudentIdInput = document.getElementById('leaveStudentId');
const leaveTypeSelect = document.getElementById('leaveType');
const leaveStartDateInput = document.getElementById('leaveStartDate');
const leaveEndDateInput = document.getElementById('leaveEndDate');
const leaveReasonTextarea = document.getElementById('leaveReason');
const leaveStatusSelect = document.getElementById('leaveStatus');

// Achievement Modals and Forms
const addAchievementModal = document.getElementById('addAchievementModal');
const addAchievementModalTitle = document.getElementById('addAchievementModalTitle');
const closeAchievementModalBtn = document.getElementById('closeAchievementModalBtn');
const cancelAchievementBtn = document.getElementById('cancelAchievementBtn');
const achievementForm = document.getElementById('achievementForm');
const saveAchievementBtn = document.getElementById('saveAchievementBtn');
const achievementStudentIdInput = document.getElementById('achievementStudentId');
const achievementStudentNameInput = document.getElementById('achievementStudentName');
const achievementTitleInput = document.getElementById('achievementTitle');
const achievementDescriptionTextarea = document.getElementById('achievementDescription');
const achievementDateInput = document.getElementById('achievementDate');
const achievementTypeInput = document.getElementById('achievementType');
const achievementTagsInput = document.getElementById('achievementTags');

// Certificate Modals and Forms
const addCertificateModal = document.getElementById('addCertificateModal');
const addCertificateModalTitle = document.getElementById('addCertificateModalTitle');
const closeCertificateModalBtn = document.getElementById('closeCertificateModalBtn');
const cancelCertificateBtn = document.getElementById('cancelCertificateBtn');
const certificateForm = document.getElementById('certificateForm');
const saveCertificateBtn = document.getElementById('saveCertificateBtn');
const certificateStudentIdInput = document.getElementById('certificateStudentId');
const certificateTitleInput = document.getElementById('certificateTitle');
const certificateOrganizationInput = document.getElementById('certificateOrganization');
const certificateIssueDateInput = document.getElementById('certificateIssueDate');
const certificateUrlInput = document.getElementById('certificateUrl');

// Exam Modals and Forms
const addExamModal = document.getElementById('addExamModal');
const addExamModalTitle = document.getElementById('addExamModalTitle');
const closeExamModalBtn = document.getElementById('closeExamModalBtn');
const cancelExamBtn = document.getElementById('cancelExamBtn');
const examForm = document.getElementById('examForm');
const saveExamBtn = document.getElementById('saveExamBtn');
const examNameInput = document.getElementById('examName');
const examClassSelect = document.getElementById('examClass');
const examSectionSelect = document.getElementById('examSection');
const examSubjectInput = document.getElementById('examSubject');
const examTopicInput = document.getElementById('examTopic');
const examDateInput = document.getElementById('examDate');
const examTimeInput = document.getElementById('examTime');
const examRoomInput = document.getElementById('examRoom');
const examTotalMarksInput = document.getElementById('examTotalMarks');

// Report Card Modals and Forms
const addReportCardModal = document.getElementById('addReportCardModal');
const addReportCardModalTitle = document.getElementById('addReportCardModalTitle');
const closeReportCardModalBtn = document.getElementById('closeReportCardModalBtn');
const cancelReportCardBtn = document.getElementById('cancelReportCardBtn');
const reportCardForm = document.getElementById('reportCardForm');
const saveReportCardBtn = document.getElementById('saveReportCardBtn');
const reportCardStudentIdInput = document.getElementById('reportCardStudentId');
const reportCardAcademicYearInput = document.getElementById('reportCardAcademicYear');
const reportCardTermSemesterInput = document.getElementById('reportCardTermSemester');
const reportCardDateGeneratedInput = document.getElementById('reportCardDateGenerated');
const reportCardOverallPercentageInput = document.getElementById('reportCardOverallPercentage');
const reportCardOverallGradeInput = document.getElementById('reportCardOverallGrade');
const reportCardTeacherRemarksTextarea = document.getElementById('reportCardTeacherRemarks');

// Daily Diary Modals and Forms
const addDiaryModal = document.getElementById('addDiaryModal');
const addDiaryModalTitle = document.getElementById('addDiaryModalTitle');
const closeDiaryModalBtn = document.getElementById('closeDiaryModalBtn');
const cancelDiaryBtn = document.getElementById('cancelDiaryBtn');
const diaryForm = document.getElementById('diaryForm');
const saveDiaryBtn = document.getElementById('saveDiaryBtn');
const diaryDateInput = document.getElementById('diaryDate');
const diaryClassSelect = document.getElementById('diaryClass');
const diarySectionSelect = document.getElementById('diarySection');
const diarySubjectInput = document.getElementById('diarySubject');
const diaryContentTextarea = document.getElementById('diaryContent');

// Study Material Modals and Forms
const addStudyMaterialModal = document.getElementById('addStudyMaterialModal');
const addStudyMaterialModalTitle = document.getElementById('addStudyMaterialModalTitle');
const closeStudyMaterialModalBtn = document.getElementById('closeStudyMaterialModalBtn');
const cancelStudyMaterialBtn = document.getElementById('cancelStudyMaterialBtn');
const studyMaterialForm = document.getElementById('studyMaterialForm');
const saveStudyMaterialBtn = document.getElementById('saveStudyMaterialBtn');
const studyMaterialTitleInput = document.getElementById('studyMaterialTitle');
const studyMaterialClassSelect = document.getElementById('studyMaterialClass');
const studyMaterialSubjectInput = document.getElementById('studyMaterialSubject');
const studyMaterialFileUrlInput = document.getElementById('studyMaterialFileUrl');

// Video Class Modals and Forms
const addVideoClassModal = document.getElementById('addVideoClassModal');
const addVideoClassModalTitle = document.getElementById('addVideoClassModalTitle');
const closeVideoClassModalBtn = document.getElementById('closeVideoClassModalBtn');
const cancelVideoClassBtn = document.getElementById('cancelVideoClassBtn');
const videoClassForm = document.getElementById('videoClassForm');
const saveVideoClassBtn = document.getElementById('saveVideoClassBtn');
const videoClassTitleInput = document.getElementById('videoClassTitle');
const videoClassClassSelect = document.getElementById('videoClassClass');
const videoClassSubjectInput = document.getElementById('videoClassSubject');
const videoClassUrlInput = document.getElementById('videoClassUrl');

// Class Timetable Modals and Forms
const addTimetableModal = document.getElementById('addTimetableModal');
const addTimetableModalTitle = document.getElementById('addTimetableModalTitle');
const closeTimetableModalBtn = document.getElementById('closeTimetableModalBtn');
const cancelTimetableBtn = document.getElementById('cancelTimetableBtn');
const timetableForm = document.getElementById('timetableForm');
const saveTimetableBtn = document.getElementById('saveTimetableBtn');
const timetableClassSelect = document.getElementById('timetableClass');
const timetableSectionSelect = document.getElementById('timetableSection');
const timetableExcelLinkInput = document.getElementById('timetableExcelLink');

// Order Modals and Forms
const addOrderModal = document.getElementById('addOrderModal');
const addOrderModalTitle = document.getElementById('addOrderModalTitle');
const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const orderForm = document.getElementById('orderForm');
const saveOrderBtn = document.getElementById('saveOrderBtn');
const orderStudentIdInput = document.getElementById('orderStudentId');
const orderStudentNameInput = document.getElementById('orderStudentName');
const orderClassSelect = document.getElementById('orderClass');
const orderSectionSelect = document.getElementById('orderSection');
const orderTypeInput = document.getElementById('orderType');
const orderItemInput = document.getElementById('orderItem');
const orderQuantityInput = document.getElementById('orderQuantity');
const orderPriceInput = document.getElementById('orderPrice');
const orderDateInput = document.getElementById('orderDate');

// Announcement Modals and Forms
const addAnnouncementModal = document.getElementById('addAnnouncementModal');
const addAnnouncementModalTitle = document.getElementById('addAnnouncementModalTitle');
const closeAnnouncementModalBtn = document.getElementById('closeAnnouncementModalBtn');
const cancelAnnouncementBtn = document.getElementById('cancelAnnouncementBtn');
const announcementForm = document.getElementById('announcementForm');
const saveAnnouncementBtn = document.getElementById('saveAnnouncementBtn');
const announcementTitleInput = document.getElementById('announcementTitle');
const announcementMessageTextarea = document.getElementById('announcementMessage');
const announcementTypeInput = document.getElementById('announcementType');
const announcementStudentIdInput = document.getElementById('announcementStudentId');
const announcementIsCommonCheckbox = document.getElementById('announcementIsCommon');

// Feedback Modals and Forms
const addFeedbackModal = document.getElementById('addFeedbackModal');
const addFeedbackModalTitle = document.getElementById('addFeedbackModalTitle');
const closeFeedbackModalBtn = document.getElementById('closeFeedbackModalBtn');
const cancelFeedbackBtn = document.getElementById('cancelFeedbackBtn');
const feedbackForm = document.getElementById('feedbackForm');
const saveFeedbackBtn = document.getElementById('saveFeedbackBtn');
const feedbackNameInput = document.getElementById('feedbackName');
const feedbackEmailInput = document.getElementById('feedbackEmail');
const feedbackCategorySelect = document.getElementById('feedbackCategory');
const feedbackMessageTextarea = document.getElementById('feedbackMessage');

// Holiday Modals and Forms
const addHolidayModal = document.getElementById('addHolidayModal');
const addHolidayModalTitle = document.getElementById('addHolidayModalTitle');
const closeHolidayModalBtn = document.getElementById('closeHolidayModalBtn');
const cancelHolidayBtn = document.getElementById('cancelHolidayBtn');
const holidayForm = document.getElementById('holidayForm');
const saveHolidayBtn = document.getElementById('saveHolidayBtn');
const holidayDateInput = document.getElementById('holidayDate');
const holidayTitleInput = document.getElementById('holidayTitle');
const holidayDescriptionTextarea = document.getElementById('holidayDescription');
const holidayTypeInput = document.getElementById('holidayType');


// Global variables to store the ID of the item being edited for each section
let currentLeaveId = null;
let currentAchievementId = null;
let currentCertificateId = null;
let currentExamId = null;
let currentReportCardId = null;
let currentDiaryId = null;
let currentStudyMaterialId = null;
let currentVideoClassId = null;
let currentTimetableId = null;
let currentOrderId = null;
let currentAnnouncementId = null;
let currentFeedbackId = null;
let currentHolidayId = null;
let currentAttendanceRecordId = null; // New: For attendance record editing
let currentFeePaymentId = null; // New: For fee payment editing


// --- Utility Functions (Assumed to be available from script.js) ---
// These functions are defined in script.js and are used here for API calls and UI feedback.
// - showMessageBox(title, message, type, showCancel)
// - showLoading()
// - hideLoading()
// - fetchData(endpoint)
// - sendData(endpoint, data, method)
// - renderPage(pageName) // To refresh the current page after an operation
// - viewStudentModal, closeViewStudentModal, viewStudentModalBody // For displaying details
// - activePage (global variable from script.js)


// --- Modal Specific Functions (Add/Edit/View) ---

// ====================================================================
// STUDENT PROFILE MANAGEMENT FUNCTIONS (New)
// ====================================================================

/**
 * Loads and displays the Add/Edit Student modal.
 * This function interacts with the student modal elements defined in script.js.
 * @param {string|null} studentId - The ID of the student to edit, or null for adding a new student.
 */
async function loadStudentModal(studentId = null) {
    // These elements are globally defined in script.js
    const addStudentModal = document.getElementById('addStudentModal');
    const addStudentModalTitle = document.getElementById('addStudentModalTitle');
    const studentForm = document.getElementById('studentForm');
    const saveStudentBtn = document.getElementById('saveStudentBtn');

    const studentIdInput = document.getElementById('studentId');
    const rollNumberInput = document.getElementById('rollNumber');
    const studentNameInput = document.getElementById('studentName');
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const classSelect = document.getElementById('class');
    const sectionSelect = document.getElementById('section');
    const genderSelect = document.getElementById('gender');
    const bloodGroupInput = document.getElementById('bloodGroup');
    const addressInput = document.getElementById('address');
    const parentNameInput = document.getElementById('parentName');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const enrollmentDateInput = document.getElementById('enrollmentDate');
    const totalFeeInput = document.getElementById('totalFee');
    const feeConcessionInput = document.getElementById('feeConcession');

    studentForm.reset(); // Clear the form

    if (studentId) {
        // Edit mode: Fetch existing student data
        addStudentModalTitle.textContent = 'Edit Student Profile';
        showLoading();
        const studentData = await fetchData(`/students/${studentId}`);
        hideLoading();

        if (studentData) {
            // Populate form fields with fetched data
            studentIdInput.value = studentData.student_id || '';
            rollNumberInput.value = studentData.roll_number || '';
            studentNameInput.value = studentData.name || '';
            dateOfBirthInput.value = studentData.date_of_birth ? new Date(studentData.date_of_birth).toISOString().split('T')[0] : '';
            classSelect.value = studentData.class || '';
            sectionSelect.value = studentData.section || '';
            genderSelect.value = studentData.gender || '';
            bloodGroupInput.value = studentData.blood_group || '';
            addressInput.value = studentData.address || '';
            parentNameInput.value = studentData.parent_name || '';
            phoneNumberInput.value = studentData.phone_number || '';
            emailInput.value = studentData.student_email || '';
            enrollmentDateInput.value = studentData.enrollment_date ? new Date(studentData.enrollment_date).toISOString().split('T')[0] : '';
            totalFeeInput.value = studentData.total_fee || '';
            feeConcessionInput.value = studentData.fee_concession || '';
            saveStudentBtn.textContent = 'Save Changes';
            studentIdInput.readOnly = true; // Make student ID read-only in edit mode
        } else {
            showMessageBox('Error', 'Failed to load student data for editing.', 'error');
            return; // Don't open modal if data fetch fails
        }
    } else {
        // Add mode: Set default values
        addStudentModalTitle.textContent = 'Add New Student';
        enrollmentDateInput.value = new Date().toISOString().split('T')[0]; // Default to today
        saveStudentBtn.textContent = 'Save Student';
        studentIdInput.readOnly = false; // Enable student ID input for new student
    }

    addStudentModal.classList.add('active'); // Show the modal
}


// ====================================================================
// FEE PAYMENT MANAGEMENT FUNCTIONS (New)
// ====================================================================

/**
 * Loads and displays the Record Payment modal for adding or editing fee records.
 * This function interacts with the payment modal elements defined in script.js.
 * @param {string|null} feeId - The ID of the fee record to edit, or null for adding a new record.
 */
async function loadFeePaymentModal(feeId = null) {
    // These elements are globally defined in script.js
    const recordPaymentModal = document.getElementById('recordPaymentModal');
    const paymentForm = document.getElementById('paymentForm');
    const paymentStudentIdInput = document.getElementById('paymentStudentId');
    const paymentAmountInput = document.getElementById('paymentAmount');
    const paymentDateInput = document.getElementById('paymentDate');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentDescriptionInput = document.getElementById('paymentDescription');
    const paymentFeeTypeInput = document.getElementById('paymentFeeType');
    const savePaymentBtn = document.getElementById('savePaymentBtn'); // Assuming this button is used for both add/edit

    paymentForm.reset(); // Clear the form
    currentFeePaymentId = feeId; // Set the global currentFeePaymentId

    if (feeId) {
        // Edit mode: Fetch existing fee data
        document.getElementById('recordPaymentModalTitle').textContent = 'Edit Fee Payment'; // Update modal title
        showLoading();
        const feeData = await fetchData(`/fees/${feeId}`);
        hideLoading();

        if (feeData) {
            // Populate form fields with fetched data
            paymentStudentIdInput.value = feeData.student_id || '';
            paymentAmountInput.value = feeData.transaction_amount || '';
            paymentDateInput.value = feeData.payment_date ? new Date(feeData.payment_date).toISOString().split('T')[0] : '';
            paymentMethodSelect.value = feeData.payment_method || '';
            paymentDescriptionInput.value = feeData.description || '';
            paymentFeeTypeInput.value = feeData.fee_type || '';
            savePaymentBtn.textContent = 'Save Changes';
            paymentStudentIdInput.readOnly = true; // Make student ID read-only in edit mode
        } else {
            showMessageBox('Error', 'Failed to load fee payment data for editing.', 'error');
            return; // Don't open modal if data fetch fails
        }
    } else {
        // Add mode: Set default values
        document.getElementById('recordPaymentModalTitle').textContent = 'Record New Payment'; // Update modal title
        paymentDateInput.value = new Date().toISOString().split('T')[0]; // Default to today
        paymentAmountInput.value = ''; // Clear amount for new entry
        paymentStudentIdInput.value = ''; // Clear student ID for new entry
        savePaymentBtn.textContent = 'Record Payment';
        paymentStudentIdInput.readOnly = false; // Enable student ID input for new payment
    }

    recordPaymentModal.classList.add('active'); // Show the modal
}


// ====================================================================
// LEAVES MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Leave modal.
 * If a leaveId is provided, it fetches the existing leave data for editing.
 * @param {string|null} leaveId - The ID of the leave to edit, or null for adding a new leave.
 */
async function loadLeaveModal(leaveId = null) {
    leaveForm.reset(); // Clear the form
    currentLeaveId = leaveId; // Set the global currentLeaveId

    if (leaveId) {
        // Edit mode: Fetch existing leave data
        addLeaveModalTitle.textContent = 'Edit Leave Application';
        showLoading();
        const leaveData = await fetchData(`/leaves/${leaveId}`);
        hideLoading();

        if (leaveData) {
            // Populate form fields with fetched data
            leaveStudentIdInput.value = leaveData.student_id || '';
            leaveTypeSelect.value = leaveData.leave_type || '';
            leaveStartDateInput.value = leaveData.start_date ? new Date(leaveData.start_date).toISOString().split('T')[0] : '';
            leaveEndDateInput.value = leaveData.end_date ? new Date(leaveData.end_date).toISOString().split('T')[0] : '';
            leaveReasonTextarea.value = leaveData.reason || '';
            leaveStatusSelect.value = leaveData.status || 'Pending';
            saveLeaveBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load leave data for editing.', 'error');
            return; // Don't open modal if data fetch fails
        }
    } else {
        // Add mode: Set default values
        addLeaveModalTitle.textContent = 'Add New Leave Application';
        leaveStartDateInput.value = new Date().toISOString().split('T')[0]; // Default to today
        leaveEndDateInput.value = new Date().toISOString().split('T')[0]; // Default to today
        leaveStatusSelect.value = 'Pending'; // Default status
        saveLeaveBtn.textContent = 'Submit Application';
    }

    addLeaveModal.classList.add('active'); // Show the modal
}

/**
 * Handles the submission of the leave form (Add or Edit).
 * @param {Event} e - The form submission event.
 */
async function handleLeaveFormSubmit(e) {
    e.preventDefault(); // Prevent default form submission

    // Collect data from the form
    const leaveData = {
        student_id: leaveStudentIdInput.value.trim(),
        leave_type: leaveTypeSelect.value,
        start_date: leaveStartDateInput.value,
        end_date: leaveEndDateInput.value,
        reason: leaveReasonTextarea.value.trim(),
        status: leaveStatusSelect.value,
        applied_on: currentLeaveId ? undefined : new Date().toISOString() // Set applied_on only for new entries
    };

    // Basic validation
    if (!leaveData.student_id || !leaveData.leave_type || !leaveData.start_date || !leaveData.end_date || !leaveData.reason) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    if (new Date(leaveData.start_date) > new Date(leaveData.end_date)) {
        showMessageBox('Validation Error', 'Start Date cannot be after End Date.', 'error');
        return;
    }

    let result;
    if (currentLeaveId) {
        // Update existing leave
        result = await sendData(`/leaves/${currentLeaveId}`, leaveData, 'PUT');
    } else {
        // Add new leave
        result = await sendData('/leaves', leaveData, 'POST');
    }

    if (result && (result.message === 'Leave application added successfully' || result.message === 'Leave application updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addLeaveModal.classList.remove('active'); // Close modal
        leaveForm.reset(); // Clear form
        renderPage('leaves'); // Refresh the leaves page to show updated data
    }
}

// Event Listeners for Leaves Modal
closeLeaveModalBtn.addEventListener('click', () => {
    addLeaveModal.classList.remove('active');
    leaveForm.reset();
});
cancelLeaveBtn.addEventListener('click', () => {
    addLeaveModal.classList.remove('active');
    leaveForm.reset();
});
addLeaveModal.addEventListener('click', (e) => {
    if (e.target === addLeaveModal) {
        addLeaveModal.classList.remove('active');
        leaveForm.reset();
    }
});
leaveForm.addEventListener('submit', handleLeaveFormSubmit);


// ====================================================================
// ACHIEVEMENTS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Achievement modal.
 * @param {string|null} achievementId - The ID of the achievement to edit, or null for adding a new one.
 */
async function loadAchievementModal(achievementId = null) {
    achievementForm.reset();
    currentAchievementId = achievementId;

    if (achievementId) {
        addAchievementModalTitle.textContent = 'Edit Achievement';
        showLoading();
        const achievementData = await fetchData(`/achievements/${achievementId}`);
        hideLoading();

        if (achievementData) {
            achievementStudentIdInput.value = achievementData.student_id || '';
            achievementStudentNameInput.value = achievementData.student_name || '';
            achievementTitleInput.value = achievementData.title || '';
            achievementDescriptionTextarea.value = achievementData.description || '';
            achievementDateInput.value = achievementData.date ? new Date(achievementData.date).toISOString().split('T')[0] : '';
            achievementTypeInput.value = achievementData.type || '';
            achievementTagsInput.value = achievementData.tags ? achievementData.tags.join(', ') : '';
            saveAchievementBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load achievement data for editing.', 'error');
            return;
        }
    } else {
        addAchievementModalTitle.textContent = 'Add New Achievement';
        achievementDateInput.value = new Date().toISOString().split('T')[0];
        saveAchievementBtn.textContent = 'Save Achievement';
    }
    addAchievementModal.classList.add('active');
}

/**
 * Handles the submission of the achievement form.
 * @param {Event} e - The form submission event.
 */
async function handleAchievementFormSubmit(e) {
    e.preventDefault();

    const achievementData = {
        student_id: achievementStudentIdInput.value.trim(),
        student_name: achievementStudentNameInput.value.trim(),
        title: achievementTitleInput.value.trim(),
        description: achievementDescriptionTextarea.value.trim() || null,
        date: achievementDateInput.value,
        type: achievementTypeInput.value.trim(),
        tags: achievementTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) || null,
    };

    if (!achievementData.student_id || !achievementData.student_name || !achievementData.title || !achievementData.date || !achievementData.type) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentAchievementId) {
        result = await sendData(`/achievements/${currentAchievementId}`, achievementData, 'PUT');
    } else {
        result = await sendData('/achievements', achievementData, 'POST');
    }

    if (result && (result.message === 'Achievement added successfully' || result.message === 'Achievement updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addAchievementModal.classList.remove('active');
        achievementForm.reset();
        renderPage('achievements');
    }
}

// Event Listeners for Achievement Modal
closeAchievementModalBtn.addEventListener('click', () => {
    addAchievementModal.classList.remove('active');
    achievementForm.reset();
});
cancelAchievementBtn.addEventListener('click', () => {
    addAchievementModal.classList.remove('active');
    achievementForm.reset();
});
addAchievementModal.addEventListener('click', (e) => {
    if (e.target === addAchievementModal) {
        addAchievementModal.classList.remove('active');
        achievementForm.reset();
    }
});
achievementForm.addEventListener('submit', handleAchievementFormSubmit);


// ====================================================================
// CERTIFICATES MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Certificate modal.
 * @param {string|null} certificateId - The ID of the certificate to edit, or null for adding a new one.
 */
async function loadCertificateModal(certificateId = null) {
    certificateForm.reset();
    currentCertificateId = certificateId;

    if (certificateId) {
        addCertificateModalTitle.textContent = 'Edit Certificate';
        showLoading();
        const certificateData = await fetchData(`/certificates/${certificateId}`);
        hideLoading();

        if (certificateData) {
            certificateStudentIdInput.value = certificateData.student_id || '';
            certificateTitleInput.value = certificateData.title || '';
            certificateOrganizationInput.value = certificateData.issuing_organization || '';
            certificateIssueDateInput.value = certificateData.issue_date ? new Date(certificateData.issue_date).toISOString().split('T')[0] : '';
            certificateUrlInput.value = certificateData.certificate_url || '';
            saveCertificateBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load certificate data for editing.', 'error');
            return;
        }
    } else {
        addCertificateModalTitle.textContent = 'Add New Certificate';
        certificateIssueDateInput.value = new Date().toISOString().split('T')[0];
        saveCertificateBtn.textContent = 'Save Certificate';
    }
    addCertificateModal.classList.add('active');
}

/**
 * Handles the submission of the certificate form.
 * @param {Event} e - The form submission event.
 */
async function handleCertificateFormSubmit(e) {
    e.preventDefault();

    const certificateData = {
        student_id: certificateStudentIdInput.value.trim(),
        title: certificateTitleInput.value.trim(),
        issuing_organization: certificateOrganizationInput.value.trim(),
        issue_date: certificateIssueDateInput.value,
        certificate_url: certificateUrlInput.value.trim() || null,
    };

    if (!certificateData.student_id || !certificateData.title || !certificateData.issuing_organization || !certificateData.issue_date) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentCertificateId) {
        result = await sendData(`/certificates/${currentCertificateId}`, certificateData, 'PUT');
    } else {
        result = await sendData('/certificates', certificateData, 'POST');
    }

    if (result && (result.message === 'Certificate added successfully' || result.message === 'Certificate updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addCertificateModal.classList.remove('active');
        certificateForm.reset();
        renderPage('certificates');
    }
}

// Event Listeners for Certificate Modal
closeCertificateModalBtn.addEventListener('click', () => {
    addCertificateModal.classList.remove('active');
    certificateForm.reset();
});
cancelCertificateBtn.addEventListener('click', () => {
    addCertificateModal.classList.remove('active');
    certificateForm.reset();
});
addCertificateModal.addEventListener('click', (e) => {
    if (e.target === addCertificateModal) {
        addCertificateModal.classList.remove('active');
        certificateForm.reset();
    }
});
certificateForm.addEventListener('submit', handleCertificateFormSubmit);


// ====================================================================
// EXAMS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Exam modal.
 * @param {string|null} examId - The ID of the exam to edit, or null for adding a new one.
 */
async function loadExamModal(examId = null) {
    examForm.reset();
    currentExamId = examId;

    if (examId) {
        addExamModalTitle.textContent = 'Edit Exam';
        showLoading();
        const examData = await fetchData(`/exams/${examId}`);
        hideLoading();

        if (examData) {
            examNameInput.value = examData.exam_name || '';
            examClassSelect.value = examData.class || '';
            examSectionSelect.value = examData.section || '';
            examSubjectInput.value = examData.subject || '';
            examTopicInput.value = examData.topic || '';
            examDateInput.value = examData.exam_date ? new Date(examData.exam_date).toISOString().split('T')[0] : '';
            examTimeInput.value = examData.exam_time || '';
            examRoomInput.value = examData.room || '';
            examTotalMarksInput.value = examData.total_marks || '';
            saveExamBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load exam data for editing.', 'error');
            return;
        }
    } else {
        addExamModalTitle.textContent = 'Add New Exam';
        examDateInput.value = new Date().toISOString().split('T')[0];
        examTimeInput.value = new Date().toTimeString().split(' ')[0].substring(0, 5); // Current time
        saveExamBtn.textContent = 'Save Exam';
    }
    addExamModal.classList.add('active');
}

/**
 * Handles the submission of the exam form.
 * @param {Event} e - The form submission event.
 */
async function handleExamFormSubmit(e) {
    e.preventDefault();

    const examData = {
        exam_name: examNameInput.value.trim(),
        class: examClassSelect.value,
        section: examSectionSelect.value || null,
        subject: examSubjectInput.value.trim(),
        topic: examTopicInput.value.trim() || null,
        exam_date: examDateInput.value,
        exam_time: examTimeInput.value,
        room: examRoomInput.value.trim() || null,
        total_marks: parseFloat(examTotalMarksInput.value) || 0,
    };

    if (!examData.exam_name || !examData.class || !examData.subject || !examData.exam_date || !examData.exam_time || examData.total_marks <= 0) {
        showMessageBox('Validation Error', 'Please fill in all required fields and ensure total marks is positive.', 'error');
        return;
    }

    let result;
    if (currentExamId) {
        result = await sendData(`/exams/${currentExamId}`, examData, 'PUT');
    } else {
        result = await sendData('/exams', examData, 'POST');
    }

    if (result && (result.message === 'Exam added successfully' || result.message === 'Exam updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addExamModal.classList.remove('active');
        examForm.reset();
        renderPage('exams');
    }
}

// Event Listeners for Exam Modal
closeExamModalBtn.addEventListener('click', () => {
    addExamModal.classList.remove('active');
    examForm.reset();
});
cancelExamBtn.addEventListener('click', () => {
    addExamModal.classList.remove('active');
    examForm.reset();
});
addExamModal.addEventListener('click', (e) => {
    if (e.target === addExamModal) {
        addExamModal.classList.remove('active');
        examForm.reset();
    }
});
examForm.addEventListener('submit', handleExamFormSubmit);


// ====================================================================
// REPORT CARDS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Report Card modal.
 * @param {string|null} reportCardId - The ID of the report card to edit, or null for adding a new one.
 */
async function loadReportCardModal(reportCardId = null) {
    reportCardForm.reset();
    currentReportCardId = reportCardId;

    if (reportCardId) {
        addReportCardModalTitle.textContent = 'Edit Report Card';
        showLoading();
        const reportCardData = await fetchData(`/report-cards/${reportCardId}`);
        hideLoading();

        if (reportCardData) {
            reportCardStudentIdInput.value = reportCardData.student_id || '';
            reportCardAcademicYearInput.value = reportCardData.academic_year || '';
            reportCardTermSemesterInput.value = reportCardData.term_semester || '';
            reportCardDateGeneratedInput.value = reportCardData.date_generated ? new Date(reportCardData.date_generated).toISOString().split('T')[0] : '';
            reportCardOverallPercentageInput.value = reportCardData.overall_percentage || '';
            reportCardOverallGradeInput.value = reportCardData.overall_grade || '';
            reportCardTeacherRemarksTextarea.value = reportCardData.teacher_remarks || '';
            saveReportCardBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load report card data for editing.', 'error');
            return;
        }
    } else {
        addReportCardModalTitle.textContent = 'Add New Report Card';
        reportCardDateGeneratedInput.value = new Date().toISOString().split('T')[0];
        saveReportCardBtn.textContent = 'Save Report Card';
    }
    addReportCardModal.classList.add('active');
}

/**
 * Handles the submission of the report card form.
 * @param {Event} e - The form submission event.
 */
async function handleReportCardFormSubmit(e) {
    e.preventDefault();

    const reportCardData = {
        student_id: reportCardStudentIdInput.value.trim(),
        academic_year: reportCardAcademicYearInput.value.trim(),
        term_semester: reportCardTermSemesterInput.value.trim(),
        date_generated: reportCardDateGeneratedInput.value,
        overall_percentage: parseFloat(reportCardOverallPercentageInput.value) || null,
        overall_grade: reportCardOverallGradeInput.value.trim() || null,
        teacher_remarks: reportCardTeacherRemarksTextarea.value.trim() || null,
        // subjects_passed and total_subjects are calculated on backend or derived from report_card_subjects
    };

    if (!reportCardData.student_id || !reportCardData.academic_year || !reportCardData.term_semester || !reportCardData.date_generated) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    if (reportCardData.overall_percentage && (reportCardData.overall_percentage < 0 || reportCardData.overall_percentage > 100)) {
        showMessageBox('Validation Error', 'Overall Percentage must be between 0 and 100.', 'error');
        return;
    }

    let result;
    if (currentReportCardId) {
        result = await sendData(`/report-cards/${currentReportCardId}`, reportCardData, 'PUT');
    } else {
        result = await sendData('/report-cards', reportCardData, 'POST');
    }

    if (result && (result.message === 'Report card added successfully' || result.message === 'Report card updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addReportCardModal.classList.remove('active');
        reportCardForm.reset();
        renderPage('report-cards');
    }
}

// Event Listeners for Report Card Modal
closeReportCardModalBtn.addEventListener('click', () => {
    addReportCardModal.classList.remove('active');
    reportCardForm.reset();
});
cancelReportCardBtn.addEventListener('click', () => {
    addReportCardModal.classList.remove('active');
    reportCardForm.reset();
});
addReportCardModal.addEventListener('click', (e) => {
    if (e.target === addReportCardModal) {
        addReportCardModal.classList.remove('active');
        reportCardForm.reset();
    }
});
reportCardForm.addEventListener('submit', handleReportCardFormSubmit);


// ====================================================================
// DAILY DIARY MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Daily Diary modal.
 * @param {string|null} diaryId - The ID of the diary entry to edit, or null for adding a new one.
 */
async function loadDiaryModal(diaryId = null) {
    diaryForm.reset();
    currentDiaryId = diaryId;

    if (diaryId) {
        addDiaryModalTitle.textContent = 'Edit Daily Diary Entry';
        showLoading();
        const diaryData = await fetchData(`/diary/${diaryId}`);
        hideLoading();

        if (diaryData) {
            diaryDateInput.value = diaryData.date ? new Date(diaryData.date).toISOString().split('T')[0] : '';
            diaryClassSelect.value = diaryData.class || '';
            diarySectionSelect.value = diaryData.section || '';
            diarySubjectInput.value = diaryData.subject || '';
            diaryContentTextarea.value = diaryData.content || '';
            saveDiaryBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load diary entry data for editing.', 'error');
            return;
        }
    } else {
        addDiaryModalTitle.textContent = 'Add New Daily Diary Entry';
        diaryDateInput.value = new Date().toISOString().split('T')[0];
        saveDiaryBtn.textContent = 'Save Entry';
    }
    addDiaryModal.classList.add('active');
}

/**
 * Handles the submission of the daily diary form.
 * @param {Event} e - The form submission event.
 */
async function handleDiaryFormSubmit(e) {
    e.preventDefault();

    const diaryData = {
        date: diaryDateInput.value,
        class: diaryClassSelect.value,
        section: diarySectionSelect.value,
        subject: diarySubjectInput.value.trim(),
        content: diaryContentTextarea.value.trim(),
    };

    if (!diaryData.date || !diaryData.class || !diaryData.section || !diaryData.subject || !diaryData.content) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentDiaryId) {
        result = await sendData(`/diary/${currentDiaryId}`, diaryData, 'PUT');
    } else {
        result = await sendData('/diary', diaryData, 'POST');
    }

    if (result && (result.message === 'Diary entry added successfully' || result.message === 'Diary entry updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addDiaryModal.classList.remove('active');
        diaryForm.reset();
        renderPage('daily-diary');
    }
}

// Event Listeners for Daily Diary Modal
closeDiaryModalBtn.addEventListener('click', () => {
    addDiaryModal.classList.remove('active');
    diaryForm.reset();
});
cancelDiaryBtn.addEventListener('click', () => {
    addDiaryModal.classList.remove('active');
    diaryForm.reset();
});
addDiaryModal.addEventListener('click', (e) => {
    if (e.target === addDiaryModal) {
        addDiaryModal.classList.remove('active');
        diaryForm.reset();
    }
});
diaryForm.addEventListener('submit', handleDiaryFormSubmit);


// ====================================================================
// STUDY MATERIALS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Study Material modal.
 * @param {string|null} materialId - The ID of the study material to edit, or null for adding a new one.
 */
async function loadStudyMaterialModal(materialId = null) {
    studyMaterialForm.reset();
    currentStudyMaterialId = materialId;

    if (materialId) {
        addStudyMaterialModalTitle.textContent = 'Edit Study Material';
        showLoading();
        const materialData = await fetchData(`/study-materials/${materialId}`);
        hideLoading();

        if (materialData) {
            studyMaterialTitleInput.value = materialData.title || '';
            studyMaterialClassSelect.value = materialData.class || '';
            studyMaterialSubjectInput.value = materialData.subject || '';
            studyMaterialFileUrlInput.value = materialData.file_url || '';
            saveStudyMaterialBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load study material data for editing.', 'error');
            return;
        }
    } else {
        addStudyMaterialModalTitle.textContent = 'Add New Study Material';
        saveStudyMaterialBtn.textContent = 'Save Material';
    }
    addStudyMaterialModal.classList.add('active');
}

/**
 * Handles the submission of the study material form.
 * @param {Event} e - The form submission event.
 */
async function handleStudyMaterialFormSubmit(e) {
    e.preventDefault();

    const studyMaterialData = {
        title: studyMaterialTitleInput.value.trim(),
        class: studyMaterialClassSelect.value,
        subject: studyMaterialSubjectInput.value.trim(),
        file_url: studyMaterialFileUrlInput.value.trim(),
    };

    if (!studyMaterialData.title || !studyMaterialData.class || !studyMaterialData.subject || !studyMaterialData.file_url) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentStudyMaterialId) {
        result = await sendData(`/study-materials/${currentStudyMaterialId}`, studyMaterialData, 'PUT');
    } else {
        result = await sendData('/study-materials', studyMaterialData, 'POST');
    }

    if (result && (result.message === 'Study material added successfully' || result.message === 'Study material updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addStudyMaterialModal.classList.remove('active');
        studyMaterialForm.reset();
        renderPage('study-materials');
    }
}

// Event Listeners for Study Material Modal
closeStudyMaterialModalBtn.addEventListener('click', () => {
    addStudyMaterialModal.classList.remove('active');
    studyMaterialForm.reset();
});
cancelStudyMaterialBtn.addEventListener('click', () => {
    addStudyMaterialModal.classList.remove('active');
    studyMaterialForm.reset();
});
addStudyMaterialModal.addEventListener('click', (e) => {
    if (e.target === addStudyMaterialModal) {
        addStudyMaterialModal.classList.remove('active');
        studyMaterialForm.reset();
    }
});
studyMaterialForm.addEventListener('submit', handleStudyMaterialFormSubmit);


// ====================================================================
// VIDEO CLASSES MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Video Class modal.
 * @param {string|null} videoClassId - The ID of the video class to edit, or null for adding a new one.
 */
async function loadVideoClassModal(videoClassId = null) {
    videoClassForm.reset();
    currentVideoClassId = videoClassId;

    if (videoClassId) {
        addVideoClassModalTitle.textContent = 'Edit Video Class';
        showLoading();
        const videoClassData = await fetchData(`/video-classes/${videoClassId}`);
        hideLoading();

        if (videoClassData) {
            videoClassTitleInput.value = videoClassData.title || '';
            videoClassClassSelect.value = videoClassData.class || '';
            videoClassSubjectInput.value = videoClassData.subject || '';
            videoClassUrlInput.value = videoClassData.video_url || '';
            saveVideoClassBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load video class data for editing.', 'error');
            return;
        }
    } else {
        addVideoClassModalTitle.textContent = 'Add New Video Class';
        saveVideoClassBtn.textContent = 'Save Video Class';
    }
    addVideoClassModal.classList.add('active');
}

/**
 * Handles the submission of the video class form.
 * @param {Event} e - The form submission event.
 */
async function handleVideoClassFormSubmit(e) {
    e.preventDefault();

    const videoClassData = {
        title: videoClassTitleInput.value.trim(),
        class: videoClassClassSelect.value,
        subject: videoClassSubjectInput.value.trim(),
        video_url: videoClassUrlInput.value.trim(),
    };

    if (!videoClassData.title || !videoClassData.class || !videoClassData.subject || !videoClassData.video_url) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentVideoClassId) {
        result = await sendData(`/video-classes/${currentVideoClassId}`, videoClassData, 'PUT');
    } else {
        result = await sendData('/video-classes', videoClassData, 'POST');
    }

    if (result && (result.message === 'Video class added successfully' || result.message === 'Video class updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addVideoClassModal.classList.remove('active');
        videoClassForm.reset();
        renderPage('video-classes');
    }
}

// Event Listeners for Video Class Modal
closeVideoClassModalBtn.addEventListener('click', () => {
    addVideoClassModal.classList.remove('active');
    videoClassForm.reset();
});
cancelVideoClassBtn.addEventListener('click', () => {
    addVideoClassModal.classList.remove('active');
    videoClassForm.reset();
});
addVideoClassModal.addEventListener('click', (e) => {
    if (e.target === addVideoClassModal) {
        addVideoClassModal.classList.remove('active');
        videoClassForm.reset();
    }
});
videoClassForm.addEventListener('submit', handleVideoClassFormSubmit);


// ====================================================================
// CLASS TIMETABLES MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Timetable modal.
 * @param {string|null} timetableId - The ID of the timetable link to edit, or null for adding a new one.
 */
async function loadTimetableModal(timetableId = null) {
    timetableForm.reset();
    currentTimetableId = timetableId;

    if (timetableId) {
        addTimetableModalTitle.textContent = 'Edit Class Timetable Link';
        showLoading();
        const timetableData = await fetchData(`/timetables/${timetableId}`);
        hideLoading();

        if (timetableData) {
            timetableClassSelect.value = timetableData.class || '';
            timetableSectionSelect.value = timetableData.section || '';
            timetableExcelLinkInput.value = timetableData.excel_sheet_link || '';
            saveTimetableBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load timetable data for editing.', 'error');
            return;
        }
    } else {
        addTimetableModalTitle.textContent = 'Add New Class Timetable Link';
        saveTimetableBtn.textContent = 'Save Timetable';
    }
    addTimetableModal.classList.add('active');
}

/**
 * Handles the submission of the timetable form.
 * @param {Event} e - The form submission event.
 */
async function handleTimetableFormSubmit(e) {
    e.preventDefault();

    const timetableData = {
        class: timetableClassSelect.value,
        section: timetableSectionSelect.value,
        excel_sheet_link: timetableExcelLinkInput.value.trim(),
    };

    if (!timetableData.class || !timetableData.section || !timetableData.excel_sheet_link) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentTimetableId) {
        result = await sendData(`/timetables/${currentTimetableId}`, timetableData, 'PUT');
    } else {
        result = await sendData('/timetables', timetableData, 'POST');
    }

    if (result && (result.message === 'Timetable link added successfully' || result.message === 'Timetable link updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addTimetableModal.classList.remove('active');
        timetableForm.reset();
        renderPage('class-timetables');
    }
}

// Event Listeners for Timetable Modal
closeTimetableModalBtn.addEventListener('click', () => {
    addTimetableModal.classList.remove('active');
    timetableForm.reset();
});
cancelTimetableBtn.addEventListener('click', () => {
    addTimetableModal.classList.remove('active');
    timetableForm.reset();
});
addTimetableModal.addEventListener('click', (e) => {
    if (e.target === addTimetableModal) {
        addTimetableModal.classList.remove('active');
        timetableForm.reset();
    }
});
timetableForm.addEventListener('submit', handleTimetableFormSubmit);


// ====================================================================
// ORDERS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Order modal.
 * @param {string|null} orderId - The ID of the order to edit, or null for adding a new one.
 */
async function loadOrderModal(orderId = null) {
    orderForm.reset();
    currentOrderId = orderId;

    if (orderId) {
        addOrderModalTitle.textContent = 'Edit Order';
        showLoading();
        const orderData = await fetchData(`/orders/${orderId}`);
        hideLoading();

        if (orderData) {
            orderStudentIdInput.value = orderData.student_id || '';
            orderStudentNameInput.value = orderData.student_name || '';
            orderClassSelect.value = orderData.class || '';
            orderSectionSelect.value = orderData.section || '';
            orderTypeInput.value = orderData.type || '';
            orderItemInput.value = orderData.item || '';
            orderQuantityInput.value = orderData.quantity || '';
            orderPriceInput.value = orderData.price || '';
            orderDateInput.value = orderData.date ? new Date(orderData.date).toISOString().split('T')[0] : '';
            saveOrderBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load order data for editing.', 'error');
            return;
        }
    } else {
        addOrderModalTitle.textContent = 'Add New Order';
        orderDateInput.value = new Date().toISOString().split('T')[0];
        orderQuantityInput.value = 1; // Default quantity
        orderPriceInput.value = 0; // Default price
        saveOrderBtn.textContent = 'Save Order';
    }
    addOrderModal.classList.add('active');
}

/**
 * Handles the submission of the order form.
 * @param {Event} e - The form submission event.
 */
async function handleOrderFormSubmit(e) {
    e.preventDefault();

    const orderData = {
        student_id: orderStudentIdInput.value.trim(),
        student_name: orderStudentNameInput.value.trim(),
        class: orderClassSelect.value,
        section: orderSectionSelect.value,
        type: orderTypeInput.value.trim(),
        item: orderItemInput.value.trim(),
        quantity: parseInt(orderQuantityInput.value) || 0,
        price: parseFloat(orderPriceInput.value) || 0,
        date: orderDateInput.value,
    };

    if (!orderData.student_id || !orderData.student_name || !orderData.class || !orderData.section || !orderData.type || !orderData.item || orderData.quantity <= 0 || orderData.price < 0 || !orderData.date) {
        showMessageBox('Validation Error', 'Please fill in all required fields and ensure quantity is positive and price is non-negative.', 'error');
        return;
    }

    let result;
    if (currentOrderId) {
        result = await sendData(`/orders/${currentOrderId}`, orderData, 'PUT');
    } else {
        result = await sendData('/orders', orderData, 'POST');
    }

    if (result && (result.message === 'Order added successfully' || result.message === 'Order updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addOrderModal.classList.remove('active');
        orderForm.reset();
        renderPage('orders');
    }
}

// Event Listeners for Order Modal
closeOrderModalBtn.addEventListener('click', () => {
    addOrderModal.classList.remove('active');
    orderForm.reset();
});
cancelOrderBtn.addEventListener('click', () => {
    addOrderModal.classList.remove('active');
    orderForm.reset();
});
addOrderModal.addEventListener('click', (e) => {
    if (e.target === addOrderModal) {
        addOrderModal.classList.remove('active');
        orderForm.reset();
    }
});
orderForm.addEventListener('submit', handleOrderFormSubmit);


// ====================================================================
// ANNOUNCEMENTS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Announcement modal.
 * @param {string|null} announcementId - The ID of the announcement to edit, or null for adding a new one.
 */
async function loadAnnouncementModal(announcementId = null) {
    announcementForm.reset();
    currentAnnouncementId = announcementId;

    if (announcementId) {
        addAnnouncementModalTitle.textContent = 'Edit Announcement';
        showLoading();
        const announcementData = await fetchData(`/announcements/${announcementId}`);
        hideLoading();

        if (announcementData) {
            announcementTitleInput.value = announcementData.title || '';
            announcementMessageTextarea.value = announcementData.message || '';
            announcementTypeInput.value = announcementData.type || '';
            announcementStudentIdInput.value = announcementData.student_id || '';
            announcementIsCommonCheckbox.checked = announcementData.is_common || false;
            saveAnnouncementBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load announcement data for editing.', 'error');
            return;
        }
    } else {
        addAnnouncementModalTitle.textContent = 'Add New Announcement';
        announcementIsCommonCheckbox.checked = true; // Default to common
        saveAnnouncementBtn.textContent = 'Publish Announcement';
    }
    addAnnouncementModal.classList.add('active');
}

/**
 * Handles the submission of the announcement form.
 * @param {Event} e - The form submission event.
 */
async function handleAnnouncementFormSubmit(e) {
    e.preventDefault();

    const announcementData = {
        title: announcementTitleInput.value.trim(),
        message: announcementMessageTextarea.value.trim(),
        type: announcementTypeInput.value.trim() || null,
        student_id: announcementStudentIdInput.value.trim() || null,
        is_common: announcementIsCommonCheckbox.checked,
        timestamp: currentAnnouncementId ? undefined : new Date().toISOString() // Set timestamp for new entries
    };

    if (!announcementData.title || !announcementData.message) {
        showMessageBox('Validation Error', 'Please fill in the title and message fields.', 'error');
        return;
    }

    // If it's not a common announcement, a student ID must be provided
    if (!announcementData.is_common && !announcementData.student_id) {
        showMessageBox('Validation Error', 'For non-common announcements, a Student ID is required.', 'error');
        return;
    }
    // If it's a common announcement, clear student_id to ensure it's null in DB
    if (announcementData.is_common) {
        announcementData.student_id = null;
    }


    let result;
    if (currentAnnouncementId) {
        result = await sendData(`/announcements/${currentAnnouncementId}`, announcementData, 'PUT');
    } else {
        result = await sendData('/announcements', announcementData, 'POST');
    }

    if (result && (result.message === 'Announcement added successfully' || result.message === 'Announcement updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addAnnouncementModal.classList.remove('active');
        announcementForm.reset();
        renderPage('announcements');
    }
}

// Event Listeners for Announcement Modal
closeAnnouncementModalBtn.addEventListener('click', () => {
    addAnnouncementModal.classList.remove('active');
    announcementForm.reset();
});
cancelAnnouncementBtn.addEventListener('click', () => {
    addAnnouncementModal.classList.remove('active');
    announcementForm.reset();
});
addAnnouncementModal.addEventListener('click', (e) => {
    if (e.target === addAnnouncementModal) {
        addAnnouncementModal.classList.remove('active');
        announcementForm.reset();
    }
});
announcementForm.addEventListener('submit', handleAnnouncementFormSubmit);


// ====================================================================
// FEEDBACK MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Feedback modal.
 * @param {string|null} feedbackId - The ID of the feedback to edit, or null for adding a new one.
 */
async function loadFeedbackModal(feedbackId = null) {
    feedbackForm.reset();
    currentFeedbackId = feedbackId;

    if (feedbackId) {
        addFeedbackModalTitle.textContent = 'Edit Feedback';
        showLoading();
        const feedbackData = await fetchData(`/feedback/${feedbackId}`);
        hideLoading();

        if (feedbackData) {
            feedbackNameInput.value = feedbackData.name || '';
            feedbackEmailInput.value = feedbackData.email || '';
            feedbackCategorySelect.value = feedbackData.category || '';
            feedbackMessageTextarea.value = feedbackData.message || '';
            saveFeedbackBtn.textContent = 'Save Changes';
        } else {
            showMessageBox('Error', 'Failed to load feedback data for editing.', 'error');
            return;
        }
    } else {
        addFeedbackModalTitle.textContent = 'Submit Feedback';
        saveFeedbackBtn.textContent = 'Submit Feedback';
    }
    addFeedbackModal.classList.add('active');
}

/**
 * Handles the submission of the feedback form.
 * @param {Event} e - The form submission event.
 */
async function handleFeedbackFormSubmit(e) {
    e.preventDefault();

    const feedbackData = {
        name: feedbackNameInput.value.trim() || null,
        email: feedbackEmailInput.value.trim() || null,
        category: feedbackCategorySelect.value,
        message: feedbackMessageTextarea.value.trim(),
        submitted_at: currentFeedbackId ? undefined : new Date().toISOString() // Set submitted_at for new entries
    };

    if (!feedbackData.category || !feedbackData.message) {
        showMessageBox('Validation Error', 'Please fill in the category and message fields.', 'error');
        return;
    }

    let result;
    if (currentFeedbackId) {
        result = await sendData(`/feedback/${currentFeedbackId}`, feedbackData, 'PUT');
    } else {
        result = await sendData('/feedback', feedbackData, 'POST');
    }

    if (result && (result.message === 'Feedback submitted successfully' || result.message === 'Feedback updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addFeedbackModal.classList.remove('active');
        feedbackForm.reset();
        renderPage('feedback');
    }
}

// Event Listeners for Feedback Modal
closeFeedbackModalBtn.addEventListener('click', () => {
    addFeedbackModal.classList.remove('active');
    feedbackForm.reset();
});
cancelFeedbackBtn.addEventListener('click', () => {
    addFeedbackModal.classList.remove('active');
    feedbackForm.reset();
});
addFeedbackModal.addEventListener('click', (e) => {
    if (e.target === addFeedbackModal) {
        addFeedbackModal.classList.remove('active');
        feedbackForm.reset();
    }
});
feedbackForm.addEventListener('submit', handleFeedbackFormSubmit);


// ====================================================================
// HOLIDAYS MANAGEMENT FUNCTIONS
// ====================================================================

/**
 * Loads and displays the Add/Edit Holiday modal.
 * @param {string|null} holidayDate - The date of the holiday to edit (PK), or null for adding a new one.
 */
async function loadHolidayModal(holidayDate = null) {
    holidayForm.reset();
    currentHolidayId = holidayDate; // For holidays, the ID is the date

    if (holidayDate) {
        addHolidayModalTitle.textContent = 'Edit Holiday';
        showLoading();
        const holidayData = await fetchData(`/holidays/${holidayDate}`);
        hideLoading();

        if (holidayData) {
            holidayDateInput.value = holidayData.date || '';
            holidayTitleInput.value = holidayData.title || '';
            holidayDescriptionTextarea.value = holidayData.description || '';
            holidayTypeInput.value = holidayData.type || '';
            saveHolidayBtn.textContent = 'Save Changes';
            // Disable date input in edit mode as it's the primary key
            holidayDateInput.disabled = true;
        } else {
            showMessageBox('Error', 'Failed to load holiday data for editing.', 'error');
            return;
        }
    } else {
        addHolidayModalTitle.textContent = 'Add New Holiday';
        holidayDateInput.value = new Date().toISOString().split('T')[0];
        saveHolidayBtn.textContent = 'Save Holiday';
        holidayDateInput.disabled = false; // Enable date input for new holidays
    }
    addHolidayModal.classList.add('active');
}

/**
 * Handles the submission of the holiday form.
 * @param {Event} e - The form submission event.
 */
async function handleHolidayFormSubmit(e) {
    e.preventDefault();

    const holidayData = {
        date: holidayDateInput.value,
        title: holidayTitleInput.value.trim(),
        description: holidayDescriptionTextarea.value.trim() || null,
        type: holidayTypeInput.value.trim() || null,
    };

    if (!holidayData.date || !holidayData.title) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    let result;
    if (currentHolidayId) {
        // For holidays, the PUT endpoint uses the date as the ID in the URL
        result = await sendData(`/holidays/${currentHolidayId}`, holidayData, 'PUT');
    } else {
        result = await sendData('/holidays', holidayData, 'POST');
    }

    if (result && (result.message === 'Holiday added successfully' || result.message === 'Holiday updated successfully')) {
        showMessageBox('Success', result.message, 'success');
        addHolidayModal.classList.remove('active');
        holidayForm.reset();
        renderPage('holidays');
    }
}

// Event Listeners for Holiday Modal
closeHolidayModalBtn.addEventListener('click', () => {
    addHolidayModal.classList.remove('active');
    holidayForm.reset();
    holidayDateInput.disabled = false; // Re-enable for next use
});
cancelHolidayBtn.addEventListener('click', () => {
    addHolidayModal.classList.remove('active');
    holidayForm.reset();
    holidayDateInput.disabled = false; // Re-enable for next use
});
addHolidayModal.addEventListener('click', (e) => {
    if (e.target === addHolidayModal) {
        addHolidayModal.classList.remove('active');
        holidayForm.reset();
        holidayDateInput.disabled = false; // Re-enable for next use
    }
});
holidayForm.addEventListener('submit', handleHolidayFormSubmit);


// ====================================================================
// ATTENDANCE RECORD EDITING FUNCTIONS (New)
// ====================================================================

// DOM elements for the dynamically created Edit Attendance Record Modal
let editAttendanceRecordModal;
let editAttendanceRecordModalTitle;
let closeEditAttendanceRecordModalBtn;
let cancelEditAttendanceRecordBtn;
let editAttendanceRecordForm;
let saveEditAttendanceRecordBtn;
let editAttendanceStudentIdInput;
let editAttendanceStudentNameInput;
let editAttendanceDateInput;
let editAttendanceStatusSelect;
let editAttendanceMorningStatusInput;
let editAttendanceAfternoonStatusInput;
let editAttendanceReasonTextarea;


/**
 * Dynamically creates and loads the Edit Attendance Record modal.
 * @param {string} attendanceId - The ID of the attendance record to edit.
 */
async function loadEditAttendanceRecordModal(attendanceId) {
    currentAttendanceRecordId = attendanceId;

    // If the modal already exists, remove it
    if (editAttendanceRecordModal) {
        editAttendanceRecordModal.remove();
    }

    // Create the modal HTML structure
    const modalHtml = `
        <div class="modal-overlay" id="editAttendanceRecordModal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title" id="editAttendanceRecordModalTitle">Edit Attendance Record</h2>
                    <button class="modal-close" id="closeEditAttendanceRecordModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editAttendanceRecordForm">
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceStudentId">Student ID</label>
                            <input type="text" class="form-control" id="editAttendanceStudentId" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceStudentName">Student Name</label>
                            <input type="text" class="form-control" id="editAttendanceStudentName" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceDate">Attendance Date</label>
                            <input type="date" class="form-control" id="editAttendanceDate" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceStatus">Status</label>
                            <select class="form-control" id="editAttendanceStatus" required>
                                <option value="full-present">Present</option>
                                <option value="full-absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="holiday">Holiday</option>
                                <option value="split">Split</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceMorningStatus">Morning Status (Optional)</label>
                            <input type="text" class="form-control" id="editAttendanceMorningStatus" placeholder="e.g., Present">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceAfternoonStatus">Afternoon Status (Optional)</label>
                            <input type="text" class="form-control" id="editAttendanceAfternoonStatus" placeholder="e.g., Absent">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="editAttendanceReason">Reason (Optional)</label>
                            <textarea class="form-control" id="editAttendanceReason" rows="2" placeholder="Reason for absence/lateness"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" id="cancelEditAttendanceRecordBtn">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="saveEditAttendanceRecordBtn">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Get the newly created DOM elements
    editAttendanceRecordModal = document.getElementById('editAttendanceRecordModal');
    editAttendanceRecordModalTitle = document.getElementById('editAttendanceRecordModalTitle');
    closeEditAttendanceRecordModalBtn = document.getElementById('closeEditAttendanceRecordModalBtn');
    cancelEditAttendanceRecordBtn = document.getElementById('cancelEditAttendanceRecordBtn');
    editAttendanceRecordForm = document.getElementById('editAttendanceRecordForm');
    saveEditAttendanceRecordBtn = document.getElementById('saveEditAttendanceRecordBtn');
    editAttendanceStudentIdInput = document.getElementById('editAttendanceStudentId');
    editAttendanceStudentNameInput = document.getElementById('editAttendanceStudentName');
    editAttendanceDateInput = document.getElementById('editAttendanceDate');
    editAttendanceStatusSelect = document.getElementById('editAttendanceStatus');
    editAttendanceMorningStatusInput = document.getElementById('editAttendanceMorningStatus');
    editAttendanceAfternoonStatusInput = document.getElementById('editAttendanceAfternoonStatus');
    editAttendanceReasonTextarea = document.getElementById('editAttendanceReason');

    // Add event listeners
    closeEditAttendanceRecordModalBtn.addEventListener('click', closeEditAttendanceRecordModal);
    cancelEditAttendanceRecordBtn.addEventListener('click', closeEditAttendanceRecordModal);
    editAttendanceRecordModal.addEventListener('click', (e) => {
        if (e.target === editAttendanceRecordModal) {
            closeEditAttendanceRecordModal();
        }
    });
    editAttendanceRecordForm.addEventListener('submit', handleEditAttendanceRecordSubmit);

    showLoading();
    const attendanceRecord = await fetchData(`/attendance-records/${attendanceId}`);
    const studentDetails = await fetchData(`/students/${attendanceRecord.student_id}`); // To get student name
    hideLoading();

    if (attendanceRecord && studentDetails) {
        editAttendanceStudentIdInput.value = attendanceRecord.student_id || '';
        editAttendanceStudentNameInput.value = studentDetails.name || 'N/A';
        editAttendanceDateInput.value = attendanceRecord.attendance_date ? new Date(attendanceRecord.attendance_date).toISOString().split('T')[0] : '';
        editAttendanceStatusSelect.value = attendanceRecord.status || 'full-present';
        editAttendanceMorningStatusInput.value = attendanceRecord.morning_status || '';
        editAttendanceAfternoonStatusInput.value = attendanceRecord.afternoon_status || '';
        editAttendanceReasonTextarea.value = attendanceRecord.reason || '';
    } else {
        showMessageBox('Error', 'Failed to load attendance record or student details.', 'error');
        closeEditAttendanceRecordModal();
        return;
    }

    editAttendanceRecordModal.classList.add('active');
}

/**
 * Closes the Edit Attendance Record modal.
 */
function closeEditAttendanceRecordModal() {
    if (editAttendanceRecordModal) {
        editAttendanceRecordModal.classList.remove('active');
        editAttendanceRecordForm.reset();
        // Remove the modal from the DOM
        editAttendanceRecordModal.remove();
        editAttendanceRecordModal = null; // Clear the reference
    }
}

/**
 * Handles the submission of the Edit Attendance Record form.
 * @param {Event} e - The form submission event.
 */
async function handleEditAttendanceRecordSubmit(e) {
    e.preventDefault();

    const attendanceData = {
        student_id: editAttendanceStudentIdInput.value.trim(),
        attendance_date: editAttendanceDateInput.value,
        status: editAttendanceStatusSelect.value,
        morning_status: editAttendanceMorningStatusInput.value.trim() || null,
        afternoon_status: editAttendanceAfternoonStatusInput.value.trim() || null,
        reason: editAttendanceReasonTextarea.value.trim() || null,
        holiday_name: null // This is only set for holiday status
    };

    if (!attendanceData.student_id || !attendanceData.attendance_date || !attendanceData.status) {
        showMessageBox('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    const result = await sendData(`/attendance-records/${currentAttendanceRecordId}`, attendanceData, 'PUT');

    if (result && result.message === 'Attendance record updated successfully') {
        showMessageBox('Success', 'Attendance record updated successfully!', 'success');
        closeEditAttendanceRecordModal();
        renderPage('attendance-records'); // Refresh the attendance records page
    }
}


// ====================================================================
// CENTRALIZED EVENT DELEGATION FOR ALL PAGE-SPECIFIC ACTIONS
// This replaces the individual event listeners in script.js for clarity and modularity.
// ====================================================================

document.body.addEventListener('click', async (e) => {
    const target = e.target.closest('.action-btn, .btn-primary'); // Catch action buttons and primary "Add" buttons

    if (!target) return;

    // --- Handle Main "Add" Buttons on each page header ---
    if (target.id === 'addLeaveBtn' && activePage === 'leaves') {
        e.stopPropagation();
        loadLeaveModal();
        return;
    } else if (target.id === 'addAchievementBtn' && activePage === 'achievements') {
        e.stopPropagation();
        loadAchievementModal();
        return;
    } else if (target.id === 'addCertificateBtn' && activePage === 'certificates') {
        e.stopPropagation();
        loadCertificateModal();
        return;
    } else if (target.id === 'addExamBtn' && activePage === 'exams') {
        e.stopPropagation();
        loadExamModal();
        return;
    } else if (target.id === 'addReportCardBtn' && activePage === 'report-cards') {
        e.stopPropagation();
        loadReportCardModal();
        return;
    } else if (target.id === 'addDiaryEntryBtn' && activePage === 'daily-diary') {
        e.stopPropagation();
        loadDiaryModal();
        return;
    } else if (target.id === 'addStudyMaterialBtn' && activePage === 'study-materials') {
        e.stopPropagation();
        loadStudyMaterialModal();
        return;
    } else if (target.id === 'addVideoClassBtn' && activePage === 'video-classes') {
        e.stopPropagation();
        loadVideoClassModal();
        return;
    } else if (target.id === 'addTimetableBtn' && activePage === 'class-timetables') {
        e.stopPropagation();
        loadTimetableModal();
        return;
    } else if (target.id === 'addOrderBtn' && activePage === 'orders') {
        e.stopPropagation();
        loadOrderModal();
        return;
    } else if (target.id === 'addAnnouncementBtn' && activePage === 'announcements') {
        e.stopPropagation();
        loadAnnouncementModal();
        return;
    } else if (target.id === 'addFeedbackBtn' && activePage === 'feedback') {
        e.stopPropagation();
        loadFeedbackModal();
        return;
    } else if (target.id === 'addHolidayBtn' && activePage === 'holidays') {
        e.stopPropagation();
        loadHolidayModal();
        return;
    } else if (target.id === 'addFeeRecordBtn' && activePage === 'fees') { // Added for fees page "Add" button
        e.stopPropagation();
        loadFeePaymentModal();
        return;
    }


    // --- Handle Table Action Buttons (View, Edit, Delete) ---
    const table = target.dataset.table; // e.g., 'leaves', 'student_achievements', 'certificates'
    const id = target.dataset.id; // The unique ID for the record

    if (!table || !id) return; // Not an action button with data-table/data-id

    // Determine the API endpoint based on the table name
    let apiEndpoint = '';
    let idField = 'id'; // Default ID field
    switch (table) {
        case 'student_profile': apiEndpoint = '/students'; break; // Added for student profile editing
        case 'leaves': apiEndpoint = '/leaves'; break;
        case 'student_achievements': apiEndpoint = '/achievements'; break;
        case 'certificates': apiEndpoint = '/certificates'; break;
        case 'exams': apiEndpoint = '/exams'; break;
        case 'report_cards': apiEndpoint = '/report-cards'; idField = 'report_id'; break;
        case 'diary': apiEndpoint = '/diary'; break;
        case 'study_materials': apiEndpoint = '/study-materials'; break;
        case 'video_classes': apiEndpoint = '/video-classes'; break;
        case 'class_timetables_links': apiEndpoint = '/timetables'; break;
        case 'orders': apiEndpoint = '/orders'; idField = 'order_id'; break;
        case 'notifications': apiEndpoint = '/announcements'; break; // Announcements use 'notifications' table
        case 'feedback': apiEndpoint = '/feedback'; break;
        case 'holidays': apiEndpoint = '/holidays'; idField = 'date'; break; // Holidays use 'date' as PK
        case 'attendance': apiEndpoint = '/attendance-records'; break; // New: For attendance records
        case 'fees': apiEndpoint = '/fees'; break; // Added for fee management
        default: return; // Not a recognized table
    }

    // Prevent script.js's generic handler from running for these specific tables
    e.stopPropagation();

    if (target.classList.contains('view-btn')) {
        showLoading();
        const itemData = await fetchData(`${apiEndpoint}/${id}`);
        hideLoading();
        if (itemData) {
            let detailsHtml = `<p><strong>${table.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Details:</strong></p>`;
            for (const key in itemData) {
                let value = itemData[key];
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
            showMessageBox('Error', 'Record not found for details.', 'error');
        }
    } else if (target.classList.contains('edit-btn')) {
        // Call the appropriate load modal function based on the table
        switch (table) {
            case 'student_profile': loadStudentModal(id); break; // Added for student profile editing
            case 'leaves': loadLeaveModal(id); break;
            case 'student_achievements': loadAchievementModal(id); break;
            case 'certificates': loadCertificateModal(id); break;
            case 'exams': loadExamModal(id); break;
            case 'report_cards': loadReportCardModal(id); break;
            case 'diary': loadDiaryModal(id); break;
            case 'study_materials': loadStudyMaterialModal(id); break;
            case 'video_classes': loadVideoClassModal(id); break;
            case 'class_timetables_links': loadTimetableModal(id); break;
            case 'orders': loadOrderModal(id); break;
            case 'notifications': loadAnnouncementModal(id); break;
            case 'feedback': loadFeedbackModal(id); break;
            case 'holidays': loadHolidayModal(id); break;
            case 'attendance': loadEditAttendanceRecordModal(id); break;
            case 'fees': loadFeePaymentModal(id); break; // Added for fee management
        }
    } else if (target.classList.contains('delete-btn')) {
        const confirmDelete = await showMessageBox('Confirm Deletion', `Are you sure you want to delete this record (ID: ${id})?`, 'error', true);

        if (confirmDelete) {
            const deleteEndpoint = `${apiEndpoint}/${id}`;
            const result = await sendData(deleteEndpoint, {}, 'DELETE');
            if (result && result.message && result.message.includes('deleted successfully')) {
                showMessageBox('Success', `${table.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} deleted successfully!`, 'success');
                renderPage(activePage); // Re-render the current page to refresh data
            }
        }
    }
});
