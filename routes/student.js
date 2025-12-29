const express = require('express');
const router = express.Router();
const { Exam, Question, Result, Student } = require('../models');
const loginRequired = require('../utils/authMiddleware');

// Get all active exams
router.get('/exams', loginRequired('student'), async (req, res) => {
    try {
        const exams = await Exam.findAll({
            where: { is_active: true },
            attributes: ['id', 'title', 'description', 'duration', 'passing_score', 'created_at']
        });
        res.json(exams);
    } catch (error) {
        console.error('Get student exams error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Exam Details & Questions for Taking Exam
router.get('/exams/:id/questions', loginRequired('student'), async (req, res) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findByPk(examId, {
            where: { is_active: true },
            attributes: ['id', 'title', 'description', 'duration']
        });

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found or inactive' });
        }

        const questions = await Question.findAll({
            where: { exam_id: examId },
            attributes: ['id', 'question_text', 'question_type', 'options', 'points'] // Exclude correct_answer
        });

        res.json({ exam, questions });
    } catch (error) {
        console.error('Get exam questions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit Exam
router.post('/exams/:id/submit', loginRequired('student'), async (req, res) => {
    try {
        const examId = req.params.id;
        const studentId = req.currentUser.id;
        const { answers } = req.body; // { questionId: answer, ... }

        const exam = await Exam.findByPk(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        const questions = await Question.findAll({ where: { exam_id: examId } });

        let autoScore = 0;
        let totalScore = 0;
        let hasEssays = false;

        questions.forEach(q => {
            totalScore += q.points;
            if (q.question_type === 'essay') {
                hasEssays = true;
            } else {
                const studentAnswer = answers[q.id];
                let isCorrect = false;
                if (q.question_type === 'multiple-choice') {
                    if (q.options) {
                        const correctOpt = q.options.find(o => o.correct);
                        if (correctOpt && (correctOpt.text === studentAnswer)) isCorrect = true;
                    }
                } else if (q.question_type === 'calculation' || q.question_type === 'numerical') {
                    if (parseFloat(studentAnswer) === parseFloat(q.correct_answer)) isCorrect = true;
                }
                if (isCorrect) autoScore += q.points;
            }
        });

        // Create Result
        const result = await Result.create({
            student_id: studentId,
            exam_id: examId,
            teacher_id: exam.created_by,
            auto_score: autoScore,
            final_score: autoScore,
            is_graded: !hasEssays,
            submission_time: new Date()
        });

        // Create Submissions
        const { Submission } = require('../models');
        const submissionData = questions.map(q => {
            const studentAnswer = answers[q.id];
            let isCorrect = null;
            if (q.question_type !== 'essay') {
                isCorrect = false;
                if (q.question_type === 'multiple-choice') {
                    if (q.options) {
                        const correctOpt = q.options.find(o => o.correct);
                        if (correctOpt && (correctOpt.text === studentAnswer)) isCorrect = true;
                    }
                } else if (q.question_type === 'calculation' || q.question_type === 'numerical') {
                    if (parseFloat(studentAnswer) === parseFloat(q.correct_answer)) isCorrect = true;
                }
            }
            return {
                result_id: result.id,
                question_id: q.id,
                student_answer: studentAnswer ? studentAnswer.toString() : '',
                answer_type: q.question_type,
                is_correct: isCorrect
            };
        });

        await Submission.bulkCreate(submissionData);

        res.json({
            message: 'Exam submitted successfully',
            resultId: result.id,
            autoScore,
            is_graded: result.is_graded
        });

    } catch (error) {
        console.error('Submit exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Select/Update teachers for student (post-registration)
router.post('/teachers/select', loginRequired('student'), async (req, res) => {
    try {
        const studentId = req.currentUser.id;
        const { teacherIds } = req.body;

        if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
            return res.status(400).json({ message: 'Please select at least one teacher' });
        }

        const { Admin, StudentTeacher } = require('../models');

        // Validate all teacher IDs
        const validTeachers = await Admin.findAll({
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

        // Delete existing teacher links for this student
        await StudentTeacher.destroy({
            where: { student_id: studentId }
        });

        // Create new teacher links
        const studentTeacherLinks = validTeachers.map(teacher => ({
            student_id: studentId,
            teacher_id: teacher.id
        }));

        await StudentTeacher.bulkCreate(studentTeacherLinks);

        // Update legacy teacher_id field for backward compatibility
        const student = await Student.findByPk(studentId);
        student.teacher_id = validTeachers[0].id;
        await student.save();

        res.json({
            studentId,
            teacherIds: validTeachers.map(t => t.id),
            message: 'Teachers updated successfully'
        });

    } catch (error) {
        console.error('Select teachers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get student results
router.get('/results', loginRequired('student'), async (req, res) => {
    try {
        const studentId = req.currentUser.id;
        const results = await Result.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Exam,
                    as: 'exam',
                    attributes: ['title', 'description', 'passing_score'],
                    include: [{
                        model: Question,
                        as: 'questions',
                        attributes: ['points']
                    }]
                }
            ],
            order: [['submission_time', 'DESC']]
        });

        // Calculate total_score for each result
        const output = results.map(r => {
            const resultJson = r.toJSON();
            if (resultJson.exam && resultJson.exam.questions) {
                resultJson.total_score = resultJson.exam.questions.reduce((sum, q) => sum + q.points, 0);
                delete resultJson.exam.questions;
            } else {
                resultJson.total_score = 0;
            }
            return resultJson;
        });

        res.json(output);
    } catch (error) {
        console.error('Get student results error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
