const request = require('supertest');
const app = require('../../src/app'); // Your Express app
const Fragment = require('../../src/model/fragment');
const hash = require('../../src/hash'); // For hashing the email

jest.mock('../../src/hash');

describe('POST /fragments', () => {
  const fragmentData = Buffer.from('Hello World');
  const fragmentType = 'text/plain';
  const user = { email: 'test@example.com', emailHash: 'hashed-email' };

  beforeEach(() => {
    // Clear all mocks and reset before each test
    jest.clearAllMocks();

    // Mock hash function to return a hashed version of the email
    hash.mockReturnValue(user.emailHash);
  });

  it('should create a plain text fragment for authenticated users', async () => {
    // Spy on Fragment.isSupportedType static method
    jest.spyOn(Fragment, 'isSupportedType').mockReturnValue(true);

    // Mock the create function to simulate fragment creation
    jest.spyOn(Fragment, 'create').mockResolvedValue({
      id: 'abc123',
      created: new Date().toISOString(),
      type: fragmentType,
      ownerId: user.emailHash,
      size: fragmentData.length,
    });

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData)
      .auth(user.email, 'password'); // Mock authentication header

    // Test the response for successful fragment creation
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('created');
    expect(res.body.type).toBe(fragmentType);
    expect(res.body.ownerId).toBe(user.emailHash);
    expect(res.body.size).toBe(fragmentData.length);
    expect(res.headers).toHaveProperty('location');
  });

  it('should return 400 for unsupported content types', async () => {
    // Spy on Fragment.isSupportedType to return false
    jest.spyOn(Fragment, 'isSupportedType').mockReturnValue(false);

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', 'application/unsupported')
      .send(fragmentData);

    // Check that the response is a 400 for unsupported content types
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid content type or body'); // Ensure this matches the actual message from your route
  });

  it('should return 500 on server errors', async () => {
    // Spy on Fragment.isSupportedType to return true (valid type)
    jest.spyOn(Fragment, 'isSupportedType').mockReturnValue(true);

    // Simulate a server error by throwing an error in Fragment.create
    jest.spyOn(Fragment, 'create').mockImplementation(() => {
      throw new Error('Server error');
    });

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData);

    // Check that the response is a 500 for internal server error
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error'); // Ensure this matches the actual message from your route
  });
});
