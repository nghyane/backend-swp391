import { Router } from "express";
import { zaloWebhookController } from "../controllers/zalo-webhook.controller";

const router = Router();

// Zalo webhook routes
router.get("/", zaloWebhookController.verifyWebhook); // For webhook verification
router.post("/", zaloWebhookController.receiveMessage); // For receiving messages

export default router;
