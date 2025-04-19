import { scholarships } from "../db/schema";

/**
 * Type for scholarship data
 */
export type Scholarship = typeof scholarships.$inferSelect;

/**
 * Interface for scholarship filter options
 */
export interface ScholarshipFilterOptions {
  name?: string;
  majorId?: number;
  campusId?: number;
  minAmount?: number;
}
