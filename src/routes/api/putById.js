// src/routes/api/putById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
require('dotenv').config();

// Set the base API URL
const apiUrl = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  const id = req.params['id'];

  try {
    // Check if the fragment exists
    const existingFragment = await Fragment.byId(req.user, id);
    if (!existingFragment) {
      logger.warn(`Fragment not found for id: ${id}`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Create a new Fragment instance
    const fragment = new Fragment(existingFragment);

    // Validate content-type
    const requestContentType = req.headers['content-type'].split(';')[0]; // Strip any charset
    const fragmentContentType = fragment.type.split(';')[0];

    if (requestContentType !== fragmentContentType) {
      logger.error(`Content-Type mismatch for fragment id: ${id}`);
      return res
        .status(400)
        .json(
          createErrorResponse(400, 'Content-Type of the request does not match the existing fragment type')
        );
    }

    // Validate the request body is not empty
    if (!req.body || req.body.length === 0) {
      logger.error(`Empty request body for fragment id: ${id}`);
      return res.status(400).json(createErrorResponse(400, 'Request body cannot be empty'));
    }

    // Update the fragment data
    logger.info(`Updating fragment with id: ${id}`);
    await fragment.setData(req.body);
    await fragment.save();

    // Dynamically set the Location header
    const locationHeader = `${apiUrl}/v1/fragments/${fragment.id}`;
    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Location', locationHeader);

    // Respond with success
    logger.debug(
      {
        fragment: fragment,
        contentType: fragment.type,
      },
      'Fragment successfully updated'
    );
    return res.status(200).json(createSuccessResponse(fragment));
  } catch (err) {
    // Log the error with context
    logger.error(`Error processing PUT request for fragment id: ${id}`, {
      error: err.message,
      stack: err.stack,
      user: req.user,
      fragmentId: id,
    });

    // Respond with a generic server error
    return res
      .status(500)
      .json(createErrorResponse(500, 'An error occurred while updating the fragment'));
  }
};
