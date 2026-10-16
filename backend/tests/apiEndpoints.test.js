import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('GuestVerify Backend API Endpoints', () => {
  const app = createApp();

  it('GET /health returns healthy status and active AI mode', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.aiMode).toBeTruthy();
  });

  it('POST /verify validates message and returns structured verdict', async () => {
    const res = await request(app)
      .post('/verify')
      .send({ message: 'Delivery for John from Amazon' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('verdict');
    expect(res.body).toHaveProperty('confidence');
    expect(res.body).toHaveProperty('action_taken');
    expect(res.body).toHaveProperty('reply_to_visitor');
    expect(res.body).toHaveProperty('conversationId');
    expect(res.body.aiMode).toBeTruthy();
  });

  it('POST /verify rejects invalid payloads with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/verify')
      .send({ message: 12345 }); // Invalid type for message

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request payload');
  });

  it('GET /logs returns recent logs and aggregated statistics', async () => {
    const res = await request(app).get('/logs?limit=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.logs)).toBe(true);
    expect(res.body.stats).toHaveProperty('total');
    expect(res.body.stats).toHaveProperty('authorized');
  });
});
