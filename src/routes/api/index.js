// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment')

const logger = require('../../logger');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',

    type: (req) => {
      const { type } = contentType.parse(req);

      const isSupported = Fragment.isSupportedType(type);
      logger.info(`Content-Type: ${type}, Supported: ${isSupported}`);

      return Fragment.isSupportedType(type);
    },
  });

// POST /v1/fragments
// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.
router.post('/fragments', rawBody(), require('./post'));

// GET /v1/fragments
router.get('/fragments', require('./get'));

// GET /v1/fragments/:id
router.get('/fragments/:id.:ext?', require('./getById'));
router.get('/fragments/:id/info', require('./getByIdInfo'));

// PUT /v1/fragments/:id
router.put('/fragments/:id', rawBody(), require('./put'));

// DELETE /v1/fragments/:id
router.delete('/fragments/:id', require('./delete.js'));

module.exports = router;
