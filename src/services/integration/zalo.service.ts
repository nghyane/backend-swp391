import { ZaloWebhookEvent } from "@/types/webhook.types";
import { getOrCreateSession } from "@session/session.service";
import env from "@config/env";
import logger from "@/utils/pino-logger";
import { getToken, saveToken } from "./token.service";

// Constants
const PROVIDER = "zalo";
const ZALO_API = {
  REFRESH: "https://oauth.zaloapp.com/v4/oa/access_token",
  SEND: "https://openapi.zalo.me/v3.0/oa/message/cs",
};
const TOKEN_ERRORS = [-124, -216];

/**
 * Check if error is token-related
 */
const isTokenError = (error: any): boolean => {
  return (
    TOKEN_ERRORS.includes(error?.error) ||
    error?.message?.toLowerCase().includes("token")
  );
};

/**
 * Safe JSON parser with fallback
 */
const parseJsonSafe = async (res: Response): Promise<any> => {
  try {
    return await res.json();
  } catch {
    return { message: await res.text() };
  }
};

/**
 * Get access or refresh token
 */
const getZaloToken = async (
  type: "access_token" | "refresh_token"
): Promise<string> => {
  const token = await getToken(PROVIDER, type);
  return token || (type === "access_token"
    ? env.ZALO_APP_ACCESS_TOKEN
    : env.ZALO_APP_REFRESH_TOKEN);
};

/**
 * Refresh Zalo token via API
 */
const refreshZaloToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getZaloToken("refresh_token");

    const res = await fetch(ZALO_API.REFRESH, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        secret_key: env.ZALO_APP_SECRET,
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        app_id: env.ZALO_APP_ID,
        grant_type: "refresh_token",
      }).toString(),
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) {
      logger.error({ data }, "Failed to refresh token");
      return null;
    }

    const now = Date.now();
    await Promise.all([
      saveToken({
        provider: PROVIDER,
        tokenType: "access_token",
        tokenValue: data.access_token,
        expiresAt: new Date(now + data.expires_in * 1000),
      }),
      saveToken({
        provider: PROVIDER,
        tokenType: "refresh_token",
        tokenValue: data.refresh_token,
        expiresAt: new Date(now + 90 * 86400000),
      }),
    ]);

    logger.info("Refreshed Zalo tokens");
    return data.access_token;
  } catch (error) {
    logger.error(error, "Error refreshing Zalo token");
    return null;
  }
};

/**
 * Retry logic for token refresh
 */
const withTokenRetry = async <T>(
  action: (token: string) => Promise<T>,
  retries = 1
): Promise<T> => {
  let token = await getZaloToken("access_token");

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await action(token);
    } catch (error: any) {
      if (!isTokenError(error) || attempt === retries) throw error;
      logger.warn("Access token expired, retrying...");
      const newToken = await refreshZaloToken();
      if (!newToken) throw new Error("Failed to refresh token");
      token = newToken;
    }
  }

  throw new Error("Token retry failed");
};

/**
 * Send a single message to Zalo
 */
const sendZaloMessageOnce = async (
  message: string,
  userId: string,
  accessToken: string
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(ZALO_API.SEND, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: accessToken,
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: message },
      }),
      signal: controller.signal,
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) {
      const error = new Error(JSON.stringify(data));
      if (isTokenError(data)) (error as any).isTokenError = true;
      throw error;
    }

    logger.debug({ userId, length: message.length }, "Sent message to Zalo");
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Send multiple messages to Zalo with retry
 */
const sendResponsesToZalo = async (
  messages: string[],
  userId: string
): Promise<void> => {
  for (const msg of messages) {
    await withTokenRetry((token) =>
      sendZaloMessageOnce(msg, userId, token)
    );
  }
};

/**
 * Send user message to AI agent and get responses
 */
const sendMessageToAI = async (
  message: string,
  userId: string,
  sessionId: string
): Promise<string[]> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${env.AI_AGENT_BASE_URL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_name: env.AI_AGENT_APP_NAME,
        user_id: userId,
        session_id: sessionId,
        new_message: {
          parts: [{ text: message }],
          role: "user",
        },
        streaming: false,
      }),
      signal: controller.signal,
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) {
      logger.error({ data }, "AI agent response failed");
      throw new Error("AI agent error");
    }

    const replies = data
      .map((item: any) => item?.content?.parts?.[0]?.text)
      .filter(Boolean);

    return replies.length
      ? replies
      : ["Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này."];
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Handle incoming Zalo text message
 */
export const handleUserSendText = async (
  eventData: ZaloWebhookEvent
): Promise<void> => {
  const userId = eventData.sender.id;
  const rawMessage = eventData.message.text;
  const message = rawMessage.replace(/#\w+/g, "").trim();

  logger.info({ userId, message: rawMessage }, "Handling Zalo message");

  try {
    const sessionId = await getOrCreateSession(userId, "zalo");
    const aiReplies = await sendMessageToAI(message, userId, sessionId);
    await sendResponsesToZalo(aiReplies, userId);
  } catch (err) {
    logger.error({ userId, error: err }, "Zalo processing error");
    try {
      await sendResponsesToZalo(
        ["Đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau."],
        userId
      );
    } catch (fallbackErr) {
      logger.error({ userId, error: fallbackErr }, "Fallback message failed");
    }
  }
};

/**
 * Verify Zalo webhook challenge
 */
const verify = async (
  accessToken: string,
  challengeCode: string
): Promise<{ verified: boolean }> => {
  if (!accessToken || !challengeCode) {
    return { verified: false };
  }

  const stored = await getZaloToken("access_token");
  const verified = accessToken === stored;

  logger.info({ verified }, "Webhook verification result");
  return { verified };
};

export const zaloWebhookService = {
  verify,
  refreshZaloToken,
};
