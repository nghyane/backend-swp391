import { Request, Response } from "express";
import { FacebookWebhookEvent, FacebookMessageResponse, FacebookSendMessageRequest } from "../../types/facebook.types";

/**
 * Controller for chatbot-related endpoints.
 * Handles Facebook Messenger webhook integration and message processing.
 */

/**
 * Verify webhook for Facebook Messenger integration
 */
const verifyWebhook = async (req: Request, res: Response): Promise<void> => {
  


  // TODO: Implement webhook verification
  // 1. Extract verification token and challenge from query params
  const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": verifyToken } = req.query;
  // 2. Verify token against environment variable
  // 3. Return challenge if verified, 403 if not

  if (mode === "subscribe" && verifyToken === process.env.FACEBOOK_VERIFY_TOKEN) {
    res.send(challenge);
  } else {
    res.status(403).send("Invalid verification token");
  }
};

/**
 * Receive and process messages from Facebook Messenger
 */
const receiveMessage = async (req: Request, res: Response): Promise<any> => {
  // TODO: Implement message processing
  // 1. Extract Facebook user ID from webhook event
  if (req.body.object !== "page") {
    return res.status(200).send('EVENT_RECEIVED');
  }
  // 2. Create or update session with Facebook user ID
  // 3. Process message and generate response
  // 4. Send response back to user
  // 5. Return 200 OK to Facebook
};



// Export all controller functions
export const chatbotController = {
  verifyWebhook,
  receiveMessage,
};
