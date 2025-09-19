// File: routes/prescriptions.routes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/prescriptions.controller');

router.get('/prescriptions', requireAuth, ctrl.list);
router.post('/prescriptions', requireAuth, ctrl.create);

module.exports = router;


