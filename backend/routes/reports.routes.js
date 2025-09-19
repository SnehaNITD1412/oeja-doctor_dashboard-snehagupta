// File: routes/reports.routes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/reports.controller');
const Report = require('../models/Report');

// GET reports
router.get('/reports', requireAuth, ctrl.list);

// POST report with file upload
router.post('/reports', requireAuth, ctrl.upload, ctrl.createReport);

module.exports = router;


