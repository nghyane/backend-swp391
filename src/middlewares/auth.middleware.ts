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
    console.log('=== AUTH MIDDLEWARE START ===');
    console.log(`Request path: ${req.path}`);
    console.log(`Request method: ${req.method}`);

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log(`Authorization header: ${authHeader ? 'Present' : 'Missing'}`);

    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
      console.log('Token extracted from header');
    }

    if (!token) {
      console.log('No token found in request');
      throw new AuthenticationError('Authentication required');
    }

    // Verify token
    console.log('Verifying token...');
    const decoded = verifyToken(token);
    console.log(`Token verified for user ID: ${decoded.userId}, role: ${decoded.role}`);

    // Get user from database (only active users for authentication)
    console.log('Getting user from database...');
    const user = await getUserById(decoded.userId, true);

    if (!user) {
      console.log(`User not found or inactive: ${decoded.userId}`);
      throw new AuthenticationError('User not found or inactive');
    }

    console.log(`User authenticated: ${user.username}, Role: ${user.role}, Active: ${user.is_active}`);

    // Attach user and token to request
    req.user = user;
    req.token = token;
    console.log('=== AUTH MIDDLEWARE END ===');

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
      console.log('=== ROLE CHECK MIDDLEWARE START ===');
      console.log(`Request path: ${req.path}`);
      console.log(`Request method: ${req.method}`);

      // Ensure user is authenticated
      if (!req.user) {
        console.log('No user found in request');
        throw new AuthenticationError('Authentication required');
      }

      console.log(`User in request: ${req.user.username}, ID: ${req.user.id}, Role: ${req.user.role}`);

      // Convert single role to array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      console.log(`Allowed roles: ${allowedRoles.join(', ')}`);

      // Check if user has required role
      console.log(`Role check: User role: ${req.user.role}, Allowed roles: ${allowedRoles.join(', ')}`);

      if (!allowedRoles.includes(req.user.role)) {
        console.log(`Role check failed: User role ${req.user.role} not in allowed roles: ${allowedRoles.join(', ')}`);
        throw new AuthorizationError('Insufficient permissions');
      }

      console.log('Role check passed');
      console.log('=== ROLE CHECK MIDDLEWARE END ===');

      next();
    } catch (error) {
      next(error);
    }
  };
};
