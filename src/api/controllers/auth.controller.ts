/**
 * Auth Controller
 * Handles authentication requests and user management
 */

import { Request, Response } from "express";
import * as authService from "@/services/auth/auth.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import {
  LoginParams,
  UserCreateParams,
  UserUpdateParams,
  UserQueryParams
} from "@/middlewares/validators/auth.validator";
import { AuthenticationError } from "@/utils/errors";
import { InternalUserRole } from "@/db/schema";

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

/**
 * Get all users
 * This endpoint returns all users with optional filtering
 */
export const getAllUsers = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract query parameters (already validated by middleware)
  const filters = req.validatedQuery as UserQueryParams || {};

  // Call service to get users
  const users = await authService.getAllUsers({
    username: filters.username,
    email: filters.email,
    role: filters.role as InternalUserRole,
    is_active: filters.is_active
  });

  // Return users
  reply(res, users, 'Users retrieved successfully');
});

/**
 * Get user by ID
 * This endpoint returns a specific user by ID
 */
export const getUserById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract user ID from request parameters
  const userId = req.validatedParams?.id as number;

  // Extract is_active from validated query parameters (default: true)
  const filters = req.validatedQuery as UserQueryParams || {};
  const is_active = filters.is_active !== undefined ? filters.is_active : true;

  // Call service to get user
  const user = await authService.getUserById(userId, is_active);

  if (!user) {
    throw new AuthenticationError('User not found or inactive');
  }

  // Return user
  reply(res, user, 'User retrieved successfully');
});

/**
 * Create a new user
 * This endpoint creates a new user
 */
export const createUser = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract user data from request body (already validated by middleware)
  const userData = req.body as UserCreateParams;

  // Call service to create user
  const newUser = await authService.createUser({
    ...userData,
    role: userData.role as InternalUserRole
  });

  // Return created user
  reply(res, newUser, 'User created successfully', 201);
});

/**
 * Update an existing user
 * This endpoint updates an existing user
 */
export const updateUser = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract user ID from request parameters
  const userId = req.validatedParams?.id as number;

  // Extract user data from request body (already validated by middleware)
  const userData = req.body as UserUpdateParams;

  // Call service to update user
  const updatedUser = await authService.updateUser(userId, {
    ...userData,
    role: userData.role as InternalUserRole
  });

  // Return updated user
  reply(res, updatedUser, 'User updated successfully');
});

/**
 * Delete a user
 * This endpoint deletes (or deactivates) a user
 */
export const deleteUser = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract user ID from request parameters
  const userId = req.validatedParams?.id as number;

  // Extract soft delete flag from query parameters (default: true)
  const softDelete = req.query.soft !== 'false';

  // Call service to delete user
  await authService.deleteUser(userId, softDelete);

  // Return success message
  const message = softDelete ? 'User deactivated successfully' : 'User deleted successfully';
  reply(res, null, message);
});
