const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentTeacher = sequelize.define('StudentTeacher', {
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
        },
        onDelete: 'CASCADE'
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'student_teachers',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'teacher_id']
        }
    ]
});

module.exports = StudentTeacher;
