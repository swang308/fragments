const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const expand = req.query.expand === '1';
    logger.debug(`Fetching fragments for user: ${req.user} with expand=${expand}`);

    const fragments = await Fragment.byUser(req.user, expand);

    if (!fragments || fragments.length === 0) {
      logger.info(`No fragments found for user: ${req.user}`);
      return res.status(404).json(createErrorResponse('No fragments found for the user.'));
    }

    logger.info(`Fragments retrieved for user: ${req.user}`);
    const successResponse = createSuccessResponse({ fragments });
    res.status(200).json(successResponse);
  } catch (error) {
    logger.error(`Error fetching fragments for user: ${req.user}`, error);
    res.status(500).json(createErrorResponse('Error fetching user fragments.'));
  }
};
