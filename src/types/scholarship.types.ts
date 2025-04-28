import { scholarships } from "../db/schema";
import { z } from 'zod';
import {
  scholarshipQuerySchema,
  scholarshipCreateSchema,
  scholarshipUpdateSchema
} from "../middlewares/validators/scholarship.validator";

/**
 * Scholarship entity data type
 * Using type inference from Drizzle ORM schema
 */
export type Scholarship = typeof scholarships.$inferSelect;

/**
 * Export types inferred from Zod schemas
 */
export type ScholarshipQueryParams = z.infer<typeof scholarshipQuerySchema>;
export type ScholarshipCreateParams = z.infer<typeof scholarshipCreateSchema>;
export type ScholarshipUpdateParams = z.infer<typeof scholarshipUpdateSchema>;
