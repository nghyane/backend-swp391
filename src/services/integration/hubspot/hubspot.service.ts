import env from '@/config/env';

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
 * Create a new contact in HubSpot
 * @param properties Contact properties
 * @returns Created contact
 */
export const createContact = async (properties: HubSpotContactProperties): Promise<HubSpotContact> => {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`
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
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`
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
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,phone,school_rank,school`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`
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
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`
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

