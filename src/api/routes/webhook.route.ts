/**
 * Webhook Router
 * Routes for handling webhooks from different platforms
 */

import { Router } from "express";
import { webhookValidators } from "../../middlewares/validators/webhook.validator";
import routeWebhook from "../controllers/webhook/webhook.controller";

const router = Router();

// Apply validation before routing to controller
router.all(
  "/:platform",
  webhookValidators.platform,
  webhookValidators.method,
  routeWebhook
);

export default router;
