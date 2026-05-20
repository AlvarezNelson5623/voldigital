// routes/auth.js
const express = require('express');
const r = express.Router();
const ctrl = require('../controllers/authController');
const { auth } = require('../middleware/auth');

r.post('/register/volunteer',   ctrl.registerVolunteer);
r.post('/register/organization',ctrl.registerOrganization);
r.post('/login',                ctrl.login);
r.get('/me',         auth,      ctrl.me);

module.exports = r;
