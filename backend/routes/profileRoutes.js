const express = require('express');
const router = express.Router();

// Middlewares ko import karein
const { requireAuth } = require('../middleware/auth');
const { profileUpload } = require('../middleware/multerConfig'); 

// Controller se dono functions ko import karein
const { 
    completeProfileController,
    getProfileController // <-- Naya function import karein
} = require('../controllers/profileController');

// Profile complete karne ka route (yeh pehle se hai)
router.post(
    '/complete-profile', 
    requireAuth,
    profileUpload,
    completeProfileController
);

// --- YEH NAYA ROUTE ADD KAREIN ---
// Profile ka data fetch karne ka route
router.get(
    '/get-profile',
    requireAuth, // Sirf logged-in user hi apna data dekh sakta hai
    getProfileController
);

module.exports = router;