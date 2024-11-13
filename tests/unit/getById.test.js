// tests/unit/getById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/111').expect(401));

  // // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/111').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('returns 404 if fragment not found', async () => {
    const res = (await request(app).get('/v1/fragments/invalid-id').auth('user1@email.com', 'password1'));

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users get a fragments data', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app).get('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.header['content-type']).toBe('text/plain');
    expect(getRes.text).toBe('This is a fragment');
  });

  test('return 415 for unsupported extension type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app).get('/v1/fragments/' + id + '.random').auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(415);
  });

  // .html conversion test
  test('authenticated users are able to do \'.html\' conversions for supported type', async () => {
    // POST a html fragment with text/html content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('This is a HTML fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // POST a markdwon fragment with text/markdown content type
    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a markdown fragment');
    expect(postRes2.statusCode).toBe(201);
    const id2 = JSON.parse(postRes2.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert html fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.html').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('text/html; charset=utf-8');

    // Try to convert markdown fragment using Get v1/fragment/:id:.ext
    const getRes2 = await request(app).get('/v1/fragments/' + id2 + '.html').auth('user1@email.com', 'password1');
    expect(getRes2.statusCode).toBe(200);
    expect(getRes2.header['content-type']).toBe('text/html; charset=utf-8');
  });

  // .txt conversion test
  test('authenticated users are able to do \'.txt\' conversions for supported type', async () => {
    // POST a html fragment with text/html content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('This is a HTML fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // POST a markdwon fragment with text/markdown content type
    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a markdown fragment');
    expect(postRes2.statusCode).toBe(201);
    const id2 = JSON.parse(postRes2.text).fragment.id;

    // POST a plain fragment with text/plain content type
    const postRes3 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes3.statusCode).toBe(201);
    const id3 = JSON.parse(postRes3.text).fragment.id;

    // POST a csv fragment with text/csv content type
    const postRes4 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send('This is a CSV fragment');
    expect(postRes4.statusCode).toBe(201);
    const id4 = JSON.parse(postRes4.text).fragment.id;

    // POST a JSON fragment with application/json content type
    const postRes5 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('This is a JSON fragment');
    expect(postRes5.statusCode).toBe(201);
    const id5 = JSON.parse(postRes5.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert html fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.txt').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('text/plain');

    // Try to convert markdown fragment using Get v1/fragment/:id:.ext
    const getRes2 = await request(app).get('/v1/fragments/' + id2 + '.txt').auth('user1@email.com', 'password1');
    expect(getRes2.statusCode).toBe(200);
    expect(getRes2.header['content-type']).toBe('text/plain');

    // Try to convert plain fragment using GET v1/framents/:id:.ext
    const getRes3 = await request(app).get('/v1/fragments/' + id3 + '.txt').auth('user1@email.com', 'password1');
    expect(getRes3.statusCode).toBe(200);
    expect(getRes3.header['content-type']).toBe('text/plain');

    // Try to convert csv fragment using GET v1/framents/:id:.ext
    const getRes4 = await request(app).get('/v1/fragments/' + id4 + '.txt').auth('user1@email.com', 'password1');
    expect(getRes4.statusCode).toBe(200);
    expect(getRes4.header['content-type']).toBe('text/plain');

    // Try to convert JSON fragment using GET v1/framents/:id:.ext
    const getRes5 = await request(app).get('/v1/fragments/' + id5 + '.txt').auth('user1@email.com', 'password1');
    expect(getRes5.statusCode).toBe(200);
    expect(getRes5.header['content-type']).toBe('text/plain');
  });

  // .md conversion test
  test('authenticated users are able to do \'.md\' conversions for supported type', async () => {
    // POST a markdown fragment with text/html content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a markdown fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert markdown fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.md').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('text/markdown');
  });

  // .JSON conversion test
  test('authenticated users are able to do \'.json\' conversions for supported type', async () => {
    // POST a JSON fragment with application/json content type
    const postData1 = { name: "JSON" };
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(postData1);
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert JSON fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.json').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('application/json');
  });

  // .csv conversion test
  test('authenticated users are able to do \'.csv\' conversions for supported type', async () => {
    // POST a CSV fragment with text/csv content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send('This is a CSV fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert JSON fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.csv').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('text/csv');
  });

  // Cannot convert unsupported type to .html
  test('authenticated users are unableable to do \'.html\' conversions for unsupported type', async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert html fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.html').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .md
  test('authenticated users are unableable to do \'.md\' conversions for unsupported type', async () => {
    // POST a plain fragment with image/png content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert md fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.md').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .json
  test('authenticated users are unableable to do \'.json\' conversions for unsupported type', async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert json fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.json').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .csv
  test('authenticated users are unableable to do \'.csv\' conversions for unsupported type', async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert csv fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app).get('/v1/fragments/' + id1 + '.csv').auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  test('return 415 for unsupported content type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/random')
      .send('This is a fragment');
    expect(postRes.statusCode).toBe(415);
  });
});

