const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    result_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'results',
            key: 'id'
        }
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        }
    },
    student_answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    answer_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'essay, multiple_choice, numerical'
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: 'Null for essay until graded'
    },
    submitted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'submissions',
    timestamps: false
});

module.exports = Submission;
