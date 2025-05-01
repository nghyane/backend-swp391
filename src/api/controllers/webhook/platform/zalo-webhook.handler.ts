/**
 * Zalo Webhook Handler
 * Handles Zalo webhook verification and message processing
 */

import { Request, Response } from "express";
import { reply } from "@/utils/response";
import { zaloWebhookService } from "@/services/integration/zalo.service";
import { queueZaloMessage } from "@/queue/webhook.queue";

/**
 * Verify Zalo webhook
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const verifyWebhook = async (req: Request, res: Response): Promise<void> => {
    const result = await zaloWebhookService.verify(
        req.query.access_token as string,
        req.query.challenge_code as string
    );
    
    reply(res, result, "Zalo webhook verified");
};

/**
 * Receive and process message from Zalo webhook
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const receiveMessage = async (req: Request, res: Response): Promise<void> => {
    // Process data from Zalo
    const eventData = req.body;

    // Add to queue instead of processing directly
    queueZaloMessage(eventData);

    // Return response to Zalo immediately - always return 200 to prevent Zalo from resending the webhook
    reply(res, { received: true }, "EVENT_RECEIVED");
};

/**
 * Export handler functions for Zalo webhook
 */
export const zaloWebhookHandler = {
    verifyWebhook,
    receiveMessage,
};
