const request = require('supertest');
const app = require('../../src/app');
const Fragment = require('../../src/model/fragment');

// Mocking Fragment.list method to return a list of fragments for testing
jest.mock('../../src/model/fragment', () => ({
  list: jest.fn(),
}));

describe('GET /v1/fragments', () => {
  // Test: Unauthenticated requests should be denied
  test('unauthenticated requests are denied', async () => {
    const response = await request(app).get('/v1/fragments');
    expect(response.status).toBe(401);
  });

  // Test: Incorrect credentials should be denied
  test('incorrect credentials are denied', async () => {
    const response = await request(app)
      .get('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password');
    expect(response.status).toBe(401);
  });

  // Test: Authenticated users should receive a fragments array
  test('authenticated users get a fragments array', async () => {
    // Mocking a successful response for Fragment.list
    const mockFragments = [
      { id: 1, name: 'Fragment 1' },
      { id: 2, name: 'Fragment 2' }];
    Fragment.list.mockResolvedValue(mockFragments);

    // Send the request with valid credentials
    const response = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  // Test: Handling server error (e.g., Fragment.list throws an error)
  // test('should return 404 if an error occurs', async () => {
  //   const response = await request(app)
  //     .get('/v1/fragments')
  //     .auth('user1@email.com', 'password1');

  //   expect(response.status).toBe(404);
  // });
});
