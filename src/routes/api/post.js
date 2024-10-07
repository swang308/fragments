const express = require('express');
const contentType = require('content-type');
const logger = require('../../logger'); // Assuming logger is in src/logger.js
const Fragment = require('../../model/fragment'); // Your Fragment class

const router = express.Router();

// Middleware to handle raw body data up to 5MB and support various content types
const rawBody = () => express.raw({
  inflate: true,
  limit: '5mb',
  type: (req) => {
    try {
      const { type } = contentType.parse(req);
      logger.debug(`Parsed content type: ${type}`);
      return Fragment.isSupportedType(type); // Check if the type is supported by Fragment
    } catch (err) {
      logger.warn('Failed to parse content type:', err.message);
      return false;
    }
  },
});

router.post('/fragments', rawBody(), async (req, res) => {
  try {
    logger.debug('Received POST request to /fragments');

    if (!Buffer.isBuffer(req.body)) {
      logger.warn('Request body is not a valid buffer');
      return res.status(400).json({ message: 'Invalid body data' });
    }

    const { type } = contentType.parse(req);
    const ownerId = req.user ? req.user.emailHash : 'anonymous';

    logger.debug(`Creating fragment for ownerId: ${ownerId} with content type: ${type}`);

    // Create a new fragment using the Fragment class
    const fragment = new Fragment({
      ownerId,
      type,
      data: req.body,
    });

    // Attempt to save the fragment and handle potential errors
    await fragment.save();

    const apiUrl = process.env.API_URL || `http://${req.headers.host}`;
    const location = `${apiUrl}/fragments/${fragment.id}`;

    logger.info(`Fragment created with ID: ${fragment.id}`);

    // Return the response with the Location header
    return res.status(201).location(location).json({
      id: fragment.id,
      created: fragment.created,
      type: fragment.type,
      ownerId: fragment.ownerId,
      size: fragment.size,
    });
  } catch (err) {
    // Log the error and respond with a 500 status code
    logger.error('Error creating fragment:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
