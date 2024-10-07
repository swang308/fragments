const request = require('supertest');
const app = require('../../src/app'); // Your Express app
const Fragment = require('../../src/model/fragment');
const hash = require('../../src/hash'); // For hashing the email

jest.mock('../../src/model/fragment');
jest.mock('../../src/hash');

describe('POST /fragments', () => {
  const fragmentData = Buffer.from('Hello World');
  const fragmentType = 'text/plain';
  const user = { email: 'test@example.com', emailHash: 'hashed-email' };

  beforeEach(() => {
    hash.mockReturnValue(user.emailHash);
  });

  it('should create a plain text fragment for authenticated users', async () => {
    Fragment.isSupportedType.mockReturnValue(true);
    Fragment.mockImplementation(() => ({
      save: jest.fn(),
      id: 'abc123',
      created: new Date(),
      type: fragmentType,
      ownerId: user.emailHash,
      size: fragmentData.length,
    }));

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData)
      .auth(user.email, 'password');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
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
      .set('Content-Type', 'application/unsupported')
      .send(fragmentData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid body data');
  });

  it('should return 500 on server errors', async () => {
    Fragment.isSupportedType.mockReturnValue(true);
    Fragment.mockImplementation(() => {
      throw new Error('Server error');
    });

    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', fragmentType)
      .send(fragmentData);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});
