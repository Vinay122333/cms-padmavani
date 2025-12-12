// --- Dashboard Functions ---

/**
 * Loads and displays dashboard statistics.
 */
async function loadDashboardStats() {
    const stats = await fetchData('/dashboard-stats');
    if (stats) {
        totalStudentsEl.textContent = stats.totalStudents ? stats.totalStudents.toLocaleString() : 'N/A';
        studentsGrowthEl.textContent = stats.studentsGrowth ? `+${stats.studentsGrowth} this month` : 'N/A';
        todayAttendanceEl.textContent = stats.todayAttendance ? `${stats.todayAttendance}%` : 'N/A';
        absentTodayEl.textContent = stats.absentToday ? `${stats.absentToday} absent today` : 'N/A';
        pendingFeesEl.textContent = stats.pendingFees ? `₹${parseFloat(stats.pendingFees).toLocaleString()}` : 'N/A';
        pendingFeesStudentsEl.textContent = stats.pendingFeesStudents ? `From ${stats.pendingFeesStudents} students` : 'N/A';
        upcomingExamsEl.textContent = stats.upcomingExams ? stats.upcomingExams : 'N/A';
        nextExamEl.textContent = stats.nextExam ? `Next: ${stats.nextExam.subject} on ${new Date(stats.nextExam.exam_date).toLocaleDateString()}` : 'N/A';
        notificationBadge.textContent = stats.notificationsCount ? stats.notificationsCount : '0';
        leavesBadge.textContent = stats.pendingLeavesCount ? stats.pendingLeavesCount : '0';
    }
}

// Removed loadRecentActivity function as the Recent Activity section is removed.

/**
 * Initializes and updates the attendance chart.
 */
async function updateAttendanceChart() {
    const chartData = await fetchData('/attendance-trend');
    if (chartData && chartData.data && chartData.categories) {
        const newOptions = {
            series: [{
                name: 'Attendance Rate',
                data: chartData.data
            }],
            xaxis: {
                categories: chartData.categories,
                labels: {
                    style: {
                        colors: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                    }
                }
            }
        };
        if (attendanceChart) {
            attendanceChart.updateOptions(newOptions);
        } else {
            const attendanceChartOptions = {
                series: [{
                    name: 'Attendance Rate',
                    data: chartData.data
                }],
                chart: {
                    height: '300px', // Set a fixed height
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    },
                    foreColor: getComputedStyle(document.documentElement).getPropertyValue('--on-surface') // Chart text color
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                    colors: [getComputedStyle(document.documentElement).getPropertyValue('--primary-color')]
                },
                grid: {
                    row: {
                        colors: ['transparent'],
                        opacity: 0.5
                    },
                    borderColor: 'rgba(0,0,0,0.1)' // Grid line color
                },
                xaxis: {
                    categories: chartData.categories,
                    labels: {
                        style: {
                            colors: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                        }
                    }
                },
                yaxis: {
                    min: 85,
                    max: 100,
                    labels: {
                        style: {
                            colors: getComputedStyle(document.documentElement).getPropertyValue('--on-surface')
                        },
                        formatter: function(val) {
                            return val + '%';
                        }
                    }
                }
                ,
                tooltip: {
                    theme: document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
                    y: {
                        formatter: function(val) {
                            return val + '% attendance';
                        }
                    }
                }
            };
            attendanceChart = new ApexCharts(document.querySelector("#attendanceChart"), attendanceChartOptions);
            attendanceChart.render();
        }
    }
}

/**
 * Initializes and updates the student performance chart.
 */



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

/**
 * Loads all dashboard data.
 */
async function loadDashboardData() {
    await loadDashboardStats();
    // Removed call to loadRecentActivity()
    await updateAttendanceChart();

}
