// src/routes/api/index.js
/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment')

// Create a router on which to mount our API endpoints
const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      if (!Fragment.isSupportedType(type)) {
        throw new Error(`Unsupported Content-Type: ${type}`);
      }
      return Fragment.isSupportedType(type);
    },
  });


// POST /v1/fragments route with authentication
// router.post('/fragments', rawBody(), require('./post'));
router.post('/fragments', rawBody(), (req, res) => {
  console.log('POST /v1/fragments was called');
  require('./post')(req, res);
});

// GET /v1/fragments
router.get('/fragments', require('./get'));


module.exports = router;
