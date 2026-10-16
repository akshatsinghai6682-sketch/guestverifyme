import { config } from '../../config.js';
import { evaluateWithMockAI } from './mockAI.js';

/**
 * Dispatches to the active AI provider based on AI_MODE.
 * Wraps call in a fail-safe try/catch so any provider failure is caught and handled safely.
 */
export async function evaluateVisitorStatement({ message, history = [] }) {
  const mode = (config.aiMode || 'mock').toLowerCase();

  try {
    if (mode === 'bedrock') {
      // Lazy import bedrockAI to avoid AWS SDK runtime initialization if in mock mode
      const { evaluateWithBedrockAI } = await import('./bedrockAI.js');
      return await evaluateWithBedrockAI({ message, history });
    }

    // Default to mock mode
    return await evaluateWithMockAI({ message, history });
  } catch (err) {
    console.error(`[AI Provider Error] Mode: ${mode}, error:`, err);
    // Return an invalid or error-flagged structure that will trigger Safety Rule 2 (fail-safe)
    return {
      verdict: 'NEEDS_MORE_INFO',
      confidence: 0.1,
      matched_delivery_id: null,
      reasoning: `AI provider error (${mode}): ${err.message}`,
      reply_to_visitor: 'Could you please repeat that? I am having trouble connecting.',
      follow_up_question: 'Could you please repeat your statement?',
    };
  }
}
