// File: routes/dev.routes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/dev.controller');

router.post('/dev/seed', requireAuth, ctrl.seedDemoData);

module.exports = router;
