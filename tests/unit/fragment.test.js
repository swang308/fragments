// Import Fragment class
const { Fragment } = require('../../src/model/fragment');

// Utility function for waiting
const wait = async (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

// Valid MIME types for testing
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

// Test suite for Fragment class
describe('Fragment class', () => {
  // Common formats test
  test('1. Common formats are supported', () => {
    validTypes.forEach((format) => expect(Fragment.isSupportedType(format)).toBe(true));
  });

  // Tests for the Fragment constructor
  describe('2. Fragment()', () => {
    test('2.1 ownerId and type are required', () => {
      expect(() => new Fragment({})).toThrow();
    });

    test('2.2 ownerId is required', () => {
      expect(() => new Fragment({ type: 'text/plain', size: 1 })).toThrow();
    });

    test('2.3 type is required', () => {
      expect(() => new Fragment({ ownerId: '1234', size: 1 })).toThrow();
    });

    test('2.4 type can be a simple media type', () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
      expect(fragment.type).toEqual('text/plain');
    });

    test('2.5 type can include a charset', () => {
      const fragment = new Fragment({
        ownerId: '1234',
        type: 'text/plain; charset=utf-8',
        size: 0,
      });
      expect(fragment.type).toEqual('text/plain; charset=utf-8');
    });

    test('2.6 size gets set to 0 if missing', () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain' });
      expect(fragment.size).toBe(0);
    });

    test('2.7 size must be a number', () => {
      expect(() => new Fragment({ ownerId: '1234', type: 'text/plain', size: '1' })).toThrow();
    });

    test('2.8 size can be 0', () => {
      expect(() => new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 })).not.toThrow();
    });

    test('2.9 size cannot be negative', () => {
      expect(() => new Fragment({ ownerId: '1234', type: 'text/plain', size: -1 })).toThrow();
    });

    test('2.10 invalid types throw', () => {
      expect(() => new Fragment({ ownerId: '1234', type: 'application/msword', size: 1 })).toThrow();
    });

    test('2.11 valid types can be set', () => {
      validTypes.forEach((format) => {
        const fragment = new Fragment({ ownerId: '1234', type: format, size: 1 });
        expect(fragment.type).toEqual(format);
      });
    });

    test('2.12 fragments have an id', () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 1 });
      expect(fragment.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    });

    test('2.13 fragments use id passed in if present', () => {
      const fragment = new Fragment({ id: 'id', ownerId: '1234', type: 'text/plain', size: 1 });
      expect(fragment.id).toEqual('id');
    });

    test('2.14 fragments get a created datetime string', () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 1 });
      expect(Date.parse(fragment.created)).not.toBeNaN();
    });

    test('2.15 fragments get an updated datetime string', () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 1 });
      expect(Date.parse(fragment.updated)).not.toBeNaN();
    });
  });

  // Tests for isSupportedType method
  describe('5. isSupportedType()', () => {
    test('5.1 common text types are supported, with and without charset', () => {
      expect(Fragment.isSupportedType('text/plain')).toBe(true);
      expect(Fragment.isSupportedType('text/plain; charset=utf-8')).toBe(true);
    });

    test('5.2 other types are not supported', () => {
      expect(Fragment.isSupportedType('application/octet-stream')).toBe(false);
      expect(Fragment.isSupportedType('application/msword')).toBe(false);
      expect(Fragment.isSupportedType('audio/webm')).toBe(false);
      expect(Fragment.isSupportedType('video/ogg')).toBe(false);
    });
  });

  // Tests for mimeType and isText
  describe('6. mimeType, isText', () => {
    test('6.1 mimeType returns the mime type without charset', () => {
      const fragment = new Fragment({
        ownerId: '1234',
        type: 'text/plain; charset=utf-8',
        size: 0,
      });
      expect(fragment.mimeType).toEqual('text/plain');
    });

    test('6.2 mimeType returns the mime type if charset is missing', () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
      expect(fragment.mimeType).toEqual('text/plain');
    });

    test('6.3 isText returns true for text types', () => {
      const fragment = new Fragment({
        ownerId: '1234',
        type: 'text/plain; charset=utf-8',
        size: 0,
      });
      expect(fragment.isText).toBe(true);
    });
  });

  // Tests for formats
  describe('7. formats', () => {
    test('7.1 formats returns the expected result for plain text', () => {
      const fragment = new Fragment({
        ownerId: '1234',
        type: 'text/plain',
        size: 0,
      });
      expect(fragment.formats).toEqual(['text/plain']);
    });
  });

  // Tests for CRUD methods
  describe('8. save(), getData(), setData(), byId(), byUser(), delete()', () => {
    test('8.1 byUser() returns an empty array if there are no fragments for this user', async () => {
      expect(await Fragment.byUser('1234')).toEqual([]);
    });

    test('8.2 A fragment can be created and save() stores a fragment for the user', async () => {
      const data = Buffer.from('hello');
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
      await fragment.save();
      await fragment.setData(data);

      const fragment2 = await Fragment.byId('1234', fragment.id);
      expect(fragment2).toEqual(fragment);
      expect(await fragment2.getData()).toEqual(data);
    });

    test('8.3 save() updates the updated date/time of a fragment', async () => {
      const ownerId = '7777';
      const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
      const modified1 = fragment.updated;
      await wait();
      await fragment.save();
      const fragment2 = await Fragment.byId(ownerId, fragment.id);
      expect(Date.parse(fragment2.updated)).toBeGreaterThan(Date.parse(modified1));
    });

    test('8.4 setData() updates the updated date/time of a fragment', async () => {
      const data = Buffer.from('hello');
      const ownerId = '7777';
      const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
      await fragment.save();
      const modified1 = fragment.updated;
      await wait();
      await fragment.setData(data);
      const fragment2 = await Fragment.byId(ownerId, fragment.id);
      expect(Date.parse(fragment2.updated)).toBeGreaterThan(Date.parse(modified1));
    });

    test('8.5 setData() throws if not given a Buffer', async () => {
      const fragment = new Fragment({ ownerId: '123', type: 'text/plain', size: 0 });
      await expect(fragment.setData()).rejects.toThrow();
    });

    test('8.6 setData() updates the fragment size', async () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
      await fragment.save();
      await fragment.setData(Buffer.from('a'));
      expect(fragment.size).toBe(1);

      await fragment.setData(Buffer.from('aa'));
      const { size } = await Fragment.byId('1234', fragment.id);
      expect(size).toBe(2);
    });

    test('8.7 a fragment can be deleted', async () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
      await fragment.save();
      await fragment.setData(Buffer.from('a'));

      await Fragment.delete('1234', fragment.id);
      await expect(Fragment.byId('1234', fragment.id)).rejects.toThrow();
    });
  });
});
