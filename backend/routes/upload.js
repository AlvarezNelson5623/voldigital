const express = require('express');
const r = express.Router();
const { uploadMiddleware, handleUpload } = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');

r.post('/', auth, uploadMiddleware, handleUpload);

module.exports = r;
