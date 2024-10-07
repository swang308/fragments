// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Define POST /v1/fragments route (add this)
router.post('/fragments', require('./post')); // Ensure this references your POST route handler

// Other routes (, DELETE, etc.) will go here later on...

module.exports = router;
