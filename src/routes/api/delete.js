// src/routes/api/delete.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to find the fragment by ID for the authenticated user
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      logger.warn(`Fragment not found for id: ${id}`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Delete the fragment if it exists
    logger.info(`Deleting fragment with id: ${id}`);
    await Fragment.delete(req.user, id);

    // Respond with success
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.error(`Error deleting fragment with id: ${id}`, err);
    res.status(500).json(createErrorResponse(500, 'An error occurred while deleting the fragment'));
  }
};
