const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment'); // Update path as per your project

jest.mock('../../src/model/fragment'); // Mock the fragment module globally

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

  test('authenticated users get a fragments array', async () => {
    // Mocking a successful response for Fragment.byUser
    const mockFragments = [
      { id: 1, name: 'Fragment 1' },
      { id: 2, name: 'Fragment 2' },
    ];
    Fragment.byUser.mockResolvedValue(mockFragments);

    // Send the request with valid credentials
    const response = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.fragments).toEqual(mockFragments);
  });


  // Test: Handling server error (e.g., Fragment.list throws an error)
  // test('should return 404 if an error occurs', async () => {
  //   const response = await request(app)
  //     .get('/v1/fragments')
  //     .auth('user1@email.com', 'password1');

  //   expect(response.status).toBe(404);
  // });
});
