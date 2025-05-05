/**
 * Auth Validator
 * Provides validation schemas for authentication requests
 */

import { z } from 'zod';
import { validateZod } from './zod.validator';
import { INTERNAL_USER_ROLES } from '@/db/schema';

// Export types inferred from schemas
export type LoginParams = z.infer<typeof loginSchema>;
export type UserCreateParams = z.infer<typeof userCreateSchema>;
export type UserUpdateParams = z.infer<typeof userUpdateSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;

/**
 * Schema for login request
 */
export const loginSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(6).max(64)
}).strict();

/**
 * Schema for user creation
 */
export const userCreateSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(6).max(64),
  email: z.string().email().max(255),
  role: z.enum(INTERNAL_USER_ROLES as unknown as [string, ...string[]]),
  is_active: z.boolean().optional().default(true)
}).strict();

/**
 * Schema for user update
 */
export const userUpdateSchema = z.object({
  username: z.string().min(3).max(64).optional(),
  password: z.string().min(6).max(64).optional(),
  email: z.string().email().max(255).optional(),
  role: z.enum(INTERNAL_USER_ROLES as unknown as [string, ...string[]]).optional(),
  is_active: z.boolean().optional()
}).strict();

/**
 * Schema for user query parameters
 */
export const userQuerySchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  role: z.enum(INTERNAL_USER_ROLES as unknown as [string, ...string[]]).optional(),
  is_active: z.boolean().optional()
}).strict();

/**
 * Validators for Auth
 */
export const authValidators = {
  // Login validator
  login: validateZod(loginSchema, 'body'),

  // User validators
  createUser: validateZod(userCreateSchema, 'body'),
  updateUser: validateZod(userUpdateSchema, 'body'),
  queryUsers: validateZod(userQuerySchema, 'query')
};
