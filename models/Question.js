const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'exams',
            key: 'id'
        }
    },
    question_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    question_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'multiple-choice, numerical, essay'
    },
    options: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of option objects for multiple-choice questions'
    },
    correct_answer: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    points: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'questions',
    timestamps: false
});

module.exports = Question;
