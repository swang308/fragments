// Import the necessary modules
const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData
} = require('../../src/model/data/memory/index');

// Helper data for testing
const mockFragment = {
  ownerId: 'user1',
  id: 'fragment1',
  content: 'This is a test fragment.',
};

const mockDataBuffer = Buffer.from('This is the raw data for the fragment.');

describe('MemoryDB unit tests', () => {
  // Test writeFragment
  test('writeFragment should write fragment metadata to memory', async () => {
    const result = await writeFragment(mockFragment);
    expect(result).toBeUndefined(); // As write operations usually return nothing
  });

  // Test readFragment
  test('readFragment should return the correct fragment metadata from memory', async () => {
    await writeFragment(mockFragment);
    const result = await readFragment(mockFragment.ownerId, mockFragment.id);
    expect(result).toEqual(mockFragment); // Ensure the fragment returned is correct
  });

  // Test writeFragmentData
  test('writeFragmentData should write fragment data to memory', async () => {
    const result = await writeFragmentData(mockFragment.ownerId, mockFragment.id, mockDataBuffer);
    expect(result).toBeUndefined(); // As write operations usually return nothing
  });

  // Test readFragmentData
  test('readFragmentData should return the correct fragment data buffer from memory', async () => {
    await writeFragmentData(mockFragment.ownerId, mockFragment.id, mockDataBuffer);
    const result = await readFragmentData(mockFragment.ownerId, mockFragment.id);
    expect(result).toEqual(mockDataBuffer); // Ensure the buffer returned is correct
  });

  // Additional tests to ensure proper functioning of edge cases

  test('readFragment should return undefined if fragment does not exist', async () => {
    const result = await readFragment('user1', 'nonexistent-fragment');
    expect(result).toBeUndefined();
  });

  test('readFragmentData should return undefined if data does not exist', async () => {
    const result = await readFragmentData('user1', 'nonexistent-fragment');
    expect(result).toBeUndefined();
  });
});
