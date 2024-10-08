// src/auth/index.js

const logger = require('../logger');

// Prefer Amazon Cognito
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  logger.info('Using Amazon Cognito for authentication');
  module.exports = require('./cognito');
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  logger.info('Using HTTP Basic Auth for authentication (not in production');
  module.exports = require('./basic-auth');
}
// In all other cases, we need to stop now and fix our config
else {
  logger.error('missing env vars: no authorization configuration found');
}
