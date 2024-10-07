const express = require('express');
const contentType = require('content-type');
const logger = require('../../../logger');
const Fragment = require('../../../model/fragment');

// Middleware to handle raw body up to 5MB and support specific content types
const rawBody = () => express.raw({
  inflate: true,
  limit: '5mb',
  type: (req) => {
    try {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    } catch (err) {
      logger.warn(`Content type parsing failed: ${err.message}`);
      return false;
    }
  },
});

module.exports = rawBody;
