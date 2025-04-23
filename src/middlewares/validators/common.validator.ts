import { Request, Response, NextFunction } from "express";
import { param, query, body, validationResult } from "express-validator";
import { replyError } from "../../utils/response";

/**
 * Middleware for handling validation errors
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Get all errors
  const errorArray = errors.array();
  const firstError = errorArray[0];
  
  // Build a meaningful error message
  let field = '';
  let message = 'Validation error';
  
  // Handle different versions of express-validator
  if ('param' in firstError) {
    field = firstError.param as string;
  } else if ('path' in firstError) {
    field = firstError.path as string;
  }
  
  if (firstError.msg) {
    message = `Validation error: ${firstError.msg}`;
  }
  
  // Include all validation errors in the error details
  const errorDetails = JSON.stringify(errors.array());
  
  replyError(res, message, 400, field, errorDetails);
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
 * Validator for common query parameters including pagination
 */
export const validateCommonQueries = (options?: {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}) => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100
  } = options || {};

  return [
    // Pagination parameters
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt()
      .customSanitizer(value => value || defaultPage),

    query("limit")
      .optional()
      .isInt({ min: 1, max: maxLimit })
      .withMessage(`Limit must be between 1 and ${maxLimit}`)
      .toInt()
      .customSanitizer(value => value || defaultLimit),

    // No offset - using page/limit pattern only

    // Common filter parameters
    query("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .trim(),

    // Sorting parameters
    query("sortBy")
      .optional()
      .isString()
      .withMessage("sortBy must be a string")
      .trim(),

    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("order must be 'asc' or 'desc'")
      .trim(),

    handleValidationErrors
  ];
};

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
