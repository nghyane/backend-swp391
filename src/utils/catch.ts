import { Request, Response, NextFunction } from "express";

/**
 * Bọc tất cả các hàm controller với xử lý lỗi tự động
 * Sử dụng như một wrapper function đơn giản
 * 
 * @example
 * // Sử dụng như một function wrapper
 * export const getUsers = catch$(async (req, res) => {
 *   const users = await userService.getAll();
 *   res.json(users);
 * });
 */
export const catch$ = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
