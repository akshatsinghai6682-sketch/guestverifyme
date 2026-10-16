import express from 'express';
import { getRecentLogs, getLogStats } from '../services/logService.js';

export const logsRouter = express.Router();

/**
 * GET /logs
 * Returns recent decision logs in reverse chronological order and aggregated statistics.
 */
logsRouter.get('/logs', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const logs = getRecentLogs(limit);
  const stats = getLogStats();

  res.json({
    logs,
    stats,
    count: logs.length,
  });
});
