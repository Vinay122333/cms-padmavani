async function renderPage(pageName) {
    activePage = pageName; // Set active page
    currentPage = 1; // Reset pagination for new page
    currentSortColumn = null; // Reset sorting for new page
    currentSortDirection = 'asc';
    globalSearchBar.value = ''; // Clear global search when changing pages

    let pageTitleText = '';
    let pageContentHtml = '';
    let pageActionsHtml = '';

    // Clear previous content
    contentArea.innerHTML = '';

    // Destroy existing chart instances before rendering new content
    if (attendanceChart) {
        attendanceChart.destroy();
        attendanceChart = null;
    }
    if (studentClassDistributionChart) {
        studentClassDistributionChart.destroy();
        studentClassDistributionChart = null;
    }
    if (feesStatusChart) {
        feesStatusChart.destroy();
        feesStatusChart = null;
    }

    switch (pageName) {
        case 'dashboard':
            pageTitleText = 'Dashboard';
            pageActionsHtml = `
                <button class="btn btn-outline" id="refreshDashboardBtnClone">
                    <span class="material-icons">refresh</span>
                    Refresh
                </button>
                <button class="btn btn-primary" id="addStudentBtnClone">
                    <span class="material-icons">add</span>
                    Add Student
                </button>
            `;
            pageContentHtml = `
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">Total Students</div>
                                <div class="card-value" id="totalStudents"></div>
                                <div class="card-description" id="studentsGrowth"></div>
                            </div>
                            <div class="card-icon blue">
                                <span class="material-icons">people</span>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">Today's Attendance</div>
                                <div class="card-value" id="todayAttendance"></div>
                                <div class="card-description" id="absentToday"></div>
                            </div>
                            <div class="card-icon green">
                                <span class="material-icons">event_available</span>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">Pending Fees</div>
                                <div class="card-value" id="pendingFees"></div>
                                <div class="card-description" id="pendingFeesStudents"></div>
                            </div>
                            <div class="card-icon orange">
                                <span class="material-icons">payments</span>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">Upcoming Exams</div>
                                <div class="card-value" id="upcomingExams"></div>
                                <div class="card-description" id="nextExam"></div>
                            </div>
                            <div class="card-icon red">
                                <span class="material-icons">assignment</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dashboard-grid">
                    <div class="chart-container">
                        <div class="card-header">
                            <div class="card-title">Attendance Trend (Last 30 Days)</div>
                            <div>
                                <button class="btn btn-outline" style="padding: 5px 10px; font-size: 12px;">
                                    Export
                                </button>
                            </div>
                        </div>
                        <div id="attendanceChart" style="height: 100%;"></div>
                    </div>
                    
                </div>
                <!-- Removed Recent Activity Section -->
                <div style="margin-top: 30px;">
                    <div class="card-header">
                        <div class="card-title">Quick Actions</div>
                    </div>
                    <div class="quick-actions-grid">
                        <button class="btn btn-outline" id="markAttendanceQuickBtnClone">
                            <span class="material-icons">event_available</span>
                            Mark Attendance
                        </button>
                        <button class="btn btn-outline" id="recordPaymentQuickBtn">
                            <span class="material-icons">payments</span>
                            Record Payment
                        </button>
                        <button class="btn btn-outline" id="sendAnnouncementQuickBtn">
                            <span class="material-icons">announcement</span>
                            Send Announcement
                        </button>
                        <button class="btn btn-outline" id="addDiaryEntryQuickBtn">
                            <span class="material-icons">book</span>
                            Add Diary Entry
                        </button>
                    </div>
                </div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Re-assign elements after content is loaded
            totalStudentsEl = document.getElementById('totalStudents');
            studentsGrowthEl = document.getElementById('studentsGrowth');
            todayAttendanceEl = document.getElementById('todayAttendance');
            absentTodayEl = document.getElementById('absentToday');
            pendingFeesEl = document.getElementById('pendingFees');
            pendingFeesStudentsEl = document.getElementById('pendingFeesStudents');
            upcomingExamsEl = document.getElementById('upcomingExams');
            nextExamEl = document.getElementById('nextExam');
            // Removed activityFeedContent as the Recent Activity section is removed
            
            // Re-attach event listeners for cloned buttons
            document.getElementById('addStudentBtnClone').addEventListener('click', () => {
                addStudentModalTitle.textContent = 'Add New Student';
                saveStudentBtn.textContent = 'Save Student';
                studentForm.reset();
                addStudentModal.classList.add('active');
            });
            document.getElementById('markAttendanceQuickBtnClone').addEventListener('click', loadAttendanceModal);
            document.getElementById('refreshDashboardBtnClone').addEventListener('click', loadDashboardData);
            document.getElementById('recordPaymentQuickBtn').addEventListener('click', loadRecordPaymentModal); // New listener
            // Replaced showMessageBox with direct calls to load functions from all-features-management.js
            document.getElementById('sendAnnouncementQuickBtn').addEventListener('click', () => loadAnnouncementModal());
            document.getElementById('addDiaryEntryQuickBtn').addEventListener('click', () => loadDiaryModal());


            await loadDashboardData();
            break;

        case 'student-profiles':
            pageTitleText = 'Student Profiles';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addStudentBtnClone">
                    <span class="material-icons">add</span>
                    Add Student
                </button>
            `;
            const students = await fetchData('/students');
            const studentColumns = [
                { header: 'ID', field: 'student_id', sortable: true },
                { header: 'Name', field: 'name', sortable: true },
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Section', field: 'section', sortable: true },
                { header: 'Roll No.', field: 'roll_number', sortable: true },
                { header: 'Gender', field: 'gender', sortable: true },
                { header: 'Phone', field: 'phone_number' },
                { header: 'Enrollment Date', field: 'enrollment_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.student_id}" data-table="student_profile"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Student" data-id="${row.student_id}" data-table="student_profile"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Student" data-id="${row.student_id}" data-table="student_profile"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="studentClassFilter">Class</label>
                        <select id="studentClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="studentSectionFilter">Section</label>
                        <select id="studentSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="studentGenderFilter">Gender</label>
                        <select id="studentGenderFilter" class="form-control">
                            <option value="">All</option>
                            <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyStudentFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetStudentFilters">Reset Filters</button>
                    </div>
                </div>
                <div class="dashboard-grid" style="grid-template-columns: 1fr;">
                    <div class="chart-container">
                        <div class="card-header">
                            <div class="card-title">Student Distribution by Class</div>
                        </div>
                        <div id="studentClassDistributionChart" style="height: 100%;"></div>
                    </div>
                </div>
                <div id="student-profiles-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            document.getElementById('addStudentBtnClone').addEventListener('click', () => {
                addStudentModalTitle.textContent = 'Add New Student';
                saveStudentBtn.textContent = 'Save Student';
                studentForm.reset();
                addStudentModal.classList.add('active');
            });
            
            const studentProfilesTableContainer = document.getElementById('student-profiles-table-container');
            studentProfilesTableContainer.appendChild(renderTable(students, studentColumns, 'student-profiles-table', 'student-profiles-pagination'));
            updateTableRows(students, studentColumns, 'student-profiles-table', 'student-profiles-pagination');

            // Attach filter event listeners
            document.getElementById('applyStudentFilters').addEventListener('click', () => {
                currentPage = 1; // Reset to first page on filter change
                updateTableRows(students, studentColumns, 'student-profiles-table', 'student-profiles-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetStudentFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#student-profiles-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(students, studentColumns, 'student-profiles-table', 'student-profiles-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#student-profiles-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage); // Use currentPageData (filtered)
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(students, studentColumns, 'student-profiles-table', 'student-profiles-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('student-profiles-table', students, studentColumns, '/students');
            await updateStudentClassDistributionChart();
            break;

        case 'attendance-records':
            pageTitleText = 'Attendance Records';
            pageActionsHtml = `
                <button class="btn btn-primary" id="markAttendanceBtnClone">
                    <span class="material-icons">add</span>
                    Mark Attendance
                </button>
            `;
            const attendanceRecords = await fetchData('/attendance-records');
            const attendanceColumns = [
                { header: 'Date', field: 'attendance_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Status', field: 'status', sortable: true, render: (val) => `<span class="status-badge ${val.replace(' ', '-')}">${val.replace('-', ' ')}</span>` },
                { header: 'Morning', field: 'morning_status', render: (val) => val || 'N/A' },
                { header: 'Afternoon', field: 'afternoon_status', render: (val) => val || 'N/A' },
                { header: 'Reason', field: 'reason', render: (val) => val || 'N/A' },
                { header: 'Holiday Name', field: 'holiday_name', render: (val) => val || 'N/A' },
                { header: 'Recorded At', field: 'recorded_at', sortable: true, render: (val) => new Date(val).toLocaleString() },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.attendance_id}" data-table="attendance"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Record" data-id="${row.attendance_id}" data-table="attendance"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Record" data-id="${row.attendance_id}" data-table="attendance"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="attendanceRecordsClassFilter">Class</label>
                        <select id="attendanceRecordsClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="attendanceRecordsSectionFilter">Section</label>
                        <select id="attendanceRecordsSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="attendanceRecordsStatusFilter">Status</label>
                        <select id="attendanceRecordsStatusFilter" class="form-control">
                            <option value="">All</option>
                            <option value="full-present">Present</option>
                            <option value="full-absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="holiday">Holiday</option>
                            <option value="split">Split</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="attendanceRecordsStartDate">Start Date</label>
                        <input type="date" id="attendanceRecordsStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="attendanceRecordsEndDate">End Date</label>
                        <input type="date" id="attendanceRecordsEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyAttendanceFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetAttendanceFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="attendance-records-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            document.getElementById('markAttendanceBtnClone').addEventListener('click', loadAttendanceModal);
            
            const attendanceRecordsTableContainer = document.getElementById('attendance-records-table-container');
            attendanceRecordsTableContainer.appendChild(renderTable(attendanceRecords, attendanceColumns, 'attendance-records-table', 'attendance-records-pagination'));
            updateTableRows(attendanceRecords, attendanceColumns, 'attendance-records-table', 'attendance-records-pagination');

            // Attach filter event listeners
            document.getElementById('applyAttendanceFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(attendanceRecords, attendanceColumns, 'attendance-records-table', 'attendance-records-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetAttendanceFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#attendance-records-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(attendanceRecords, attendanceColumns, 'attendance-records-table', 'attendance-records-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#attendance-records-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(attendanceRecords, attendanceColumns, 'attendance-records-table', 'attendance-records-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('attendance-records-table', attendanceRecords, attendanceColumns, '/attendance-records');
            break;

        case 'leaves':
            pageTitleText = 'Leave Applications';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addLeaveBtn">
                    <span class="material-icons">add</span>
                    Add Leave
                </button>
            `;
            const leaves = await fetchData('/leaves');
            const leaveColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Leave Type', field: 'leave_type', sortable: true },
                { header: 'Start Date', field: 'start_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'End Date', field: 'end_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Reason', field: 'reason' },
                { header: 'Status', field: 'status', sortable: true, render: (val) => `<span class="status-badge ${val.toLowerCase()}">${val}</span>` },
                { header: 'Applied On', field: 'applied_on', sortable: true, render: (val) => new Date(val).toLocaleString() },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="leaves"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Leave" data-id="${row.id}" data-table="leaves"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Leave" data-id="${row.id}" data-table="leaves"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="leavesStudentIdFilter">Student ID</label>
                        <input type="text" id="leavesStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="leavesStatusFilter">Status</label>
                        <select id="leavesStatusFilter" class="form-control">
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="leavesStartDate">Start Date</label>
                        <input type="date" id="leavesStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="leavesEndDate">End Date</label>
                        <input type="date" id="leavesEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyLeavesFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetLeavesFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="leaves-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadLeaveModal from all-features-management.js
            document.getElementById('addLeaveBtn').addEventListener('click', () => loadLeaveModal());
            
            const leavesTableContainer = document.getElementById('leaves-table-container');
            leavesTableContainer.appendChild(renderTable(leaves, leaveColumns, 'leaves-table', 'leaves-pagination'));
            updateTableRows(leaves, leaveColumns, 'leaves-table', 'leaves-pagination');

            // Attach filter event listeners
            document.getElementById('applyLeavesFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(leaves, leaveColumns, 'leaves-table', 'leaves-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetLeavesFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#leaves-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(leaves, leaveColumns, 'leaves-table', 'leaves-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#leaves-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(leaves, leaveColumns, 'leaves-table', 'leaves-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('leaves-table', leaves, leaveColumns, '/leaves');
            break;

        case 'achievements':
            pageTitleText = 'Student Achievements';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addAchievementBtn">
                    <span class="material-icons">add</span>
                    Add Achievement
                </button>
            `;
            const achievements = await fetchData('/achievements');
            const achievementColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Student Name', field: 'student_name', sortable: true },
                { header: 'Title', field: 'title', sortable: true },
                { header: 'Description', field: 'description' },
                { header: 'Date', field: 'date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Type', field: 'type', sortable: true },
                { header: 'Tags', field: 'tags', render: (val) => val ? val.join(', ') : 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="student_achievements"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Achievement" data-id="${row.id}" data-table="student_achievements"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Achievement" data-id="${row.id}" data-table="student_achievements"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="achievementsStudentIdFilter">Student ID</label>
                        <input type="text" id="achievementsStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="achievementsClassFilter">Class</label>
                        <select id="achievementsClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="achievementsSectionFilter">Section</label>
                        <select id="achievementsSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="achievementsTypeFilter">Type</label>
                        <input type="text" id="achievementsTypeFilter" class="form-control" placeholder="e.g., Sports">
                    </div>
                    <div class="filter-group">
                        <label for="achievementsStartDate">Start Date</label>
                        <input type="date" id="achievementsStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="achievementsEndDate">End Date</label>
                        <input type="date" id="achievementsEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyAchievementsFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetAchievementsFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="achievements-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadAchievementModal from all-features-management.js
            document.getElementById('addAchievementBtn').addEventListener('click', () => loadAchievementModal());
            
            const achievementsTableContainer = document.getElementById('achievements-table-container');
            achievementsTableContainer.appendChild(renderTable(achievements, achievementColumns, 'achievements-table', 'achievements-pagination'));
            updateTableRows(achievements, achievementColumns, 'achievements-table', 'achievements-pagination');

            // Attach filter event listeners
            document.getElementById('applyAchievementsFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(achievements, achievementColumns, 'achievements-table', 'achievements-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetAchievementsFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#achievements-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(achievements, achievementColumns, 'achievements-table', 'achievements-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#achievements-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(achievements, achievementColumns, 'achievements-table', 'achievements-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('achievements-table', achievements, achievementColumns, '/achievements');
            break;

        case 'certificates':
            pageTitleText = 'Certificates';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addCertificateBtn">
                    <span class="material-icons">add</span>
                    Add Certificate
                </button>
            `;
            const certificates = await fetchData('/certificates');
            const certificateColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Title', field: 'title', sortable: true },
                { header: 'Organization', field: 'issuing_organization', sortable: true },
                { header: 'Issue Date', field: 'issue_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'URL', field: 'certificate_url', render: (val) => val ? `<a href="${val}" target="_blank" class="text-link">View</a>` : 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="certificates"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Certificate" data-id="${row.id}" data-table="certificates"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Certificate" data-id="${row.id}" data-table="certificates"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="certificatesStudentIdFilter">Student ID</label>
                        <input type="text" id="certificatesStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="certificatesClassFilter">Class</label>
                        <select id="certificatesClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="certificatesSectionFilter">Section</label>
                        <select id="certificatesSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="certificatesOrganizationFilter">Organization</label>
                        <input type="text" id="certificatesOrganizationFilter" class="form-control" placeholder="e.g., CBSE">
                    </div>
                    <div class="filter-group">
                        <label for="certificatesIssueStartDate">Issue Start Date</label>
                        <input type="date" id="certificatesIssueStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="certificatesIssueEndDate">Issue End Date</label>
                        <input type="date" id="certificatesIssueEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyCertificatesFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetCertificatesFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="certificates-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadCertificateModal from all-features-management.js
            document.getElementById('addCertificateBtn').addEventListener('click', () => loadCertificateModal());
            
            const certificatesTableContainer = document.getElementById('certificates-table-container');
            certificatesTableContainer.appendChild(renderTable(certificates, certificateColumns, 'certificates-table', 'certificates-pagination'));
            updateTableRows(certificates, certificateColumns, 'certificates-table', 'certificates-pagination');

            // Attach filter event listeners
            document.getElementById('applyCertificatesFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(certificates, certificateColumns, 'certificates-table', 'certificates-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetCertificatesFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#certificates-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(certificates, certificateColumns, 'certificates-table', 'certificates-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#certificates-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(certificates, certificateColumns, 'certificates-table', 'certificates-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('certificates-table', certificates, certificateColumns, '/certificates');
            break;

        case 'exams':
            pageTitleText = 'Exams';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addExamBtn">
                    <span class="material-icons">add</span>
                    Add Exam
                </button>
            `;
            const exams = await fetchData('/exams');
            const examColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Exam Name', field: 'exam_name', sortable: true },
                { header: 'Subject', field: 'subject', sortable: true },
                { header: 'Date', field: 'exam_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Time', field: 'exam_time', render: (val) => val ? val.substring(0, 5) : 'N/A' }, // Format time
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Section', field: 'section', sortable: true },
                { header: 'Topic', field: 'topic' },
                { header: 'Room', field: 'room' },
                { header: 'Total Marks', field: 'total_marks', sortable: true },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="exams"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Exam" data-id="${row.id}" data-table="exams"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Exam" data-id="${row.id}" data-table="exams"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="examsClassFilter">Class</label>
                        <select id="examsClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="examsSubjectFilter">Subject</label>
                        <input type="text" id="examsSubjectFilter" class="form-control" placeholder="e.g., Math">
                    </div>
                    <div class="filter-group">
                        <label for="examsStartDate">Start Date</label>
                        <input type="date" id="examsStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="examsEndDate">End Date</labeL>
                        <input type="date" id="examsEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyExamsFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetExamsFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="exams-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadExamModal from all-features-management.js
            document.getElementById('addExamBtn').addEventListener('click', () => loadExamModal());
            
            const examsTableContainer = document.getElementById('exams-table-container');
            examsTableContainer.appendChild(renderTable(exams, examColumns, 'exams-table', 'exams-pagination'));
            updateTableRows(exams, examColumns, 'exams-table', 'exams-pagination');

            // Attach filter event listeners
            document.getElementById('applyExamsFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(exams, examColumns, 'exams-table', 'exams-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetExamsFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#exams-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(exams, examColumns, 'exams-table', 'exams-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#exams-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(exams, examColumns, 'exams-table', 'exams-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('exams-table', exams, examColumns, '/exams');
            break;

        case 'report-cards':
            pageTitleText = 'Report Cards';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addReportCardBtn">
                    <span class="material-icons">add</span>
                    Add Report Card
                </button>
            `;
            const reportCards = await fetchData('/report-cards');
            const reportCardColumns = [
                { header: 'ID', field: 'report_id', sortable: true },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Academic Year', field: 'academic_year', sortable: true },
                { header: 'Term/Semester', field: 'term_semester', sortable: true },
                { header: 'Date Generated', field: 'date_generated', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Overall %', field: 'overall_percentage', sortable: true, render: (val) => val ? `${val}%` : 'N/A' },
                { header: 'Overall Grade', field: 'overall_grade', sortable: true },
                { header: 'Subjects Passed', field: 'subjects_passed', sortable: true },
                { header: 'Total Subjects', field: 'total_subjects', sortable: true },
                { header: 'Remarks', field: 'teacher_remarks', render: (val) => val || 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.report_id}" data-table="report_cards"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Report Card" data-id="${row.report_id}" data-table="report_cards"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Report Card" data-id="${row.report_id}" data-table="report_cards"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="reportCardsStudentIdFilter">Student ID</label>
                        <input type="text" id="reportCardsStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="reportCardsClassFilter">Class</label>
                        <select id="reportCardsClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="reportCardsSectionFilter">Section</label>
                        <select id="reportCardsSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="reportCardsAcademicYearFilter">Academic Year</label>
                        <input type="text" id="reportCardsAcademicYearFilter" class="form-control" placeholder="e.g., 2023-2024">
                    </div>
                    <div class="filter-group">
                        <label for="reportCardsTermFilter">Term/Semester</label>
                        <input type="text" id="reportCardsTermFilter" class="form-control" placeholder="e.g., Term 1">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyReportCardsFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetReportCardsFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="report-cards-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadReportCardModal from all-features-management.js
            document.getElementById('addReportCardBtn').addEventListener('click', () => loadReportCardModal());
            
            const reportCardsTableContainer = document.getElementById('report-cards-table-container');
            reportCardsTableContainer.appendChild(renderTable(reportCards, reportCardColumns, 'report-cards-table', 'report-cards-pagination'));
            updateTableRows(reportCards, reportCardColumns, 'report-cards-table', 'report-cards-pagination');

            // Attach filter event listeners
            document.getElementById('applyReportCardsFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(reportCards, reportCardColumns, 'report-cards-table', 'report-cards-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetReportCardsFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#report-cards-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(reportCards, reportCardColumns, 'report-cards-table', 'report-cards-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#report-cards-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(reportCards, reportCardColumns, 'report-cards-table', 'report-cards-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('report-cards-table', reportCards, reportCardColumns, '/report-cards');
            break;

        case 'daily-diary':
            pageTitleText = 'Daily Diary';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addDiaryEntryBtn">
                    <span class="material-icons">add</span>
                    Add Entry
                </button>
            `;
            const diaryEntries = await fetchData('/diary');
            const diaryColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Date', field: 'date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Section', field: 'section', sortable: true },
                { header: 'Subject', field: 'subject', sortable: true },
                { header: 'Content', field: 'content' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="diary"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Entry" data-id="${row.id}" data-table="diary"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Entry" data-id="${row.id}" data-table="diary"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="diaryClassFilter">Class</label>
                        <select id="diaryClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="diarySectionFilter">Section</label>
                        <select id="diarySectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="diarySubjectFilter">Subject</label>
                        <input type="text" id="diarySubjectFilter" class="form-control" placeholder="e.g., Math">
                    </div>
                    <div class="filter-group">
                        <label for="diaryStartDate">Start Date</label>
                        <input type="date" id="diaryStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="diaryEndDate">End Date</labeL>
                        <input type="date" id="diaryEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyDiaryFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetDiaryFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="daily-diary-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadDiaryModal from all-features-management.js
            document.getElementById('addDiaryEntryBtn').addEventListener('click', () => loadDiaryModal());
            
            const diaryTableContainer = document.getElementById('daily-diary-table-container');
            diaryTableContainer.appendChild(renderTable(diaryEntries, diaryColumns, 'daily-diary-table', 'daily-diary-pagination'));
            updateTableRows(diaryEntries, diaryColumns, 'daily-diary-table', 'daily-diary-pagination');

            // Attach filter event listeners
            document.getElementById('applyDiaryFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(diaryEntries, diaryColumns, 'daily-diary-table', 'daily-diary-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetDiaryFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#daily-diary-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(diaryEntries, diaryColumns, 'daily-diary-table', 'daily-diary-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#daily-diary-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(diaryEntries, diaryColumns, 'daily-diary-table', 'daily-diary-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('daily-diary-table', diaryEntries, diaryColumns, '/diary');
            break;

        case 'study-materials':
            pageTitleText = 'Study Materials';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addStudyMaterialBtn">
                    <span class="material-icons">add</span>
                    Add Material
                </button>
            `;
            const studyMaterials = await fetchData('/study-materials');
            const studyMaterialColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Subject', field: 'subject', sortable: true },
                { header: 'Title', field: 'title', sortable: true },
                { header: 'File', field: 'file_url', render: (val) => val ? `<a href="${val}" target="_blank" class="text-link">Download</a>` : 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="study_materials"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Material" data-id="${row.id}" data-table="study_materials"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Material" data-id="${row.id}" data-table="study_materials"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="studyMaterialClassFilter">Class</label>
                        <select id="studyMaterialClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="studyMaterialSubjectFilter">Subject</label>
                        <input type="text" id="studyMaterialSubjectFilter" class="form-control" placeholder="e.g., Science">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyStudyMaterialFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetStudyMaterialFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="study-materials-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadStudyMaterialModal from all-features-management.js
            document.getElementById('addStudyMaterialBtn').addEventListener('click', () => loadStudyMaterialModal());
            
            const studyMaterialsTableContainer = document.getElementById('study-materials-table-container');
            studyMaterialsTableContainer.appendChild(renderTable(studyMaterials, studyMaterialColumns, 'study-materials-table', 'study-materials-pagination'));
            updateTableRows(studyMaterials, studyMaterialColumns, 'study-materials-table', 'study-materials-pagination');

            // Attach filter event listeners
            document.getElementById('applyStudyMaterialFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(studyMaterials, studyMaterialColumns, 'study-materials-table', 'study-materials-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetStudyMaterialFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#study-materials-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(studyMaterials, studyMaterialColumns, 'study-materials-table', 'study-materials-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#study-materials-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(studyMaterials, studyMaterialColumns, 'study-materials-table', 'study-materials-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('study-materials-table', studyMaterials, studyMaterialColumns, '/study-materials');
            break;

        case 'video-classes':
            pageTitleText = 'Video Classes';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addVideoClassBtn">
                    <span class="material-icons">add</span>
                    Add Video Class
                </button>
            `;
            const videoClasses = await fetchData('/video-classes');
            const videoClassColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Subject', field: 'subject', sortable: true },
                { header: 'Title', field: 'title', sortable: true },
                { header: 'Video', field: 'video_url', render: (val) => val ? `<a href="${val}" target="_blank" class="text-link">Watch</a>` : 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="video_classes"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Video Class" data-id="${row.id}" data-table="video_classes"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Video Class" data-id="${row.id}" data-table="video_classes"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="videoClassClassFilter">Class</label>
                        <select id="videoClassClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="videoClassSubjectFilter">Subject</label>
                        <input type="text" id="videoClassSubjectFilter" class="form-control" placeholder="e.g., Physics">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyVideoClassFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetVideoClassFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="video-classes-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadVideoClassModal from all-features-management.js
            document.getElementById('addVideoClassBtn').addEventListener('click', () => loadVideoClassModal());
            
            const videoClassesTableContainer = document.getElementById('video-classes-table-container');
            videoClassesTableContainer.appendChild(renderTable(videoClasses, videoClassColumns, 'video-classes-table', 'video-classes-pagination'));
            updateTableRows(videoClasses, videoClassColumns, 'video-classes-table', 'video-classes-pagination');

            // Attach filter event listeners
            document.getElementById('applyVideoClassFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(videoClasses, videoClassColumns, 'video-classes-table', 'video-classes-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetVideoClassFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#video-classes-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(videoClasses, videoClassColumns, 'video-classes-table', 'video-classes-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#video-classes-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(videoClasses, videoClassColumns, 'video-classes-table', 'video-classes-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('video-classes-table', videoClasses, videoClassColumns, '/video-classes');
            break;

        case 'class-timetables':
            pageTitleText = 'Class Timetables';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addTimetableBtn">
                    <span class="material-icons">add</span>
                    Add Timetable
                </button>
            `;
            const timetables = await fetchData('/timetables');
            const timetableColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Section', field: 'section', sortable: true },
                { header: 'Excel Link', field: 'excel_sheet_link', render: (val) => val ? `<a href="${val}" target="_blank" class="text-link">View Excel</a>` : 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="class_timetables_links"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Timetable" data-id="${row.id}" data-table="class_timetables_links"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Timetable" data-id="${row.id}" data-table="class_timetables_links"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="timetableClassFilter">Class</label>
                        <select id="timetableClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="timetableSectionFilter">Section</label>
                        <select id="timetableSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyTimetableFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetTimetableFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="class-timetables-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadTimetableModal from all-features-management.js
            document.getElementById('addTimetableBtn').addEventListener('click', () => loadTimetableModal());
            
            const timetablesTableContainer = document.getElementById('class-timetables-table-container');
            timetablesTableContainer.appendChild(renderTable(timetables, timetableColumns, 'class-timetables-table', 'class-timetables-pagination'));
            updateTableRows(timetables, timetableColumns, 'class-timetables-table', 'class-timetables-pagination');

            // Attach filter event listeners
            document.getElementById('applyTimetableFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(timetables, timetableColumns, 'class-timetables-table', 'class-timetables-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetTimetableFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#class-timetables-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(timetables, timetableColumns, 'class-timetables-table', 'class-timetables-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#class-timetables-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(timetables, timetableColumns, 'class-timetables-table', 'class-timetables-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('class-timetables-table', timetables, timetableColumns, '/timetables');
            break;

        case 'fees':
            pageTitleText = 'Fees Management';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addFeeRecordBtn">
                    <span class="material-icons">add</span>
                    Add Fee Record
                </button>
            `;
            const fees = await fetchData('/fees');
            const feeColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Payment Date', field: 'payment_date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Amount', field: 'transaction_amount', sortable: true, render: (val) => `₹${parseFloat(val).toLocaleString()}` },
                { header: 'Method', field: 'payment_method', sortable: true },
                { header: 'Description', field: 'description' },
                { header: 'Type', field: 'fee_type', sortable: true },
                { header: 'Status', field: 'status', sortable: true, render: (val) => `<span class="status-badge ${val.toLowerCase()}">${val}</span>` },
                { header: 'Transaction ID', field: 'transaction_id' },
                { header: 'Receipt', field: 'receipt_url', render: (val, row) => val ? `<button class="action-btn" title="View Receipt" data-id="${row.id}" data-table="fees" data-action="view-receipt"><span class="material-icons">receipt_long</span></button>` : 'N/A' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="fees"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Record" data-id="${row.id}" data-table="fees"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Record" data-id="${row.id}" data-table="fees"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="feesStudentIdFilter">Student ID</label>
                        <input type="text" id="feesStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="feesStatusFilter">Status</label>
                        <select id="feesStatusFilter" class="form-control">
                            <option value="">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="feesMethodFilter">Method</label>
                        <input type="text" id="feesMethodFilter" class="form-control" placeholder="e.g., Online">
                    </div>
                    <div class="filter-group">
                        <label for="feesStartDate">Start Date</label>
                        <input type="date" id="feesStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="feesEndDate">End Date</labeL>
                        <input type="date" id="feesEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyFeesFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetFeesFilters">Reset Filters</button>
                    </div>
                </div>
                <div class="dashboard-grid" style="grid-template-columns: 1fr;">
                    <div class="chart-container">
                        <div class="card-header">
                            <div class="card-title">Fees Collection Status</div>
                        </div>
                        <div id="feesStatusChart" style="height: 100%;"></div>
                    </div>
                </div>
                <div id="fees-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            document.getElementById('addFeeRecordBtn').addEventListener('click', loadRecordPaymentModal); // Use the new record payment modal
            
            const feesTableContainer = document.getElementById('fees-table-container');
            feesTableContainer.appendChild(renderTable(fees, feeColumns, 'fees-table', 'fees-pagination'));
            updateTableRows(fees, feeColumns, 'fees-table', 'fees-pagination');

            // Attach filter event listeners
            document.getElementById('applyFeesFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(fees, feeColumns, 'fees-table', 'fees-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetFeesFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#fees-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(fees, feeColumns, 'fees-table', 'fees-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#fees-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(fees, feeColumns, 'fees-table', 'fees-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('fees-table', fees, feeColumns, '/fees');
            await updateFeesStatusChart();
            break;

        case 'orders':
            pageTitleText = 'Orders';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addOrderBtn">
                    <span class="material-icons">add</span>
                    Add Order
                </button>
            `;
            const orders = await fetchData('/orders');
            const orderColumns = [
                { header: 'ID', field: 'order_id', sortable: true },
                { header: 'Student ID', field: 'student_id', sortable: true },
                { header: 'Student Name', field: 'student_name', sortable: true },
                { header: 'Class', field: 'class', sortable: true },
                { header: 'Section', field: 'section', sortable: true },
                { header: 'Type', field: 'type', sortable: true },
                { header: 'Item', field: 'item', sortable: true },
                { header: 'Quantity', field: 'quantity', sortable: true },
                { header: 'Price', field: 'price', sortable: true, render: (val) => `₹${parseFloat(val).toLocaleString()}` },
                { header: 'Date', field: 'date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.order_id}" data-table="orders"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Order" data-id="${row.order_id}" data-table="orders"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Order" data-id="${row.order_id}" data-table="orders"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="ordersStudentIdFilter">Student ID</label>
                        <input type="text" id="ordersStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="ordersClassFilter">Class</label>
                        <select id="ordersClassFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option><option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="ordersSectionFilter">Section</label>
                        <select id="ordersSectionFilter" class="form-control">
                            <option value="">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="ordersTypeFilter">Order Type</label>
                        <input type="text" id="ordersTypeFilter" class="form-control" placeholder="e.g., Uniform">
                    </div>
                    <div class="filter-group">
                        <label for="ordersItemFilter">Item Name</label>
                        <input type="text" id="ordersItemFilter" class="form-control" placeholder="e.g., Notebook">
                    </div>
                    <div class="filter-group">
                        <label for="ordersStartDate">Start Date</label>
                        <input type="date" id="ordersStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="ordersEndDate">End Date</labeL>
                        <input type="date" id="ordersEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyOrdersFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetOrdersFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="orders-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadOrderModal from all-features-management.js
            document.getElementById('addOrderBtn').addEventListener('click', () => loadOrderModal());
            
            const ordersTableContainer = document.getElementById('orders-table-container');
            ordersTableContainer.appendChild(renderTable(orders, orderColumns, 'orders-table', 'orders-pagination'));
            updateTableRows(orders, orderColumns, 'orders-table', 'orders-pagination');

            // Attach filter event listeners
            document.getElementById('applyOrdersFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(orders, orderColumns, 'orders-table', 'orders-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetOrdersFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#orders-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(orders, orderColumns, 'orders-table', 'orders-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#orders-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(orders, orderColumns, 'orders-table', 'orders-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('orders-table', orders, orderColumns, '/orders');
            break;

        case 'announcements':
            pageTitleText = 'Announcements';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addAnnouncementBtn">
                    <span class="material-icons">add</span>
                    Add Announcement
                </button>
            `;
            const announcements = await fetchData('/announcements');
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="announcementsStudentIdFilter">Student ID (for specific)</label>
                        <input type="text" id="announcementsStudentIdFilter" class="form-control" placeholder="e.g., S001">
                    </div>
                    <div class="filter-group">
                        <label for="announcementsTypeFilter">Type</label>
                        <input type="text" id="announcementsTypeFilter" class="form-control" placeholder="e.g., Event">
                    </div>
                    <div class="filter-group">
                        <label for="announcementsCommonFilter">Common Announcement</label>
                        <select id="announcementsCommonFilter" class="form-control">
                            <option value="">All</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyAnnouncementsFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetAnnouncementsFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="announcements-table-container"></div>
            `; // Container for table
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadAnnouncementModal from all-features-management.js
            document.getElementById('addAnnouncementBtn').addEventListener('click', () => loadAnnouncementModal());
            
            const announcementColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Title', field: 'title', sortable: true },
                { header: 'Message', field: 'message' },
                { header: 'Timestamp', field: 'timestamp', sortable: true, render: (val) => new Date(val).toLocaleString() },
                { header: 'Student ID', field: 'student_id', render: (val) => val || 'N/A' },
                { header: 'Type', field: 'type', render: (val) => val || 'N/A' },
                { header: 'Common', field: 'is_common', render: (val) => val ? 'Yes' : 'No' },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="notifications"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Announcement" data-id="${row.id}" data-table="notifications"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Announcement" data-id="${row.id}" data-table="notifications"><span class="material-icons">delete</span></button>
                `}
            ];
            const announcementsTableContainer = document.getElementById('announcements-table-container');
            announcementsTableContainer.appendChild(renderTable(announcements, announcementColumns, 'announcements-table', 'announcements-pagination'));
            updateTableRows(announcements, announcementColumns, 'announcements-table', 'announcements-pagination', getActiveFilters(), globalSearchBar.value);

            // Attach filter event listeners
            document.getElementById('applyAnnouncementsFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(announcements, announcementColumns, 'announcements-table', 'announcements-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetAnnouncementsFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#announcements-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(announcements, announcementColumns, 'announcements-table', 'announcements-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#announcements-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(announcements, announcementColumns, 'announcements-table', 'announcements-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('announcements-table', announcements, announcementColumns, '/announcements');
            break;

        case 'feedback':
            pageTitleText = 'Feedback';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addFeedbackBtn">
                    <span class="material-icons">add</span>
                    Submit Feedback
                </button>
            `;
            const feedbackEntries = await fetchData('/feedback');
            const feedbackColumns = [
                { header: 'ID', field: 'id', sortable: true },
                { header: 'Name', field: 'name', sortable: true },
                { header: 'Email', field: 'email', sortable: true },
                { header: 'Category', field: 'category', sortable: true },
                { header: 'Message', field: 'message' },
                { header: 'Submitted At', field: 'submitted_at', sortable: true, render: (val) => new Date(val).toLocaleString() },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="feedback"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Feedback" data-id="${row.id}" data-table="feedback"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Feedback" data-id="${row.id}" data-table="feedback"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="feedbackCategoryFilter">Category</label>
                        <input type="text" id="feedbackCategoryFilter" class="form-control" placeholder="e.g., Complaint">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyFeedbackFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetFeedbackFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="feedback-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadFeedbackModal from all-features-management.js
            document.getElementById('addFeedbackBtn').addEventListener('click', () => loadFeedbackModal());
            
            const feedbackTableContainer = document.getElementById('feedback-table-container');
            feedbackTableContainer.appendChild(renderTable(feedbackEntries, feedbackColumns, 'feedback-table', 'feedback-pagination'));
            updateTableRows(feedbackEntries, feedbackColumns, 'feedback-table', 'feedback-pagination');

            // Attach filter event listeners
            document.getElementById('applyFeedbackFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(feedbackEntries, feedbackColumns, 'feedback-table', 'feedback-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetFeedbackFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#feedback-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(feedbackEntries, feedbackColumns, 'feedback-table', 'feedback-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#feedback-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(feedbackEntries, feedbackColumns, 'feedback-table', 'feedback-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('feedback-table', feedbackEntries, feedbackColumns, '/feedback');
            break;

        case 'holidays':
            pageTitleText = 'Holidays';
            pageActionsHtml = `
                <button class="btn btn-primary" id="addHolidayBtn">
                    <span class="material-icons">add</span>
                    Add Holiday
                </button>
            `;
            const holidays = await fetchData('/holidays');
            const holidayColumns = [
                { header: 'Date', field: 'date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
                { header: 'Title', field: 'title', sortable: true },
                { header: 'Description', field: 'description' },
                { header: 'Type', field: 'type', sortable: true },
                { header: 'Actions', field: 'actions', render: (val, row) => `
                    <button class="action-btn view-btn" title="View Details" data-id="${row.date}" data-table="holidays"><span class="material-icons">visibility</span></button>
                    <button class="action-btn edit-btn" title="Edit Holiday" data-id="${row.date}" data-table="holidays"><span class="material-icons">edit</span></button>
                    <button class="action-btn delete-btn" title="Delete Holiday" data-id="${row.date}" data-table="holidays"><span class="material-icons">delete</span></button>
                `}
            ];
            pageContentHtml = `
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="holidaysTypeFilter">Type</label>
                        <input type="text" id="holidaysTypeFilter" class="form-control" placeholder="e.g., National">
                    </div>
                    <div class="filter-group">
                        <label for="holidaysStartDate">Start Date</label>
                        <input type="date" id="holidaysStartDate" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label for="holidaysEndDate">End Date</labeL>
                        <input type="date" id="holidaysEndDate" class="form-control">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="applyHolidaysFilters">Apply Filters</button>
                        <button class="btn btn-outline" id="resetHolidaysFilters">Reset Filters</button>
                    </div>
                </div>
                <div id="holidays-table-container"></div>
            `;
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            // Changed to call loadHolidayModal from all-features-management.js
            document.getElementById('addHolidayBtn').addEventListener('click', () => loadHolidayModal());
            
            const holidaysTableContainer = document.getElementById('holidays-table-container');
            holidaysTableContainer.appendChild(renderTable(holidays, holidayColumns, 'holidays-table', 'holidays-pagination'));
            updateTableRows(holidays, holidayColumns, 'holidays-table', 'holidays-pagination');

            // Attach filter event listeners
            document.getElementById('applyHolidaysFilters').addEventListener('click', () => {
                currentPage = 1;
                updateTableRows(holidays, holidayColumns, 'holidays-table', 'holidays-pagination', getActiveFilters(), globalSearchBar.value);
            });
            document.getElementById('resetHolidaysFilters').addEventListener('click', resetFilters);

            // Attach pagination event listeners
            document.querySelector('#holidays-pagination #prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableRows(holidays, holidayColumns, 'holidays-table', 'holidays-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });
            document.querySelector('#holidays-pagination #nextPageBtn').addEventListener('click', () => {
                const totalPages = Math.ceil(currentPageData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTableRows(holidays, holidayColumns, 'holidays-table', 'holidays-pagination', getActiveFilters(), globalSearchBar.value);
                }
            });

            attachTableActionListeners('holidays-table', holidays, holidayColumns, '/holidays');
            break;

        // Removed 'system-settings' case
        // Removed 'audit-logs' case

        default:
            pageTitleText = 'Page Not Found';
            pageContentHtml = '<p style="text-align: center; color: rgba(var(--on-surface), 0.6); margin-top: 50px;">The requested page could not be loaded.</p>';
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageTitleText}</h1>
                    <div class="page-actions">${pageActionsHtml}</div>
                </div>
                ${pageContentHtml}
            `;
            break;
    }

    // Update the page title in the header
    document.querySelector('.page-title').textContent = pageTitleText;
}


// --- Chart Specific Update Functions ---

/**
 * Initializes and updates the student class distribution chart.
 */
async function updateStudentClassDistributionChart() {
    const chartData = await fetchData('/student-class-distribution');
    if (chartData && chartData.series && chartData.labels) {
        const options = {
            series: chartData.series,
            labels: chartData.labels,
            chart: {
                type: 'donut',
                height: '300px', // Set a fixed height
                foreColor: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            legend: {
                position: 'right',
                offsetY: 0,
                height: 230,
                labels: {
                    colors: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    return opts.w.config.series[opts.seriesIndex] + "" // Display raw count, not percentage
                },
                dropShadow: {
                    enabled: false
                },
                style: {
                    colors: [getComputedStyle(document.documentElement).getPropertyValue('--on-primary')] // Ensure data labels are visible on dark/light slices
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Total Students',
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => {
                                        return a + b
                                    }, 0);
                                },
                                color: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                            }
                        }
                    }
                }
            },
            tooltip: {
                theme: document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
            }
        };
        if (studentClassDistributionChart) {
            studentClassDistributionChart.updateOptions(options);
        } else {
            studentClassDistributionChart = new ApexCharts(document.querySelector("#studentClassDistributionChart"), options);
            studentClassDistributionChart.render();
        }
    }
}

/**
 * Initializes and updates the fees status chart.
 */
async function updateFeesStatusChart() {
    const chartData = await fetchData('/fees-status-overview');
    if (chartData && chartData.series && chartData.labels) {
        const options = {
            series: chartData.series,
            labels: chartData.labels,
            chart: {
                type: 'pie',
                height: '300px', // Set a fixed height
                foreColor: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            legend: {
                position: 'right',
                offsetY: 0,
                height: 230,
                labels: {
                    colors: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    // Display actual amount, not percentage
                    return `₹${opts.w.config.series[opts.seriesIndex].toLocaleString()}`;
                },
                dropShadow: {
                    enabled: false
                },
                style: {
                    colors: [getComputedStyle(document.documentElement).getPropertyValue('--on-primary')]
                }
            },
            tooltip: {
                theme: document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
                y: {
                    formatter: function (val) {
                        return `₹${parseFloat(val).toLocaleString()}`;
                    }
                }
            }
        };
        if (feesStatusChart) {
            feesStatusChart.updateOptions(options);
        } else {
            feesStatusChart = new ApexCharts(document.querySelector("#feesStatusChart"), options);
            feesStatusChart.render();
        }
    }
}


// --- Table Action Listeners (View, Edit, Delete) ---

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


// --- Modal Specific Functions ---

// Close View Student Modal
closeViewStudentModal.addEventListener('click', () => {
    viewStudentModal.classList.remove('active');
    viewStudentModalBody.innerHTML = ''; // Clear content
});

viewStudentModal.addEventListener('click', (e) => {
    if (e.target === viewStudentModal) {
        viewStudentModal.classList.remove('active');
        viewStudentModalBody.innerHTML = ''; // Clear content
    }
});


// Record Payment Modal
async function loadRecordPaymentModal(studentId = '') {
    paymentForm.reset();
    paymentStudentIdInput.value = studentId;
    paymentDateInput.value = new Date().toISOString().split('T')[0]; // Set today's date
    recordPaymentModal.classList.add('active');
}

closeRecordPaymentModal.addEventListener('click', () => {
    recordPaymentModal.classList.remove('active');
    paymentForm.reset();
});

cancelPaymentBtn.addEventListener('click', () => {
    recordPaymentModal.classList.remove('active');
    paymentForm.reset();
});

recordPaymentModal.addEventListener('click', (e) => {
    if (e.target === recordPaymentModal) {
        recordPaymentModal.classList.remove('active');
        paymentForm.reset();
    }
});

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const paymentData = {
        student_id: paymentStudentIdInput.value,
        transaction_amount: parseFloat(paymentAmountInput.value),
        payment_date: paymentDateInput.value,
        payment_method: paymentMethodSelect.value,
        description: paymentDescriptionInput.value || null,
        fee_type: paymentFeeTypeInput.value || null,
        status: 'Completed', // Default status for new payments
        transaction_id: `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, // Generate simple ID
        receipt_url: `receipts/${paymentStudentIdInput.value}-${Date.now()}.pdf` // Placeholder URL
    };

    if (isNaN(paymentData.transaction_amount) || paymentData.transaction_amount <= 0) {
        showMessageBox('Validation Error', 'Please enter a valid positive amount.', 'error');
        return;
    }
    if (!paymentData.student_id || !paymentData.payment_date || !paymentData.payment_method) {
        showMessageBox('Validation Error', 'Please fill in all required payment fields.', 'error');
        return;
    }

    const result = await sendData('/fees', paymentData, 'POST');
    if (result && result.message === 'Fee record added successfully') {
        showMessageBox('Success', 'Payment recorded successfully!', 'success');
        recordPaymentModal.classList.remove('active');
        paymentForm.reset();
        loadDashboardData(); // Refresh dashboard stats
        if (activePage === 'fees') {
            renderPage('fees'); // Refresh fees list if on that page
        }
        // Optionally, show receipt immediately after successful payment
        await displayReceipt(paymentData);
    }
});

// Receipt Modal Functions
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

closeReceiptModal.addEventListener('click', () => {
    receiptModal.classList.remove('active');
    receiptModalBody.innerHTML = '';
});

receiptModal.addEventListener('click', (e) => {
    if (e.target === receiptModal) {
        receiptModal.classList.remove('active');
        receiptModalBody.innerHTML = '';
    }
});

printReceiptBtn.addEventListener('click', () => {
    const receiptHTML = receiptModalBody.innerHTML;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Fee Receipt</title>
            <style>
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        gap: 10px;
                        box-sizing: border-box;
                        page-break-after: always;
                    }
                    .copy {
                        width: 48%;
                        border: 1px dashed #555;
                        padding: 10px;
                        box-sizing: border-box;
                    }
                }
                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }
            </style>
        </head>
        <body>
            <div class="copy">${receiptHTML}</div>
            <div class="copy">${receiptHTML}</div>

            <script>
                window.onload = function () {
                    window.print();
                    window.onafterprint = function () {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
});


downloadReceiptBtn.addEventListener('click', () => {
    showMessageBox('Download Receipt', 'PDF download functionality to be implemented. You can use libraries like jsPDF or html2canvas for this.', 'info');
});


// Mark Attendance Modal Functions
async function loadAttendanceModal() {
    attendanceModal.classList.add('active');
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    attendanceDateInput.value = today;
    await loadStudentsForAttendance();
}

closeAttendanceModal.addEventListener('click', () => {
    attendanceModal.classList.remove('active');
    attendanceTableBody.innerHTML = ''; // Clear table
    attendanceDateInput.value = '';
    attendanceClassSelect.value = '';
    attendanceSectionSelect.value = '';
});

attendanceModal.addEventListener('click', (e) => {
    if (e.target === attendanceModal) {
        attendanceModal.classList.remove('active');
        attendanceTableBody.innerHTML = ''; // Clear table
        attendanceDateInput.value = '';
    }
});

// Load students for attendance table based on filters
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


// --- Main Event Listeners ---

// Toggle Sidebar Collapse
collapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-collapsed');
    mainContent.classList.toggle('main-content-expanded');
    
    // Change icon based on state
    const icon = collapseBtn.querySelector('span');
    if (sidebar.classList.contains('sidebar-collapsed')) {
        icon.textContent = 'chevron_right';
    } else {
        icon.textContent = 'chevron_left';
    }
    // Re-render charts to adjust to new container size
    if (activePage === 'dashboard') {
        updateAttendanceChart();
    } else if (activePage === 'student-profiles') {
        updateStudentClassDistributionChart();
    } else if (activePage === 'fees') {
        updateFeesStatusChart();
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    
    // Change icon based on theme
    const icon = themeToggle.querySelector('span');
    if (newTheme === 'dark') {
        icon.textContent = 'brightness_7';
    } else {
        icon.textContent = 'brightness_4';
    }
    // Re-render charts to apply new theme colors
    if (activePage === 'dashboard') {
        updateAttendanceChart();
    } else if (activePage === 'student-profiles') {
        updateStudentClassDistributionChart();
    } else if (activePage === 'fees') {
        updateFeesStatusChart();
    }
});

// Add Student Modal (initial setup, will be re-attached dynamically)
closeModalBtn.addEventListener('click', () => {
    addStudentModal.classList.remove('active');
    studentForm.reset(); // Clear form on close
});

cancelBtn.addEventListener('click', () => {
    addStudentModal.classList.remove('active');
    studentForm.reset(); // Clear form on cancel
});

// Close modal when clicking outside
addStudentModal.addEventListener('click', (e) => {
    if (e.target === addStudentModal) {
        addStudentModal.classList.remove('active');
        studentForm.reset(); // Clear form on outside click
    }
});

// Student Form Submission
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEditMode = addStudentModalTitle.textContent.includes('Edit'); // Check if in edit mode
    const studentIdValue = document.getElementById('studentId').value;

    const studentData = {
        student_id: studentIdValue,
        roll_number: parseInt(document.getElementById('rollNumber').value),
        name: document.getElementById('studentName').value,
        date_of_birth: document.getElementById('dateOfBirth').value,
        class: document.getElementById('class').value,
        section: document.getElementById('section').value,
        gender: document.getElementById('gender').value,
        blood_group: document.getElementById('bloodGroup').value || null,
        address: document.getElementById('address').value || null,
        parent_name: document.getElementById('parentName').value,
        phone_number: document.getElementById('phoneNumber').value,
        student_email: document.getElementById('email').value || null,
        enrollment_date: document.getElementById('enrollmentDate').value,
        total_fee: parseFloat(document.getElementById('totalFee').value),
        fee_concession: parseFloat(document.getElementById('feeConcession').value) || 0,
        password_hash: 'default_password_hash' // Placeholder: In a real app, this would be generated securely
    };

    let result;
    if (isEditMode) {
        result = await sendData(`/students/${studentIdValue}`, studentData, 'PUT');
    } else {
        result = await sendData('/students', studentData);
    }
    
    if (result && (result.message === 'Student added successfully' || result.message === 'Student updated successfully')) {
        showMessageBox('Success', isEditMode ? 'Student updated successfully!' : 'Student added successfully!', 'success');
        addStudentModal.classList.remove('active');
        studentForm.reset();
        loadDashboardData(); // Refresh dashboard stats
        if (activePage === 'student-profiles') {
            renderPage('student-profiles'); // Refresh student list if on that page
        }
    }
});

// Save Attendance
saveAttendanceBtn.addEventListener('click', async () => {
    const attendanceDate = attendanceDateInput.value;
    if (!attendanceDate) {
        showMessageBox('Warning', 'Please select an attendance date.', 'info');
        return;
    }

    const attendanceRecords = [];
    attendanceTableBody.querySelectorAll('tr').forEach(row => {
        const studentId = row.querySelector('.attendance-status').dataset.studentId;
        const status = row.querySelector('.attendance-status').value;
        // Assuming the reason input is the last one in the row for simplicity
        const inputs = row.querySelectorAll('.attendance-reason');
        const morningStatus = inputs[0].value || null;
        const afternoonStatus = inputs[1].value || null;
        const reason = inputs[2].value || null;


        attendanceRecords.push({
            student_id: studentId,
            attendance_date: attendanceDate,
            status: status,
            morning_status: morningStatus,
            afternoon_status: afternoonStatus,
            reason: reason,
            holiday_name: null // This would be set if status is 'holiday' and a holiday name is provided
        });
    });

    if (attendanceRecords.length === 0) {
        showMessageBox('Info', 'No attendance records to save.', 'info');
        return;
    }

    const result = await sendData('/attendance', { records: attendanceRecords });
    if (result && result.message === 'Attendance recorded successfully') {
        showMessageBox('Success', 'Attendance recorded successfully!', 'success');
        attendanceModal.classList.remove('active');
        attendanceTableBody.innerHTML = ''; // Clear table
        attendanceDateInput.value = '';
        attendanceClassSelect.value = '';
        attendanceSectionSelect.value = '';
        loadDashboardData(); // Refresh dashboard stats
        if (activePage === 'attendance-records') {
            renderPage('attendance-records'); // Refresh attendance list if on that page
        }
    }
});

// Reset Attendance form
resetAttendanceBtn.addEventListener('click', () => {
    attendanceTableBody.innerHTML = '';
    attendanceDateInput.value = new Date().toISOString().split('T')[0];
    attendanceClassSelect.value = '';
    attendanceSectionSelect.value = '';
    loadStudentsForAttendance(); // Reload students
});

// Global Search Bar Event Listener
globalSearchBar.addEventListener('input', () => {
    // Trigger table update with current filters and new search term
    if (activePage !== 'dashboard') { // Don't filter dashboard activity feed with this bar
        currentPage = 1; // Reset to first page on search
        updateTableRows(currentPageData, currentTableColumns, `${activePage}-table`, `${activePage}-pagination`, getActiveFilters(), globalSearchBar.value);
    }
});

// Menu Item Active State and Page Rendering
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const pageName = item.dataset.page;
        if (pageName) {
            renderPage(pageName);
        }
        
        // Close sidebar on mobile after selection
        if (window.innerWidth < 992) {
            sidebar.classList.remove('active');
        }
    });
});

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
        sidebar.classList.remove('active');
    }
    // Re-render charts on resize to ensure responsiveness
    if (activePage === 'dashboard') {
        updateAttendanceChart();
    } else if (activePage === 'student-profiles') {
        updateStudentClassDistributionChart();
    } else if (activePage === 'fees') {
        updateFeesStatusChart();
    }
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Set initial attendance date
    attendanceDateInput.value = new Date().toISOString().split('T')[0];
    // Load dashboard data on initial page load
    renderPage('dashboard'); // Render dashboard initially

    // Apply saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Attach event listeners for the main "Add" buttons that open modals
    // These are now handled by specific functions, which are then called
    // by the centralized event delegation in all-features-management.js
    // We only need to ensure the modal functions are globally accessible.

    // Student Profile Add Button
    const addStudentProfileBtn = document.getElementById('addStudentProfileBtn');
    if (addStudentProfileBtn) {
        addStudentProfileBtn.addEventListener('click', () => loadStudentModal());
    }

    // Fee Payment Add Button
    const addFeePaymentButton = document.getElementById('addFeePaymentBtn');
    if (addFeePaymentButton) {
        addFeePaymentButton.addEventListener('click', () => loadFeePaymentModal());
    }

    // Mark Attendance Button
    const markAttendanceButton = document.getElementById('markAttendanceBtn');
    if (markAttendanceButton) {
        markAttendanceButton.addEventListener('click', () => attendanceModal.classList.add('active'));
    }

    // Ensure chart functions are called on initial load for dashboard
    if (activePage === 'dashboard') {
        updateAttendanceChart();
    }
});
// --- Sidebar Hover-to-Expand/Collapse (Desktop Only) ---

// Helper to check if device is mobile (width < 992px)
function isMobileView() {
    return window.innerWidth < 992;
}

// Sidebar hover expand/collapse for desktop
sidebar.addEventListener('mouseenter', () => {
    if (!isMobileView()) {
        sidebar.classList.remove('sidebar-collapsed');
        mainContent.classList.remove('main-content-expanded');
        // Update icon if present
        const icon = collapseBtn.querySelector('span');
        if (icon) icon.textContent = 'chevron_left';
    }
});

sidebar.addEventListener('mouseleave', () => {
    if (!isMobileView()) {
        sidebar.classList.add('sidebar-collapsed');
        mainContent.classList.add('main-content-expanded');
        // Update icon if present
        const icon = collapseBtn.querySelector('span');
        if (icon) icon.textContent = 'chevron_right';
    }
});

// Retain button toggle for mobile only
collapseBtn.addEventListener('click', () => {
    if (isMobileView()) {
        sidebar.classList.toggle('active');
    }
});

// Ensure sidebar is collapsed by default on desktop
window.addEventListener('DOMContentLoaded', () => {
    if (!isMobileView()) {
        sidebar.classList.add('sidebar-collapsed');
        mainContent.classList.add('main-content-expanded');
        const icon = collapseBtn.querySelector('span');
        if (icon) icon.textContent = 'chevron_right';
    }
});
