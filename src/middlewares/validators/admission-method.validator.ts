import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

// Export types inferred from schemas
export type AdmissionMethodQueryParams = z.infer<typeof admissionMethodQuerySchema>;
export type AdmissionMethodCreateParams = z.infer<typeof admissionMethodCreateSchema>;
export type AdmissionMethodUpdateParams = z.infer<typeof admissionMethodUpdateSchema>;
export type AdmissionMethodAssociateParams = z.infer<typeof admissionMethodAssociateSchema>;
export type AdmissionMethodGlobalAppParams = z.infer<typeof admissionMethodGlobalAppSchema>;

/**
 * Schema for Admission Method
 */
// Query schema
export const admissionMethodQuerySchema = z.object({
  major_id: z.coerce.number().int().positive().optional(),
  academic_year: z.coerce.number().int().min(2000).max(2100).optional(),
  is_active: z.coerce.boolean().optional()
}).strict().merge(commonQuerySchema);

// Create schema
export const admissionMethodCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  applicationUrl: z.string().url().max(255).optional()
}).strict();

// Update schema
export const admissionMethodUpdateSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().optional(),
  applicationUrl: z.string().url().max(255).optional()
}).strict();

// Schema for Major association
export const admissionMethodAssociateSchema = z.object({
  admissionMethodId: z.number().int().positive(),
  majorId: z.number().int().positive(),
  academicYearId: z.number().int().positive(),
  campusId: z.number().int().positive().optional(),
  minScore: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
}).strict();

// Schema for Global Application
export const admissionMethodGlobalAppSchema = z.object({
  admissionMethodId: z.number().int().positive(),
  academicYearId: z.number().int().positive(),
  campusId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  note: z.string().optional()
}).strict();

/**
 * Validators for Admission Method
 */
export const admissionMethodValidators = {
  // Query validator
  query: validateZod(admissionMethodQuerySchema, 'query'),
  
  // Create validator
  create: validateZod(admissionMethodCreateSchema, 'body'),
  
  // Update validator
  update: validateZod(admissionMethodUpdateSchema, 'body'),
  
  // Major association validator
  associateMajor: validateZod(admissionMethodAssociateSchema, 'body'),
  
  // Global Application validator
  globalApplication: validateZod(admissionMethodGlobalAppSchema, 'body')
};
