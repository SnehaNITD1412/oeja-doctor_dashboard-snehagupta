// File: routes/patientHub.routes.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/patientHub.controller');

// Quick mount check (no auth)
router.get('/healthz', (req, res) => res.status(200).json({ success: true, data: 'patientHub alive' }));
// Stub to silence stray /api/patient requests
router.get('/patient', (req, res) => res.status(200).json({ success: true, data: {} }));

// All routes are protected
router.get('/patient-summary/:patientId', requireAuth, ctrl.getPatientSummary);
router.get('/patients/:patientId', requireAuth, ctrl.getPatientById);
router.get('/reports', requireAuth, ctrl.getReports);
router.get('/prescriptions', requireAuth, ctrl.getPrescriptions);
router.get('/chats', requireAuth, ctrl.getChats);
router.get('/feedback/doctor', requireAuth, ctrl.getFeedbackFromDoctor);
router.get('/feedback/patient', requireAuth, ctrl.getFeedbackFromPatient);
router.get('/appointments', requireAuth, ctrl.getAppointments);
router.get('/appointments/stats', requireAuth, ctrl.getAppointmentStats);
router.get('/visits', requireAuth, ctrl.getVisits);


// Create endpoints
router.post('/reports', requireAuth, ctrl.createReport);
router.post('/prescriptions', requireAuth, ctrl.createPrescription);
router.post('/chats', requireAuth, ctrl.createMessage);
router.post('/feedback/doctor', requireAuth, ctrl.createDoctorFeedback);
router.post('/feedback/patient', requireAuth, ctrl.createPatientFeedback);

module.exports = router;


