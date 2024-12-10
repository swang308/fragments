// src/routes/api/putById.js

require('dotenv').config();

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

const apiUrl = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  // const id = req.params['id'];
  const { id } = req.params;
  try {
    // Retrieve the fragment
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      logger.warn(`Fragment with ID ${id} not found.`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // check content-type matches the existing fragments type
    if (req.headers['content-type'] != fragment.type && !Buffer.isBuffer(req.body)) {
      res.status(400).json(createErrorResponse(400, 'Content-type of the request does not match the existing fragments type'));
      logger.error(`Content-Type mismatch. Expected: ${fragment.type}, Received: ${req.headers['content-type']}`);
    } else {

      await fragment.save();
      await fragment.setData(req.body);

      // Set headers and respond with success
      res.setHeader('Content-Type', fragment.type);
      res.setHeader('Location', `${apiUrl}/v1/fragments/${fragment.id}`);
      res.status(200).json(createSuccessResponse(fragment));

      logger.info(`Fragment with ID ${id} successfully updated.`);
    }
  } catch (err) {
    logger.error('Error processing PUT request', { error: err });
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
