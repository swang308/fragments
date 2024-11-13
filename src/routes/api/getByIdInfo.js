const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to retrieve the fragment by ID for the authenticated user
    const fragment = await Fragment.byId(req.user, id);

    // Set the response header and send the fragment data if found
    res.setHeader('Content-Type', fragment.type);
    return res.status(200).json(createSuccessResponse(fragment));

  } catch (err) {
    logger.warn("Error retrieving fragment metadata", { error: err, fragmentId: id });
    return res.status(404).json(createErrorResponse(404, 'Fragment metadata is not found'));
  }
};
