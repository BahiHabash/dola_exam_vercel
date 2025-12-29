const express = require('express');
const { Exam, Question, Result, Submission } = require('../models');
const loginRequired = require('../utils/authMiddleware');
const { gradeSubmission } = require('../utils/autoGrader');

const router = express.Router();

// Get exam questions
router.get('/:examId/questions', async (req, res) => {
    try {
        const examId = req.params.examId;

        const exam = await Exam.findByPk(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const questions = await Question.findAll({ where: { exam_id: examId } });

        const qList = questions.map(q => ({
            id: q.id,
            text: q.question_text,
            type: q.question_type,
            options: q.question_type === 'multiple-choice' ? q.options : null,
            points: q.points
            // NO correct_answer here for security
        }));

        res.json({
            examId: exam.id,
            title: exam.title,
            duration: exam.duration,
            questions: qList
        });
    } catch (error) {
        console.error('Get exam questions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit exam
router.post('/:examId/submit', loginRequired('student'), async (req, res) => {
    try {
        const examId = req.params.examId;
        const { submissions: submissionsData } = req.body;
        const userId = req.currentUser.id;

        // Check if already submitted
        const existingResult = await Result.findOne({
            where: { student_id: userId, exam_id: examId }
        });

        if (existingResult) {
            return res.status(400).json({ message: 'You have already submitted this exam' });
        }

        let totalScore = 0;
        let hasEssay = false;

        // Create Result
        const result = await Result.create({
            student_id: userId,
            exam_id: examId,
            submission_time: new Date(),
            is_graded: false
        });

        // Process submissions
        for (const sub of submissionsData) {
            const { questionId, studentAnswer, answerType } = sub;

            const question = await Question.findByPk(questionId);
            if (!question) continue;

            let isCorrect = false;
            let pointsAwarded = 0.0;

            // Auto-grade non-essay questions
            if (question.question_type !== 'essay') {
                const gradeResult = gradeSubmission(studentAnswer, question);
                isCorrect = gradeResult.isCorrect;
                pointsAwarded = gradeResult.score;
                totalScore += pointsAwarded;
            } else {
                hasEssay = true;
            }

            // Create submission entry
            await Submission.create({
                result_id: result.id,
                question_id: questionId,
                student_answer: String(studentAnswer),
                answer_type: answerType,
                is_correct: question.question_type === 'essay' ? null : isCorrect,
                submitted_at: new Date()
            });
        }

        // Update result scores
        result.auto_score = totalScore;
        result.final_score = totalScore;

        // Mark as graded if no essays
        if (!hasEssay) {
            result.is_graded = true;
            result.graded_at = new Date();
        }

        await result.save();

        res.status(201).json({
            resultId: result.id,
            autoScore: totalScore,
            submissionTime: result.submission_time,
            message: 'Exam submitted successfully'
        });
    } catch (error) {
        console.error('Submit exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
