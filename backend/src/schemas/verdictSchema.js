import { z } from 'zod';

/**
 * Expected verdict values for GuestVerify decisions.
 */
export const VerdictEnum = z.enum(['AUTHORIZED', 'NEEDS_MORE_INFO', 'SUSPICIOUS']);

/**
 * Schema matching the required Claude tool call parameters for "submit_verdict".
 * Both mock AI and real Bedrock Claude must conform to this schema.
 */
export const VerdictOutputSchema = z.object({
  verdict: VerdictEnum,
  confidence: z.number().min(0).max(1),
  matched_delivery_id: z.string().nullable(),
  reasoning: z.string().min(1),
  reply_to_visitor: z.string().min(1),
  follow_up_question: z.string().nullable().optional(),
});
