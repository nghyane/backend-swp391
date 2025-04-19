import { Request, Response, NextFunction } from "express";

type AsyncControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Bọc một hàm controller để tự động xử lý lỗi mà không cần try-catch
 * 
 * @example
 * // Định nghĩa hàm controller với asyncHandler
 * export const getItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
 *   const items = await itemService.getItems();
 *   res.status(200).json({
 *     success: true,
 *     data: items,
 *     count: items.length
 *   });
 * });
 * 
 * // Hoặc với hàm đã định nghĩa trước
 * const findItemById = async (req: Request, res: Response): Promise<void> => {
 *   const item = await itemService.findById(req.params.id);
 *   res.status(200).json({ success: true, data: item });
 * };
 * export const getItemById = asyncHandler(findItemById);
 * 
 * @param fn Hàm controller cần bọc
 * @returns Hàm wrapper đã xử lý lỗi
 */
export const asyncHandler = (fn: AsyncControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
