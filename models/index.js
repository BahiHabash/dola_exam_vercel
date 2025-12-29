const sequelize = require('../config/database');
const { Op } = require('sequelize');
const Student = require('./Student');
const Admin = require('./Admin');
const Exam = require('./Exam');
const Question = require('./Question');
const Result = require('./Result');
const Submission = require('./Submission');
const EssayGrade = require('./EssayGrade');
const StudentTeacher = require('./StudentTeacher');

// Define Relationships

// Student relationships
Student.hasMany(Result, { foreignKey: 'student_id', as: 'results' });
Result.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Admin relationships
Admin.hasMany(Exam, { foreignKey: 'created_by', as: 'exams' });
Exam.belongsTo(Admin, { foreignKey: 'created_by', as: 'creator' });

Admin.hasMany(EssayGrade, { foreignKey: 'graded_by', as: 'graded_essays' });
EssayGrade.belongsTo(Admin, { foreignKey: 'graded_by', as: 'grader' });

// Legacy Teacher (Admin) relationships - keep for backward compatibility
Admin.hasMany(Student, { foreignKey: 'teacher_id', as: 'students' });
Student.belongsTo(Admin, { foreignKey: 'teacher_id', as: 'teacher' });

Admin.hasMany(Result, { foreignKey: 'teacher_id', as: 'teacher_results' });
Result.belongsTo(Admin, { foreignKey: 'teacher_id', as: 'teacher' });

// NEW: Many-to-many relationship between Students and Teachers
Student.belongsToMany(Admin, {
    through: StudentTeacher,
    foreignKey: 'student_id',
    otherKey: 'teacher_id',
    as: 'teachers'
});

Admin.belongsToMany(Student, {
    through: StudentTeacher,
    foreignKey: 'teacher_id',
    otherKey: 'student_id',
    as: 'selectedStudents'
});

// Exam relationships
Exam.hasMany(Question, { foreignKey: 'exam_id', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

Exam.hasMany(Result, { foreignKey: 'exam_id', as: 'results' });
Result.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

// Result relationships
Result.hasMany(Submission, { foreignKey: 'result_id', as: 'submissions', onDelete: 'CASCADE' });
Submission.belongsTo(Result, { foreignKey: 'result_id', as: 'result' });

Result.hasMany(EssayGrade, { foreignKey: 'result_id', as: 'essay_grades', onDelete: 'CASCADE' });
EssayGrade.belongsTo(Result, { foreignKey: 'result_id', as: 'result' });

// Submission relationships
Submission.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

EssayGrade.belongsTo(Submission, { foreignKey: 'submission_id', as: 'submission' });

module.exports = {
    sequelize,
    Op,
    Student,
    Admin,
    Exam,
    Question,
    Result,
    Submission,
    EssayGrade,
    StudentTeacher
};

