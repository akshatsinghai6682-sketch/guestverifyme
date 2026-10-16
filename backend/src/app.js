import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { verifyRouter } from './routes/verify.js';
import { logsRouter } from './routes/logs.js';

export function createApp() {
  const app = express();

  // Standard middleware
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));

  // Routes
  app.use('/', healthRouter);
  app.use('/', verifyRouter);
  app.use('/', logsRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
