/**
 * HubSpot Controller
 * Handles HubSpot integration requests
 */

import { Request, Response } from "express";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import { HubSpotContactRequest } from "@/types/hubspot.types";
import * as hubspotService from "@/services/integration/hubspot.service";
import * as sessionService from "@/services/session/session.service";
import { NotFoundError } from "@/utils/errors";
import { createNamespace } from "@/utils/pino-logger";

const logger = createNamespace('hubspot-controller');

/**
 * Create or update a HubSpot contact and link it to a session
 * This endpoint checks if a contact exists with the given email,
 * creates one if it doesn't, and links the contact ID to the session
 */
export const createOrUpdateContact = catch$(async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  // Extract contact data from request body (already validated by middleware)
  const contactData = req.body as HubSpotContactRequest;
  const { email, session_id, ...otherProperties } = contactData;

  logger.debug({ email, session_id }, 'Processing HubSpot contact request');

  try {
    // Check if session exists using session service
    const session = await sessionService.getSessionById(session_id);

    if (!session) {
      throw new NotFoundError('Session', session_id);
    }

    // Process HubSpot contact using service
    const { contactId, created, updatedFields } = await hubspotService.createOrUpdateContact(
      email,
      otherProperties
    );

    // Update session with HubSpot contact ID using session service
    await sessionService.updateSessionHubspotContact(session_id, contactId);

    const processingTime = Date.now() - startTime;
    logger.info({
      email,
      contactId,
      created,
      processingTime
    }, `${created ? 'Created' : 'Updated'} HubSpot contact and linked to session in ${processingTime}ms`);

    // Return response with additional metadata
    reply(res, {
      contact_id: contactId,
      session_id,
      email,
      created,
      updated_fields: updatedFields,
      processing_time_ms: processingTime
    }, created ? 'HubSpot contact created and linked to session' : 'HubSpot contact updated and linked to session');
  } catch (error) {
    logger.error({ error, email, session_id }, 'Error processing HubSpot contact');
    throw error; // Let the global error handler handle it
  }
});
