const request = require('supertest');
const app = require('../../src/app');

describe('app', () => {
  describe('404 Middleware', () => {
    test('1. Returns 404 for undefined routes', async () => {
      const res = await request(app).get('/undefined');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBeDefined(); // Assuming an error message is included in the response body
    });
  });

  describe('2. CORS Headers', () => {
    test('Access-Control-Allow-Origin is set', async () => {
      const res = await request(app).get('/');
      expect(res.headers['access-control-allow-origin']).toBe('*'); // Adjust for specific origin
    });

    // test('Access-Control-Allow-Methods is set', async () => {
    //   const res = await request(app).get('/');
    //   expect(res.headers['access-control-allow-methods']).toContain('GET'); // Adjust as needed
    // });

    // test('Access-Control-Allow-Headers is set', async () => {
    //   const res = await request(app).get('/');
    //   expect(res.headers['access-control-allow-headers']).toBeDefined(); // Check specific headers
    // });
  });
});
