// src/model/fragment.js

const { randomUUID } = require('crypto');
const contentType = require('content-type');
const logger = require('../logger');

// Import database operations
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id = randomUUID(), ownerId, created = new Date().toISOString(), updated = new Date().toISOString(), type, size = 0 }) {
    // Validate required fields
    if (!ownerId) throw new Error('ownerId is required');
    if (!type) throw new Error('type is required');
    if (!Fragment.isSupportedType(type)) throw new Error(`Unsupported type: ${type}`);
    if (typeof size !== 'number' || size < 0) throw new Error('Size must be a non-negative number');

    // Initialize properties
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  // Static methods for database operations
  static async byUser(ownerId, expand = false) {
    try {
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch (error) {
      logger.error('Error fetching fragments by user:', error);
      return [];
    }
  }

  static async byId(ownerId, id) {
    try {
      const result = await readFragment(ownerId, id);
      if (!result) throw new Error('Fragment not found');
      return new Fragment(result);
    } catch (error) {
      logger.error('Error fetching fragment by ID:', error);
      throw new Error(error.message);
    }
  }

  static async delete(ownerId, id) {
    try {
      await deleteFragment(ownerId, id);
    } catch (error) {
      logger.error('Error deleting fragment:', error);
      throw new Error('Error deleting fragment');
    }
  }

  static async list(ownerId, expand = false) {
    return Fragment.byUser(ownerId, expand);
  }

  // Instance methods for database operations
  async save() {
    this.updated = new Date().toISOString();
    try {
      await writeFragment(this);
      logger.info('Fragment saved successfully');
    } catch (error) {
      logger.error('Error saving fragment:', error);
      throw new Error('Error saving fragment');
    }
  }

  async getData() {
    try {
      return await readFragmentData(this.ownerId, this.id);
    } catch (error) {
      logger.error('Error fetching fragment data:', error);
      throw new Error('Error fetching fragment data');
    }
  }

  async setData(data) {
    if (!(data instanceof Buffer)) {
      logger.error('Data must be a Buffer');
      throw new Error('Data must be a Buffer');
    }

    this.updated = new Date().toISOString();
    this.size = Buffer.byteLength(data);

    try {
      await writeFragmentData(this.ownerId, this.id, data);
    } catch (error) {
      logger.error('Error setting fragment data:', error);
      throw new Error('Error setting fragment data');
    }
  }

  // Getters
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  get formats() {
    const formatsByType = {
      'image/png': ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      'image/jpeg': ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      'image/gif': ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      'image/webp': ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      'text/plain': ['text/plain'],
      'text/markdown': ['text/plain', 'text/html', 'text/markdown'],
      'text/html': ['text/plain', 'text/html'],
      'application/json': ['application/json', 'text/plain'],
      'text/csv': ['text/csv', 'text/plain', 'text/json'],
    };

    return formatsByType[this.mimeType] || [];
  }

  // Static utility methods
  static isSupportedType(type) {
    const supportedTypes = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'text/csv',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avif',
      'image/gif',
    ];
    return supportedTypes.includes(type);
  }
}

module.exports = { Fragment };
