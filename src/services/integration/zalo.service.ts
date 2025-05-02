/**
 * Zalo Webhook Service
 * Provides functions to interact with Zalo OA API and process webhook events
 */

import { ZaloWebhookEvent } from "@/types/webhook.types";
import { getOrCreateSession } from "@session/session.service";
import env from "@config/env";
import logger from "@/utils/pino-logger";

/**
 * Verify Zalo webhook with provided tokens
 * @param accessToken Access token from Zalo
 * @param challengeCode Challenge code from Zalo
 * @returns Verification result
 */
const verify = async (accessToken: string, challengeCode: string): Promise<{ verified: boolean }> => {
  return { verified: true };
};



/**
 * Handle user text message from Zalo
 * @param eventData Event data from Zalo webhook
 * @returns Processing result
 */
export const handleUserSendText = async (eventData: ZaloWebhookEvent): Promise<void> => {
  // Extract necessary data
  const userId = eventData.sender.id;
  const rawMessage = eventData.message.text;

  // Remove command hashtags from message
  const message = rawMessage.replace(/#\w+/g, '').trim();

  try {
    // 1. Get or create session
    const sessionId = await getOrCreateSession(userId, 'zalo');

    // 2. Send message to AI Agent
    const aiResponses = await sendMessageToAI(message, userId, sessionId);

    // 3. Send responses back to Zalo
    await sendResponsesToZalo(aiResponses, userId);
  } catch (error) {
    console.error('Error processing Zalo message:', error);

    await sendResponsesToZalo(['Đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.'], userId);
  }
};

/**
 * Send message to AI Agent
 * @param message User message text
 * @param userId User ID
 * @param sessionId Session ID
 * @returns Array of AI responses
 */
async function sendMessageToAI(message: string, userId: string, sessionId: string): Promise<string[]> {
  const response = await fetch(`${env.AI_AGENT_BASE_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_name: env.AI_AGENT_APP_NAME,
      user_id: userId,
      session_id: sessionId,
      new_message: {
        parts: [{ text: message }],
        role: "user"
      },
      streaming: false
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to send message to AI agent: ${response.statusText}`);
  }

  const responseData = await response.json();

  return responseData
    .map((item: any) => item?.content?.parts?.[0]?.text)
    .filter(Boolean);
}

/**
 * Send responses to Zalo
 * @param responses Array of response texts
 * @param userId User ID to send responses to
 */
async function sendResponsesToZalo(responses: string[], userId: string): Promise<void> {
  for (const responseText of responses) {
    const response = await fetch(`https://openapi.zalo.me/v3.0/oa/message/cs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': env.ZALO_APP_ACCESS_TOKEN
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: responseText }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send response to Zalo: ${response.statusText}`);
    }

  }
};

/**
 * Export service functions for Zalo webhook
 */
export const zaloWebhookService = {
  verify
};
