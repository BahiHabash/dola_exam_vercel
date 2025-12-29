const express = require('express');
const { Exam, Question, Result, Student, Submission, EssayGrade, Admin, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const loginRequired = require('../utils/authMiddleware');

const router = express.Router();
console.log('DEBUG: Loaded admin.js routes');

// Create exam
router.post('/exams', loginRequired('admin'), async (req, res) => {
    try {
        const { title, description, duration, passing_score } = req.body;

        const newExam = await Exam.create({
            title,
            description,
            duration,
            passing_score: passing_score || 60.0,
            created_by: req.currentUser.id
        });

        res.status(201).json({
            examId: newExam.id,
            message: 'Exam created'
        });
    } catch (error) {
        console.error('Create exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add question to exam
router.post('/exams/:examId/questions', loginRequired('admin'), async (req, res) => {
    try {
        const examId = req.params.examId;
        const { questionText, questionType, options, correctAnswer, points } = req.body;

        const newQuestion = await Question.create({
            exam_id: examId,
            question_text: questionText,
            question_type: questionType,
            options,
            correct_answer: correctAnswer,
            points: points || 1.0
        });

        res.status(201).json({
            questionId: newQuestion.id,
            message: 'Question added'
        });
    } catch (error) {
        console.error('Add question error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update question
router.put('/exams/:examId/questions/:questionId', loginRequired('admin'), async (req, res) => {
    try {
        const { examId, questionId } = req.params;

        const question = await Question.findOne({
            where: { id: questionId, exam_id: examId }
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const { questionText, questionType, options, correctAnswer, points } = req.body;

        if (questionText) question.question_text = questionText;
        if (questionType) question.question_type = questionType;
        if (options !== undefined) question.options = options;
        if (correctAnswer !== undefined) question.correct_answer = correctAnswer;
        if (points !== undefined) question.points = points;

        await question.save();

        res.json({ message: 'Question updated' });
    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete question
router.delete('/exams/:examId/questions/:questionId', loginRequired('admin'), async (req, res) => {
    try {
        const { examId, questionId } = req.params;

        const question = await Question.findOne({
            where: { id: questionId, exam_id: examId }
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await question.destroy();

        res.json({ message: 'Question deleted' });
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get exam results
router.get('/exams/:examId/results', loginRequired('admin'), async (req, res) => {
    try {
        const examId = req.params.examId;

        const results = await Result.findAll({
            where: { exam_id: examId },
            include: [{
                model: Student,
                as: 'student',
                attributes: ['name']
            }]
        });

        const output = results.map(r => ({
            resultId: r.id,
            studentName: r.student ? r.student.name : 'Unknown',
            studentId: r.student_id,
            autoScore: r.auto_score,
            essayScore: r.essay_score,
            finalScore: r.final_score,
            status: r.is_graded ? 'Graded' : 'Pending',
            submittedAt: r.submission_time
        }));

        res.json(output);
    } catch (error) {
        console.error('Get exam results error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get essay reviews for grading
router.get('/essay-reviews', loginRequired('admin'), async (req, res) => {
    try {
        const statusFilter = req.query.status || 'all';
        const examId = req.query.examId;

        // Build query
        const whereClause = { answer_type: 'essay' };

        const submissions = await Submission.findAll({
            where: whereClause,
            include: [
                {
                    model: Result,
                    as: 'result',
                    include: [{
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name']
                    }],
                    where: examId ? { exam_id: examId } : {}
                },
                {
                    model: Question,
                    as: 'question',
                    attributes: ['id', 'question_text']
                }
            ]
        });

        const reviews = await Promise.all(submissions.map(async (sub) => {
            const grade = await EssayGrade.findOne({ where: { submission_id: sub.id } });
            const isGraded = grade !== null;

            // Apply status filter
            if (statusFilter === 'pending' && isGraded) return null;
            if (statusFilter === 'graded' && !isGraded) return null;

            return {
                submissionId: sub.id,
                resultId: sub.result.id,
                studentId: sub.result.student.id,
                studentName: sub.result.student.name,
                questionId: sub.question.id,
                questionText: sub.question.question_text,
                studentAnswer: sub.student_answer,
                currentScore: grade ? grade.score : null,
                status: isGraded ? 'Graded' : 'Pending',
                submittedAt: sub.submitted_at
            };
        }));

        // Filter out nulls from status filter
        const filteredReviews = reviews.filter(r => r !== null);

        res.json(filteredReviews);
    } catch (error) {
        console.error('Get essay reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Grade essay
router.post('/essay-reviews/:submissionId/grade', loginRequired('admin'), async (req, res) => {
    try {
        const submissionId = req.params.submissionId;
        const { score, comment } = req.body;

        const submission = await Submission.findByPk(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const result = await Result.findByPk(submission.result_id);

        // Check if existing grade
        let grade = await EssayGrade.findOne({ where: { submission_id: submissionId } });

        if (grade) {
            // Update existing grade
            grade.score = score;
            grade.comment = comment;
            grade.graded_by = req.currentUser.id;
            grade.graded_at = new Date();
            await grade.save();
        } else {
            // Create new grade
            grade = await EssayGrade.create({
                result_id: result.id,
                submission_id: submissionId,
                graded_by: req.currentUser.id,
                score,
                comment
            });
        }

        // Recalculate result total
        const allEssayGrades = await EssayGrade.findAll({
            where: { result_id: result.id }
        });

        const totalEssayScore = allEssayGrades.reduce((sum, g) => sum + g.score, 0);
        result.essay_score = totalEssayScore;

        // Formula from Python backend: final_score = (auto_score + essay_score) / 2
        result.final_score = (result.auto_score + result.essay_score) / 2;

        // Check if all essays are graded
        const allEssaySubs = await Submission.findAll({
            where: { result_id: result.id, answer_type: 'essay' }
        });

        const gradedSubIds = allEssayGrades.map(g => g.submission_id);
        const allGraded = allEssaySubs.every(sub => gradedSubIds.includes(sub.id));

        if (allGraded) {
            result.is_graded = true;
            result.graded_at = new Date();
        }

        await result.save();

        res.json({
            message: 'Grade saved',
            updatedResultId: result.id
        });
    } catch (error) {
        console.error('Grade essay error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get statistics
router.get('/statistics', loginRequired('admin'), async (req, res) => {
    try {
        const examId = req.query.examId;

        const totalStudents = await Student.count();

        const whereClause = examId ? { exam_id: examId } : {};
        const results = await Result.findAll({
            where: whereClause,
            include: [{
                model: Exam,
                as: 'exam',
                attributes: ['passing_score']
            }]
        });

        const totalSubmissions = results.length;

        let avgScore = 0;
        let passRate = 0;
        let passingCount = 0;

        if (totalSubmissions > 0) {
            const totalScore = results.reduce((sum, r) => sum + r.final_score, 0);
            avgScore = totalScore / totalSubmissions;

            // Calculate pass rate
            passingCount = results.filter(r => r.final_score >= r.exam.passing_score).length;
            passRate = (passingCount / totalSubmissions) * 100;
        }

        // Count pending essays
        const essaySubs = await Submission.findAll({
            where: { answer_type: 'essay' },
            include: examId ? [{
                model: Result,
                as: 'result',
                where: { exam_id: examId },
                attributes: []
            }] : []
        });

        let pendingEssays = 0;
        for (const sub of essaySubs) {
            const grade = await EssayGrade.findOne({ where: { submission_id: sub.id } });
            if (!grade) pendingEssays++;
        }

        const totalExams = await Exam.count({ where: examId ? { id: examId } : {} });
        console.log('DEBUG: Statistics called. totalExams:', totalExams);

        res.json({
            totalStudents,
            totalSubmissions,
            averageScore: avgScore,
            passRate,
            pendingEssays,
            totalExams
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all students
router.get('/students', loginRequired('admin'), async (req, res) => {
    try {
        const students = await Student.findAll();

        const output = await Promise.all(students.map(async (student) => {
            const results = await Result.findAll({
                where: { student_id: student.id }
            });

            const completedExams = results.length;
            let avg = 0;

            if (completedExams > 0) {
                const totalScore = results.reduce((sum, r) => sum + r.final_score, 0);
                avg = totalScore / completedExams;
            }

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                registrationDate: student.registration_date,
                completedExams,
                averageScore: avg
            };
        }));

        res.json(output);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get list of admins (Super Admin only)
router.get('/admins', loginRequired('admin'), async (req, res) => {
    try {
        const currentAdmin = await Admin.findByPk(req.currentUser.id);
        if (!currentAdmin || currentAdmin.role !== 'super_admin') {
            return res.status(403).json({ message: 'Super Admin privilege required' });
        }

        const admins = await Admin.findAll({
            where: { role: 'sub_admin' },
            attributes: ['id', 'username', 'name', 'email', 'role', 'created_at']
        });

        const output = admins.map(a => ({
            id: a.id,
            name: a.name || a.username, // Use name if available
            username: a.username,
            password: '***', // Security
            role: a.role,
            createdAt: a.created_at
        }));

        res.json(output);
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new admin (Super Admin only)
router.post('/admins', loginRequired('admin'), async (req, res) => {
    try {
        const currentAdmin = await Admin.findByPk(req.currentUser.id);
        if (!currentAdmin || currentAdmin.role !== 'super_admin') {
            return res.status(403).json({ message: 'Super Admin privilege required' });
        }

        const { name, username, password } = req.body;

        // Check duplication
        const existing = await Admin.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPw = await bcrypt.hash(password, 10);

        // Generate dummy email since it's required by model but not provided by UI
        const email = `${username}@admin.local`;

        const newAdmin = await Admin.create({
            username,
            name,
            email,
            password_hash: hashedPw,
            role: 'sub_admin'
        });

        res.status(201).json({
            id: newAdmin.id,
            username: newAdmin.username,
            role: newAdmin.role,
            message: 'Admin created'
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete admin (Super Admin only)
router.delete('/admins/:id', loginRequired('admin'), async (req, res) => {
    try {
        const currentAdmin = await Admin.findByPk(req.currentUser.id);
        if (!currentAdmin || currentAdmin.role !== 'super_admin') {
            return res.status(403).json({ message: 'Super Admin privilege required' });
        }

        const idToDelete = req.params.id;

        if (String(idToDelete) === String(currentAdmin.id)) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        const adminToDelete = await Admin.findByPk(idToDelete);
        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await adminToDelete.destroy();

        res.json({ message: 'Admin deleted' });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

