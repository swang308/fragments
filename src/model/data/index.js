// src/model/data/index.js

const logger = require('../../logger');

// This file will allow us to switch between different backend strategies (memory, AWS, etc.)

// We can use an environment variable or other logic to determine which strategy to use.
// For now, we're using the 'memory' strategy by default.
if (process.env.DATA_BACKEND === 'aws') {
  logger.info('AWS backend is not implemented yet.');
} else {
  logger.info('Using in-memory data strategy');
  return require('./memory');
}


// If the environment sets an AWS Region, we'll use AWS backend
// services (S3, DynamoDB); otherwise, we'll use an in-memory db.
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
