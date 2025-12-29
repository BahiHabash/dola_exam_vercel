/**
 * Auto-grade a single submission against a question
 * @param {string} submissionText - Student's answer
 * @param {object} question - Question object with type and correct_answer
 * @returns {object} { isCorrect, score }
 */
function gradeSubmission(submissionText, question) {
    // Essays are always 0 until manually graded
    if (question.question_type === 'essay') {
        return { isCorrect: false, score: 0.0 };
    }

    // Normalize strings for comparison
    const studentAns = String(submissionText).trim().toLowerCase();
    const correctAns = String(question.correct_answer).trim().toLowerCase();

    if (studentAns === correctAns) {
        return { isCorrect: true, score: parseFloat(question.points) };
    }

    return { isCorrect: false, score: 0.0 };
}

module.exports = {
    gradeSubmission
};
