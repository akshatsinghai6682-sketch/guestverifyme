import express from 'express';
import rateLimit from 'express-rate-limit';
import { VerifyRequestSchema } from '../schemas/verifyRequestSchema.js';
import { getOrCreateSession, recordTurn } from '../services/conversationStore.js';
import { evaluateVisitorStatement } from '../services/ai/index.js';
import { enforceSafetyRules, sanitizeVisitorMessage } from '../services/decisionValidator.js';
import { appendDecisionLog } from '../services/logService.js';
import { config } from '../config.js';

export const verifyRouter = express.Router();

// Basic rate limiting: 30 verification requests per minute per IP
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'Too many doorbell verification attempts from this IP. Please wait a moment.',
    action_taken: 'RATE_LIMIT_COOLDOWN',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

verifyRouter.post('/verify', verifyLimiter, async (req, res) => {
  try {
    const parseResult = VerifyRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request payload',
        details: parseResult.error.issues,
      });
    }

    const rawMessage = parseResult.data.message || parseResult.data.statement || '';
    const conversationId = parseResult.data.conversationId || undefined;
    const cleanMessage = sanitizeVisitorMessage(rawMessage);

    // Get or initialize conversation session
    const session = getOrCreateSession(conversationId);

    // Call active AI engine (mock or bedrock)
    const rawAIResult = await evaluateVisitorStatement({
      message: cleanMessage,
      history: session.history,
    });

    // Enforce server-side defense-in-depth safety rules
    const finalResult = enforceSafetyRules({
      rawAIResult,
      currentRound: session.rounds,
      currentTime: new Date(),
      visitorMessage: cleanMessage,
    });

    // Record turn in session
    recordTurn(session.id, {
      visitorMessage: cleanMessage,
      aiResult: rawAIResult,
      finalResult,
    });

    // Append decision to logs/decisions.jsonl (Never log secrets!)
    const logRecord = appendDecisionLog({
      conversationId: session.id,
      round: session.rounds,
      visitorMessage: cleanMessage,
      verdict: finalResult.verdict,
      confidence: finalResult.confidence,
      matchedDelivery: finalResult.matched_delivery_id,
      actionTaken: finalResult.action_taken,
      reasoning: finalResult.reasoning,
    });

    return res.json({
      conversationId: session.id,
      round: session.rounds,
      status: session.status,
      verdict: finalResult.verdict,
      confidence: finalResult.confidence,
      matched_delivery_id: finalResult.matched_delivery_id,
      reasoning: finalResult.reasoning,
      reply_to_visitor: finalResult.reply_to_visitor,
      follow_up_question: finalResult.follow_up_question,
      action_taken: finalResult.action_taken,
      safety_interventions: finalResult.safety_interventions,
      aiMode: config.aiMode,
      timestamp: logRecord ? logRecord.timestamp : new Date().toISOString(),
    });
  } catch (err) {
    console.error('[POST /verify] Unexpected error:', err);
    // Even on server exception, fail safe: return NEEDS_MORE_INFO, never AUTHORIZED
    return res.status(500).json({
      verdict: 'NEEDS_MORE_INFO',
      confidence: 0.1,
      matched_delivery_id: null,
      reasoning: 'Internal server error during verification. Fail-safe initiated.',
      reply_to_visitor: 'Could you please wait a moment and try ringing again?',
      action_taken: 'AWAITING_VISITOR_RESPONSE',
      aiMode: config.aiMode,
      timestamp: new Date().toISOString(),
    });
  }
});
