import { z } from 'zod';
import { validateZod, commonQuerySchema } from "./zod.validator";

/**
 * Schema for Scholarship
 */
// Query schema
export const scholarshipQuerySchema = z.object({
  major_id: z.coerce.number().int().positive().optional(),
  major_code: z.string().optional(),
  campus_id: z.coerce.number().int().positive().optional(),
  campus_code: z.string().optional(),
}).strict().merge(commonQuerySchema);

// Create schema
export const scholarshipCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  condition: z.string().optional(),
  amount: z.coerce.number().int().min(0),
  major_id: z.number().int().positive(),
  campus_id: z.number().int().positive(),
  application_url: z.string().url().max(255).optional()
}).strict();

// Update schema
export const scholarshipUpdateSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().optional(),
  condition: z.string().optional(),
  amount: z.coerce.number().int().min(0).optional(),
  major_id: z.number().int().positive().optional(),
  campus_id: z.number().int().positive().optional(),
  application_url: z.string().url().max(255).optional()
}).strict();

/**
 * Validators for Scholarship
 */
export const scholarshipValidators = {
  // Query validator
  query: validateZod(scholarshipQuerySchema, 'query'),

  // Create validator
  create: validateZod(scholarshipCreateSchema, 'body'),

  // Update validator
  update: validateZod(scholarshipUpdateSchema, 'body')
};
