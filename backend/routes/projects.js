const express = require('express');
const r = express.Router();
const ctrl = require('../controllers/projectController');
const { auth, requireRole } = require('../middleware/auth');
const { checkProjectLimit } = require('../middleware/planCheck');

r.get('/',                               ctrl.getAll);
r.get('/recommended/:volunteerId', auth,  ctrl.getRecommended);
r.get('/discover/:volunteerId',    auth,  ctrl.getDiscover);
r.get('/organization/:orgId',            ctrl.getByOrg);
r.get('/:id',                            ctrl.getOne);
r.post('/', auth, requireRole('organization'), checkProjectLimit, ctrl.create);
r.put('/:id',          auth, requireRole('organization'), ctrl.update);
r.put('/:id/complete', auth, requireRole('organization'), ctrl.complete);
r.delete('/:id',       auth, requireRole('organization'), ctrl.remove);

module.exports = r;
