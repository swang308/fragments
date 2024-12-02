// src/routes/api/index.js
/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment')

const logger = require('../../logger');
// const { createErrorResponse, createSuccessResponse } = require('../../response');
// const { listFragments } = require('../../model/data/aws/index.js');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',

    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
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
// router.get('/fragments', async (req, res) => {
//   try {
//     logger.debug(`Fetching fragments for user: ${req.user}`);
//     const fragments = await listFragments(req.user);
//     logger.debug(`Fragments fetched: ${JSON.stringify(fragments)}`);
//     res.status(200).json(createSuccessResponse({ fragments }));
//   } catch (err) {
//     logger.error(`Error fetching fragments: ${err.message}`);
//     res.status(500).json(createErrorResponse(500, 'Failed to retrieve fragments'));
//   }
// });

// GET /v1/fragments/:id
router.get('/fragments/:id.:ext?', require('./getById'));
router.get('/fragments/:id/info', require('./getByIdInfo'));

// PUT /v1/fragments/:id
router.put('/fragments/:id', rawBody(), require('./put'));

// DELETE /v1/fragments/:id
router.delete('/fragments/:id', require('./delete.js'));

module.exports = router;
