// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
require('dotenv').config();

const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Creates a new fragment for the user.
 * The client posts a file (raw binary data) in the body of the request
 * and sets the Content-Type header to the desired type of the fragment if the type is supported.
 */
module.exports = async (req, res) => {
  logger.debug('Trying to add a new fragment // POST v1/fragments');

  try {
    // Parse the content type from the request
    const { type } = contentType.parse(req);
    let fragmentData;

    // Determine the fragment data based on Content-Type
    if (type === 'application/json') {
      fragmentData = Buffer.from(JSON.stringify(req.body)); // Convert JSON to Buffer
    } else {
      fragmentData = req.body;
    }

    // Validate if the request body is a buffer (binary data or converted JSON)
    if (!Buffer.isBuffer(fragmentData)) {
      logger.warn('Unsupported Content-Type: body is not binary data');
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    // Validate if the content type is supported
    if (!Fragment.isSupportedType(type)) {
      logger.warn(`Unsupported type ${type} passed in POST v1/fragments`);
      return res.status(415).json(createErrorResponse(415, `Unsupported type ${type}`));
    }

    // Create a new fragment with the user ID and the content type
    const fragment = new Fragment({ ownerId: req.user, type: type, size: fragmentData.length });
    logger.info({ fragment }, 'Created new fragment');

    // Save the fragment and store the data
    await fragment.save();
    await fragment.setData(fragmentData);

    // Determine the API URL or fallback to localhost
    const location = process.env.API_URL
      ? new URL(`${process.env.API_URL}/v1/fragments/${fragment.id}`)
      : new URL(`http://localhost:8080/v1/fragments/${fragment.id}`);

    logger.debug('Location: ' + location.href);

    // Set the response headers and send success response
    res
      .location(location.href)
      .setHeader('Content-Type', fragment.type)
      .status(201)
      .json(createSuccessResponse({ fragment: fragment }));

    logger.info({ fragment: fragment }, 'Fragment successfully posted');
  } catch (error) {
    logger.error({ error }, 'Something went wrong while posting the fragment');
    res.status(500).json(createErrorResponse(500, `${error}`));
  }
};
