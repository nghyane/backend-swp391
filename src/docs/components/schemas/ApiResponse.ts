export const ApiResponse = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      description: 'Response data - structure varies by endpoint'
    },
    message: { type: 'string', example: 'Operation successful' },
    success: { type: 'boolean', example: true },
    timestamp: { type: 'string', format: 'date-time', example: '2024-04-20T10:30:00Z' },
  },
  required: ['data', 'message', 'success', 'timestamp']
};
