/**
 * Session Validator
 * Provides validation schemas for session requests
 */

import { z } from 'zod';
import { validateZod, commonQuerySchema } from '@middlewares/validators/zod.validator';

// Export types inferred from schemas
export type SessionQueryParams = z.infer<typeof sessionQuerySchema>;

/**
 * Schema for Session
 */
// Query schema
export const sessionQuerySchema = z.object({
  platform: z.string().optional(),
  anonymous: z.coerce.boolean().optional(),
  hubspot_contact_id: z.string().optional(),
}).strict().merge(commonQuerySchema);

// Session ID param schema
export const sessionIdParamSchema = z.object({
  id: z.string().min(1, 'Session ID không được để trống')
}).strict();

/**
 * Validators for Session
 */
export const sessionValidators = {
  // Query validator
  query: validateZod(sessionQuerySchema, 'query'),

  // Session ID validator
  sessionId: validateZod(sessionIdParamSchema, 'params')
};
