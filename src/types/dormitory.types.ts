import { dormitories } from "../db/schema";
import { Campus } from "./campus.types";
import { z } from 'zod';
import {
  dormitoryQuerySchema,
  dormitoryCreateSchema,
  dormitoryUpdateSchema
} from "../middlewares/validators/dormitory.validator";

/**
 * Dormitory entity data type with campus information
 */
export type Dormitory = typeof dormitories.$inferSelect & {
  campus: Campus; // Campus is required
};

/**
 * Export types inferred from Zod schemas
 */
export type DormitoryQueryParams = z.infer<typeof dormitoryQuerySchema>;
export type DormitoryCreateParams = z.infer<typeof dormitoryCreateSchema>;
export type DormitoryUpdateParams = z.infer<typeof dormitoryUpdateSchema>;
