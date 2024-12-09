// src/index.js

// We want to log any crash cases so we can debug later from logs.
const logger = require('./logger');
// Read environment variables from an .env file (if present)
require('dotenv').config();

logger.debug('Loaded environment variables:', {
  AWS_COGNITO_POOL_ID: process.env.AWS_COGNITO_POOL_ID,
  AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_DYNAMODB_TABLE_NAME: process.env.AWS_DYNAMODB_TABLE_NAME,
  API_URL: process.env.API_URL,
  PORT: process.env.PORT,
});

// If we're going to crash because of an uncaught exception, log it first.
// https://nodejs.org/api/process.html#event-uncaughtexception
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// If we're going to crash because of an unhandled promise rejection, log it first.
// https://nodejs.org/api/process.html#event-unhandledrejection
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Start our server
require('./server');
logger.info(`Server is running on port ${process.env.PORT || 8080}`);
