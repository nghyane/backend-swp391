import env from '@config/env';
import { createNamespace } from '@utils/pino-logger';

const logger = createNamespace('hubspot-service');

/**
 * Interface for HubSpot contact properties
 */
export interface HubSpotContactProperties {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  school_rank?: string;
  school?: string;
}

/**
 * Interface for HubSpot contact
 */
export interface HubSpotContact {
  id: string;
  properties: HubSpotContactProperties;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get HubSpot access token from environment variables
 * @returns Access token
 */
const getHubspotAccessToken = (): string => {
  // Always use token from environment variables
  return env.HUBSPOT_ACCESS_TOKEN;
};

/**
 * Create a new contact in HubSpot
 * @param properties Contact properties
 * @returns Created contact
 */
export const createContact = async (properties: HubSpotContactProperties): Promise<HubSpotContact> => {
  const accessToken = getHubspotAccessToken();

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ properties })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create HubSpot contact: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

/**
 * Update an existing contact in HubSpot
 * @param contactId HubSpot contact ID
 * @param properties Contact properties to update
 * @returns Updated contact
 */
export const updateContact = async (contactId: string, properties: HubSpotContactProperties): Promise<HubSpotContact> => {
  const accessToken = getHubspotAccessToken();

  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ properties })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update HubSpot contact: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

/**
 * Get a contact by ID from HubSpot
 * @param contactId HubSpot contact ID
 * @returns Contact or null if not found
 */
export const getContactById = async (contactId: string): Promise<HubSpotContact | null> => {
  const accessToken = getHubspotAccessToken();

  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,phone,school_rank,school`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get HubSpot contact: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

/**
 * Search for contacts by email
 * @param email Email to search for
 * @returns Array of matching contacts
 */
export const searchContactsByEmail = async (email: string): Promise<HubSpotContact[]> => {
  const accessToken = getHubspotAccessToken();

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email
            }
          ]
        }
      ],
      properties: ['firstname', 'lastname', 'email', 'phone', 'school_rank', 'school'],
      limit: 10
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to search HubSpot contacts: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  return result.results || [];
};

/**
 * Create or update a contact in HubSpot
 * @param email Email of the contact
 * @param properties Additional contact properties
 * @returns Object with contact ID, created flag, and updated fields
 */
export const createOrUpdateContact = async (
  email: string,
  properties: Omit<HubSpotContactProperties, 'email'>
): Promise<{ contactId: string; created: boolean; updatedFields: string[] }> => {
  logger.debug({ email }, 'Processing HubSpot contact');

  // Check if contact already exists in HubSpot
  const existingContacts = await searchContactsByEmail(email);
  let contactId: string;
  let created = false;
  let updatedFields: string[] = [];

  if (existingContacts.length > 0) {
    // Contact exists, update it
    const existingContact = existingContacts[0];
    contactId = existingContact.id;

    // Determine which fields are being updated
    const currentProps = existingContact.properties;
    updatedFields = Object.keys(properties).filter(key =>
      properties[key as keyof Omit<HubSpotContactProperties, 'email'>] !== undefined &&
      properties[key as keyof Omit<HubSpotContactProperties, 'email'>] !== currentProps[key as keyof HubSpotContactProperties]
    );

    if (updatedFields.length > 0) {
      // Only update if there are changes
      await updateContact(contactId, {
        email,
        ...properties
      });
      logger.info({ contactId, email, updatedFields }, 'Updated existing HubSpot contact');
    } else {
      logger.info({ contactId, email }, 'No changes needed for existing HubSpot contact');
    }
  } else {
    // Contact doesn't exist, create it
    const newContact = await createContact({
      email,
      ...properties
    });

    contactId = newContact.id;
    created = true;
    updatedFields = Object.keys(properties).filter(key =>
      properties[key as keyof Omit<HubSpotContactProperties, 'email'>] !== undefined
    );

    logger.info({ contactId, email, created }, 'Created new HubSpot contact');
  }

  return { contactId, created, updatedFields };
};

