// File: routes/doctor.routes.js

const express = require('express');
const router = express.Router();

// Controller aur zaroori middlewares ko import karein
const doctorController = require('../controllers/doctor.controller');
const { requireAuth } = require('../middleware/auth'); // Aapka authentication middleware
const upload = require('../middleware/upload');      // Hamara file upload middleware

/**
 * @route   POST /complete-profile
 * @desc    Doctor ki professional details aur documents submit karne ke liye
 * @access  Private (Sirf logged-in user hi access kar sakta hai)
 */
router.post(
    '/complete-profile',
    requireAuth, // 1. Pehle check karega ki user logged-in hai
    upload,      // 2. Phir file uploads ko handle karega
    doctorController.submitProfileForm // 3. Aakhir mein controller data ko save karega
);

/**
 * @route   GET /dashboard-data
 * @desc    Frontend dashboard ke liye saari details fetch karne ke liye
 * @access  Private
 */
router.get(
    '/dashboard-data', 
    requireAuth, 
    doctorController.getDoctorDashboardData
);

/**
 * @route   POST /update-practice-locations
 * @desc    Sirf practice locations aur consultation hours ko update kare
 * @access  Private
 */
router.post(
    '/update-practice-locations',
    requireAuth,
    doctorController.updatePracticeLocations
);

// --- YEH NAYA ROUTE ADD KAREIN ---
router.get(
    '/doctor/appointments', // Naya, saaf URL
    requireAuth,
    doctorController.getDoctorAppointments // Naye controller function ko call karega
);

module.exports = router;
