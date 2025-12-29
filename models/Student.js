const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for existing students or if we want global students (but we aim for teacher-scoped)
        references: {
            model: 'admins',
            key: 'id'
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'students',
    timestamps: false
});

module.exports = Student;
