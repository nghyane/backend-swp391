/**
 * Common types used across the application
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Error response structure
 */
export type ErrorResponse = {
  readonly success: boolean;
  readonly message: string;
  readonly field?: string;
  readonly error?: string;
};

/**
 * Pagination options for list endpoints
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Base filter options that can be extended by entity-specific filters
 */
export interface BaseFilterOptions {
  name?: string;
  [key: string]: any;
}

/**
 * Type for ID parameters
 */
export type IdParam = number | string;

/**
 * Type for date range filter
 */
export interface DateRangeFilter {
  startDate?: Date | string;
  endDate?: Date | string;
}
