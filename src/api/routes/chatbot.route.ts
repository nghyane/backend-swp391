import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";
import { zaloWebhookController } from "../controllers/zalo-webhook.controller";
import { validateCustomQueries, validateBody } from "../../middlewares/validators";
import { query, body } from "express-validator";

const router = Router();

// Facebook Messenger webhook routes
router.get("/webhook", 
	validateCustomQueries([
		query('hub.mode').exists().withMessage('hub.mode is required'),
		query('hub.verify_token').exists().withMessage('hub.verify_token is required'),
		query('hub.challenge').exists().withMessage('hub.challenge is required')
	]),
	chatbotController.verifyWebhook
);
router.post("/webhook", 
	validateBody([
		body('object').exists().withMessage('object is required'),
		body('entry').exists().withMessage('entry is required')
	]),
	chatbotController.receiveMessage
);

// Zalo OA webhook routes
router.get("/zalo/webhook", 
	validateCustomQueries([
		query('token').exists().withMessage('token is required')
	]),
	zaloWebhookController.verifyWebhook
);
router.post("/zalo/webhook", 
	validateBody([
		body('app_id').exists().withMessage('app_id is required'),
		body('event_name').exists().withMessage('event_name is required')
	]),
	zaloWebhookController.receiveMessage
);

export default router;
