// src/model/fragment.js

const { randomUUID } = require('crypto');
const contentType = require('content-type');
const logger = require('../logger');

// Database functions for fragment operations
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('ownerId and type are required');
    }

    if (typeof size !== 'number' || size < 0) {
      throw new Error('Size must be a non-negative number');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error('Invalid fragment type');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Retrieve all fragments for a user
   * @param {string} ownerId - User's hashed email
   * @param {boolean} expand - Expand ids to full fragments if true
   * @returns {Promise<Array<Fragment>>}
   */
  static async byUser(ownerId, expand = false) {
    try {
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch (error) {
      logger.warn('Error fetching user fragments', { error });
      return [];
    }
  }

  /**
   * Retrieve a fragment by user and id
   * @param {string} ownerId - User's hashed email
   * @param {string} id - Fragment ID
   * @returns {Promise<Fragment>}
   */
  static async byId(ownerId, id) {
    try {
      const result = await readFragment(ownerId, id);
      if (!result) {
        throw new Error('Fragment not found');
      }
      return new Fragment(result);
    } catch (error) {
      logger.error('Error fetching fragment by ID', { error });
      throw new Error('Fragment not found');
    }
  }

  /**
   * Delete a fragment by user and id
   * @param {string} ownerId - User's hashed email
   * @param {string} id - Fragment ID
   * @returns {Promise<void>}
   */
  static async delete(ownerId, id) {
    await deleteFragment(ownerId, id);
    logger.info(`Fragment with ID ${id} deleted successfully`);
  }

  /**
   * Save the fragment to the database
   * @returns {Promise<void>}
   */
  async save() {
    this.updated = new Date().toISOString();
    try {
      await writeFragment(this);
      logger.info('Fragment saved successfully', { fragment: this });
    } catch (error) {
      logger.error('Error saving fragment', { error });
      throw new Error('Failed to save fragment');
    }
  }

  /**
   * Retrieve fragment data
   * @returns {Promise<Buffer>}
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Retrieve and display fragment content as a string if it's text-based
   * @returns {Promise<string>} - Fragment content as a string
   */
  async getDisplayContent() {
    if (!this.isText) {
      throw new Error('Cannot display content for non-text fragment types');
    }

    try {
      // Retrieve the fragment's data as a Buffer
      const data = await this.getData();

      // Convert Buffer to a UTF-8 string
      return data.toString('utf-8');
    } catch (error) {
      logger.error('Error retrieving or displaying fragment content', { error });
      throw new Error('Failed to retrieve or display fragment content');
    }
  }

  /**
   * Set fragment data
   * @param {Buffer} data - Fragment data
   * @returns {Promise<void>}
   */
  async setData(data) {
    if (!(data instanceof Buffer)) {
      logger.error('Data must be a Buffer');
      throw new Error('Data must be a Buffer');
    }
    this.updated = new Date().toISOString();
    this.size = Buffer.byteLength(data);
    try {
      await writeFragmentData(this.ownerId, this.id, data);
      logger.info('Fragment data updated successfully');
    } catch (error) {
      logger.error('Error updating fragment data', { error });
      throw new Error('Failed to update fragment data');
    }
  }

  /**
   * Get MIME type without encoding
   * @returns {string}
   */
  get mimeType() {
    return contentType.parse(this.type).type;
  }

  /**
   * Check if the fragment is a text type
   * @returns {boolean}
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Get supported formats for this fragment type
   * @returns {Array<string>}
   */
  get formats() {
    const type = this.type;

    if (type.startsWith('image/')) {
      return ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    }

    switch (type) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/plain', 'text/html', 'text/markdown'];
      case 'text/html':
        return ['text/plain', 'text/html'];
      case 'application/json':
        return ['application/json', 'text/plain'];
      case 'text/csv':
        return ['text/csv', 'text/plain', 'application/json'];
      default:
        return [];
    }
  }

  /**
   * Validate if the content type is supported
   * @param {string} value - Content type value
   * @returns {boolean}
   */
  static isSupportedType(value) {
    const validTypes = [
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
    return validTypes.includes(value);
  }
}

module.exports.Fragment = Fragment;
