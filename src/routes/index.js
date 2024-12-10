// src/routes/index.js

const express = require('express');

// Modifications to src/routes/index.js

// Our authentication middleware
const { authenticate } = require('../auth');

// version and author from package.json
const { version, author } = require('../../package.json');

const { createSuccessResponse } = require('../response');

// Create a router that we can use to mount our API
const router = express.Router();

const { hostname } = require('os');

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));

router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  const resData = {
    author,
    githubUrl: 'https://github.com/swang308/fragments',
    version,
    hostname: hostname(),
  };

  res.status(200).json(createSuccessResponse(resData))
});

module.exports = router;
