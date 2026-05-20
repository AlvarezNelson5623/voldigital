// routes/tags.js
const express = require('express');
const r = express.Router();
const { getTags } = require('../controllers/extraControllers');
r.get('/', getTags);
module.exports = r;
