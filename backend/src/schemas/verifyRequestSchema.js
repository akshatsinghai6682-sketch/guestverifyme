import { z } from 'zod';

/**
 * Schema for POST /verify request payload.
 * Accepts both `message` and `statement` field names for seamless compatibility.
 * Allows `conversationId` to be null, undefined, or string.
 */
export const VerifyRequestSchema = z.object({
  message: z.string().nullish().default(''),
  statement: z.string().nullish(),
  conversationId: z.string().nullish(),
});
