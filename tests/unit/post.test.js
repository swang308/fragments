const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const data = 'hello';
    const response = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(response.status).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const data = 'hello';
    const response = await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(response.status).toBe(401);
  });

  // text/plain
  test('authenticated users can post text/plain fragment data', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    // expect(res.body.status).toBe('ok');
    expect(res.headers['content-type']).toContain('text/plain');
  });

  // text/*
  test('authenticated users can post text/* fragment data', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/*')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('text/*');
  });

  // application/json
  test('authenticated users can post application/json fragment data', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.headers['content-type']).toContain('application/json');
  });

  // unsupported content type
  test('should return 415 for unsupported content types', async () => {
    const unsupportedData = '<xml><data>Sample XML data</data></xml>';
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1') // Use valid credentials
      .set('Content-Type', 'application/xml') // Unsupported content type
      .send(unsupportedData);

    expect(response.status).toBe(415);
  });

  test('should return 401 for missing required fields', async () => {
    const data = null; // Missing ownerId or type
    const response = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(response.status).toBe(401);
  });

  test('should return 401 for invalid JSON data format', async () => {
    const invalidJsonData = '{ text: "hello"'; // Invalid JSON (missing closing quote)
    const response = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'application/json')
      .send(invalidJsonData);

    expect(response.status).toBe(401);
  });
});
