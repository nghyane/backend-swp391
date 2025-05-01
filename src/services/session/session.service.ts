import { eq, and, SQL, desc } from 'drizzle-orm';
import { db } from '@db/index';
import { sessions } from '@db/schema';
import env from '@config/env';
import { NotFoundError } from '@utils/errors';
import { createNamespace } from '@utils/pino-logger';
import { SessionQueryParams } from '@middlewares/validators/session.validator';

const logger = createNamespace('session-service');

/**
 * Get or create a session using AI Agent session ID
 * @param userId User ID from the platform
 * @param platform Platform name (e.g., 'zalo')
 * @returns Session ID
 */
export const getOrCreateSession = async (userId: string, platform: string): Promise<string> => {
  // 1. Check for existing session
  const existingSession = await db.query.sessions.findFirst({
    where: eq(sessions.user_id, userId)
  });

  if (existingSession) return existingSession.session_id;

  // 2. Create new AI Agent session
  const sessionResponse = await fetch(
    `${env.AI_AGENT_BASE_URL}/apps/${env.AI_AGENT_APP_NAME}/users/${userId}/sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: {} })
    }
  );

  if (!sessionResponse.ok) {
    throw new Error(`Failed to create AI session: ${sessionResponse.statusText}`);
  }

  const { id: sessionId } = await sessionResponse.json();

  // 3. Create local session with AI session ID
  await db.insert(sessions).values({
    session_id: sessionId,
    user_id: userId,
    platform,
    anonymous: true
  });

  logger.info(`Created new session ${sessionId} for user ${userId} on platform ${platform}`);
  return sessionId;
};

/**
 * Get a session by ID
 * @param sessionId Session ID
 * @returns Session or null if not found
 */
export const getSessionById = async (sessionId: string) => {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.session_id, sessionId)
  });

  return session;
};

/**
 * Update a session with HubSpot contact ID
 * @param sessionId Session ID
 * @param hubspotContactId HubSpot contact ID
 * @throws NotFoundError if session not found
 */
export const updateSessionHubspotContact = async (
  sessionId: string,
  hubspotContactId: string
): Promise<void> => {
  // Check if session exists
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new NotFoundError('Session', sessionId);
  }

  // Update session with HubSpot contact ID
  await db.update(sessions)
    .set({
      hubspot_contact_id: hubspotContactId,
      anonymous: false
    })
    .where(eq(sessions.session_id, sessionId));

  logger.info(`Updated session ${sessionId} with HubSpot contact ID ${hubspotContactId}`);
};

/**
 * Build filter conditions for sessions based on query parameters
 * @param filterOptions Filter options for sessions
 * @returns Array of SQL conditions
 */
const buildSessionFilterConditions = (filterOptions: SessionQueryParams): SQL[] => {
  const conditions: SQL[] = [];

  // Filter by platform
  if (filterOptions.platform) {
    conditions.push(eq(sessions.platform, filterOptions.platform));
  }

  // Filter by anonymous status
  if (filterOptions.anonymous !== undefined) {
    conditions.push(eq(sessions.anonymous, filterOptions.anonymous));
  }

  // Filter by HubSpot contact ID
  if (filterOptions.hubspot_contact_id) {
    conditions.push(eq(sessions.hubspot_contact_id, filterOptions.hubspot_contact_id));
  }

  // Filter by name (user_id in this case)
  if (filterOptions.name) {
    conditions.push(eq(sessions.user_id, filterOptions.name));
  }

  return conditions;
};

/**
 * Get all sessions with optional filtering
 * @param filterOptions Optional filters for sessions
 * @returns Array of sessions matching the filters
 */
export const getAllSessions = async (filterOptions?: SessionQueryParams) => {
  // If no filters, return all sessions
  if (!filterOptions || Object.keys(filterOptions).length === 0) {
    return await db.query.sessions.findMany({
      orderBy: [desc(sessions.session_id)]
    });
  }

  // Build filter conditions
  const conditions = buildSessionFilterConditions(filterOptions);

  // If no conditions were added, return all sessions
  if (conditions.length === 0) {
    return await db.query.sessions.findMany({
      orderBy: [desc(sessions.session_id)]
    });
  }

  // Execute query with all filters
  return await db.query.sessions.findMany({
    where: and(...conditions),
    orderBy: [desc(sessions.session_id)]
  });
};

/**
 * Delete a session by ID
 * @param sessionId Session ID
 * @throws NotFoundError if session not found
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  // Check if session exists
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new NotFoundError('Session', sessionId);
  }

  // Delete session
  await db.delete(sessions).where(eq(sessions.session_id, sessionId));

  logger.info(`Deleted session ${sessionId}`);
};
