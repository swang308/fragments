const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Try to retrieve and log content (optional)
    try {
      const content = await fragment.getDisplayContent();
      logger.info(`Fragment content before deletion: ${content}`);
    } catch (contentError) {
      logger.warn(`Failed to retrieve fragment content for ID: ${id}`, { error: contentError });
    }

    // Proceed with deletion
    logger.info(`Deleting fragment with ID: ${id}`);
    await Fragment.delete(req.user, id);

    return res.status(200).json(createSuccessResponse({ message: 'Fragment deleted successfully' }));
  } catch (err) {
    logger.error('Error deleting fragment', { error: err });
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
