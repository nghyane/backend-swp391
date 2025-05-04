import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

// Export types inferred from schemas
export type MajorCampusQueryParams = z.infer<typeof majorCampusQuerySchema>;
export type MajorCampusAddParams = z.infer<typeof majorCampusAddSchema>;
export type MajorCampusUpdateParams = z.infer<typeof majorCampusUpdateSchema>;

/**
 * Schema for Major-Campus Admission
 */
// Query schema
export const majorCampusQuerySchema = z.object({
  academic_year: z.coerce.number().int().min(2000).max(2100).optional()
}).strict().merge(commonQuerySchema);

// Add schema
export const majorCampusAddSchema = z.object({
  campus_id: z.number().int().positive(),
  academic_year: z.number().int().min(2000).max(2100),
  quota: z.number().int().positive().optional(),
  tuition_fee: z.number().int().min(0).optional()
}).strict();

// Update schema
export const majorCampusUpdateSchema = z.object({
  quota: z.number().int().positive().optional(),
  tuition_fee: z.number().int().min(0).optional()
}).strict();

// Params schema
export const majorCampusParamsSchema = z.object({
  major_id: z.coerce.number().int().positive(),
  campus_id: z.coerce.number().int().positive(),
  academic_year: z.coerce.number().int().min(2000).max(2100)
}).strict();

/**
 * Validators for Major-Campus Admission
 */
export const majorCampusValidators = {
  // Query validator
  query: validateZod(majorCampusQuerySchema, 'query'),

  // Add validator
  add: validateZod(majorCampusAddSchema, 'body'),

  // Update validator
  update: validateZod(majorCampusUpdateSchema, 'body'),

  // Params validator
  params: validateZod(majorCampusParamsSchema, 'params')
};
