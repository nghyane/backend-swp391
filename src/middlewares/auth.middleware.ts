/**
 * Auth Middleware
 * Provides middleware functions for authentication and authorization
 */

import { Request, Response, NextFunction } from "express";
import { verifyToken, getUserById, JwtPayload } from "@/services/auth/auth.service";
import { AuthenticationError, AuthorizationError } from "@/utils/errors";
import { InternalUserRole } from "@/db/schema";

/**
 * Extend Express Request interface to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role: InternalUserRole;
        is_active: boolean;
      };
      token?: string;
    }
  }
}

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 * Attaches user to request object if token is valid
 */
export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    if (!token) {
      throw new AuthenticationError('Authentication required');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database (only active users for authentication)
    const user = await getUserById(decoded.userId, true);

    if (!user) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Attach user and token to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Authentication failed'));
    }
  }
};

/**
 * Middleware to check user role
 * @param roles Allowed roles
 * @returns Middleware function
 */
export const checkRole = (roles: InternalUserRole | InternalUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      // Convert single role to array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Check if user has required role
      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
