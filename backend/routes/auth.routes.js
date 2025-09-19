// File: routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Apne middlewares ko import karein
const { requireAuth } = require('../middleware/auth');
const { checkProfileCompletion } = require('../middleware/checkProfile');

// --- Public Routes (Bina login ke access ho sakte hain) ---
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// --- Protected Routes (Login karna zaroori hai) ---
router.post('/change-password', requireAuth, authController.changePassword);

// Dashboard ka "gatekeeper" route
router.get(
    '/dashboard',
    requireAuth,            // Pehle login check karega
    checkProfileCompletion, // Phir profile completion check karega
    (req, res) => {
        // Agar dono check pass ho gaye, to success message bhejega
        res.status(200).json({ 
            success: true, 
            message: 'Access granted to dashboard.' 
        });
    }
);

router.get('/health', authController.healthCheck);

module.exports = router;
