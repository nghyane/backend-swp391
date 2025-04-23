import { Request, Response, NextFunction } from "express";
import { isNotFoundError, isValidationError, isAuthorizationError } from "../utils/errors";
import { replyError } from "../utils/response";

// Removed createErrorResponse function as it's now part of utils/response.ts

/**
 * Centralized error handling middleware for the application
 * Automatically detects error types and returns appropriate responses
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // Log error for development
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  if (isNotFoundError(err)) {
    replyError(res, err.message, 404);
    return;
  }
  
  if (isValidationError(err)) {
    replyError(res, err.message, 400, err.field);
    return;
  }
  
  if (isAuthorizationError(err)) {
    replyError(res, err.message, 403);
    return;
  }

  // Handle other errors
  const anyError = err as any;
  const statusCode = anyError.status || anyError.statusCode || 500;
  const errorMessage = anyError.message || "Internal server error";
  
  replyError(
    res, 
    "Internal server error", 
    statusCode, 
    undefined, 
    errorMessage
  );
}