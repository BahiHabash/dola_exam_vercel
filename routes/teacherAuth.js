const express = require('express');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { createToken } = require('../utils/jwtHandler');

const router = express.Router();

// Register teacher
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check availability
        const existing = await Admin.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPw = await bcrypt.hash(password, 10);

        // Create teacher
        const newTeacher = await Admin.create({
            username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Generate unique username if needed, or update model to not require it? Admin model has username unique.
            name,
            email,
            password_hash: hashedPw,
            role: 'teacher',
            plan: 'free',
            max_active_exams: 2,
            max_students: 30
        });

        const token = createToken(newTeacher.id, 'teacher');

        res.status(201).json({
            token,
            teacherId: newTeacher.id,
            role: 'teacher',
            message: 'Teacher account created'
        });

    } catch (error) {
        console.error('Teacher register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Teacher Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const teacher = await Admin.findOne({ where: { email } });

        if (!teacher || !(await bcrypt.compare(password, teacher.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if active (middleware does this too, but good to check on login)
        if (!teacher.is_active) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        // Update last login
        teacher.last_login = new Date();
        await teacher.save();

        const token = createToken(teacher.id, teacher.role);

        res.json({
            token,
            teacherId: teacher.id,
            role: teacher.role,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Teacher login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
