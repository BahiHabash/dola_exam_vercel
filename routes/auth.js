const express = require('express');
const bcrypt = require('bcryptjs');
const { Student, Admin, StudentTeacher } = require('../models');
const { createToken, decodeToken } = require('../utils/jwtHandler');

const router = express.Router();

// Register new student
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, teacherIds } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if email already exists
        const existingStudent = await Student.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Validate teacher IDs if provided
        let validTeachers = [];
        if (teacherIds && Array.isArray(teacherIds) && teacherIds.length > 0) {
            validTeachers = await Admin.findAll({
                where: {
                    id: teacherIds,
                    role: 'teacher',
                    is_active: true
                }
            });

            if (validTeachers.length !== teacherIds.length) {
                return res.status(400).json({
                    message: 'Some teacher IDs are invalid or inactive'
                });
            }
        }

        // Hash password
        const hashedPw = await bcrypt.hash(password, 10);

        // Create new student
        const newStudent = await Student.create({
            name,
            email,
            password_hash: hashedPw,
            teacher_id: validTeachers.length > 0 ? validTeachers[0].id : null // Set first teacher for backward compatibility
        });

        // Create student-teacher relationships
        if (validTeachers.length > 0) {
            const studentTeacherLinks = validTeachers.map(teacher => ({
                student_id: newStudent.id,
                teacher_id: teacher.id
            }));

            await StudentTeacher.bulkCreate(studentTeacherLinks);
        }

        // Create token
        const token = createToken(newStudent.id, 'student');

        res.status(201).json({
            token,
            studentId: newStudent.id,
            teacherIds: validTeachers.map(t => t.id),
            message: 'Registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login (supports both student and admin)
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password required' });
        }

        let user = null;
        let role = null;

        // Check Admin first (if username provided)
        if (username) {
            user = await Admin.findOne({ where: { username } });
            role = 'admin';
        } else if (email) {
            // Check Student by email
            user = await Student.findOne({ where: { email } });
            role = 'student';

            // If not found, try Admin by email
            if (!user) {
                const adminCheck = await Admin.findOne({ where: { email } });
                if (adminCheck) {
                    user = adminCheck;
                    role = 'admin';
                }
            }
        }

        // Verify user and password
        if (user && await bcrypt.compare(password, user.password_hash)) {
            const tokenRole = role; // 'admin' or 'student'
            const specificRole = role === 'admin' ? user.role : 'student';

            const token = createToken(user.id, tokenRole);
            return res.status(200).json({
                token,
                userId: user.id,
                role: specificRole, // super_admin or sub_admin for admins
                userType: tokenRole, // admin or student
                message: 'Login successful'
            });
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify token
router.post('/verify-token', (req, res) => {
    try {
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ isValid: false });
        }

        const payload = decodeToken(token);

        if (typeof payload === 'string') {
            return res.status(401).json({ isValid: false, message: payload });
        }

        res.status(200).json({
            isValid: true,
            userId: payload.user_id,
            role: payload.role
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ isValid: false, message: 'Server error' });
    }
});

module.exports = router;
