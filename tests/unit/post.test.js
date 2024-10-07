// tests/unit/post.test.js
const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('../../src/hash');

jest.mock('../../src/model/fragment');
jest.mock('../../src/hash');

describe('POST /fragments', () => {
  const fragmentData = Buffer.from('Hello World');
  const fragmentType = 'text/plain';
  const user = { email: 'test@example.com', emailHash: 'hashed-email' };

  beforeEach(() => {
    jest.clearAllMocks();
    hash.mockReturnValue(user.emailHash); // Mock hashing of the email
  });

  it('should return 401 for unauthenticated requests', async () => {
    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should create a plain text fragment for authenticated users', async () => {
    Fragment.isSupportedType.mockReturnValue(true); // Mock isSupportedType to return true
    const mockFragment = {
      id: 'abc123',
      created: new Date().toISOString(),
      type: fragmentType,
      ownerId: user.emailHash,
      size: fragmentData.length,
      setData: jest.fn().mockResolvedValue(undefined),
    };

    jest.spyOn(Fragment.prototype, 'setData').mockImplementation(mockFragment.setData);

    const res = await request(app)
      .post('/fragments')
      .set('Authorization', `Basic ${Buffer.from(`${user.email}:password`).toString('base64')}`)
      .set('Content-Type', fragmentType)
      .send(fragmentData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', mockFragment.id);
    expect(res.body).toHaveProperty('created');
    expect(res.body.type).toBe(fragmentType);
    expect(res.body.ownerId).toBe(user.emailHash);
    expect(res.body.size).toBe(fragmentData.length);
    expect(res.headers).toHaveProperty('location');
  });

  it('should return 400 for unsupported content types', async () => {
    Fragment.isSupportedType.mockReturnValue(false);

    const res = await request(app)
      .post('/fragments')
      .set('Authorization', `Basic ${Buffer.from(`${user.email}:password`).toString('base64')}`)
      .set('Content-Type', 'application/unsupported')
      .send(fragmentData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid content type');
  });

  it('should return 400 for invalid body data', async () => {
    Fragment.isSupportedType.mockReturnValue(true);

    const res = await request(app)
      .post('/fragments')
      .set('Authorization', `Basic ${Buffer.from(`${user.email}:password`).toString('base64')}`)
      .set('Content-Type', fragmentType)
      .send('Invalid data'); // Send invalid (non-Buffer) data

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid body data');
  });

  it('should return 500 on server errors', async () => {
    Fragment.isSupportedType.mockReturnValue(true);

    const mockFragment = new Fragment({ ownerId: user.emailHash, type: fragmentType });
    jest.spyOn(mockFragment, 'setData').mockRejectedValue(new Error('Server error'));

    const res = await request(app)
      .post('/fragments')
      .set('Authorization', `Basic ${Buffer.from(`${user.email}:password`).toString('base64')}`)
      .set('Content-Type', fragmentType)
      .send(fragmentData);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});
