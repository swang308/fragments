// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  try {
    const fragments = [];
    // Send a successful response
    res.json(createSuccessResponse({ fragments }));
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json(createErrorResponse(500, 'Failed to fetch fragments' + error));
  }
};
