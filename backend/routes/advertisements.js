const express = require('express');
const r = express.Router();
const { getActive, create: createAd, getByOrg, updateAdvertisement, deleteAdvertisement } = require('../controllers/extraControllers');
const { auth, requireRole } = require('../middleware/auth');

r.get('/active',              getActive);
r.post('/',     auth, requireRole('organization'), createAd);
r.get('/organization/:orgId', auth, getByOrg);
r.put('/:id',   auth, requireRole('organization'), updateAdvertisement);
r.delete('/:id',auth, requireRole('organization'), deleteAdvertisement);

module.exports = r;
