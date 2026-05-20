const express = require('express');
const r = express.Router();
const { getPlans, upgrade } = require('../controllers/extraControllers');
const { auth, requireRole } = require('../middleware/auth');

r.get('/', getPlans);
r.post('/upgrade', auth, requireRole('organization'), upgrade);

module.exports = r;
