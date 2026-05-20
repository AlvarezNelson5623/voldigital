const express = require('express');
const r = express.Router();
const ctrl = require('../controllers/organizationController');
const { auth } = require('../middleware/auth');
const { requirePlanFeature } = require('../middleware/planCheck');

r.get('/:id',                 ctrl.getPublic);
r.get('/:id/full',       auth, ctrl.getFull);
r.put('/:id',            auth, ctrl.update);
r.get('/:id/volunteers', auth, requirePlanFeature('can_view_volunteers'), ctrl.getVolunteers);
r.get('/:id/dashboard',  auth, requirePlanFeature('has_dashboard'), ctrl.getDashboard);

module.exports = r;
