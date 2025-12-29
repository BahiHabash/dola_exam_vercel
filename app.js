const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const examRoutes = require('./routes/exam');
const adminRoutes = require('./routes/teacher'); // Use teacher.js logic for /api/admin calls
const teacherAuthRoutes = require('./routes/teacherAuth');
const superAdminRoutes = require('./routes/superAdmin');
const publicRoutes = require('./routes/public');

const app = express();

// CORS configuration - allow all origins for API routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/public', publicRoutes); // Public endpoints (no auth required)
app.use('/api/auth', authRoutes); // Auth routes (login/register)
app.use('/api/teachers', teacherAuthRoutes);
app.use('/api/admin', adminRoutes); // Legacy admin routes mapped to teacher logic
app.use('/api/teacher', adminRoutes); // Teacher routes (same as admin routes, for teacher-specific endpoints)
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/exams', examRoutes);

// Serve static files from '../frontend' directory
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

// Frontend routes
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'login.html'));
});

app.get('/:path', (req, res) => {
    const requestedPath = req.params.path;

    // Prevent accessing backend files
    if (requestedPath.startsWith('exam_backend')) {
        return res.status(403).send('Access Denied');
    }

    const filePath = path.join(staticPath, requestedPath);

    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    res.status(404).send('File not found');
});

module.exports = app;
