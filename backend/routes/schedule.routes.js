// File: routes/schedule.routes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/schedule.controller');

// Doctor sets availability
router.post('/schedule/availability', requireAuth, ctrl.setAvailability);

// Get available slots for a date
router.get('/schedule/slots', requireAuth, ctrl.getSlots); // ?doctorId&date=YYYY-MM-DD

// Book a slot
router.post('/schedule/book', requireAuth, ctrl.bookSlot);

// Approve appointment + meet link
router.patch('/schedule/appointments/:id/approve', requireAuth, ctrl.approveAppointment);
router.patch('/schedule/appointments/:id/reject', requireAuth, ctrl.rejectAppointment);

// Patient-facing
router.get('/appointments', requireAuth, ctrl.getAppointments);
router.get('/appointments/stats', requireAuth, ctrl.getAppointmentStats);

module.exports = router;


