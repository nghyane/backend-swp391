import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";
import { zaloWebhookController } from "../controllers/zalo-webhook.controller";

const router = Router();

// Facebook Messenger webhook routes
router.get("/webhook", chatbotController.verifyWebhook);
router.post("/webhook", chatbotController.receiveMessage);

// Zalo OA webhook routes
router.get("/zalo/webhook", zaloWebhookController.verifyWebhook);
router.post("/zalo/webhook", zaloWebhookController.receiveMessage);

export default router;
