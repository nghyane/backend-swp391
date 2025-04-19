import { Request, Response, NextFunction } from "express";

type AsyncControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Bọc một hàm controller để tự động xử lý lỗi mà không cần try-catch
 * 
 * @example
 * // Định nghĩa hàm controller
 * const getItems = async (req: Request, res: Response): Promise<void> => {
 *   const items = await itemService.getItems();
 *   res.status(200).json({
 *     success: true,
 *     data: items,
 *     count: items.length
 *   });
 * };
 * 
 * // Export controller sử dụng asyncHandler
 * export const itemController = {
 *   getItems: asyncHandler(getItems)
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
