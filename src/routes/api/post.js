const express = require('express');
const contentType = require('content-type');
const logger = require('../../logger'); // Logger for logging information
const Fragment = require('../../model/fragment'); // Fragment class

const router = express.Router();

// Middleware to handle raw body data up to 5MB and support various content types
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const { type } = contentType.parse(req);
        logger.debug(`Parsed content type: ${type}`);
        return Fragment.isSupportedType(type); // Check if the type is supported by Fragment
      } catch (err) {
        logger.warn(`Failed to parse content type: ${err.message}`);
        return false;
      }
    },
  });

router.post('/', rawBody(), async (req, res) => {
  try {
    // Simple Basic Auth check for the header (for testing purposes)
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
      logger.warn('Unauthorized request - Missing or invalid Authorization header');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Decode basic auth credentials (email and password)
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    // For testing purposes, we are simulating authentication (replace with real validation logic)
    if (email !== 'test@example.com' || password !== 'password') {
      logger.warn(`Unauthorized request - Invalid credentials for email: ${email}`);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate the content type
    const { type } = contentType.parse(req);
    if (!Fragment.isSupportedType(type)) {
      logger.warn(`Invalid content type: ${type}`);
      return res.status(400).json({ message: 'Invalid content type' });
    }

    // Ensure body is a buffer (raw binary data)
    if (!Buffer.isBuffer(req.body)) {
      logger.warn('Invalid body data: Body is not a buffer');
      return res.status(400).json({ message: 'Invalid body data' });
    }

    // Simulate the ownerId as a hashed user email (replace with actual hash logic in production)
    const ownerId = 'hashed-email';

    // Create and save the fragment
    const fragment = new Fragment({ ownerId, type, size: req.body.length });
    await fragment.setData(req.body);

    // Set the Location header
    const apiUrl = process.env.API_URL || `http://${req.headers.host}`;
    const location = new URL(`/fragments/${fragment.id}`, apiUrl).toString();
    res.set('Location', location);

    // Respond with the created fragment's metadata
    logger.info(`Fragment created with ID: ${fragment.id}, Owner: ${ownerId}`);
    return res.status(201).json({
      id: fragment.id,
      created: fragment.created,
      type: fragment.type,
      ownerId: fragment.ownerId,
      size: fragment.size,
    });
  } catch (err) {
    logger.error('Internal server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
