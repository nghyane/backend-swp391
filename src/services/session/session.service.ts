import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { sessions } from '@/db/schema';
import env from '@/config/env';
import { NotFoundError } from '@/utils/errors';
import { createNamespace } from '@/utils/pino-logger';

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
