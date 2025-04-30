/**
 * Webhook Router
 * Routes for handling webhooks from different platforms
 */

import { Router } from "express";
import { webhookValidators } from "../../middlewares/validators/webhook.validator";
import routeWebhook from "../controllers/webhook/webhook.controller";

const router = Router();

/**
 * @swagger
 * /webhooks/{platform}:
 *   post:
 *     summary: Xử lý webhook từ các nền tảng khác nhau
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: platform
 *         required: true
 *         schema:
 *           type: string
 *           enum: [zalo, facebook, hubspot]
 *         description: Nền tảng gửi webhook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook đã được xử lý
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.all(
  "/:platform",
  webhookValidators.platform,
  webhookValidators.method,
  routeWebhook
);

export default router;
