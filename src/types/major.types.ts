import { majors } from "../db/schema";

/**
 * Interface for major filter options
 */
export interface MajorFilterOptions {
  name?: string;
  code?: string;
  description?: string;
}

/**
 * Type for major data
 */
export type Major = typeof majors.$inferSelect;
