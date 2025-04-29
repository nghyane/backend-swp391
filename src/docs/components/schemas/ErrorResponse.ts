export const ErrorResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Resource not found' },
    field: { type: 'string', example: 'id', description: 'Field that caused the error (if applicable)' },
    error: { type: 'string', example: 'Entity with ID 123 not found', description: 'Detailed error information' },
  },
  required: ['success', 'message']
};
