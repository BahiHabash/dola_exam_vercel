const express = require('express');
const { Admin } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get list of active teachers (public endpoint for student registration)
router.get('/teachers', async (req, res) => {
    try {
        const searchQuery = req.query.q || '';

        const whereClause = {
            role: 'teacher',
            is_active: true
        };

        // Add search filter if query provided
        if (searchQuery) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${searchQuery}%` } },
                { username: { [Op.like]: `%${searchQuery}%` } },
                { email: { [Op.like]: `%${searchQuery}%` } }
            ];
        }

        const teachers = await Admin.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'username', 'email'],
            order: [['name', 'ASC']]
        });

        // Format response
        const formattedTeachers = teachers.map(t => ({
            id: t.id,
            name: t.name || t.username,
            email: t.email,
            username: t.username
        }));

        res.json(formattedTeachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
