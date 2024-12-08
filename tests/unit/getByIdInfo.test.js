// tests/unit/getByIdInfo.test.js

const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments/:id/info', () => {
  const authHeader = { username: 'user1@email.com', password: 'password1' };

  test('1. Unauthenticated requests are denied', async () => {
    await request(app).get('/v1/fragments/111/info').expect(401);
  });

  test('2. Incorrect credentials are denied', async () => {
    await request(app)
      .get('/v1/fragments/123/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('3. Returns 404 if fragment not found', async () => {
    const res = await request(app).get('/v1/fragments/id-in/info').auth(authHeader.username, authHeader.password);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Fragment not found');
  });

  test('4. Authenticated users get a fragment metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth(authHeader.username, authHeader.password)
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    logger.debug('Fragment has been posted:', postRes.body);
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app).get(`/v1/fragments/${id}/info`).auth(authHeader.username, authHeader.password);
    expect(getRes.statusCode).toBe(200);
  });
});
