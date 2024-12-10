const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  // Test for unauthenticated requests
  test('1. Denies unauthenticated requests with 401 status', () =>
    request(app)
      .delete('/v1/fragments/111')
      .expect(401));

  // Test for incorrect credentials
  test('2. Denies requests with incorrect credentials with 401 status', () =>
    request(app)
      .delete('/v1/fragments/111')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Test for deleting a fragment that doesn’t exist
  test('3. Returns 500 if the fragment is not retrieved', async () => {
    const res = await request(app)
      .delete('/v1/fragments/invalid-id')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Internal server error');
  });

  // Test for successfully deleting an existing fragment
  test('4. Allows authenticated users to delete a fragment', async () => {
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
