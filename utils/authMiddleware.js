const { decodeToken } = require('./jwtHandler');

/**
 * Express middleware for authentication and authorization
 * @param {string} role - Required role ('student', 'admin', or null for any authenticated user)
 * @returns {Function} Express middleware function
 */
const { Admin } = require('../models'); // Import Admin (Teacher) model

function loginRequired(roleRequired = null) {
    return async (req, res, next) => {
        // Extract token from Authorization header
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Token is missing!' });
        }

        // Decode and verify token
        const payload = decodeToken(token);

        if (typeof payload === 'string') {
            // Error message returned from decodeToken
            return res.status(401).json({ message: payload });
        }

        // Attach user info to request
        const userRole = payload.role;
        req.currentUser = {
            id: payload.user_id,
            role: userRole
        };

        // Check Logic
        try {
            // 1. Check Roles
            if (roleRequired) {
                // If requiring 'super_admin'
                if (roleRequired === 'super_admin' && userRole !== 'super_admin') {
                    return res.status(403).json({ message: 'Super Admin privilege required' });
                }

                // If requiring 'teacher' (super_admin also allowed usually, or strict?)
                // Assuming 'teacher' means "Teacher or Super Admin access" or strictly teacher?
                // Plan: "Teachers must never see other teachers data". Super Admin manages teachers.
                // Let's assume 'teacher' requirement is met by 'teacher' role. 'super_admin' might need distinct handling.
                // The prompt says: "role field... allowed values: 'teacher', 'super_admin'".
                // Existing code used 'admin'. We should update routes to use 'teacher' or 'super_admin'.

                if (roleRequired === 'teacher') {
                    if (userRole !== 'teacher' && userRole !== 'super_admin') {
                        // Allow super_admin to pass 'teacher' check? 
                        // Actually, super_admin has their own routes. 
                        // If super_admin tries to hit teacher routes, they might fail on `teacher_id` checks unless we handle it.
                        // But strictly for auth:
                        return res.status(403).json({ message: 'Teacher access required' });
                    }
                }

                // Legacy 'admin' check -> map to teacher or super_admin
                if (roleRequired === 'admin' && (userRole !== 'teacher' && userRole !== 'super_admin')) {
                    return res.status(403).json({ message: 'Admin access required' });
                }
            }

            // 2. Subscription/Active Check for Teachers
            if (userRole === 'teacher') {
                const teacher = await Admin.findByPk(payload.user_id);

                if (!teacher) {
                    return res.status(401).json({ message: 'User not found' });
                }

                if (!teacher.is_active) {
                    return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
                }

                if (teacher.expires_at && new Date() > new Date(teacher.expires_at)) {
                    return res.status(403).json({ message: 'Subscription expired. Please renew.' });
                }

                // Update cached user info with fresh DB data if needed, or just proceed
                req.currentUser.plan = teacher.plan; // Useful for limits
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(500).json({ message: 'Server error during auth' });
        }
    };
}

module.exports = loginRequired;
