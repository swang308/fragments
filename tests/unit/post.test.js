const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {

  test('unauthenticated requests are denied', async () => {
    const data = Buffer.from('hello');
    const response = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(response.status).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const data = Buffer.from('hello');
    const response = await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(response.status).toBe(401);
  });

  // test('should return 400 if req.body is not a Buffer', async () => {
  // });

  // test('unauthenticated users can post data', async () => {
  //   const data = Buffer.from('hello');
  //   const response = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'password1123')
  //     .set('Content-Type', 'text/plain')
  //     .send(data);
  //   expect(response.status).toBe(401);
  // });

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
    const data = ''; // Missing ownerId or type
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

  // // Test: Authenticated users should receive a fragments array
  // test('authenticated users get a fragments array', async () => {
  //   // Mocking a successful response for Fragment.list
  //   const mockFragments = [{ id: 1, name: 'Fragment 1' }, { id: 2, name: 'Fragment 2' }];
  //   Fragment.list.mockResolvedValue(mockFragments);

  //   // Send the request with valid credentials
  //   const response = await request(app)
  //     .get('/v1/fragments')
  //     .auth('user1@email.com', 'password1');

  //   // Assertions
  //   expect(response.status).toBe(200);
  //   expect(response.body.status).toBe('ok');
  //   expect(Array.isArray(response.body.fragments)).toBe(true);
  //   expect(response.body.fragments.length).toBe(mockFragments.length);
  //   expect(response.body.fragments).toEqual(mockFragments);
  // });

  // // Test: Handling server error (e.g., Fragment.list throws an error)
  // test('should return 404 if an error occurs', async () => {
  //   // Mocking Fragment.list to throw an error
  //   Fragment.list.mockRejectedValue(new Error('Database error'));

  //   const response = await request(app)
  //     .get('/v1/fragments')
  //     .auth('user1@email.com', 'password1');

  //   // Assertions
  //   expect(response.status).toBe(404);
  //   expect(response.body.error.message).toBe('Database error');
  //   expect(response.body.error.code).toBe(404);
  // });
});
