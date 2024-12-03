// src/auth/index.js
// This file will be used to figure out which of the 
// two strategies to use at runtime, based on our environment variables.

const logger = require('../logger');

// Check for environment configurations
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  logger.info('Using AWS Cognito for authentication');
  module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production') {
  logger.info('Using HTTP Basic Auth for authentication');
  module.exports = require('./basic-auth');
  // } else if (process.env.AUTH_TOKEN) {
  //   logger.info('Using Simple Token Auth for authentication');
  //   const { Strategy } = require('passport-http-bearer');

  //   const strategy = new Strategy((token, done) => {
  //     if (token === process.env.AUTH_TOKEN) {
  //       return done(null, { id: 'user123' }); // Mock user ID
  //     }
  //     return done(null, false);
  //   });

  //   module.exports = {
  //     strategy,
  //     authenticate: () => passport.authenticate('bearer', { session: false }),
  //   };
} else {
  throw new Error('No authentication configuration found. Check environment variables.');
}
