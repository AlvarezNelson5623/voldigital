const express = require('express');
const r = express.Router();
const ctrl = require('../controllers/volunteerController');
const { auth } = require('../middleware/auth');

r.get('/:id',           ctrl.getPublic);
r.get('/:id/full', auth, ctrl.getFull);
r.put('/:id',      auth, ctrl.update);
r.get('/:id/projects', auth, ctrl.getProjects);

module.exports = r;
