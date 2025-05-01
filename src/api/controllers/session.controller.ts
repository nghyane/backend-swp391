/**
 * Session Controller
 * Handles session management requests
 */

import { Request, Response } from "express";
import * as sessionService from "@/services/session/session.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import { SessionQueryParams } from "@/types/session.types";

/**
 * Get all sessions with optional filtering
 * This endpoint retrieves all sessions matching the provided filters
 */
export const getAllSessions = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const filters = req.validatedQuery as SessionQueryParams || {};

  const hasFilters = Object.keys(filters).length > 0;

  // Get all sessions matching filters
  const sessions = await sessionService.getAllSessions(hasFilters ? filters : undefined);

  // Return sessions
  reply(
    res,
    sessions,
    hasFilters ? 'Filtered sessions retrieved successfully' : 'All sessions retrieved successfully'
  );
});

/**
 * Get session by ID
 * This endpoint retrieves a session by its ID
 */
export const getSessionById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const sessionId = req.validatedParams?.id as string;
  const session = await sessionService.getSessionById(sessionId);

  if (!session) {
    throw new Error(`Session with ID ${sessionId} not found`);
  }

  // Return session
  reply(res, session, 'Session retrieved successfully');
});

/**
 * Delete a session
 * This endpoint deletes a session by its ID
 */
export const deleteSession = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const sessionId = req.validatedParams?.id as string;

  // Delete session
  await sessionService.deleteSession(sessionId);

  // Return success message
  reply(res, null, 'Session deleted successfully');
});
