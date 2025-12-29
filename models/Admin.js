const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'teacher' // teacher, super_admin (legacy: sub_admin -> teacher)
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    plan: {
        type: DataTypes.ENUM('free', 'pro'),
        defaultValue: 'free'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    max_active_exams: {
        type: DataTypes.INTEGER,
        defaultValue: 2
    },
    max_students: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    }
}, {
    tableName: 'admins',
    timestamps: false
});

module.exports = Admin;
