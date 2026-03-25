const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../../src/config/database');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 201 on successful registration', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // findByEmail
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, name: 'Test', email: 'test@example.com' }] 
      }); // create

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 on invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and token on success', async () => {
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, email: 't@e.com', password_hash: 'hashed' }] 
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 't@e.com', password: 'p' });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBe('token');
    });

    it('should return 401 on invalid credentials', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'no@e.com', password: 'p' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return profile with valid token', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'X' }] });
      jwt.verify.mockReturnValue({ id: 1, email: 't@e.com' });
      
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer fake-token');
      expect(res.status).toBe(200);
    });
  });
});
