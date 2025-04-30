import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { sessions } from '@/db/schema';
import env from '@/config/env';
import { NotFoundError } from '@/utils/errors';

/**
 * Get or create a session using AI Agent session ID
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

  return sessionId;
};
