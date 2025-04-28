import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

/**
 * Schema for Dormitory
 */
// Query schema
export const dormitoryQuerySchema = z.object({
  campus_id: z.coerce.number().int().positive().optional(),
  campus_code: z.string().optional(),
}).strict().merge(commonQuerySchema);

// Create schema
export const dormitoryCreateSchema = z.object({
  name: z.string().min(1).max(255),
  campus_id: z.number().int().positive(),
  description: z.string().optional(),
  capacity: z.number().int().positive().optional(),
}).strict();

// Update schema
export const dormitoryUpdateSchema = z.object({
  name: z.string().max(255).optional(),
  campus_id: z.number().int().positive().optional(),
  description: z.string().optional(),
  capacity: z.number().int().positive().optional(),
}).strict();

/**
 * Validators for Dormitory
 */
export const dormitoryValidators = {
  // Query validator
  query: validateZod(dormitoryQuerySchema, 'query'),

  // Create validator
  create: validateZod(dormitoryCreateSchema, 'body'),

  // Update validator
  update: validateZod(dormitoryUpdateSchema, 'body')
};
