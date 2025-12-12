// events.js - Safe Event Binding with Null Checks

/**
 * Utility to safely add event listener
 * @param {string} selector - CSS selector or element ID
 * @param {string} event - Event type (e.g., 'click')
 * @param {Function} handler - Callback function
 */
function bindEvent(selector, event, handler) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) {
        el.addEventListener(event, handler);
    }
}

// ==================
// Global Events
// ==================
bindEvent('#messageBoxOkBtn', 'click', () => {
    messageBoxOverlay.classList.remove('active');
});

// ==================
// Dashboard Page Events
// ==================
function attachDashboardEvents() {
    bindEvent('#addStudentBtnClone', 'click', () => { /* open add student modal */ });
    bindEvent('#markAttendanceQuickBtnClone', 'click', loadAttendanceModal);
    bindEvent('#refreshDashboardBtnClone', 'click', loadDashboardData);
    bindEvent('#recordPaymentQuickBtn', 'click', loadRecordPaymentModal);
    bindEvent('#sendAnnouncementQuickBtn', 'click', () => loadAnnouncementModal());
    bindEvent('#addDiaryEntryQuickBtn', 'click', () => loadDiaryModal());
}

// ==================
// Student Profiles Page Events
// ==================
function attachStudentProfilesEvents() {
    bindEvent('#applyStudentFilters', 'click', () => { /* apply filters */ });
    bindEvent('#resetStudentFilters', 'click', resetFilters);
    bindEvent('#student-profiles-pagination #prevPageBtn', 'click', () => { /* prev page */ });
    bindEvent('#student-profiles-pagination #nextPageBtn', 'click', () => { /* next page */ });
}

// ==================
// Attendance Page Events
// ==================
function attachAttendanceEvents() {
    bindEvent('#markAttendanceBtnClone', 'click', loadAttendanceModal);
    bindEvent('#applyAttendanceFilters', 'click', () => { /* apply filters */ });
    bindEvent('#resetAttendanceFilters', 'click', resetFilters);
    bindEvent('#attendance-records-pagination #prevPageBtn', 'click', () => { /* prev page */ });
    bindEvent('#attendance-records-pagination #nextPageBtn', 'click', () => { /* next page */ });
}

// ==================
// Other Pages (Leaves, Achievements, Certificates, Exams, Report Cards, Diary, Study Materials, Video Classes, Timetable, Events, Fees)
// ==================
function attachGenericListEvents(pagePrefix, addBtnHandler, filterHandler) {
    bindEvent(`#add${pagePrefix}Btn`, 'click', addBtnHandler);
    bindEvent(`#apply${pagePrefix}Filters`, 'click', filterHandler);
    bindEvent(`#reset${pagePrefix}Filters`, 'click', resetFilters);
    bindEvent(`#${pagePrefix.toLowerCase()}-pagination #prevPageBtn`, 'click', () => { /* prev */ });
    bindEvent(`#${pagePrefix.toLowerCase()}-pagination #nextPageBtn`, 'click', () => { /* next */ });
}

// ==================
// Master Attach Function (Call After Page Load)
// ==================
function attachPageEvents(page) {
    switch (page) {
        case 'dashboard':
            attachDashboardEvents();
            break;
        case 'student-profiles':
            attachStudentProfilesEvents();
            break;
        case 'attendance-records':
            attachAttendanceEvents();
            break;
        case 'leaves':
            attachGenericListEvents('Leave', () => loadLeaveModal(), () => { /* apply leaves filter */ });
            break;
        case 'achievements':
            attachGenericListEvents('Achievement', () => loadAchievementModal(), () => { /* apply achievements filter */ });
            break;
        case 'certificates':
            attachGenericListEvents('Certificate', () => loadCertificateModal(), () => { /* apply certificates filter */ });
            break;
        case 'exams':
            attachGenericListEvents('Exam', () => loadExamModal(), () => { /* apply exams filter */ });
            break;
        case 'report-cards':
            attachGenericListEvents('ReportCard', () => loadReportCardModal(), () => { /* apply report cards filter */ });
            break;
        case 'daily-diary':
            attachGenericListEvents('DiaryEntry', () => loadDiaryModal(), () => { /* apply diary filter */ });
            break;
        case 'study-materials':
            attachGenericListEvents('StudyMaterial', () => loadStudyMaterialModal(), () => { /* apply study materials filter */ });
            break;
        case 'video-classes':
            attachGenericListEvents('VideoClass', () => loadVideoClassModal(), () => { /* apply video class filter */ });
            break;
        case 'timetable':
            attachGenericListEvents('Timetable', () => loadTimetableModal(), () => { /* apply timetable filter */ });
            break;
        case 'events':
            attachGenericListEvents('Event', () => loadEventModal(), () => { /* apply events filter */ });
            break;
        case 'fees':
            attachGenericListEvents('Payment', () => loadRecordPaymentModal(), () => { /* apply fees filter */ });
            break;
        default:
            console.warn(`No event bindings defined for page: ${page}`);
    }
}
