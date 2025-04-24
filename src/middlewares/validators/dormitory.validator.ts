import { z } from 'zod';
import { validateZod, commonQuerySchema } from './zod.validator';

/**
 * Schema for Dormitory
 */
// Query schema
export const dormitoryQuerySchema = z.object({
  campusId: z.coerce.number().int().positive().optional(),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional()
}).strict().merge(commonQuerySchema)
.refine(
  (data) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
      return data.priceMax >= data.priceMin;
    }
    return true;
  },
  {
    message: "Maximum price must be greater than or equal to minimum price",
    path: ["priceMax"]
  }
);

// Create schema
export const dormitoryCreateSchema = z.object({
  name: z.string().min(1).max(255),
  campusId: z.number().int().positive(),
  description: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  pricePerMonth: z.number().int().min(0).optional()
}).strict();

// Update schema
export const dormitoryUpdateSchema = z.object({
  name: z.string().max(255).optional(),
  campusId: z.number().int().positive().optional(),
  description: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  pricePerMonth: z.number().int().min(0).optional()
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
