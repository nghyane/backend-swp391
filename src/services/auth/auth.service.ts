/**
 * Authentication Service
 * Provides functions for user authentication and token management
 */

import { eq } from "drizzle-orm";
import { db } from "@db/index";
import { internalUsers } from "@db/schema";
import { AuthenticationError, NotFoundError } from "@utils/errors";
import env from "@config/env";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { InternalUserRole } from "@db/schema";
import { Secret, SignOptions } from "jsonwebtoken";

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
      role: user.role
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
 * @returns User or null if not found
 */
export const getUserById = async (userId: number): Promise<AuthUser | null> => {
  const user = await db.query.internalUsers.findFirst({
    where: eq(internalUsers.id, userId)
  });

  if (!user || !user.is_active) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
};
