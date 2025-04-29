export const Session = {
  type: 'object',
  properties: {
    session_id: { type: 'string', example: 'sess_123456789' },
    platform: { type: 'string', example: 'zalo' },
    user_id: { type: 'string', example: 'user_987654321' },
    hubspot_contact_id: { type: 'string', example: 'contact_123456' },
    anonymous: { type: 'boolean', example: false }
  },
  required: ['session_id']
};
