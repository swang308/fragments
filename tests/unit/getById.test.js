// tests/unit/getById.test.js

const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments/:id/info', () => {
  const authHeader = { username: 'user1@email.com', password: 'password1' };

  test('Returns 401 for requests without authentication', async () => {
    await request(app).get('/v1/fragments/111/info').expect(401);
  });

  test('Returns 401 for requests with incorrect credentials', async () => {
    await request(app)
      .get('/v1/fragments/123/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('eturns 404 when the fragment ID is not found', async () => {
    const res = await request(app).get('/v1/fragments/id-in/info').auth(authHeader.username, authHeader.password);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Fragment not found');
  });

  test('Returns fragment data for authenticated requests with a valid ID', async () => {
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

  test('Returns 415 for unsupported content type conversion', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth(authHeader.username, authHeader.password)
      .set('Content-Type', 'text/plain')
      .send('This is a fragment for unsupported type test');
    expect(postRes.statusCode).toBe(201);

    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.unsupported`)
      .auth(authHeader.username, authHeader.password);
    expect(getRes.statusCode).toBe(415);
    expect(getRes.body.error.message).toBe('Unsupported conversion: .unsupported');
  });

  test('Returns fragment data in original type if no extension is specified', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth(authHeader.username, authHeader.password)
      .set('Content-Type', 'text/plain')
      .send('This is a plain text fragment');
    expect(postRes.statusCode).toBe(201);

    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth(authHeader.username, authHeader.password);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.header['content-type']).toBe('text/plain');
    expect(getRes.text).toBe('This is a plain text fragment');
  });

  test('Converts Markdown to HTML if .html extension is specified', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth(authHeader.username, authHeader.password)
      .set('Content-Type', 'text/markdown')
      .send('# Markdown Title');
    expect(postRes.statusCode).toBe(201);

    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth(authHeader.username, authHeader.password);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.header['content-type']).toContain('text/html');
    expect(getRes.text).toContain('<h1>Markdown Title</h1>');
  });

  test('Returns 415 for unsupported conversion type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth(authHeader.username, authHeader.password)
      .set('Content-Type', 'text/plain')
      .send('Sample fragment data');
    expect(postRes.statusCode).toBe(201);

    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.unsupported`)
      .auth(authHeader.username, authHeader.password);
    expect(getRes.statusCode).toBe(415);
    expect(getRes.body.error.message).toBe('Unsupported conversion: .unsupported');
  });

  // test('Converts image to specified format (e.g., .jpeg)', async () => {
  // const imageBuffer = Buffer.from('some image data'); // Replace with an actual image buffer in a real test
  // const fs = require('fs');
  // const path = require('path');
  // const imageBuffer = fs.readFileSync(path.resolve(__dirname, '../'));
  // const postRes = await request(app)
  //   .post('/v1/fragments')
  //   .auth(authHeader.username, authHeader.password)
  //   .set('Content-Type', 'image/png')
  //   .send(imageBuffer);
  // expect(postRes.statusCode).toBe(201);

  // const id = JSON.parse(postRes.text).fragment.id;

  // const getRes = await request(app)
  //   .get(`/v1/fragments/${id}.jpeg`)
  //   .auth(authHeader.username, authHeader.password);
  // expect(getRes.statusCode).toBe(200);
  // expect(getRes.header['content-type']).toBe('image/jpeg');
  // });

  // test('Returns 415 for image conversion failure on unsupported format', async () => {
  //   // Read a sample PNG image file as a Buffer
  //   const imageBuffer = fs.readFileSync(path.resolve(__dirname, 'path/to/your/test/image.png'));

  //   // Upload the image fragment
  //   const postRes = await request(app)
  //     .post('/v1/fragments')
  //     .auth(authHeader.username, authHeader.password)
  //     .set('Content-Type', 'image/png')
  //     .send(imageBuffer);
  //   expect(postRes.statusCode).toBe(201);

  //   // Parse the ID from the response
  //   const id = JSON.parse(postRes.text).fragment.id;

  //   // Attempt to retrieve the fragment with an unsupported conversion (e.g., .unsupported)
  //   const getRes = await request(app)
  //     .get(`/v1/fragments/${id}.unsupported`)
  //     .auth(authHeader.username, authHeader.password);

  //   // Validate that a 415 Unsupported Media Type error is returned
  //   expect(getRes.statusCode).toBe(415);
  //   expect(getRes.body.error.message).toBe('Image conversion failed');
  // });

  // test('Converts JSON to CSV format', async () => {
  //   const postRes = await request(app)
  //     .post('/v1/fragments')
  //     .auth(authHeader.username, authHeader.password)
  //     .set('Content-Type', 'application/json')
  //     .send({ name: 'John', age: 30 });
  //   expect(postRes.statusCode).toBe(201);

  //   const id = JSON.parse(postRes.text).fragment.id;

  //   const getRes = await request(app)
  //     .get(`/v1/fragments/${id}.csv`)
  //     .auth(authHeader.username, authHeader.password);
  //   expect(getRes.statusCode).toBe(200);
  //   expect(getRes.header['content-type']).toContain('text/csv');
  //   expect(getRes.text).toBe('name,age\nJohn,30\n');
  // });
});
