const express = require('express');
const router = express.Router();

// 1. Apne middlewares ko import karein
const { requireAuth } = require('../middleware/auth');

// 2. Apni controller file se function ko import karein
const { getDoctorAppointments } = require('../controllers/appointmentController.js');

// 3. Route (Address) define karein aur use controller se jodein
router.get(
    '/doctor/appointments', // Yeh hai "Address"
    requireAuth,            // Yeh hai "Guard"
    getDoctorAppointments   // Yeh hai "Ghar" jahan kaam hoga
);

module.exports = router;