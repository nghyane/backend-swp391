import { z } from 'zod';
import { validateZod, commonQuerySchema } from "./zod.validator";

/**
 * Schema for Scholarship
 */
// Query schema
export const scholarshipQuerySchema = z.object({
  majorId: z.coerce.number().int().positive().optional(),
  campusId: z.coerce.number().int().positive().optional(),
  minAmount: z.coerce.number().int().min(0).optional()
}).strict().merge(commonQuerySchema);

// Create schema
export const scholarshipCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  condition: z.string().optional(),
  amount: z.coerce.number().int().min(0),
  majorId: z.number().int().positive(),
  campusId: z.number().int().positive(),
  applicationUrl: z.string().url().max(255).optional()
}).strict();

// Update schema
export const scholarshipUpdateSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().optional(),
  condition: z.string().optional(),
  amount: z.coerce.number().int().min(0).optional(),
  majorId: z.number().int().positive().optional(),
  campusId: z.number().int().positive().optional(),
  applicationUrl: z.string().url().max(255).optional()
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
