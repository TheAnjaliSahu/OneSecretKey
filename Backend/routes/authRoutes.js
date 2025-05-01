const express = require('express');
const { register, signin } = require('../controllers/secretController');
const router = express.Router();

// User Registration Route
router.post('/register', register);

// User Login Route
router.post('/signin', signin);

module.exports = router;
