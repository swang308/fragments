// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
// const { json } = require('express');
require('dotenv').config();

const apiUrl = process.env.API_URL || 'http://localhost:8080';

/*
 * Create a fragment for the current user
 */
module.exports = async (req, res) => {
  logger.debug('Received request - POST /v1/fragments');
  logger.debug(`req.body (Buffer?): ${Buffer.isBuffer(req.body)}`);
  logger.debug(`req.body content: ${req.body ? req.body.toString() : 'Empty body'}`);
  logger.debug(`req.user: ${JSON.stringify(req.user)}`);


  try {
    const ownerId = req.user;
    const contentType = req.get('Content-Type');

    // Validate supported fragment types
    if (!Fragment.isSupportedType(contentType)) {
      return res.status(415).json(createErrorResponse(415, `Unsupported Content-Type: ${contentType}`));
    }

    // Validate request body as Buffer
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json(createErrorResponse(400, 'Request body must be a Buffer'));
    }

    // Ensure user authentication
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json(createErrorResponse(401, 'Unauthorized user'));
    }

    // Check for ownerId and contentType
    if (!ownerId || !contentType) {
      return res.status(400).json(createErrorResponse(400, 'Missing ownerId or Content-Type'));
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
    // Retrieve the actual content of the fragment
    const fragmentData = await fragment.getData();

    // Set response headers
    res.set({
      'Content-Type': fragment.type,
      'Location': location,
    });

    // Send a successful response with fragment details
    res.status(201).json(createSuccessResponse({
      status: 'ok',
      fragment: {
        id: fragment.id,
        ownerId: fragment.ownerId,
        created: fragment.created,
        updated: fragment.updated,
        type: fragment.type,
        size: fragment.size,
        location: location,
        json: fragmentData
      }
    }));

    logger.info({ fragment }, 'Fragment created');
  } catch (error) {
    logger.error('Error creating fragment', error);
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
