/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Import the authentication middleware
const { authenticate } = require('../../auth/basic-auth'); // Adjust the path as necessary

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Define POST /v1/fragments route with authentication
router.post('/fragments', authenticate(), require('./post')); // Add the authenticate middleware here

module.exports = router;
