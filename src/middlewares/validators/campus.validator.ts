import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

// Contact schema for campus
const contactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional()
}).strict();

/**
 * Schema for Campus
 */
// Query schema - Campus only needs basic query parameters
export const campusQuerySchema = z.object({
  name: z.string().optional(),
  campus_code: z.string().optional(),
  address: z.string().optional()
}).strict().merge(commonQuerySchema);

// Create schema
export const campusCreateSchema = z.object({
  code: z.string().min(1).max(10),
  name: z.string().min(1).max(255),
  address: z.string().optional(),
  contact: contactSchema.optional().or(z.string())
}).strict();

// Update schema
export const campusUpdateSchema = z.object({
  code: z.string().max(10).optional(),
  name: z.string().max(255).optional(),
  address: z.string().optional(),
  contact: contactSchema.optional().or(z.string())
}).strict();

/**
 * Validators for Campus
 */
export const campusValidators = {
  // Query validator
  query: validateZod(campusQuerySchema, 'query'),

  // Create validator
  create: validateZod(campusCreateSchema, 'body'),

  // Update validator
  update: validateZod(campusUpdateSchema, 'body')
};
