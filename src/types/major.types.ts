import { majors } from "../db/schema";
import { BaseFilterOptions } from "./common.types";

/**
 * Filter options for major entities
 */
export interface MajorFilterOptions extends BaseFilterOptions {
  code?: string;
  description?: string;
  name?: string;
}

/**
 * Pagination and sorting options
 */
export interface MajorQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof typeof majors.$inferSelect;
  order?: 'asc' | 'desc';
}

/**
 * Paginated result for majors
 */
export interface PaginatedMajorResult {
  items: typeof majors.$inferSelect[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Major entity data type
 */
export type Major = typeof majors.$inferSelect;
