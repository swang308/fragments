// src/hash.js

const crypto = require('crypto');

/**
 * Hashes the user's email with sha256 and encodes it in hex.
 * 
 * @param {string} email - User's email address.
 * @returns {string} - Hashed email address.
 */
module.exports = (email) => crypto.createHash('sha256').update(email).digest('hex');
