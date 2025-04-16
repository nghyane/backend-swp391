import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";

const router = Router();

// Facebook Messenger webhook routes
router.get("/webhook", chatbotController.verifyWebhook);
router.post("/webhook", chatbotController.receiveMessage);

// Additional chatbot routes
router.post("/send", chatbotController.sendMessageToUser);
router.get("/history/:facebookUserId", chatbotController.getConversationHistory);

export default router;
