/**
 * Webhook Types
 * Type definitions for webhook functionality
 */

import { Request, Response } from "express";

/**
 * Platform handler interface
 * Defines the required methods for webhook handlers
 */
export interface WebhookHandler {
  /**
   * Verifies a webhook from a platform
   * Typically used for initial setup and verification
   */
  verifyWebhook: (req: Request, res: Response) => Promise<void>;
  
  /**
   * Processes incoming webhook messages/events
   * Handles actual webhook payloads
   */
  receiveMessage: (req: Request, res: Response) => Promise<void>;
}

/**
 * Supported webhook platforms
 */
export type WebhookPlatform = 'zalo';

/**
 * Map of platform identifiers to their respective handlers
 */
export type WebhookHandlerMap = Record<WebhookPlatform, WebhookHandler>;


export type ZaloWebhookEvent = {
  app_id: string;
  user_id_by_app: string;
  event_name: 'user_send_text' | 'anonymous_send_text' | 'follow' | 'unfollow' | string;
  timestamp: string;
  sender: { id: string };
  recipient: { id: string }; 
  message: { msg_id: string; text: string };
};