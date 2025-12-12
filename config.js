// script.js - Enhanced for Robustness and Error Prevention

// --- Configuration ---
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend API URL

// --- DOM Elements ---
// Main Layout Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const collapseBtn = document.getElementById('collapseBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const themeToggle = document.getElementById('themeToggle');

// Student Modals and Forms
const addStudentModal = document.getElementById('addStudentModal');
const addStudentModalTitle = document.getElementById('addStudentModalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentForm = document.getElementById('studentForm');
const saveStudentBtn = document.getElementById('saveStudentBtn');

// Attendance Modal Elements
const attendanceModal = document.getElementById('attendanceModal');
const closeAttendanceModal = document.getElementById('closeAttendanceModal');
const attendanceDateInput = document.getElementById('attendanceDate');
const attendanceClassSelect = document.getElementById('attendanceClass');
const attendanceSectionSelect = document.getElementById('attendanceSection');
const attendanceTableBody = document.getElementById('attendanceTableBody');
const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
const resetAttendanceBtn = document.getElementById('resetAttendanceBtn');

// Global Search Bar
const globalSearchBar = document.getElementById('globalSearchBar');

// View Student Details Modal
const viewStudentModal = document.getElementById('viewStudentModal');
const closeViewStudentModal = document.getElementById('closeViewStudentModal');
const viewStudentModalBody = document.getElementById('viewStudentModalBody');

// Record Payment Modal Elements
const recordPaymentModal = document.getElementById('recordPaymentModal');
const closeRecordPaymentModal = document.getElementById('closeRecordPaymentModal');
const paymentForm = document.getElementById('paymentForm');
const paymentStudentIdInput = document.getElementById('paymentStudentId');
const paymentAmountInput = document.getElementById('paymentAmount');
const paymentDateInput = document.getElementById('paymentDate');
const paymentMethodSelect = document.getElementById('paymentMethod');
const paymentDescriptionInput = document.getElementById('paymentDescription');
const paymentFeeTypeInput = document.getElementById('paymentFeeType');
const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
const savePaymentBtn = document.getElementById('savePaymentBtn');

// Receipt Modal Elements
const receiptModal = document.getElementById('receiptModal');
const closeReceiptModal = document.getElementById('closeReceiptModal');
const receiptModalBody = document.getElementById('receiptModalBody');
const printReceiptBtn = document.getElementById('printReceiptBtn');
const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');

// Dashboard elements (re-assigned dynamically after content loads)
let totalStudentsEl;
let studentsGrowthEl;
let todayAttendanceEl;
let absentTodayEl;
let pendingFeesEl;
let pendingFeesStudentsEl;
let upcomingExamsEl;
let nextExamEl;
// Removed activityFeedContent as the Recent Activity section is removed
let refreshDashboardBtn;
let addStudentBtnClone;
let markAttendanceQuickBtnClone;
let recordPaymentQuickBtn;
let sendAnnouncementQuickBtn;
let addDiaryEntryQuickBtn;

// Badges
const notificationBadge = document.getElementById('notification-badge');
const leavesBadge = document.getElementById('leaves-badge');

// Generic Message Box elements
const messageBoxOverlay = document.getElementById('messageBoxOverlay');
const messageBoxIcon = document.getElementById('messageBoxIcon');
const messageBoxTitle = document.getElementById('messageBoxTitle');
const messageBoxText = document.getElementById('messageBoxText');
const messageBoxOkBtn = document.getElementById('messageBoxOkBtn');

// Global Loading Overlay
const loadingOverlay = document.getElementById('loadingOverlay');


// --- Global Variables ---
let attendanceChart = null; // To store the ApexCharts instance for dashboard attendance trend
let studentClassDistributionChart = null; // For student profiles page
let feesStatusChart = null; // For fees page
let currentPageData = []; // Stores the raw data for the current page's table
let currentTableColumns = []; // Stores column definitions for the current table
let currentPage = 1;
const rowsPerPage = 10; // Number of rows per page for pagination
let currentSortColumn = null;
let currentSortDirection = 'asc'; // 'asc' or 'desc'
let activePage = 'dashboard'; // Keep track of the currently active page
