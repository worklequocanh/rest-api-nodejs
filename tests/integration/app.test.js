const request = require('supertest');
const app = require('../../src/app');

describe('App General', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 200 for root route', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
