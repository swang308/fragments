// src/routes/api/getbyIdInfo.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the fragment by ID
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      logger.warn(`Fragment with ID ${id} not found.`);
      return res.status(404).json(createErrorResponse(404, 'Fragment metadata not found'));
    }

    // Set Content-Type and respond with fragment metadata
    res.setHeader('Content-Type', fragment.type);
    res.status(200).json(createSuccessResponse(fragment));

    logger.info(`Fragment metadata retrieved successfully for ID: ${id}`);
  } catch (err) {
    logger.error(`Error retrieving fragment metadata for ID: ${id}`, { error: err });
    res.status(500).json(createErrorResponse(500, 'Internal server error while retrieving fragment metadata'));
  }
};

