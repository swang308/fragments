const request = require('supertest');
const app = require('../../src/app'); // Import your Express app
const httpStatus = require('http-status');
const { Fragment } = require('../../src/model/fragment');

jest.mock('../../src/model/fragment'); // Mock the Fragment model


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
  });

  test('should return 415 for unsupported content types', async () => {
  });

  test('should handle internal server error gracefully', async () => {
  });
});
