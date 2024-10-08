// src/routes/api/post.js
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

const router = express.Router();

// Raw body parser for supporting various Content-Types up to 5MB
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // Attempt to parse the Content-Type header
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }

  const [scheme, credentials] = authHeader.split(' ');
  if (scheme !== 'Basic' || !credentials) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }

  // Decode credentials (assume a basic validation for demonstration)
  req.ownerId = 'sample-owner-id'; // This should be replaced with real validation logic
  next();
};

// POST /fragments route
router.post('/fragments', rawBody(), authenticate, async (req, res) => {
  try {
    const { type } = contentType.parse(req);

    if (!Fragment.isSupportedType(type)) {
      console.error(`Unsupported content type: ${type}`);
      return res.status(415).json({ error: `Unsupported type: ${type}` });
    }

    // Create a new Fragment instance
    const fragment = new Fragment({
      ownerId: req.ownerId,
      type,
      size: Buffer.isBuffer(req.body) ? req.body.length : 0, // Set size if it's a buffer
    });

    await fragment.save();          // Save the fragment metadata
    await fragment.setData(req.body); // Set the fragment data

    // Build the location URL for the created fragment
    const apiUrl = process.env.API_URL || `http://${req.headers.host}`;
    const locationUrl = `${apiUrl}/fragments/${fragment.id}`;

    res.status(201)
      .location(locationUrl)
      .json({
        id: fragment.id,
        created: fragment.created,
        type: fragment.type,
        size: fragment.size,
        ownerId: fragment.ownerId,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
