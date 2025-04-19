import { Request, Response, NextFunction } from "express";
import { param, query, body, validationResult } from "express-validator";

/**
 * Middleware xử lý lỗi validation
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({
    success: false,
    message: "Invalid data",
    errors: errors.array()
  });
};

/**
 * Validator cho ID trong params
 * @param paramName Tên tham số (mặc định là 'id')
 */
export const validateId = (paramName: string = 'id') => [
  param(paramName).isInt({ min: 1 }).withMessage(`${paramName} must be a positive integer`),
  handleValidationErrors
];

/**
 * Validator cho các tham số query cơ bản
 */
export const validateCommonQueries = () => [
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  query("offset").optional().isInt({ min: 0 }).withMessage("Offset must be a non-negative integer"),
  query("name").optional().isString().withMessage("Name must be a string"),
  handleValidationErrors
];

/**
 * Validator cho các tham số query tùy chỉnh
 */
export const validateCustomQueries = (customValidators: any[]) => [
  ...customValidators,
  handleValidationErrors
];

/**
 * Validator cho dữ liệu trong body
 */
export const validateBody = (bodyValidators: any[]) => [
  ...bodyValidators,
  handleValidationErrors
];
