/**
 * HubSpot Validator
 * Provides validation schemas for HubSpot integration requests
 */

import { z } from 'zod';
import { validateZod } from './zod.validator';

/**
 * Schema for HubSpot contact request
 * Validates data for creating or updating a HubSpot contact and linking to a session
 */
export const hubspotContactSchema = z.object({
  // Required fields
  email: z.string().email('Email không hợp lệ'),
  session_id: z.string().min(1, 'Session ID không được để trống'),
  
  // Optional fields
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  school: z.string().optional(),
  school_rank: z.string().optional(),
}).strict();

/**
 * Validators for HubSpot
 */
export const hubspotValidators = {
  // Create or update contact validator
  createOrUpdateContact: validateZod(hubspotContactSchema, 'body')
};
