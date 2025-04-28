import { Request, Response, NextFunction } from "express";

/**
 * Wrap all controller functions with automatic error handling
 * Use as a simple wrapper function
 *
 * @example
 * // Use as a function wrapper
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
