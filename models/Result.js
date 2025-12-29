const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        }
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'exams',
            key: 'id'
        }
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'admins',
            key: 'id'
        }
    },
    auto_score: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    essay_score: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    final_score: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    submission_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    is_graded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    graded_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'results',
    timestamps: false
});

module.exports = Result;
