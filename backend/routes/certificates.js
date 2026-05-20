// routes/certificates.js
const express = require('express');
const r = express.Router();
const { getByVolunteer, payDownload } = require('../controllers/extraControllers');
const { auth } = require('../middleware/auth');

r.get('/volunteer/:volunteerId', auth, getByVolunteer);
r.post('/:id/pay',               auth, payDownload);

module.exports = r;
