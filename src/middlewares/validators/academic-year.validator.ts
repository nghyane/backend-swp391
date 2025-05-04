/**
 * Academic Year Validators
 * Provides validation schemas for academic year operations
 */

import { z } from 'zod';
import { validateZod } from './zod.validator';

// Schema for academic year query parameters
export const academicYearQuerySchema = z.object({
  // No specific query parameters needed for now
}).strict().optional();

// Schema for creating a new academic year
export const academicYearCreateSchema = z.object({
  year: z.number().int().min(2000).max(2100)
    .describe('Năm học (ví dụ: 2024 cho năm học 2024-2025)')
}).strict();

// Export type for query parameters
export type AcademicYearQueryParams = z.infer<typeof academicYearQuerySchema>;

// Export type for create parameters
export type AcademicYearCreateParams = z.infer<typeof academicYearCreateSchema>;

// Export validators for use in routes
export const academicYearValidators = {
  query: validateZod(academicYearQuerySchema, 'query'),
  create: validateZod(academicYearCreateSchema, 'body')
};
