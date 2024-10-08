const request = require('supertest');
const app = require('../../src/app'); // Import your Express app
const httpStatus = require('http-status');
const { Fragment } = require('../../src/model/fragment');

jest.mock('../../src/model/fragment'); // Mock the Fragment model
jest.mock('../../src/auth/basic-auth', () => ({
  authenticate: jest.fn(() => (req, res, next) => {
    // Simulate successful authentication
    req.user = { email: 'user@example.com' }; // Mock user data
    next(); // Ensure next() is called to proceed to the next middleware/route handler
  })
}));


describe('POST /fragments', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    Fragment.mockClear();
  });

  test('should return 401 if no authorization header is provided', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .send('Sample fragment text');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body).toEqual({
      error: { code: 401, message: 'Unauthorized' },
      status: 'error'
    });
  });

  test('should return 401 if invalid authorization header is provided', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .set('Authorization', 'InvalidHeader')
      .send('Sample fragment text');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body).toEqual({
      error: { code: 401, message: 'Unauthorized' },
      status: 'error'
    });
  });

  test('should create a plain text fragment for authenticated users', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Text/plain test');
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.text).status).toBe('ok');
  });

  test('should return 415 for unsupported content types', async () => {
  });



  test('should handle internal server error gracefully', async () => {
  });
});
