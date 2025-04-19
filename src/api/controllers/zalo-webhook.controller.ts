/**
 * Controller for Zalo chatbot endpoints.
 * Handles Zalo webhook verification and message processing.
 *
 * @module zalo_webhook.controller
 */
import { Request, Response } from "express";

/**
 * Xác thực webhook với Zalo (dùng cho đăng ký webhook từ Zalo OA)
 * @param req Express Request
 * @param res Express Response
 * @returns void
 */
const verifyWebhook = async (req: Request, res: Response): Promise<void> => {
  // TODO: Cập nhật logic xác thực webhook theo tài liệu Zalo OA
  res.status(200).send("Zalo webhook verified");
};

/**
 * Nhận và xử lý message từ webhook Zalo
 * @param req Express Request
 * @param res Express Response
 * @returns any
 */
const receiveMessage = async (req: Request, res: Response): Promise<any> => {
  // TODO: Xử lý message từ Zalo OA webhook
  res.status(200).send("EVENT_RECEIVED");
};

/**
 * Export các hàm controller cho Zalo webhook
 */
export const zaloWebhookController = {
  verifyWebhook,
  receiveMessage,
};
