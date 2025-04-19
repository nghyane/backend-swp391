import { majors } from "../db/schema";
import { BaseFilterOptions } from "./common.types";

/**
 * Filter options for major entities
 */
export interface MajorFilterOptions extends BaseFilterOptions {
  code?: string;
  description?: string;
}

/**
 * Major entity data type
 */
export type Major = typeof majors.$inferSelect;
