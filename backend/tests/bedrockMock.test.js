import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the BedrockRuntimeClient
vi.mock('@aws-sdk/client-bedrock-runtime', () => {
  return {
    BedrockRuntimeClient: class {
      send(command) {
        return Promise.resolve({
          output: {
            message: {
              role: 'assistant',
              content: [
                {
                  toolUse: {
                    toolUseId: 'tooluse-12345',
                    name: 'submit_verdict',
                    input: {
                      verdict: 'AUTHORIZED',
                      confidence: 0.94,
                      matched_delivery_id: 'del-001',
                      reasoning: 'Verified Amazon delivery for John Smith in active window.',
                      reply_to_visitor: 'Thanks! Please leave the package by the door.',
                      follow_up_question: null,
                    },
                  },
                },
              ],
            },
          },
        });
      }
    },
    ConverseCommand: class {
      constructor(params) {
        this.params = params;
      }
    },
  };
});

describe('Bedrock Converse Tool-Use AI Provider', () => {
  it('invokes Bedrock Converse API with submit_verdict tool and parses output', async () => {
    const { evaluateWithBedrockAI } = await import('../src/services/ai/bedrockAI.js');

    const result = await evaluateWithBedrockAI({
      message: 'Delivery for John from Amazon',
      history: [],
    });

    expect(result.verdict).toBe('AUTHORIZED');
    expect(result.confidence).toBe(0.94);
    expect(result.matched_delivery_id).toBe('del-001');
    expect(result.reply_to_visitor).toContain('leave the package by the door');
  });
});
