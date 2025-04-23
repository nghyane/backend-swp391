import { PaginatedResponse } from '../types/common.types';

/**
 * Create a paginated result from an array of items
 * @param items Array of items to paginate
 * @param page Current page number
 * @param limit Items per page
 * @param sortOptions Optional sorting configuration
 * @returns Paginated result
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 10,
  sortOptions?: {
    sortBy: keyof T;
    order: 'asc' | 'desc';
  }
): PaginatedResponse<T> {
  // Apply sorting if requested
  if (sortOptions) {
    const { sortBy, order } = sortOptions;
    
    items = [...items].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return order === 'asc' ? -1 : 1;
      if (bValue == null) return order === 'asc' ? 1 : -1;
      
      // Compare non-null values
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  // Calculate pagination
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);
  
  // Return paginated result
  return {
    items: paginatedItems,
    total,
    page,
    limit,
    totalPages
  };
}
