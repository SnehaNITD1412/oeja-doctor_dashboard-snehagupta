// File: middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // We need the User model to fetch user details

/**
 * This middleware protects routes that require a user to be logged in.
 * It checks for a JWT in the request headers, verifies it, and attaches
 * the full user object to the request.
 */
exports.requireAuth = async (req, res, next) => {
    let token;

    // 1. Check for the token in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized. No token provided.' });
    }

    try {
        // 2. Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // 3. Find the user in the database using the subject (user id) from the token
        // We exclude the password field for security
        const userIdFromToken = decoded.sub || decoded.id; // support either claim just in case
        const currentUser = await User.findById(userIdFromToken).select('-password');

        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'The user belonging to this token no longer exists.' });
        }

        // 4. Attach the complete user object to the request
        // This makes user info (like role, isProfileComplete) available in the next steps
        req.user = currentUser;

        // Grant access to the protected route
        next();

    } catch (error) {
        console.error('Authentication Error:', error.message);
        return res.status(401).json({ success: false, error: 'Not authorized. Token is invalid or has expired.' });
    }
};
