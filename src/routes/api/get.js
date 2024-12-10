// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {

    const expand = req.query.expand === '1';
    const fragments = await Fragment.byUser(req.user, expand);

    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    logger.error({ error }, 'Error getting user fragments');
    res.status(404).json(createErrorResponse(404, 'User fragments not found'));
  }
};
