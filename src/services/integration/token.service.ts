/**
 * Integration Token Service
 * Provides functions to manage integration tokens in the database
 */

import { db } from "@db/index";
import { integrationTokens } from "@db/schema";
import { eq, and } from "drizzle-orm";
import logger from "@/utils/pino-logger";

/**
 * Token data structure
 */
export interface TokenData {
  provider: string;
  tokenType: string;
  tokenValue: string;
  expiresAt?: Date;
}

/**
 * Token info structure with full details
 */
export interface TokenInfo {
  id: number;
  provider: string;
  token_type: string;
  token_value: string;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get a token by provider and type
 * @param provider Provider name (e.g., 'hubspot', 'zalo')
 * @param tokenType Token type (e.g., 'access_token', 'refresh_token')
 * @returns Token value or null if not found
 */
export const getToken = async (provider: string, tokenType: string): Promise<string | null> => {
  const token = await db.query.integrationTokens.findFirst({
    where: and(
      eq(integrationTokens.provider, provider),
      eq(integrationTokens.token_type, tokenType)
    )
  });

  return token?.token_value || null;
};

/**
 * Get full token information by provider and type
 * @param provider Provider name (e.g., 'hubspot', 'zalo')
 * @param tokenType Token type (e.g., 'access_token', 'refresh_token')
 * @returns Full token information or null if not found
 */
export const getTokenInfo = async (provider: string, tokenType: string): Promise<TokenInfo | null> => {
  const token = await db.query.integrationTokens.findFirst({
    where: and(
      eq(integrationTokens.provider, provider),
      eq(integrationTokens.token_type, tokenType)
    )
  });

  return token || null;
};

/**
 * Save or update a token
 * @param tokenData Token data to save
 * @returns True if successful
 */
export const saveToken = async (tokenData: TokenData): Promise<boolean> => {
  try {
    const { provider, tokenType, tokenValue, expiresAt } = tokenData;

    // Check if token exists
    const existingToken = await db.query.integrationTokens.findFirst({
      where: and(
        eq(integrationTokens.provider, provider),
        eq(integrationTokens.token_type, tokenType)
      )
    });

    if (existingToken) {
      // Update existing token
      await db
        .update(integrationTokens)
        .set({
          token_value: tokenValue,
          expires_at: expiresAt,
          updated_at: new Date()
        })
        .where(
          and(
            eq(integrationTokens.provider, provider),
            eq(integrationTokens.token_type, tokenType)
          )
        );

      logger.info(`Updated ${tokenType} for ${provider}`);
    } else {
      // Insert new token
      await db.insert(integrationTokens).values({
        provider,
        token_type: tokenType,
        token_value: tokenValue,
        expires_at: expiresAt
      });

      logger.info(`Saved new ${tokenType} for ${provider}`);
    }

    return true;
  } catch (error) {
    logger.error(error, `Failed to save ${tokenData.tokenType} for ${tokenData.provider}`);
    return false;
  }
};

/**
 * Delete a token
 * @param provider Provider name
 * @param tokenType Token type
 * @returns True if successful
 */
export const deleteToken = async (provider: string, tokenType: string): Promise<boolean> => {
  try {
    await db
      .delete(integrationTokens)
      .where(
        and(
          eq(integrationTokens.provider, provider),
          eq(integrationTokens.token_type, tokenType)
        )
      );

    logger.info(`Deleted ${tokenType} for ${provider}`);
    return true;
  } catch (error) {
    logger.error(error, `Failed to delete ${tokenType} for ${provider}`);
    return false;
  }
};

/**
 * Check if a token is expired
 * @param tokenInfo Token information
 * @returns True if token is expired or will expire in the next 5 minutes
 */
export const isTokenExpired = (tokenInfo: TokenInfo | null): boolean => {
  if (!tokenInfo || !tokenInfo.expires_at) return true;

  // Token is considered expired if it will expire in the next 5 minutes
  const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
  const expirationTime = new Date(tokenInfo.expires_at).getTime() - expirationBuffer;

  return Date.now() >= expirationTime;
};

/**
 * Export token service functions
 */
export const tokenService = {
  getToken,
  getTokenInfo,
  saveToken,
  deleteToken,
  isTokenExpired
};
