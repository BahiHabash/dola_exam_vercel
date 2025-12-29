const express = require('express');
const { Exam, Question, Result, Student, Submission, EssayGrade, Admin, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const loginRequired = require('../utils/authMiddleware');

const router = express.Router();

// Create exam
router.post('/exams', loginRequired('teacher'), async (req, res) => {
    try {
        const { title, description, duration, passing_score } = req.body;
        const teacherId = req.currentUser.id;

        // Check Plan Limits (Active Exams)
        // Assume 'is_active' exams are those not 'archived'? Or just all exams?
        // Prompt says "Count current active exams". Let's assume all exams are active unless Soft Deleted or we add 'is_active' field handling.
        // Exam model has 'is_active' default true.
        const teacher = await Admin.findByPk(teacherId); // Admin is Teacher model

        const currentExamCount = await Exam.count({
            where: { created_by: teacherId, is_active: true }
        });

        if (teacher.plan === 'free' && currentExamCount >= teacher.max_active_exams) {
            return res.status(403).json({
                message: `Free plan limit reached (${teacher.max_active_exams} exams). Upgrade to Pro to create more.`
            });
        }

        const newExam = await Exam.create({
            title,
            description,
            duration,
            passing_score: passing_score || 60.0,
            created_by: teacherId
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

// Get all exams for teacher
router.get('/exams', loginRequired('teacher'), async (req, res) => {
    try {
        const exams = await Exam.findAll({
            where: { created_by: req.currentUser.id }
        });
        res.json(exams);
    } catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Exam
router.put('/exams/:id', loginRequired('teacher'), async (req, res) => {
    try {
        const { title, description, duration, passing_score } = req.body;
        const examId = req.params.id;
        const teacherId = req.currentUser.id;

        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        if (title) exam.title = title;
        if (description) exam.description = description;
        if (duration) exam.duration = duration;
        if (passing_score) exam.passing_score = passing_score;

        await exam.save();
        res.json({ message: 'Exam updated', exam });

    } catch (error) {
        console.error('Update exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Exam
router.delete('/exams/:id', loginRequired('teacher'), async (req, res) => {
    try {
        const examId = req.params.id;
        const teacherId = req.currentUser.id;

        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        await exam.destroy();
        res.json({ message: 'Exam deleted' });

    } catch (error) {
        console.error('Delete exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get questions for exam
router.get('/exams/:examId/questions', loginRequired('teacher'), async (req, res) => {
    try {
        const examId = req.params.examId;
        const teacherId = req.currentUser.id;

        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        const questions = await Question.findAll({ where: { exam_id: examId } });
        res.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add question to exam
router.post('/exams/:examId/questions', loginRequired('teacher'), async (req, res) => {
    try {
        const examId = req.params.examId;
        const teacherId = req.currentUser.id;

        // Check ownership
        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found or access denied' });
        }

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
router.put('/exams/:examId/questions/:questionId', loginRequired('teacher'), async (req, res) => {
    try {
        const { examId, questionId } = req.params;
        const teacherId = req.currentUser.id;

        // Verify exam ownership first (strictly speaking optional if checking question link, but safer)
        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found or access denied' });
        }

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
router.delete('/exams/:examId/questions/:questionId', loginRequired('teacher'), async (req, res) => {
    try {
        const { examId, questionId } = req.params;
        const teacherId = req.currentUser.id;

        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found or access denied' });
        }

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
router.get('/exams/:examId/results', loginRequired('teacher'), async (req, res) => {
    try {
        const examId = req.params.examId;
        const teacherId = req.currentUser.id;

        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found or access denied' });
        }

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
router.get('/essay-reviews', loginRequired('teacher'), async (req, res) => {
    try {
        const statusFilter = req.query.status || 'all';
        const examId = req.query.examId;
        const teacherId = req.currentUser.id;

        // Build query
        const whereClause = { answer_type: 'essay' };

        // Ensure we only fetch for exams owned by this teacher
        // We need to filter Results > Exam > created_by = teacherId

        const submissions = await Submission.findAll({
            where: whereClause,
            include: [
                {
                    model: Result,
                    as: 'result',
                    required: true,
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['id', 'name']
                        },
                        {
                            model: Exam,
                            as: 'exam',
                            where: { created_by: teacherId, ...(examId ? { id: examId } : {}) },
                            required: true
                        }
                    ]
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
router.post('/essay-reviews/:submissionId/grade', loginRequired('teacher'), async (req, res) => {
    try {
        const submissionId = req.params.submissionId;
        const { score, comment } = req.body;
        const teacherId = req.currentUser.id;

        const submission = await Submission.findByPk(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const result = await Result.findByPk(submission.result_id, {
            include: [{ model: Exam, as: 'exam' }]
        });

        if (!result || result.exam.created_by !== teacherId) {
            return res.status(403).json({ message: 'Access denied' });
        }

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

// Get statistics (Legacy or detailed stats)
router.get('/statistics', loginRequired('teacher'), async (req, res) => {
    try {
        const examId = req.query.examId;
        const teacherId = req.currentUser.id;

        const totalStudents = await Student.count({ where: { teacher_id: teacherId } });

        // Filter results by teacher_id (using the new field)
        const whereClause = { teacher_id: teacherId };
        if (examId) whereClause.exam_id = examId;

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

// Get all students (using many-to-many relationship)
router.get('/students', loginRequired('teacher'), async (req, res) => {
    try {
        const teacherId = req.currentUser.id;

        // Get teacher with their selected students using the join table
        const teacher = await Admin.findByPk(teacherId, {
            include: [{
                model: Student,
                as: 'selectedStudents',
                through: {
                    attributes: ['created_at'],
                    as: 'enrollment'
                },
                attributes: ['id', 'name', 'email', 'registration_date']
            }]
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const students = teacher.selectedStudents || [];

        const output = await Promise.all(students.map(async (student) => {
            const results = await Result.findAll({
                where: { student_id: student.id, teacher_id: teacherId }
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

// Add Student (Teacher manually adds student)
router.post('/students', loginRequired('teacher'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const teacherId = req.currentUser.id;

        const teacher = await Admin.findByPk(teacherId);

        // Count students via join table
        const { StudentTeacher } = require('../models');
        const studentCount = await StudentTeacher.count({ where: { teacher_id: teacherId } });

        if (teacher.plan === 'free' && studentCount >= teacher.max_students) {
            return res.status(403).json({
                message: `Free plan limit reached (${teacher.max_students} students). Upgrade to Pro.`
            });
        }

        // Check availability (global email check)
        const existing = await Student.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPw = await bcrypt.hash(password || '123456', 10);

        const newStudent = await Student.create({
            name,
            email,
            password_hash: hashedPw,
            teacher_id: teacherId // Set for backward compatibility
        });

        // Create join table entry
        await StudentTeacher.create({
            student_id: newStudent.id,
            teacher_id: teacherId
        });

        res.status(201).json({ message: 'Student added' });

    } catch (error) {
        console.error('Add student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Student
router.put('/students/:id', loginRequired('teacher'), async (req, res) => {
    try {
        const studentId = req.params.id;
        const teacherId = req.currentUser.id;
        const { name, email, password } = req.body;

        const student = await Student.findOne({ where: { id: studentId, teacher_id: teacherId } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or access denied' });
        }

        // Check email uniqueness (exclude current student)
        if (email && email !== student.email) {
            const existing = await Student.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            student.email = email;
        }

        if (name) student.name = name;
        if (password) {
            const hashedPw = await bcrypt.hash(password, 10);
            student.password_hash = hashedPw;
        }

        await student.save();

        res.json({
            message: 'Student updated',
            student: {
                id: student.id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Student
router.delete('/students/:id', loginRequired('teacher'), async (req, res) => {
    try {
        const studentId = req.params.id;
        const teacherId = req.currentUser.id;

        const student = await Student.findOne({ where: { id: studentId, teacher_id: teacherId } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or access denied' });
        }

        await student.destroy();

        res.json({ message: 'Student deleted' });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Teacher Dashboard

router.get('/dashboard', loginRequired('teacher'), async (req, res) => {
    try {
        const teacherId = req.currentUser.id;

        const totalExams = await Exam.count({ where: { created_by: teacherId } });
        const totalStudents = await Student.count({ where: { teacher_id: teacherId } });
        const totalSubmissions = await Result.count({ where: { teacher_id: teacherId } });

        const results = await Result.findAll({ where: { teacher_id: teacherId }, attributes: ['final_score'] });
        const totalScore = results.reduce((sum, r) => sum + r.final_score, 0);
        const averageScore = results.length > 0 ? totalScore / results.length : 0;

        // Pending essays: Get submissions where result.teacher_id is me
        // A bit complex query, using raw or include.
        // Simplest: Find all Results for teacher, get IDs, find EssayGrades?
        // Or: Submission -> Result (where teacher_id=X).
        const essaySubs = await Submission.findAll({
            where: { answer_type: 'essay' },
            include: [{
                model: Result,
                as: 'result',
                where: { teacher_id: teacherId },
                attributes: ['id']
            }]
        });

        let pendingEssays = 0;
        for (const sub of essaySubs) {
            const grade = await EssayGrade.findOne({ where: { submission_id: sub.id } });
            if (!grade) pendingEssays++;
        }

        res.json({
            totalExams,
            totalStudents,
            totalSubmissions,
            averageScore,
            pendingEssays
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export Results
router.get('/exams/:examId/results/export', loginRequired('teacher'), async (req, res) => {
    try {
        const examId = req.params.examId;
        const teacherId = req.currentUser.id;

        const exam = await Exam.findOne({ where: { id: examId, created_by: teacherId } });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const results = await Result.findAll({
            where: { exam_id: examId },
            include: [{
                model: Student,
                as: 'student',
                attributes: ['name', 'email']
            }]
        });

        const data = results.map(r => ({
            StudentName: r.student ? r.student.name : 'Unknown',
            StudentEmail: r.student ? r.student.email : 'N/A',
            ExamTitle: exam.title,
            AutoScore: r.auto_score,
            EssayScore: r.essay_score,
            FinalScore: r.final_score,
            Passed: r.final_score >= exam.passing_score ? 'Yes' : 'No',
            SubmissionTime: r.submission_time
        }));

        res.json(data);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;

