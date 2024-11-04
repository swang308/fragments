// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');
require('dotenv').config();

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () =>
    request(app).post('/v1/fragments').expect(401)
  );

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401)
  );

  // test('fragment without data returns error', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user01', '123@wsEd')
  //     .send();
  //   expect(res.statusCode).toBe(500);
  // });

  // test('authenticated users create a plain text fragment', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user01', '123@wsEd')
  //     .set('Content-Type', 'text/plain')
  //     .send('This is a fragment');
  //   expect(res.statusCode).toBe(201);
  //   expect(res.headers['content-type']).toContain('text/plain');
  // });

  // test('authenticated users create a binary fragment', async () => {
  //   const bufferFragment = Buffer.from('This is a test binary fragment');

  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user01', '123@wsEd')
  //     .set('Content-Type', 'application/json')
  //     .send(bufferFragment);

  //   expect(res.statusCode).toBe(201);
  //   expect(res.headers['content-type']).toContain('application/json');
  // });

  // test('POST response includes a Location header with a URL to GET the created fragment', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user01', '123@wsEd')
  //     .set('Content-Type', 'text/plain')
  //     .send('This is a fragment');
  //   expect(res.statusCode).toBe(201);
  //   expect(res.headers.location).toMatch(/\/v1\/fragments\/[a-f0-9-]+$/);
  // });

  // test('Fragment with an unsupported type gives error', () =>
  //   request(app)
  //     .post('/v1/fragments')
  //     .set('Content-Type', 'audio/mpeg')
  //     .auth('user01', '123@wsEd')
  //     .send('aa')
  //     .expect(415)
  // );

  // test('authenticated users create a JSON fragment', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user01', '123@wsEd')
  //     .set('Content-Type', 'application/json')
  //     .send({ message: "This is a JSON fragment" });
  //   expect(res.statusCode).toBe(201);
  //   expect(res.headers['content-type']).toContain('application/json');
  // });

});
