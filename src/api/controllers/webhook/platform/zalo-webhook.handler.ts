/**
 * Zalo Webhook Handler
 * Handles Zalo webhook verification and message processing
 */

import { Request, Response } from "express";
import { reply } from "../../../../utils/response";
import { zaloWebhookService } from "../../../../services/webhook/zalo-webhook.service";
import { queueZaloMessage } from "../../../../queue/webhook.queue";

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
    // Xử lý dữ liệu từ Zalo
    const eventData = req.body;

    // Thêm vào queue thay vì xử lý trực tiếp
    queueZaloMessage(eventData);

    // Trả về phản hồi cho Zalo ngay lập tức - luôn trả về 200 để Zalo không gửi lại webhook
    reply(res, { received: true }, "EVENT_RECEIVED");
};

/**
 * Export handler functions for Zalo webhook
 */
export const zaloWebhookHandler = {
    verifyWebhook,
    receiveMessage,
};
