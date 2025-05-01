/**
 * Auth Controller
 * Handles authentication requests
 */

import { Request, Response } from "express";
import * as authService from "@/services/auth/auth.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import { LoginParams } from "@/middlewares/validators/auth.validator";
import { AuthenticationError } from "@/utils/errors";

/**
 * Login a user
 * This endpoint authenticates a user and returns a JWT token
 */
export const login = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract login credentials from request body (already validated by middleware)
  const credentials = req.body as LoginParams;

  // Call service to authenticate user
  const { user, token } = await authService.login(credentials);

  // Return user info and token
  reply(res, { user, token }, 'Login successful');
});

/**
 * Logout a user
 * This endpoint returns a success message
 * Note: Actual token invalidation should be handled on the client side
 */
export const logout = catch$(async (req: Request, res: Response): Promise<void> => {
  // Return success message
  reply(res, null, 'Logout successful');
});

/**
 * Get current user info
 * This endpoint returns the current authenticated user's info
 */
export const getCurrentUser = catch$(async (req: Request, res: Response): Promise<void> => {
  // User is already attached to request by auth middleware
  const user = req.user;

  if (!user) {
    throw new AuthenticationError('Not authenticated');
  }

  // Return user info
  reply(res, user, 'User info retrieved successfully');
});
