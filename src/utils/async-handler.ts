import { Request, Response, NextFunction } from "express";

type AsyncControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Bọc một hàm controller để tự động xử lý lỗi mà không cần try-catch
 * 
 * @example
 * // Sử dụng trong controller
 * export const myController = {
 *   getItems: asyncHandler(async (req, res) => {
 *     const items = await itemService.getItems();
 *     res.json({ success: true, data: items });
 *   })
 * };
 * 
 * @param fn Hàm controller cần bọc
 * @returns Hàm wrapper đã xử lý lỗi
 */
export const asyncHandler = (fn: AsyncControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
