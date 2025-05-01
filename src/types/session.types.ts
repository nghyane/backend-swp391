/**
 * Session Types
 * Type definitions for session functionality
 */

import { sessions } from "@db/schema";
import { z } from 'zod';
import { sessionQuerySchema } from "@middlewares/validators/session.validator";

/**
 * Session entity data type
 * Using type inference from Drizzle ORM schema
 */
export type Session = typeof sessions.$inferSelect;

/**
 * Export types inferred from Zod schemas
 */
export type SessionQueryParams = z.infer<typeof sessionQuerySchema>;
