export const NotFound = {
  description: 'Resource Not Found - The specified resource was not found',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example: {
        success: false,
        message: 'Resource not found',
        error: 'The requested entity with ID 123 does not exist'
      }
    },
  },
};
