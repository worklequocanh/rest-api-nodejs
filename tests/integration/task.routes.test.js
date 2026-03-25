const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const jwt = require('jsonwebtoken');

jest.mock('../../src/config/database');

process.env.JWT_SECRET = 'test-secret';

describe('Task Routes', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'user@example.com' }, 'test-secret');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });

    it('should return list of tasks with valid token', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Task 1' }] }); // findAll
      db.query.mockResolvedValueOnce({ rows: [{ count: '1' }] }); // total count

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task with valid data', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'New Task' }] });

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('New Task');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 404 if task not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app)
        .get('/api/tasks/99')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should return 404 if updating non-existent task', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app)
        .put('/api/tasks/99')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 404 if deleting non-existent task', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });
      const res = await request(app)
        .delete('/api/tasks/99')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
