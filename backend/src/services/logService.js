import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config.js';

/**
 * Ensures the target log file and parent directory exist.
 */
function ensureLogFile() {
  const logPath = config.paths.decisionsLog;
  const dir = path.dirname(logPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, '', 'utf-8');
  }
}

/**
 * Appends a decision record to logs/decisions.jsonl.
 * SAFETY RULE: Never log secrets, AWS keys, or credentials.
 */
export function appendDecisionLog({
  conversationId,
  round = 0,
  visitorMessage = '',
  verdict,
  confidence = 0,
  matchedDelivery = null,
  actionTaken,
  reasoning = '',
}) {
  try {
    ensureLogFile();

    const record = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      conversationId: conversationId || null,
      round,
      visitorMessage: (visitorMessage || '').trim().slice(0, 300),
      verdict,
      confidence: Number(confidence.toFixed(2)),
      matchedDelivery: matchedDelivery || null,
      actionTaken,
      reasoning: (reasoning || '').slice(0, 300),
    };

    const line = JSON.stringify(record) + '\n';
    fs.appendFileSync(config.paths.decisionsLog, line, 'utf-8');
    return record;
  } catch (err) {
    console.error('[logService] Failed to append decision log:', err.message);
    return null;
  }
}

/**
 * Reads recent decision logs from logs/decisions.jsonl (newest first).
 */
export function getRecentLogs(limit = 50) {
  try {
    ensureLogFile();
    const raw = fs.readFileSync(config.paths.decisionsLog, 'utf-8');
    const lines = raw.trim().split('\n').filter(Boolean);

    const parsed = [];
    for (let i = lines.length - 1; i >= 0 && parsed.length < limit; i--) {
      try {
        parsed.push(JSON.parse(lines[i]));
      } catch (parseErr) {
        // Skip malformed lines
      }
    }

    return parsed;
  } catch (err) {
    console.error('[logService] Failed to read decisions.jsonl:', err.message);
    return [];
  }
}

/**
 * Aggregates summary statistics from all recorded decisions.
 */
export function getLogStats() {
  try {
    ensureLogFile();
    const raw = fs.readFileSync(config.paths.decisionsLog, 'utf-8');
    const lines = raw.trim().split('\n').filter(Boolean);

    let total = 0;
    let authorized = 0;
    let needsInfo = 0;
    let suspicious = 0;

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        total += 1;
        if (item.verdict === 'AUTHORIZED') authorized += 1;
        else if (item.verdict === 'NEEDS_MORE_INFO') needsInfo += 1;
        else if (item.verdict === 'SUSPICIOUS') suspicious += 1;
      } catch (err) {
        // Skip
      }
    }

    return { total, authorized, needsInfo, suspicious };
  } catch (err) {
    return { total: 0, authorized: 0, needsInfo: 0, suspicious: 0 };
  }
}
