// src/routes/api/getByIdInfo.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to retrieve the fragment by ID for the authenticated user
    const fragments = await Fragment.byId(req.user, id);

    // Set the response header and send the fragment data if found
    res.setHeader('Content-Type', fragments.type);
    return res.status(200).json(createSuccessResponse(fragments));

  } catch (err) {
    logger.warn('Fragment not found', { error: err, fragmentId: id });
    return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
