// server.js - Enhanced for Robustness and Error Prevention

// --- Core Module Imports ---
// Load environment variables from .env file at the very beginning
require('dotenv').config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js'); // Supabase client
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const morgan = require('morgan'); // HTTP request logger middleware
const helmet = require('helmet'); // Security middleware

const app = express();
const PORT = process.env.PORT || 3000; // Backend server port

// --- Supabase Configuration ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate Supabase credentials
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('FATAL ERROR: Supabase URL or Anon Key is not defined in environment variables.');
    // Exit the process if critical environment variables are missing
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test Supabase connection (optional, as it's more about API interaction than a direct connection)
(async () => {
    try {
        const { data, error } = await supabase.from('student_profile').select('student_id').limit(1);
        if (error) {
            console.error('Error connecting to Supabase:', error.message);
        } else {
            console.log('Successfully connected to Supabase.');
        }
    } catch (e) {
        console.error('Failed to connect to Supabase:', e.message);
    }
})();


// --- Middleware Setup ---

// 1. Security Enhancements with Helmet
// Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet());

// 2. CORS Configuration
// Configure CORS to allow requests from your frontend domain.
// IMPORTANT: 'http://127.0.0.1:5501' is included to allow requests from Live Server.
// Please ensure 'YOUR_FRONTEND_PRODUCTION_URL' is replaced with your actual deployed frontend URL.
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5501', 'YOUR_FRONTEND_PRODUCTION_URL'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
}));

// 3. Request Body Parsers
// `express.json()` parses incoming requests with JSON payloads.
// `express.urlencoded()` parses incoming requests with URL-encoded payloads.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // `extended: true` allows for rich objects and arrays to be encoded into the URL-encoded format.

// 4. HTTP Request Logger (Morgan)
// 'dev' format provides concise colored output for development.
// For production, consider 'combined' or a custom format for more details.
app.use(morgan('dev'));


// --- API Routes ---

// Helper function for error handling (modified to use `next` for consistency)
// This helper is now primarily for logging and can be removed if all errors are passed to `next`
const handleError = (res, error, message = 'An unexpected error occurred', statusCode = 500) => {
    console.error(message, error); // Log the full error object for debugging
    // This function is less critical now as errors will be passed to the central error handler
    // but it still serves as a good logging point if you prefer to keep it.
    // For consistency, we'll now ensure all errors are passed via `next(error)`
    // and the central error handler will format the response.
    res.status(statusCode).json({ message: message, error: error.message || error.details || 'Unknown error' });
};


// GET Dashboard Statistics
app.get('/api/dashboard-stats', async (req, res, next) => {
    try {
        // Total Students
        const { count: totalStudents, error: totalStudentsError } = await supabase
            .from('student_profile')
            .select('*', { count: 'exact', head: true });
        if (totalStudentsError) throw totalStudentsError;

        // Students Growth (e.g., students added this month)
        const date = new Date();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
        const firstDayOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]; // Get last day of current month

        const { count: studentsGrowth, error: studentsGrowthError } = await supabase
            .from('student_profile')
            .select('*', { count: 'exact', head: true })
            .gte('enrollment_date', firstDayOfMonth)
            .lte('enrollment_date', lastDayOfMonth); // Use lte for end of month
        if (studentsGrowthError) throw studentsGrowthError;

        // Today's Attendance (example: percentage of students marked present)
        const today = new Date().toISOString().split('T')[0];

        const { data: allStudentsToday, error: allStudentsTodayError } = await supabase
            .from('student_profile')
            .select('student_id'); // Select all student IDs to get total count
        if (allStudentsTodayError) throw allStudentsTodayError;
        const totalStudentsForAttendance = allStudentsToday ? allStudentsToday.length : 0;

        let todayAttendancePercentage = 0;
        let absentToday = 0;

        if (totalStudentsForAttendance > 0) {
            const { data: attendanceRecordsToday, error: attendanceRecordsError } = await supabase
                .from('attendance')
                .select('status')
                .eq('attendance_date', today);
            if (attendanceRecordsError) throw attendanceRecordsError;

            const presentStudentsCount = attendanceRecordsToday.filter(rec => rec.status === 'full-present').length;
            absentToday = attendanceRecordsToday.filter(rec => ['full-absent', 'late', 'split'].includes(rec.status)).length;

            // Calculate percentage based on ALL students in the school
            todayAttendancePercentage = (presentStudentsCount / totalStudentsForAttendance * 100).toFixed(0);
        }

        // Pending Fees
        const { data: pendingFeesData, error: pendingFeesError } = await supabase
            .from('student_profile')
            .select('total_fee, overall_amount_paid'); // Ensure these columns exist and are numbers
        if (pendingFeesError) throw pendingFeesError;

        const pendingFees = pendingFeesData.reduce((sum, student) => {
            const total = student.total_fee || 0;
            const paid = student.overall_amount_paid || 0;
            return sum + (total - paid);
        }, 0).toFixed(2);
        const pendingFeesStudents = pendingFeesData.filter(student => (student.total_fee || 0) - (student.overall_amount_paid || 0) > 0).length;


        // Upcoming Exams (e.g., next 3 exams)
        const { data: upcomingExamsData, error: upcomingExamsError } = await supabase
            .from('exams')
            .select('exam_name, subject, exam_date')
            .gte('exam_date', today)
            .order('exam_date', { ascending: true })
            .limit(3);
        if (upcomingExamsError) throw upcomingExamsError;

        const upcomingExams = upcomingExamsData.length;
        const nextExam = upcomingExamsData[0] || null;

        // Notifications Count (example: unread notifications or general announcements)
        const { count: notificationsCount, error: notificationsCountError } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('is_common', true); // Or filter by student_id for specific user
        if (notificationsCountError) throw notificationsCountError;

        // Pending Leaves Count
        const { count: pendingLeavesCount, error: pendingLeavesCountError } = await supabase
            .from('leaves')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Pending');
        if (pendingLeavesCountError) throw pendingLeavesCountError;

        res.json({
            totalStudents: totalStudents || 0,
            studentsGrowth: studentsGrowth || 0,
            todayAttendance: todayAttendancePercentage,
            absentToday: absentToday || 0,
            pendingFees: parseFloat(pendingFees) || 0,
            pendingFeesStudents: pendingFeesStudents || 0,
            upcomingExams: upcomingExams || 0,
            nextExam: nextExam,
            notificationsCount: notificationsCount || 0,
            pendingLeavesCount: pendingLeavesCount || 0
        });

    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET Recent Activity
app.get('/api/recent-activity', async (req, res, next) => {
    try {
        const activities = [];

        // Fetch recent fees payments
        const { data: feesData, error: feesError } = await supabase
            .from('fees')
            .select('created_at, transaction_amount, student_id')
            .order('created_at', { ascending: false })
            .limit(5);
        if (feesError) throw feesError;
        feesData.forEach(f => {
            activities.push({
                title: 'Fee Payment Received',
                description: `₹${parseFloat(f.transaction_amount || 0).toLocaleString()} from Student ID: ${f.student_id || 'N/A'}`,
                time: f.created_at,
                icon: 'payments'
            });
        });

        // Fetch recent leave applications
        const { data: leavesData, error: leavesError } = await supabase
            .from('leaves')
            .select('applied_on, start_date, end_date, student_id')
            .eq('status', 'Pending')
            .order('applied_on', { ascending: false })
            .limit(5);
        if (leavesError) throw leavesError;
        leavesData.forEach(l => {
            activities.push({
                title: 'New Leave Application',
                description: `Student ID: ${l.student_id || 'N/A'} applied for leave from ${new Date(l.start_date).toLocaleDateString()} - ${new Date(l.end_date).toLocaleDateString()}`,
                time: l.applied_on,
                icon: 'event_busy'
            });
        });

        // Fetch recent exam updates
        const { data: examsData, error: examsError } = await supabase
            .from('exams')
            .select('created_at, exam_name, subject, exam_date')
            .order('created_at', { ascending: false })
            .limit(5);
        if (examsError) throw examsError;
        examsData.forEach(e => {
            activities.push({
                title: 'Exam Schedule Updated',
                description: `${e.exam_name} for ${e.subject} scheduled on ${new Date(e.exam_date).toLocaleDateString()}`,
                time: e.created_at,
                icon: 'assignment'
            });
        });

        // Fetch recent feedback
        const { data: feedbackData, error: feedbackError } = await supabase
            .from('feedback')
            .select('submitted_at, name, category')
            .order('submitted_at', { ascending: false })
            .limit(5);
        if (feedbackError) throw feedbackError;
        feedbackData.forEach(f => {
            activities.push({
                title: 'New Feedback Received',
                description: `From ${f.name || 'Anonymous'} (${f.category || 'N/A'})`,
                time: f.submitted_at,
                icon: 'feedback'
            });
        });

        // Sort all activities by time and limit to 10
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        res.json(activities.slice(0, 10));

    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET Student Performance Overview (for dashboard chart)
app.get('/api/student-performance-overview', async (req, res, next) => {
    try {
        // In a real scenario, you'd calculate average scores per subject or class
        // For now, let's provide mock data to ensure the chart renders
        const mockPerformanceData = {
            categories: ['Math', 'Science', 'English', 'History', 'Art'],
            series: [85, 78, 92, 70, 88] // Average scores or performance indicators
        };
        res.json(mockPerformanceData);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET Attendance Trend (for chart)
app.get('/api/attendance-trend', async (req, res, next) => {
    try {
        const { data: attendanceTrendData, error } = await supabase
            .from('attendance')
            .select('attendance_date, status')
            .gte('attendance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // Last 30 days
            .order('attendance_date', { ascending: true });
        if (error) throw error;

        // Fetch total number of students for accurate daily attendance percentage
        const { count: totalStudents, error: totalStudentsError } = await supabase
            .from('student_profile')
            .select('*', { count: 'exact', head: true });
        if (totalStudentsError) throw totalStudentsError;

        const dailyAttendance = {};
        attendanceTrendData.forEach(record => {
            const date = record.attendance_date;
            if (!dailyAttendance[date]) {
                dailyAttendance[date] = { present: 0, total_records: 0 };
            }
            dailyAttendance[date].total_records++; // Count how many attendance records exist for the day
            if (record.status === 'full-present') {
                dailyAttendance[date].present++;
            }
        });

        const categories = [];
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            categories.push(new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            const dayStats = dailyAttendance[dateString];
            if (totalStudents > 0) { // Calculate percentage based on total students in the school
                if (dayStats && dayStats.total_records > 0) {
                    data.push(((dayStats.present / totalStudents) * 100).toFixed(2));
                } else {
                    data.push(0); // 0% if no attendance records for the day
                }
            } else {
                data.push(0); // If no students, attendance is 0%
            }
        }

        res.json({ categories, data });

    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// --- Student Profile Routes ---

// POST a new student
app.post('/api/students', async (req, res, next) => {
    const {
        student_id, roll_number, name, date_of_birth, class: studentClass, section,
        gender, blood_group, address, parent_name, phone_number, student_email,
        enrollment_date, total_fee, fee_concession, password_hash
    } = req.body;

    try {
        // Insert into login table first
        const { error: loginError } = await supabase
            .from('login')
            .insert([{ student_id, password_hash }]);
        if (loginError) {
            if (loginError.code === '23505') { // Unique violation
                const err = new Error('Student ID already exists in login table.');
                err.statusCode = 409; // Conflict
                return next(err);
            }
            throw loginError;
        }

        // Calculate initial current_due_amount
        const calculatedCurrentDueAmount = (parseFloat(total_fee) || 0) - (parseFloat(fee_concession) || 0);

        // Insert into student_profile
        const { error: profileError } = await supabase
            .from('student_profile')
            .insert([{
                student_id, roll_number, name, date_of_birth, class: studentClass, section,
                gender, blood_group, address, parent_name, phone_number, student_email,
                enrollment_date, total_fee: parseFloat(total_fee) || 0, fee_concession: parseFloat(fee_concession) || 0,
                current_due_amount: calculatedCurrentDueAmount,
                overall_amount_paid: 0 // Initialize overall_amount_paid to 0 for new students
            }]);
        if (profileError) {
            // If student_profile insert fails, attempt to rollback login entry
            await supabase.from('login').delete().eq('student_id', student_id);
            if (profileError.code === '23505') { // Unique violation
                const err = new Error('Roll Number or Student ID already exists in student profile.');
                err.statusCode = 409; // Conflict
                return next(err);
            }
            throw profileError;
        }

        res.status(201).json({ message: 'Student added successfully' });

    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET all student profiles
app.get('/api/students', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('student_profile')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single student profile by ID
app.get('/api/students/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('student_profile')
            .select('*')
            .eq('student_id', id)
            .single(); // Use .single() to expect one row
        if (error) {
            if (error.code === 'PGRST116') { // No rows found
                const err = new Error('Student not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a student profile by ID
app.put('/api/students/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        // Ensure student_id is not updated if it's the primary key
        if (updatedData.student_id && updatedData.student_id !== id) {
            const err = new Error('Student ID cannot be changed.');
            err.statusCode = 400;
            return next(err);
        }

        // Handle fee updates: Recalculate current_due_amount if total_fee or fee_concession changes
        if (updatedData.total_fee !== undefined || updatedData.fee_concession !== undefined) {
            const { data: currentProfile, error: currentProfileError } = await supabase
                .from('student_profile')
                .select('total_fee, fee_concession, overall_amount_paid')
                .eq('student_id', id)
                .single();

            if (currentProfileError) throw currentProfileError;

            const newTotalFee = updatedData.total_fee !== undefined ? parseFloat(updatedData.total_fee) : (currentProfile.total_fee || 0);
            const newFeeConcession = updatedData.fee_concession !== undefined ? parseFloat(updatedData.fee_concession) : (currentProfile.fee_concession || 0);
            const currentOverallAmountPaid = currentProfile.overall_amount_paid || 0;

            updatedData.current_due_amount = (newTotalFee - newFeeConcession) - currentOverallAmountPaid;
        }


        // Update student_profile
        const { data, error } = await supabase
            .from('student_profile')
            .update(updatedData)
            .eq('student_id', id);
        if (error) throw error;

        res.json({ message: 'Student updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a student
app.delete('/api/students/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // Supabase handles cascading deletes if configured in your database.
        // If not, you'd need to delete from child tables first.
        // Assuming your FKs have ON DELETE CASCADE or you handle manually.
        // Example manual deletions (if no cascading is set up):
        await supabase.from('attendance').delete().eq('student_id', id);
        await supabase.from('fees').delete().eq('student_id', id);
        await supabase.from('leaves').delete().eq('student_id', id);
        await supabase.from('student_achievements').delete().eq('student_id', id);
        await supabase.from('certificates').delete().eq('student_id', id);
        await supabase.from('report_cards').delete().eq('student_id', id);
        await supabase.from('notifications').delete().eq('student_id', id);
        await supabase.from('orders').delete().eq('student_id', id);

        // Delete from student_profile
        const { error: profileError } = await supabase
            .from('student_profile')
            .delete()
            .eq('student_id', id);
        if (profileError) throw profileError;

        // Delete from login table last
        const { error: loginError } = await supabase
            .from('login')
            .delete()
            .eq('student_id', id);
        if (loginError) throw loginError;

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET students for attendance marking (with optional class/section filters)
app.get('/api/students-for-attendance', async (req, res, next) => {
    const { class: studentClass, section } = req.query;
    let query = supabase.from('student_profile').select('student_id, name, class, section');

    if (studentClass) {
        query = query.eq('class', studentClass);
    }
    if (section) {
        query = query.eq('section', section);
    }
    query = query.order('class', { ascending: true }).order('section', { ascending: true }).order('name', { ascending: true });

    try {
        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST attendance records (batch insert/upsert)
app.post('/api/attendance', async (req, res, next) => {
    const { records } = req.body; // records is an array of attendance objects

    if (!Array.isArray(records) || records.length === 0) {
        const err = new Error('No attendance records provided.');
        err.statusCode = 400;
        return next(err);
    }

    try {
        // Use upsert to insert new records or update existing ones based on primary key/unique constraint
        // Assuming 'student_id' and 'attendance_date' form a unique constraint for attendance
        const { data, error } = await supabase
            .from('attendance')
            .upsert(records, { onConflict: 'student_id,attendance_date' });
        if (error) throw error;

        res.status(201).json({ message: 'Attendance recorded successfully', data });

    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET all attendance records
app.get('/api/attendance-records', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .order('attendance_date', { ascending: false })
            .order('student_id', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single attendance record by ID
app.get('/api/attendance-records/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('attendance_id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Attendance record not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE an attendance record by ID
app.put('/api/attendance-records/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('attendance')
            .update(updatedData)
            .eq('attendance_id', id);
        if (error) throw error;
        res.json({ message: 'Attendance record updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE an attendance record by ID
app.delete('/api/attendance-records/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('attendance')
            .delete()
            .eq('attendance_id', id);
        if (error) throw error;
        res.json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all leaves
app.get('/api/leaves', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('leaves')
            .select('*')
            .order('applied_on', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single leave application by ID
app.get('/api/leaves/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('leaves')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Leave application not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new leave application
app.post('/api/leaves', async (req, res, next) => {
    const newLeave = req.body;
    try {
        const { data, error } = await supabase
            .from('leaves')
            .insert([newLeave]);
        if (error) throw error;
        res.status(201).json({ message: 'Leave application added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a leave application by ID
app.put('/api/leaves/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('leaves')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Leave application updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a leave application by ID
app.delete('/api/leaves/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('leaves')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Leave application deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all achievements
app.get('/api/achievements', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('student_achievements')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single achievement by ID
app.get('/api/achievements/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('student_achievements')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Achievement not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new achievement
app.post('/api/achievements', async (req, res, next) => {
    const newAchievement = req.body;
    try {
        const { data, error } = await supabase
            .from('student_achievements')
            .insert([newAchievement]);
        if (error) throw error;
        res.status(201).json({ message: 'Achievement added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE an achievement by ID
app.put('/api/achievements/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('student_achievements')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Achievement updated successfully', data });
    }
    catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE an achievement by ID
app.delete('/api/achievements/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('student_achievements')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all certificates
app.get('/api/certificates', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('issue_date', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single certificate by ID
app.get('/api/certificates/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Certificate not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new certificate
app.post('/api/certificates', async (req, res, next) => {
    const newCertificate = req.body;
    try {
        const { data, error } = await supabase
            .from('certificates')
            .insert([newCertificate]);
        if (error) throw error;
        res.status(201).json({ message: 'Certificate added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a certificate by ID
app.put('/api/certificates/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('certificates')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Certificate updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a certificate by ID
app.delete('/api/certificates/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('certificates')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all exams
app.get('/api/exams', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('exams')
            .select('*')
            .order('exam_date', { ascending: true })
            .order('exam_time', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single exam by ID
app.get('/api/exams/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('exams')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Exam not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new exam
app.post('/api/exams', async (req, res, next) => {
    const newExam = req.body;
    try {
        const { data, error } = await supabase
            .from('exams')
            .insert([newExam]);
        if (error) throw error;
        res.status(201).json({ message: 'Exam added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE an exam by ID
app.put('/api/exams/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('exams')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Exam updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE an exam by ID
app.delete('/api/exams/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('exams')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all report cards
app.get('/api/report-cards', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('report_cards')
            .select('*')
            .order('academic_year', { ascending: false })
            .order('term_semester', { ascending: false })
            .order('date_generated', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single report card by ID
app.get('/api/report-cards/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('report_cards')
            .select('*')
            .eq('report_id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Report card not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new report card
app.post('/api/report-cards', async (req, res, next) => {
    const newReportCard = req.body;
    try {
        const { data, error } = await supabase
            .from('report_cards')
            .insert([newReportCard]);
        if (error) throw error;
        res.status(201).json({ message: 'Report card added successfully', data });
    }
    catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a report card by ID
app.put('/api/report-cards/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('report_cards')
            .update(updatedData)
            .eq('report_id', id);
        if (error) throw error;
        res.json({ message: 'Report card updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a report card by ID
app.delete('/api/report-cards/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // Delete associated report_card_subjects first if not cascading
        await supabase.from('report_card_subjects').delete().eq('report_id', id);

        const { error } = await supabase
            .from('report_cards')
            .delete()
            .eq('report_id', id);
        if (error) throw error;
        res.json({ message: 'Report card deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// --- Report Card Subjects Routes ---
// GET all report card subjects (can be filtered by report_id if needed)
app.get('/api/report-card-subjects', async (req, res, next) => {
    const { report_id } = req.query;
    let query = supabase.from('report_card_subjects').select('*');
    if (report_id) {
        query = query.eq('report_id', report_id);
    }
    try {
        const { data, error } = await query.order('subject_name', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single report card subject by ID
app.get('/api/report-card-subjects/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('report_card_subjects')
            .select('*')
            .eq('subject_id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Report card subject not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new report card subject
app.post('/api/report-card-subjects', async (req, res, next) => {
    const newSubject = req.body;
    try {
        const { data, error } = await supabase
            .from('report_card_subjects')
            .insert([newSubject]);
        if (error) throw error;
        res.status(201).json({ message: 'Report card subject added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a report card subject by ID
app.put('/api/report-card-subjects/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('report_card_subjects')
            .update(updatedData)
            .eq('subject_id', id);
        if (error) throw error;
        res.json({ message: 'Report card subject updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a report card subject by ID
app.delete('/api/report-card-subjects/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('report_card_subjects')
            .delete()
            .eq('subject_id', id);
        if (error) throw error;
        res.json({ message: 'Report card subject deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all daily diary entries
app.get('/api/diary', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('diary') // Changed from 'daily_diary' to 'diary' to match schema
            .select('*')
            .order('date', { ascending: false })
            .order('class', { ascending: true })
            .order('section', { ascending: true })
            .order('subject', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single diary entry by ID
app.get('/api/diary/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('diary') // Changed from 'daily_diary' to 'diary' to match schema
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Diary entry not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new diary entry
app.post('/api/diary', async (req, res, next) => {
    const newEntry = req.body;
    try {
        const { data, error } = await supabase
            .from('diary') // Changed from 'daily_diary' to 'diary' to match schema
            .insert([newEntry]);
        if (error) throw error;
        res.status(201).json({ message: 'Diary entry added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a diary entry by ID
app.put('/api/diary/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('diary') // Changed from 'daily_diary' to 'diary' to match schema
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Diary entry updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a diary entry by ID
app.delete('/api/diary/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('diary') // Changed from 'daily_diary' to 'diary' to match schema
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Diary entry deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all study materials
app.get('/api/study-materials', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('study_materials')
            .select('*')
            .order('class', { ascending: true })
            .order('subject', { ascending: true })
            .order('title', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single study material by ID
app.get('/api/study-materials/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('study_materials')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Study material not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new study material
app.post('/api/study-materials', async (req, res, next) => {
    const newMaterial = req.body;
    try {
        const { data, error } = await supabase
            .from('study_materials')
            .insert([newMaterial]);
        if (error) throw error;
        res.status(201).json({ message: 'Study material added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a study material by ID
app.put('/api/study-materials/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('study_materials')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Study material updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a study material by ID
app.delete('/api/study-materials/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('study_materials')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Study material deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all video classes
app.get('/api/video-classes', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('video_classes')
            .select('*')
            .order('class', { ascending: true })
            .order('subject', { ascending: true })
            .order('title', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single video class by ID
app.get('/api/video-classes/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('video_classes')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Video class not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new video class
app.post('/api/video-classes', async (req, res, next) => {
    const newVideoClass = req.body;
    try {
        const { data, error } = await supabase
            .from('video_classes')
            .insert([newVideoClass]);
        if (error) throw error;
        res.status(201).json({ message: 'Video class added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a video class by ID
app.put('/api/video-classes/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('video_classes')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Video class updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a video class by ID
app.delete('/api/video-classes/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('video_classes')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Video class deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all class timetables
app.get('/api/timetables', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('class_timetables_links')
            .select('*')
            .order('class', { ascending: true })
            .order('section', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single timetable link by ID
app.get('/api/timetables/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('class_timetables_links')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Timetable link not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new timetable link
app.post('/api/timetables', async (req, res, next) => {
    const newLink = req.body;
    try {
        const { data, error } = await supabase
            .from('class_timetables_links')
            .insert([newLink]);
        if (error) throw error;
        res.status(201).json({ message: 'Timetable link added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a timetable link by ID
app.put('/api/timetables/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('class_timetables_links')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Timetable link updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a timetable link by ID
app.delete('/api/timetables/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('class_timetables_links')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Timetable link deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all fees records
app.get('/api/fees', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('fees')
            .select('*')
            .order('payment_date', { ascending: false })
            .order('student_id', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single fee record by ID
app.get('/api/fees/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('fees')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Fee record not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new fee record
app.post('/api/fees', async (req, res, next) => {
    const newFee = req.body;
    try {
        const { data: feeData, error: feeError } = await supabase
            .from('fees')
            .insert([newFee])
            .select(); // Select the inserted data to return it
        if (feeError) throw feeError;

        // Update student_profile's overall_amount_paid and current_due_amount
        const { student_id, transaction_amount } = newFee;
        const { data: studentProfile, error: studentProfileError } = await supabase
            .from('student_profile')
            .select('overall_amount_paid, total_fee, fee_concession')
            .eq('student_id', student_id)
            .single();

        if (studentProfileError) throw studentProfileError;

        const updatedOverallAmountPaid = (studentProfile.overall_amount_paid || 0) + (parseFloat(transaction_amount) || 0);
        const newCurrentDueAmount = (studentProfile.total_fee || 0) - (studentProfile.fee_concession || 0) - updatedOverallAmountPaid;

        const { error: updateError } = await supabase
            .from('student_profile')
            .update({
                overall_amount_paid: updatedOverallAmountPaid,
                current_due_amount: newCurrentDueAmount
            })
            .eq('student_id', student_id);
        if (updateError) throw updateError;

        res.status(201).json({ message: 'Fee record added successfully', data: feeData[0] }); // Return the inserted fee record
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a fee record by ID
app.put('/api/fees/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        // Fetch old record to calculate difference for student_profile update
        const { data: oldFeeRecord, error: oldFeeError } = await supabase
            .from('fees')
            .select('student_id, transaction_amount')
            .eq('id', id)
            .single();
        if (oldFeeError) throw oldFeeError;

        const oldAmount = oldFeeRecord.transaction_amount || 0;
        const newAmount = updatedData.transaction_amount !== undefined ? parseFloat(updatedData.transaction_amount) : oldAmount;
        const amountDifference = newAmount - oldAmount;

        const { data, error } = await supabase
            .from('fees')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;

        // Update student_profile's overall_amount_paid and current_due_amount
        const { student_id } = oldFeeRecord;
        const { data: studentProfile, error: studentProfileError } = await supabase
            .from('student_profile')
            .select('overall_amount_paid, total_fee, fee_concession')
            .eq('student_id', student_id)
            .single();
        if (studentProfileError) throw studentProfileError;

        const updatedOverallAmountPaid = (studentProfile.overall_amount_paid || 0) + amountDifference;
        const newCurrentDueAmount = (studentProfile.total_fee || 0) - (studentProfile.fee_concession || 0) - updatedOverallAmountPaid;

        const { error: updateError } = await supabase
            .from('student_profile')
            .update({
                overall_amount_paid: updatedOverallAmountPaid,
                current_due_amount: newCurrentDueAmount
            })
            .eq('student_id', student_id);
        if (updateError) throw updateError;

        res.json({ message: 'Fee record updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a fee record by ID
app.delete('/api/fees/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // Fetch record to get student_id and amount for student_profile update
        const { data: deletedFeeRecord, error: fetchError } = await supabase
            .from('fees')
            .select('student_id, transaction_amount')
            .eq('id', id)
            .single();
        if (fetchError) throw fetchError;

        const { error } = await supabase
            .from('fees')
            .delete()
            .eq('id', id);
        if (error) throw error;

        // Update student_profile's overall_amount_paid and current_due_amount
        const { student_id, transaction_amount } = deletedFeeRecord;
        const { data: studentProfile, error: studentProfileError } = await supabase
            .from('student_profile')
            .select('overall_amount_paid, total_fee, fee_concession')
            .eq('student_id', student_id)
            .single();
        if (studentProfileError) throw studentProfileError;

        const updatedOverallAmountPaid = (studentProfile.overall_amount_paid || 0) - (parseFloat(transaction_amount) || 0);
        const newCurrentDueAmount = (studentProfile.total_fee || 0) - (studentProfile.fee_concession || 0) - updatedOverallAmountPaid;

        const { error: updateError } = await supabase
            .from('student_profile')
            .update({
                overall_amount_paid: updatedOverallAmountPaid,
                current_due_amount: newCurrentDueAmount
            })
            .eq('student_id', student_id);
        if (updateError) throw updateError;

        res.json({ message: 'Fee record deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all orders
app.get('/api/orders', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false })
            .order('student_id', { ascending: true });
        if (error) throw error;
        res.json(data);
    }  catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single order by ID
app.get('/api/orders/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Order not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new order
app.post('/api/orders', async (req, res, next) => {
    const newOrder = req.body;
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([newOrder]);
        if (error) throw error;
        res.status(201).json({ message: 'Order added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE an order by ID
app.put('/api/orders/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('orders')
            .update(updatedData)
            .eq('order_id', id);
        if (error) throw error;
        res.json({ message: 'Order updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE an order by ID
app.delete('/api/orders/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', id);
        if (error) throw error;
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all announcements (notifications where is_common is true or student_id is null)
app.get('/api/announcements', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .or('is_common.eq.true,student_id.is.null') // Supabase syntax for OR
            .order('timestamp', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single announcement by ID
app.get('/api/announcements/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Announcement not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new announcement
app.post('/api/announcements', async (req, res, next) => {
    const newAnnouncement = req.body;
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([newAnnouncement]);
        if (error) throw error;
        res.status(201).json({ message: 'Announcement added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE an announcement by ID
app.put('/api/announcements/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('notifications')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Announcement updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE an announcement by ID
app.delete('/api/announcements/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all feedback
app.get('/api/feedback', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('submitted_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single feedback by ID
app.get('/api/feedback/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Feedback not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST new feedback
app.post('/api/feedback', async (req, res, next) => {
    const newFeedback = req.body;
    try {
        const { data, error } = await supabase
            .from('feedback')
            .insert([newFeedback]);
        if (error) throw error;
        res.status(201).json({ message: 'Feedback submitted successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE feedback by ID
app.put('/api/feedback/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('feedback')
            .update(updatedData)
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Feedback updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE feedback by ID
app.delete('/api/feedback/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET all holidays
app.get('/api/holidays', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('holidays')
            .select('*')
            .order('date', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET a single holiday by date (PK is date)
app.get('/api/holidays/:date', async (req, res, next) => {
    const { date } = req.params; // Date format should be YYYY-MM-DD
    try {
        const { data, error } = await supabase
            .from('holidays')
            .select('*')
            .eq('date', date)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                const err = new Error('Holiday not found');
                err.statusCode = 404;
                return next(err);
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// POST a new holiday
app.post('/api/holidays', async (req, res, next) => {
    const newHoliday = req.body;
    try {
        const { data, error } = await supabase
            .from('holidays')
            .insert([newHoliday]);
        if (error) throw error;
        res.status(201).json({ message: 'Holiday added successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// UPDATE a holiday by date
app.put('/api/holidays/:date', async (req, res, next) => {
    const { date } = req.params;
    const updatedData = req.body;
    try {
        const { data, error } = await supabase
            .from('holidays')
            .update(updatedData)
            .eq('date', date);
        if (error) throw error;
        res.json({ message: 'Holiday updated successfully', data });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// DELETE a holiday by date
app.delete('/api/holidays/:date', async (req, res, next) => {
    const { date } = req.params;
    try {
        const { error } = await supabase
            .from('holidays')
            .delete()
            .eq('date', date);
        if (error) throw error;
        res.json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// GET school settings (placeholder for now)
app.get('/api/settings', async (req, res, next) => {
    try {
        // In a real application, you might fetch this from a 'settings' table
        // For now, return hardcoded values
        res.json({
            schoolName: 'Padmavani E/M High School',
            schoolAddress: 'Vijaynagar colony, Tadipatri - 515411, Andhra Pradesh, India'
        });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// PUT school settings (placeholder for now)
app.put('/api/settings', async (req, res, next) => {
    const { schoolName, schoolAddress } = req.body;
    try {
        // In a real application, you would update a 'settings' table here
        console.log(`Updated School Name: ${schoolName}, Address: ${schoolAddress}`);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET Student Distribution by Class (for chart)
app.get('/api/student-class-distribution', async (req, res, next) => {
    try {
        // Fetch all students, then group and count in Node.js
        const { data: studentsData, error } = await supabase
            .from('student_profile')
            .select('class')
            .order('class', { ascending: true });
        if (error) throw error;

        // Aggregate data to count students per class
        const classCounts = {};
        studentsData.forEach(student => {
            const className = student.class;
            classCounts[className] = (classCounts[className] || 0) + 1;
        });

        const labels = Object.keys(classCounts).map(c => `Class ${c}`);
        const series = Object.values(classCounts);

        res.json({ series, labels });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});

// GET Fees Status Overview (for chart)
app.get('/api/fees-status-overview', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('student_profile')
            .select('total_fee, current_due_amount');
        if (error) throw error;

        const totalPaid = data.reduce((sum, student) => sum + ((student.total_fee || 0) - (student.current_due_amount || 0)), 0);
        const totalPending = data.reduce((sum, student) => sum + (student.current_due_amount || 0), 0);

        const series = [parseFloat(totalPaid.toFixed(2)), parseFloat(totalPending.toFixed(2))];
        const labels = ['Total Paid', 'Total Pending'];

        res.json({ series, labels });
    } catch (error) {
        next(error); // Pass error to central error handler
    }
});


// --- Error Handling Middleware ---
// This middleware catches errors passed from routes or other middleware.
// It should be defined after all routes and other middleware.
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message); // Log the error message
    console.error(err.stack); // Log the stack trace for debugging

    const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
    const message = err.statusCode ? err.message : 'An unexpected error occurred on the server.';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // In development, you might send the stack trace, but avoid in production for security
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- 404 Not Found Middleware ---
// This middleware catches any requests that don't match any defined routes.
// It should be placed right before the main error handling middleware.
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});


// --- Start Server ---
const server = app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Access your Supabase project at: ${supabaseUrl}`);
});


// --- Graceful Shutdown ---
// This handles situations where the server needs to shut down gracefully,
// e.g., on SIGTERM (from process managers like PM2 or Docker) or SIGINT (Ctrl+C).
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: Closing HTTP server.');
    server.close(() => {
        console.log('HTTP server closed.');
        // Optional: Close database connections or other resources here
        process.exit(0); // Exit process after server closes
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: Closing HTTP server.');
    server.close(() => {
        console.log('HTTP server closed.');
        // Optional: Close database connections or other resources here
        process.exit(0); // Exit process after server closes
    });
});

// Uncaught exceptions handling
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1); // Exit with failure code
    });
});

// Unhandled promise rejections handling
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1); // Exit with failure code
    });
});
