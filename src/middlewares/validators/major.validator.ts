import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

// Export types inferred from schemas
export type MajorQueryParams = z.infer<typeof majorQuerySchema>;
export type MajorCreateParams = z.infer<typeof majorCreateSchema>;
export type MajorUpdateParams = z.infer<typeof majorUpdateSchema>;
export type MajorLinkParams = z.infer<typeof majorLinkSchema>;

/**
 * Schema for Major
 */
// Query schema
export const majorQuerySchema = z.object({
  academicYear: z.coerce.number().int().min(2000).max(2100).optional(),
  campusId: z.coerce.number().int().positive().optional(),
  code: z.string().optional()
}).strict().merge(commonQuerySchema);

// Create schema
export const majorCreateSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional()
}).strict();

// Update schema
export const majorUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
}).strict();

// Schema for major-campus link
export const majorLinkSchema = z.object({
  majorId: z.number().int().positive(),
  campusId: z.number().int().positive(),
  academicYear: z.number().int().min(2000).max(2100),
  quota: z.number().int().positive().optional(),
  tuitionFee: z.number().int().min(0).optional()
}).strict();

/**
 * Validators for Major
 */
export const majorValidators = {
  // Query validator
  query: validateZod(majorQuerySchema, 'query'),
  
  // Create validator
  create: validateZod(majorCreateSchema, 'body'),
  
  // Update validator
  update: validateZod(majorUpdateSchema, 'body'),
  
  // Link validator
  link: validateZod(majorLinkSchema, 'body')
};
