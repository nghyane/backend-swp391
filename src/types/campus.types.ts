import { campuses } from "../db/schema";
import { z } from 'zod';
import {
  campusQuerySchema,
  campusCreateSchema,
  campusUpdateSchema
} from "../middlewares/validators/campus.validator";

/**
 * Campus entity data type
 * Sử dụng type inference từ Drizzle ORM schema
 */
export type Campus = typeof campuses.$inferSelect;

/**
 * Export types inferred from Zod schemas
 */
export type CampusQueryParams = z.infer<typeof campusQuerySchema>;
export type CampusCreateParams = z.infer<typeof campusCreateSchema>;
export type CampusUpdateParams = z.infer<typeof campusUpdateSchema>;
