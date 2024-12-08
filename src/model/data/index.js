// src/model/data/index.js

const logger = require('../../logger');

// Determine the data strategy based on environment variables or default to 'memory'
let dataStrategy;

if (process.env.AWS_REGION) {
  logger.info('Using AWS data strategy');
  dataStrategy = require('./aws');
} else {
  logger.info('Using in-memory data strategy');
  dataStrategy = require('./memory');
}

module.exports = dataStrategy;
