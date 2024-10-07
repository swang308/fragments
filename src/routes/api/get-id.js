// src/routes/api/get-id.js

const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a specific fragment for the current user
 */
module.exports = (req, res) => {
  try {
    const fragmentId = req.params.id;
    // Your logic to fetch the fragment using fragmentId

    // Example response
    res.json(createSuccessResponse({ id: fragmentId, data: 'fragment data' }));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, 'Failed to fetch fragments' + error));
  }
}
