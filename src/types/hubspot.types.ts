/**
 * HubSpot Types
 * Type definitions for HubSpot integration
 */

import { z } from 'zod';
import { hubspotContactSchema } from '@/middlewares/validators/hubspot.validator';

/**
 * Interface for HubSpot contact request
 * Used for creating or updating contacts and linking them to sessions
 */
export type HubSpotContactRequest = z.infer<typeof hubspotContactSchema>;

/**
 * Response from HubSpot contact creation/update API
 */
export interface HubSpotContactResponse {
  contact_id: string;
  session_id: string;
  email: string;
  created: boolean;
  updated_fields?: string[];
  processing_time_ms?: number;
}
