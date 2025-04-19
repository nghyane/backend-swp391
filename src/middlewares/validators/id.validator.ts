import { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";

/**
 * Middleware kiểm tra tính hợp lệ của ID trong params
 * @param paramName - Tên tham số chứa ID (mặc định là "id")
 * @returns Middleware để kiểm tra ID
 */
export const validateIdParam = (paramName: string = "id") => {
  return [
    // Kiểm tra ID phải là số nguyên dương
    param(paramName)
      .isInt({ min: 1 })
      .withMessage(`${paramName} must be a positive integer`),
    
    // Middleware xử lý kết quả validation
    (req: Request, res: Response, next: NextFunction): void => {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Invalid data",
          errors: errors.array()
        });
        return;
      }
      
      // Chuyển đổi ID từ string sang number để sử dụng trong controller
      if (req.params[paramName]) {
        req.params[paramName] = parseInt(req.params[paramName]).toString();
      }
      
      next();
    }
  ];
};

