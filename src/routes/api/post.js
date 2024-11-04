// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

require('dotenv').config();

/**
 * Creates a new fragment for the user.
 * The client posts a file (raw binary data) in the body of the request
 * and sets the Content-Type header to the desired type of the fragment if the type is supported.
 */
module.exports = async (req, res) => {
  logger.debug('POST /v1/fragments called');

  try {
    const { type } = contentType.parse(req);
    const fragmentData = type === 'application/json' ? Buffer.from(JSON.stringify(req.body)) : req.body;

    if (!Buffer.isBuffer(fragmentData)) {
      logger.warn('Unsupported Content-Type: body is not binary data');
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    if (!Fragment.isSupportedType(type)) {
      logger.warn(`Unsupported type ${type} passed in POST v1/fragments`);
      return res.status(415).json(createErrorResponse(415, `Unsupported type ${type}`));
    }

    const fragment = new Fragment({ ownerId: req.user, type, size: fragmentData.length });
    await fragment.save();
    await fragment.setData(fragmentData);

    const location = new URL(`${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.location(location.href)
      .setHeader('Content-Type', fragment.type)
      .status(201)
      .json(createSuccessResponse({ fragment }));
  } catch (error) {
    logger.error({ error }, 'Error processing POST /v1/fragments');
    res.status(500).json(createErrorResponse(500, `${error}`));
  }
};
