import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3002', 10),
  aiMode: (process.env.AI_MODE || 'mock').toLowerCase(),
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    sessionToken: process.env.AWS_SESSION_TOKEN || '',
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
  },
  paths: {
    deliveriesJson: path.resolve(__dirname, '../data/deliveries.json'),
    decisionsLog: path.resolve(__dirname, '../logs/decisions.jsonl'),
  },
};
