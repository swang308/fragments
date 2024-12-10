// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    if (!Fragment.isSupportedType(req.get('Content-Type'))) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });

    await fragment.save();
    await fragment.setData(req.body);

    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Location', `${process.env.API_URL || 'http://localhost:8080'}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));

    logger.info('Fragment created successfully', { fragment });
  } catch (error) {
    logger.error('Error creating fragment', { error });
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
