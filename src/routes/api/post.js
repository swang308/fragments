const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
require('dotenv').config();

const apiUrl = process.env.API_URL || 'http://localhost:8080';

/*
 * Create a fragment for the current user
 */
module.exports = async (req, res) => {
  logger.debug('Attempting to add a new fragment - POST /v1/fragments');

  try {
    const ownerId = req.user;
    const contentType = req.get('Content-Type');

    // Validate supported fragment types
    if (!Fragment.isSupportedType(contentType)) {
      return res.status(415).json(createErrorResponse(415, `Unsupported Content-Type: ${contentType}`));
    }

    // Validate request body as Buffer
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json(createErrorResponse(400, 'Invalid data format. Expected a Buffer.'));
    }

    // Ensure user authentication
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json(createErrorResponse(401, 'Unauthorized access - valid credentials required'));
    }

    // Check for ownerId and contentType
    if (!ownerId || !contentType) {
      return res.status(400).json(createErrorResponse(400, 'Missing ownerId or contentType in request body'));
    }

    // Create and save a new fragment instance
    const fragment = new Fragment({
      ownerId,
      type: contentType,
      size: req.body.length,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    });

    await fragment.save();
    await fragment.setData(req.body);

    const location = `${apiUrl}/v1/fragments/${fragment.id}`;

    // Set response headers
    res.set({
      'Content-Type': fragment.type,
      'Location': location,
    });

    // Send a successful response with fragment details
    res.status(201).json(createSuccessResponse({
      status: 'ok',
      fragmentId: fragment.id,
      location: location,
      type: fragment.type,
      size: fragment.size,
      created: fragment.created,
      updated: fragment.updated,
    }));

    logger.info({ fragment }, 'Fragment successfully created and posted');
  } catch (error) {
    logger.error('Error creating fragment:', error);
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
