import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";

const router = Router();

// Facebook Messenger webhook routes
router.get("/webhook", chatbotController.verifyWebhook);
router.post("/webhook", chatbotController.receiveMessage);

export default router;
