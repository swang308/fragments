// src/routes/api/putById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
require('dotenv').config();

// Set the base API URL from environment or fallback to localhost
const apiUrl = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  const id = req.params['id'];

  try {
    // Check if the fragment exists
    const existingFragment = await Fragment.byId(req.user, id);
    if (!existingFragment) {
      logger.warn(`Fragment not found for id: ${id}`);
      return res.status(404).json(createErrorResponse(404, 'Fragment data not found'));
    }

    // Create a new Fragment instance
    const fragment = new Fragment(existingFragment);

    // Validate content type matches the fragment's type
    if (req.headers['content-type'] !== fragment.type && !Buffer.isBuffer(req.body)) {
      logger.error(`Content-type mismatch for fragment id: ${id}`);
      return res
        .status(400)
        .json(createErrorResponse(400, 'Content-type of the request does not match the existing fragment type'));
    }

    // Update the fragment
    logger.info(`Updating fragment with id: ${id}`);
    await fragment.save();
    await fragment.setData(req.body);

    // Set response headers
    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Location', `${apiUrl}/v1/fragments/${fragment.id}`);

    // Respond with success
    logger.debug({ fragment, contentType: fragment.type }, 'Fragment data successfully updated');
    return res.status(200).json(createSuccessResponse(fragment));
  } catch (err) {
    logger.error(`Error processing PUT request for fragment id: ${id}`, { err });
    return res.status(500).json(createErrorResponse(500, 'An error occurred while updating the fragment'));
  }
};
