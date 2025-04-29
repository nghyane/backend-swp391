export const InternalServerError = {
  description: 'Internal Server Error - Something went wrong on the server',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example: {
        success: false,
        message: 'Internal server error',
        error: 'An unexpected error occurred while processing your request'
      }
    },
  },
};
