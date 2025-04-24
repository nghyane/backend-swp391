import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

/**
 * Schema for Campus
 */
// Query schema - Campus only needs basic query parameters
export const campusQuerySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional()
}).strict().merge(commonQuerySchema);

// Create schema
export const campusCreateSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().optional(),
  city: z.string().optional()
}).strict();

// Update schema
export const campusUpdateSchema = z.object({
  name: z.string().max(255).optional(),
  address: z.string().optional(),
  city: z.string().optional()
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
