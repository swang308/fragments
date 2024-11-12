const request = require('supertest');

const app = require('../../src/app');

describe('app', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('testing 404 middleware', async () => {
    const res = await request(app).get('/undefined');
    expect(res.statusCode).toBe(404);
  });

  // Test for CORS headers
  test('CORS headers are set', async () => {
    const res = await request(app).get('/');
    expect(res.headers['access-control-allow-origin']).toBe('*'); // Adjust if specific origin is set
  });

  // Test for gzip compression header, test for gzip compression larger
  // test('gzip compression is enabled', async () => {
  //   const res = await request(app).get('/');
  //   expect(res.headers['content-encoding']).toBe('gzip');
  // });

});


