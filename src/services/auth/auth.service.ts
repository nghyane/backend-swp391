/**
 * Authentication Service
 * Provides functions for user authentication and token management
 */

import { eq, and, like, or, sql } from "drizzle-orm";
import { db } from "@db/index";
import { internalUsers } from "@db/schema";
import { AuthenticationError, NotFoundError, ConflictError } from "@utils/errors";
import env from "@config/env";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { InternalUserRole } from "@db/schema";
import { Secret, SignOptions } from "jsonwebtoken";
import logger from "@utils/pino-logger";

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interface for authenticated user
 */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: InternalUserRole;
  is_active: boolean;
}

/**
 * Interface for JWT payload
 */
export interface JwtPayload {
  userId: number;
  username: string;
  role: InternalUserRole;
}

/**
 * Login a user with username and password
 * @param credentials Login credentials
 * @returns Auth user with token
 * @throws AuthenticationError if credentials are invalid
 */
export const login = async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
  // Find user by username
  const user = await db.query.internalUsers.findFirst({
    where: eq(internalUsers.username, credentials.username)
  });

  // Check if user exists and is active
  if (!user) {
    throw new NotFoundError("User", credentials.username, "Invalid username or password");
  }

  if (!user.is_active) {
    throw new AuthenticationError("Account is disabled");
  }

  // Verify password
  try {
    const isPasswordValid = await argon2.verify(user.password_hash, credentials.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid username or password");
    }
  } catch (error) {
    throw new AuthenticationError("Invalid username or password");
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role
  });

  // Return user info and token
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    },
    token
  };
};

/**
 * Generate JWT token
 * @param payload Token payload
 * @returns JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: '24h'
  };

  return jwt.sign(
    payload as jwt.JwtPayload,
    env.JWT_SECRET as Secret,
    options
  );
};

/**
 * Verify JWT token
 * @param token JWT token
 * @returns Decoded token payload
 * @throws AuthenticationError if token is invalid
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
  }
};

/**
 * Get user by ID
 * @param userId User ID
 * @param is_active Optional parameter to filter by active status (default: true)
 * @returns User or null if not found
 */
export const getUserById = async (userId: number, is_active: boolean = true): Promise<AuthUser | null> => {
  // Build where conditions
  const whereConditions = [eq(internalUsers.id, userId)];

  // Add is_active filter if specified
  if (is_active) {
    whereConditions.push(eq(internalUsers.is_active, true));
  }

  // Query user with filters
  const user = await db.query.internalUsers.findFirst({
    where: and(...whereConditions)
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    is_active: user.is_active ?? false
  };
};

/**
 * Hash a password using argon2
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MiB
    timeCost: 3,
    parallelism: 1
  });
};

/**
 * Get all users with optional filtering
 * @param filters Optional filters for username, email, role, and active status
 * @returns Array of users
 */
export const getAllUsers = async (filters?: {
  username?: string;
  email?: string;
  role?: InternalUserRole;
  is_active?: boolean;
}): Promise<AuthUser[]> => {
  // Build where conditions based on filters
  const whereConditions = [];

  if (filters?.username) {
    whereConditions.push(like(internalUsers.username, `%${filters.username}%`));
  }

  if (filters?.email) {
    whereConditions.push(like(internalUsers.email, `%${filters.email}%`));
  }

  if (filters?.role) {
    whereConditions.push(eq(internalUsers.role, filters.role));
  }

  if (filters?.is_active !== undefined) {
    whereConditions.push(eq(internalUsers.is_active, filters.is_active));
  }

  // Query users with filters
  const users = await db.query.internalUsers.findMany({
    where: whereConditions.length > 0
      ? and(...whereConditions)
      : undefined,
    orderBy: sql`${internalUsers.username} asc`
  });

  // Map to AuthUser type
  return users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    is_active: user.is_active ?? false
  }));
};

/**
 * Create a new user
 * @param userData User data to create
 * @returns Created user
 * @throws ConflictError if username or email already exists
 */
export const createUser = async (userData: {
  username: string;
  password: string;
  email: string;
  role: InternalUserRole;
  is_active?: boolean;
}): Promise<AuthUser> => {
  // Check if username or email already exists
  const existingUser = await db.query.internalUsers.findFirst({
    where: or(
      eq(internalUsers.username, userData.username),
      eq(internalUsers.email, userData.email)
    )
  });

  if (existingUser) {
    if (existingUser.username === userData.username) {
      throw new ConflictError('User with this username already exists');
    } else {
      throw new ConflictError('User with this email already exists');
    }
  }

  // Hash password
  const password_hash = await hashPassword(userData.password);

  // Create user
  const [newUser] = await db.insert(internalUsers).values({
    username: userData.username,
    password_hash,
    email: userData.email,
    role: userData.role,
    is_active: userData.is_active ?? true
  }).returning();

  logger.info(`Created new user: ${newUser.username} (${newUser.role})`);

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    is_active: newUser.is_active ?? false
  };
};

/**
 * Update an existing user
 * @param userId User ID to update
 * @param userData User data to update
 * @returns Updated user
 * @throws NotFoundError if user not found
 * @throws ConflictError if username or email already exists
 */
export const updateUser = async (
  userId: number,
  userData: Partial<{
    username: string;
    password: string;
    email: string;
    role: InternalUserRole;
    is_active: boolean;
  }>
): Promise<AuthUser> => {
  // Check if user exists
  const existingUser = await db.query.internalUsers.findFirst({
    where: eq(internalUsers.id, userId)
  });

  if (!existingUser) {
    throw new NotFoundError('User', userId);
  }

  // Check if username or email already exists (if updating those fields)
  if (userData.username || userData.email) {
    const conflictUser = await db.query.internalUsers.findFirst({
      where: and(
        or(
          userData.username ? eq(internalUsers.username, userData.username) : sql`1=0`,
          userData.email ? eq(internalUsers.email, userData.email) : sql`1=0`
        ),
        sql`${internalUsers.id} != ${userId}`
      )
    });

    if (conflictUser) {
      if (userData.username && conflictUser.username === userData.username) {
        throw new ConflictError('User with this username already exists');
      } else if (userData.email && conflictUser.email === userData.email) {
        throw new ConflictError('User with this email already exists');
      }
    }
  }

  // Prepare update data
  const updateData: any = { ...userData };

  // Hash password if provided
  if (userData.password) {
    updateData.password_hash = await hashPassword(userData.password);
    delete updateData.password;
  }

  // Update user
  const [updatedUser] = await db.update(internalUsers)
    .set(updateData)
    .where(eq(internalUsers.id, userId))
    .returning();

  logger.info(`Updated user: ${updatedUser.username} (ID: ${updatedUser.id})`);

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
    is_active: updatedUser.is_active ?? false
  };
};

/**
 * Delete a user (or deactivate if soft delete)
 * @param userId User ID to delete
 * @param softDelete Whether to soft delete (default: true)
 * @returns True if successful
 * @throws NotFoundError if user not found
 */
export const deleteUser = async (userId: number, softDelete: boolean = true): Promise<boolean> => {
  // Check if user exists
  const existingUser = await db.query.internalUsers.findFirst({
    where: eq(internalUsers.id, userId)
  });

  if (!existingUser) {
    throw new NotFoundError('User', userId);
  }

  if (softDelete) {
    // Soft delete (deactivate)
    await db.update(internalUsers)
      .set({ is_active: false })
      .where(eq(internalUsers.id, userId));

    logger.info(`Deactivated user: ${existingUser.username} (ID: ${existingUser.id})`);
  } else {
    // Hard delete
    await db.delete(internalUsers)
      .where(eq(internalUsers.id, userId));

    logger.info(`Deleted user: ${existingUser.username} (ID: ${existingUser.id})`);
  }

  return true;
};
