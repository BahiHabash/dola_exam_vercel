const express = require('express');
const { Admin, Exam, Student, Result, sequelize } = require('../models');
const loginRequired = require('../utils/authMiddleware');

const router = express.Router();

// Middleware to ensure Super Admin (double check, though app usage should enforce it)
// Used loginRequired('super_admin') in checks.

// Get all teachers
router.get('/teachers', loginRequired('super_admin'), async (req, res) => {
    try {
        const teachers = await Admin.findAll({
            where: { role: 'teacher' }, // Or sub_admin if we support legacy
            attributes: ['id', 'username', 'name', 'email', 'role', 'plan', 'is_active', 'created_at', 'expires_at']
        });

        // Add calculated stats
        const output = await Promise.all(teachers.map(async (t) => {
            const totalExams = await Exam.count({ where: { created_by: t.id } });
            const totalStudents = await Student.count({ where: { teacher_id: t.id } });
            const totalResults = await Result.count({ where: { teacher_id: t.id } });

            return {
                teacherId: t.id,
                name: t.name || t.username,
                email: t.email,
                plan: t.plan,
                isActive: t.is_active,
                createdAt: t.created_at,
                expiresAt: t.expires_at,
                totalExams,
                totalStudents,
                totalResults
            };
        }));

        res.json(output);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single teacher details
router.get('/teachers/:id', loginRequired('super_admin'), async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacher = await Admin.findByPk(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const totalExams = await Exam.count({ where: { created_by: teacherId } });
        const totalStudents = await Student.count({ where: { teacher_id: teacherId } });
        const totalResults = await Result.count({ where: { teacher_id: teacherId } });

        res.json({
            teacherId: teacher.id,
            name: teacher.name || teacher.username,
            email: teacher.email,
            role: teacher.role,
            plan: teacher.plan,
            isActive: teacher.is_active,
            maxActiveExams: teacher.max_active_exams,
            maxStudents: teacher.max_students,
            lastLogin: teacher.last_login,
            createdAt: teacher.created_at,
            expiresAt: teacher.expires_at,
            stats: {
                totalExams,
                totalStudents,
                totalResults
            }
        });

    } catch (error) {
        console.error('Get teacher details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update teacher status/subscription
router.patch('/teachers/:id/status', loginRequired('super_admin'), async (req, res) => {
    try {
        const teacherId = req.params.id;
        const { isActive, expiresAt, plan, maxActiveExams, maxStudents } = req.body;

        const teacher = await Admin.findByPk(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        if (isActive !== undefined) teacher.is_active = isActive;
        if (expiresAt !== undefined) teacher.expires_at = expiresAt ? new Date(expiresAt) : null;
        if (plan !== undefined) teacher.plan = plan;
        if (maxActiveExams !== undefined) teacher.max_active_exams = maxActiveExams;
        if (maxStudents !== undefined) teacher.max_students = maxStudents;

        await teacher.save();

        res.json({ message: 'Teacher updated successfully', teacher });

    } catch (error) {
        console.error('Update teacher status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete teacher (Soft Delete)
router.delete('/teachers/:id', loginRequired('super_admin'), async (req, res) => {
    try {
        const teacherId = req.params.id;

        const teacher = await Admin.findByPk(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Soft delete: set inactive and maybe rename/mangle email if needed to allow re-registration?
        // Instruction says: "Setting isActive = false... Or perform hard delete... Make sure related data handled"
        // Recommended: Soft delete (isActive = false).

        teacher.is_active = false;
        // teacher.deleted_at = new Date(); // If using paranoid, but we just use isActive for now
        await teacher.save();

        res.json({ message: 'Teacher deactivated (soft deleted)' });

    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
