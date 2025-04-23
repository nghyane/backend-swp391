/**
 * Controller for Zalo chatbot endpoints.
 * Handles Zalo webhook verification and message processing.
 *
 * @module zalo_webhook.controller
 */
import { Request, Response } from "express";
import { catch$ } from "../../utils/catch";
import { reply } from "../../utils/response";

/**
 * Verify Zalo webhook
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const verifyWebhook = catch$(async (req: Request, res: Response): Promise<void> => {
	// TODO: Update verification logic according to Zalo OA documentation
	reply(res, { verified: true }, "Zalo webhook verified");
});

/**
 * Receive and process message from Zalo webhook
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const receiveMessage = catch$(async (req: Request, res: Response): Promise<void> => {
	// TODO: Update message processing logic according to Zalo OA documentation
	reply(res, { received: true }, "EVENT_RECEIVED");
});

/**
 * Export controller functions for Zalo webhook
 */
export const zaloWebhookController = {
	verifyWebhook,
	receiveMessage,
};
