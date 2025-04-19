/**
 * Controller for Zalo chatbot endpoints.
 * Handles Zalo webhook verification and message processing.
 *
 * @module zalo_webhook.controller
 */
import { Request, Response } from "express";
import { catch$ } from "../../utils/catch";

/**
 * Verify Zalo webhook
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const verifyWebhook = catch$(async (req: Request, res: Response): Promise<void> => {
	// TODO: Update verification logic according to Zalo OA documentation
	res.status(200).send("Zalo webhook verified");
});

/**
 * Receive and process message from Zalo webhook
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const receiveMessage = catch$(async (req: Request, res: Response): Promise<void> => {
	// TODO: Update message processing logic according to Zalo OA documentation
	res.status(200).send("EVENT_RECEIVED");
});

/**
 * Export các hàm controller cho Zalo webhook
 */
export const zaloWebhookController = {
	verifyWebhook,
	receiveMessage,
};
