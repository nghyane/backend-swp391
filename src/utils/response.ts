import { Response } from 'express';
import { ApiResponse, PaginatedResponse, ErrorResponse } from '../types/common.types';

/**
 * Send a standardized API response
 * @param res Express response object
 * @param data Response data
 * @param message Response message
 * @param status HTTP status code
 */
export const reply = <T>(
  res: Response, 
  data: T, 
  message = 'ok', 
  status = 200
): Response => {
  const response: ApiResponse<T> = {
    data,
    message,
    success: status < 300,
    timestamp: new Date().toISOString()
  };
  
  return res.status(status).json(response);
};

/**
 * Send a standardized error response
 * @param res Express response object
 * @param message Error message
 * @param status HTTP status code
 * @param field Optional field name that caused the error
 * @param error Optional detailed error information (only included in non-production)
 */
export const replyError = (
  res: Response,
  message: string,
  status = 400,
  field?: string,
  error?: string
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(field && { field }),
    ...(error && process.env.NODE_ENV !== 'production' && { error })
  };
  
  return res.status(status).json(response);
};

/**
 * Send a standardized paginated API response
 * @param res Express response object
 * @param items Array of items for the current page
 * @param total Total number of items across all pages
 * @param page Current page number
 * @param limit Items per page
 * @param message Response message
 */
export const replyPaginated = <T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message = 'ok'
): Response => {
  const paginatedData: PaginatedResponse<T> = {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
  
  return reply(res, paginatedData, message);
};
