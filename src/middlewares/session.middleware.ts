import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers["x-session-id"]) {
    req.headers["x-session-id"] = uuidv4();
  }

  next();
};