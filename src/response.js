// src/response.js

/**
 * Creates a success response.
 * 
 * @param {object} data - Data to include in the response.
 * @returns {object} - Success response.
 */
module.exports.createSuccessResponse = (data) => ({
  status: 'ok',
  ...data,
});

/**
 * Creates an error response.
 * 
 * @param {number} code - Error code.
 * @param {string} message - Error message.
 * @returns {object} - Error response.
 */
module.exports.createErrorResponse = (code, message) => ({
  status: 'error',
  error: {
    code,
    message,
  },
});
