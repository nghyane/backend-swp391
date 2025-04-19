import { Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";

/**
 * Middleware kiểm tra tính hợp lệ của tham số query
 * @param queryParams - Mảng các tham số query cần kiểm tra
 * @returns Middleware để kiểm tra các tham số query
 */
export const validateQueryParams = (queryParams: {name: string, type: 'int' | 'string'}[]) => {
  const validators = queryParams.map(param => {
    if (param.type === 'int') {
      return query(param.name)
        .optional()
        .isInt({ min: 1 })
        .withMessage(`${param.name} must be a positive integer`);
    } else {
      return query(param.name)
        .optional()
        .isString()
        .withMessage(`${param.name} must be a string`);
    }
  });
  
  return [
    ...validators,
    (req: Request, res: Response, next: NextFunction): void => {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: errors.array()
        });
        return;
      }
      
      next();
    }
  ];
};
