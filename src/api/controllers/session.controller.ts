import { Request, Response } from "express";
import { catch$ } from "../../utils/catch";
import { replyError } from "../../utils/response";

/**
 * Controller for session-related endpoints.
 * Sessions store conversation context and user information for the chatbot.
 * Integrated with Facebook user IDs for Facebook Messenger chatbot.
 */

/**
 * Get a session by Facebook user ID
 */
const getSessionByFacebookId = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting session by Facebook user ID
  // 1. Extract Facebook user ID from request params
  // 2. Fetch session from database
  // 3. Return session or 404 if not found
  replyError(res, "Not implemented yet", 501);
});

/**
 * Update an existing session
 */
const updateSession = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement updating session
  // 1. Extract Facebook user ID and message from request body
  // 2. Update session in database
  // 3. Return updated session
  replyError(res, "Not implemented yet", 501);
});

/**
 * Get all sessions
 */
const getAllSessions = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting all sessions
  // 1. Fetch all sessions from database
  // 2. Apply optional filtering
  // 3. Return sessions array
  replyError(res, "Not implemented yet", 501);
});

// Export all controller functions
export const sessionController = {
  getSessionByFacebookId,
  updateSession,
  getAllSessions
};
