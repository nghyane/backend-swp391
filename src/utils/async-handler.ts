import { Request, Response, NextFunction } from "express";

type AsyncControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Bọc một hàm controller để tự động xử lý lỗi
 */
export const asyncHandler = (fn: AsyncControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
