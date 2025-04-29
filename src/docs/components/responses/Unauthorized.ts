export const Unauthorized = {
  description: 'Unauthorized - Authentication is required',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example: {
        success: false,
        message: 'Authentication required',
        error: 'Please provide valid authentication credentials'
      }
    },
  },
};
