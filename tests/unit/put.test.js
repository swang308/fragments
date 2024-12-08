const request = require('supertest');
const app = require('../../src/app');

require('dotenv').config();

describe('PUT /v1/fragments', () => {
  // Test: Unauthenticated requests should be denied
  test('unauthenticated requests are denied', () =>
    request(app).put('/v1/fragments').expect(401));

  // Test: Requests with incorrect credentials should be denied
  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Test: Updating a fragment with an unsupported content-type should fail
  test('fragment with incorrect content-type data does not work', async () => {
    const initialData = 'This is fragment';

    // Create a new fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(initialData);

    expect(postRes.statusCode).toBe(201);
    expect(postRes.headers['content-type']).toContain('text/plain');

    const fragmentId = JSON.parse(postRes.text).fragment.id;

    // Attempt to update the fragment with an unsupported content-type
    const updatedData = 'This is the updated fragment';
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/random') // Unsupported content-type
      .send(updatedData);

    expect(putRes.statusCode).toBe(400);
  });

  // Test: PUT response includes a Location header pointing to the updated fragment
  test('PUT response includes a Location header with a full URL to GET the updated fragment', async () => {
    const initialData = 'This is fragment';

    // Create a new fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(initialData);

    expect(postRes.statusCode).toBe(201);

    const fragmentId = JSON.parse(postRes.text).fragment.id;

    // Update the fragment
    const updatedData = 'This is the updated fragment';
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(updatedData);

    expect(putRes.statusCode).toBe(200);
    expect(putRes.headers.location).toEqual(postRes.headers.location);
  });

  // Test: Updating a non-existent fragment ID should return 404
  test('Fragment with incorrect id gives error', async () => {
    const data = 'This is a fragment';

    // Attempt to update a fragment with a non-existent ID
    const putRes = await request(app)
      .put('/v1/fragments/randomId')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(putRes.statusCode).toBe(500);
  });
});
