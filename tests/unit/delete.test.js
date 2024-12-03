const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  // Test for unauthenticated requests
  test('denies unauthenticated requests with 401 status', () =>
    request(app)
      .delete('/v1/fragments/111')
      .expect(401));

  // Test for incorrect credentials
  test('denies requests with incorrect credentials with 401 status', () =>
    request(app)
      .delete('/v1/fragments/111')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Test for deleting a fragment that doesn't exist
  test('returns 404 if the fragment is not found', async () => {
    const res = await request(app)
      .delete('/v1/fragments/invalid-id')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toMatch(/Fragment not found/i);
  });

  // Test for successfully deleting an existing fragment
  test('allows authenticated users to delete a fragment', async () => {
    // Create a fragment to delete
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    // Ensure fragment creation was successful
    expect(postRes.statusCode).toBe(201);
    const fragmentId = JSON.parse(postRes.text).fragment.id;

    // Delete the created fragment
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    // Ensure deletion was successful
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.status).toBe('ok');
  });
});
