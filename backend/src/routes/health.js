import express from 'express';
import { config } from '../config.js';

export const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiMode: config.aiMode,
    modelId: config.aiMode === 'bedrock' ? config.aws.modelId : 'mock-engine',
  });
});
