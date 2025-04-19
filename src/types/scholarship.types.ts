import { scholarships } from "../db/schema";
import { BaseFilterOptions } from "./common.types";

/**
 * Scholarship entity data type
 */
export type Scholarship = typeof scholarships.$inferSelect;

/**
 * Filter options for scholarship entities
 */
export interface ScholarshipFilterOptions extends BaseFilterOptions {
  majorId?: number;
  campusId?: number;
  minAmount?: number;
}
