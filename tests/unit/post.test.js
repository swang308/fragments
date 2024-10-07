const request = require('supertest');
const app = require('../../src/app'); // Your Express app
const Fragment = require('../../src/model/fragment');
const hash = require('../../src/hash'); // For hashing the email

// Mock the hash and Fragment modules
jest.mock('../../src/hash');
jest.mock('../../src/model/fragment');

describe('POST /fragments', () => {
  const fragmentData = Buffer.from('Hello World');
  const fragmentType = 'text/plain';
  const user = { email: 'test@example.com', emailHash: 'hashed-email' };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the hash function to return a hashed version of the email
    hash.mockReturnValue(user.emailHash);

    // Mock Fragment methods
    Fragment.isSupportedType = jest.fn();
  });

  it('should create a plain text fragment for authenticated users', async () => {
    // Mock isSupportedType to return true
    Fragment.isSupportedType.mockReturnValue(true);

    const mockFragment = {
      id: 'abc123',
      created: new Date().toISOString(),
      type: fragmentType,
      ownerId: user.emailHash,
      size: fragmentData.length,
      save: jest.fn().mockResolvedValue(this), // Ensure save resolves to the fragment object itself
    };

    // Set the implementation of Fragment to return the mockFragment
    Fragment.mockImplementation(() => mockFragment);

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData)
      .auth(user.email, 'password'); // Mock authentication header

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('created');
    expect(res.body.type).toBe(fragmentType);
    expect(res.body.ownerId).toBe(user.emailHash);
    expect(res.body.size).toBe(fragmentData.length);
    expect(res.headers).toHaveProperty('location');
  });

  it('should return 400 for unsupported content types', async () => {
    // Mock isSupportedType to return false
    Fragment.isSupportedType.mockReturnValue(false);

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', 'application/unsupported')
      .send(fragmentData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid body data'); // Ensure this matches the actual message from your route
  });

  it('should return 500 on server errors', async () => {
    // Mock isSupportedType to return true
    Fragment.isSupportedType.mockReturnValue(true);

    // Simulate a server error by making the save function reject
    const mockFragment = {
      save: jest.fn().mockRejectedValue(new Error('Server error')),
    };

    Fragment.mockImplementation(() => mockFragment);

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error'); // Ensure this matches the actual message from your route
  });
});
