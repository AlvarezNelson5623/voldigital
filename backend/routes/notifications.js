const express = require('express');
const r = express.Router();
const { getNotifications, markRead, markAllRead } = require('../controllers/extraControllers');
const { auth } = require('../middleware/auth');

r.get('/',           auth, getNotifications);
r.put('/:id/read',   auth, markRead);
r.put('/read-all',   auth, markAllRead);

module.exports = r;
