/**
 * Main Webhook Controller
 * Central controller for handling webhooks from different platforms
 */

import { Request, Response } from "express";
import { catch$ } from "@/utils/catch";
import { WebhookHandlerMap, WebhookPlatform } from "@/types/webhook.types";
import { zaloWebhookHandler } from "./platform/zalo-webhook.handler";

/**
 * Map of platform identifiers to their respective handlers
 */
const platformHandlers: WebhookHandlerMap = {
  zalo: zaloWebhookHandler
};

/**
 * Routes webhook requests to appropriate platform handlers based on
 * the platform parameter and HTTP method
 *
 * Note: Platform and method validation is handled by middleware
 */
const routeWebhook = catch$(async (req: Request, res: Response): Promise<void> => {
  // Platform is validated by middleware to be one of the supported platforms
  // Type assertion is needed here because TypeScript doesn't know that
  // the validator ensures platform is of type WebhookPlatform
  const platform = req.params.platform as WebhookPlatform;
  const handler = platformHandlers[platform];

  // Route to appropriate handler method based on HTTP method
  // GET requests are for verification, POST requests are for receiving messages
  if (req.method === "GET") {
    await handler.verifyWebhook(req, res);
  } else {
    await handler.receiveMessage(req, res);
  }
});

export default routeWebhook;
