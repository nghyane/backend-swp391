/**
 * Auth Validator
 * Provides validation schemas for authentication requests
 */

import { z } from 'zod';
import { validateZod } from './zod.validator';
import { INTERNAL_USER_ROLES } from '@/db/schema';

// Export types inferred from schemas
export type LoginParams = z.infer<typeof loginSchema>;

/**
 * Schema for login request
 */
export const loginSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(6).max(64)
}).strict();

/**
 * Validators for Auth
 */
export const authValidators = {
  // Login validator
  login: validateZod(loginSchema, 'body')
};
