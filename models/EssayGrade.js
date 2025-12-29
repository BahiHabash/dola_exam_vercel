const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EssayGrade = sequelize.define('EssayGrade', {
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
    submission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'submissions',
            key: 'id'
        }
    },
    graded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    graded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'graded',
        comment: 'pending, graded'
    }
}, {
    tableName: 'essay_grades',
    timestamps: false
});

module.exports = EssayGrade;
