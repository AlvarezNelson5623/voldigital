const express = require('express');
const r = express.Router();
const ctrl = require('../controllers/applicationController');
const { auth, requireRole } = require('../middleware/auth');

r.post('/',                        auth, requireRole('volunteer'), ctrl.apply);
r.get('/project/:projectId',       auth, ctrl.getByProject);
r.get('/volunteer/:volunteerId',   auth, ctrl.getByVolunteer);
r.put('/:id',                      auth, requireRole('organization'), ctrl.updateStatus);

module.exports = r;
