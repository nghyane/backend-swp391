import { majors } from "../db/schema";

/**
 * Major entity data type - using type inference from Drizzle ORM schema
 */
export type Major = typeof majors.$inferSelect;

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
  items: Major[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Note: MajorFilterOptions has been replaced by MajorQueryParams from Zod schema
