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
 *       - $ref: '#/components/parameters/PlatformParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.all(
  "/:platform",
  webhookValidators.platform,
  webhookValidators.method,
  routeWebhook
);

export default router;
