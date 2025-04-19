import { Request, Response, NextFunction } from "express";
import { isNotFoundError, isValidationError, isAuthorizationError } from "../utils/errors";
import { ErrorResponse } from "../types/common.types";

/**
 * Creates a standardized error response
 */
function createErrorResponse(message: string, field?: string, error?: string): ErrorResponse {
  return {
    success: false,
    message,
    ...(field && { field }),
    ...(error && process.env.NODE_ENV !== "production" && { error })
  };
}

/**
 * Centralized error handling middleware for the application
 * Automatically detects error types and returns appropriate responses
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // Log error for development
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  if (isNotFoundError(err)) {
    res.status(404).json(createErrorResponse(err.message));
    return;
  }
  if (isValidationError(err)) {
    res.status(400).json(createErrorResponse(err.message, err.field));
    return;
  }
  if (isAuthorizationError(err)) {
    res.status(403).json(createErrorResponse(err.message));
    return;
  }

  // Handle other errors
  const anyError = err as any;
  const statusCode = anyError.status || anyError.statusCode || 500;
  const errorMessage = anyError.message || "Internal server error";
  res.status(statusCode).json(createErrorResponse("Internal server error", undefined, errorMessage));
}