import crypto from 'crypto';

// In-memory conversation store with TTL cleanup
const sessions = new Map();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get an existing conversation or create a new session.
 */
export function getOrCreateSession(conversationId) {
  cleanExpiredSessions();

  if (conversationId && sessions.has(conversationId)) {
    const session = sessions.get(conversationId);
    session.updatedAt = Date.now();
    return session;
  }

  const id = conversationId || crypto.randomUUID();
  const session = {
    id,
    rounds: 0, // Number of follow-up evaluations performed
    status: 'ACTIVE', // 'ACTIVE' | 'RESOLVED'
    history: [], // [{ role: 'visitor' | 'doorbell', message, timestamp, verdict }]
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  sessions.set(id, session);
  return session;
}

/**
 * Record a turn in the conversation.
 */
export function recordTurn(conversationId, { visitorMessage, aiResult, finalResult }) {
  const session = sessions.get(conversationId);
  if (!session) return;

  session.history.push({
    turn: session.rounds,
    visitorMessage,
    verdict: finalResult.verdict,
    reply: finalResult.reply_to_visitor,
    followUp: finalResult.follow_up_question || null,
    timestamp: new Date().toISOString(),
  });

  if (finalResult.verdict === 'NEEDS_MORE_INFO') {
    session.rounds += 1;
  } else {
    // AUTHORIZED or SUSPICIOUS completes the verification cycle
    session.status = 'RESOLVED';
  }

  session.updatedAt = Date.now();
}

/**
 * Reset or remove a conversation session.
 */
export function clearSession(conversationId) {
  sessions.delete(conversationId);
}

/**
 * Background TTL cleanup for dormant sessions.
 */
function cleanExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.updatedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}
