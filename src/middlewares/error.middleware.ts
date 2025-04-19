import { Request, Response, NextFunction } from "express";
import { isNotFoundError, isValidationError, isAuthorizationError } from "../utils/errors";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Xử lý NotFoundError
  if (isNotFoundError(err)) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }

  // Xử lý ValidationError
  if (isValidationError(err)) {
    return res.status(400).json({
      success: false,
      message: err.message,
      field: err.field
    });
  }

  // Xử lý AuthorizationError
  if (isAuthorizationError(err)) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  // Xử lý các lỗi khác
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  res.status(err.status || 500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message
  });
};