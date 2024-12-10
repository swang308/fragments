// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('./auth');
const logger = require('./logger');
const { createErrorResponse } = require('./response');
const { version } = require('pino');
const pino = require('pino-http')({ logger });

const app = express();

app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

passport.use(authenticate.strategy());
app.use(passport.initialize());

app.use('/', require('./routes'));

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

// Global error-handling middleware
app.use((err, req, res) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status >= 500) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
      version,
    },
  });
});

module.exports = app;
