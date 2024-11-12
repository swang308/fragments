// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  try {
    const ownerId = req.user.id;  // Assuming authentication middleware
    const fragments = Fragment.list(ownerId);
    res.status(200).json(createSuccessResponse({
      status: 'ok',
      fragments,
    }));
  } catch (error) {
    res.status(404).json(createErrorResponse({
      status: 'error',
      error: {
        message: error.message,
        code: 404
      }
    }));
  }
};
