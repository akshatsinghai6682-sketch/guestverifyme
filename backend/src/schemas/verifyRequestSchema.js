import { z } from 'zod';

export const VerifyRequestSchema = z.object({
  message: z.string().default(''),
  conversationId: z.string().optional(),
});
