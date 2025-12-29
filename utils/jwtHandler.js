const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'default-secret-key';

/**
 * Create a JWT token for a user
 * @param {number} userId - User ID
 * @param {string} role - User role ('student' or 'admin')
 * @returns {string} JWT token
 */
function createToken(userId, role) {
    const payload = {
        user_id: userId,
        role: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };

    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

/**
 * Decode and verify a JWT token
 * @param {string} token - JWT token to decode
 * @returns {object|string} Decoded payload or error message
 */
function decodeToken(token) {
    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        return payload;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return 'Expired token';
        }
        return 'Invalid token';
    }
}

module.exports = {
    createToken,
    decodeToken
};
