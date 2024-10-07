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
router.post('/fragments', require('./post'));

// Define PUT /v1/fragments route (update this)
router.put('/fragments', require('./put'));

// Define DELETE /v1/fragments route (delete this)
router.delete('/fragments', require('./delete'));

// Define GET /v1/fragments/:id route
router.get('/fragments/:id', require('./get:id'));

module.exports = router;
