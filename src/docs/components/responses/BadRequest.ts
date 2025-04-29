export const BadRequest = {
  description: 'Bad Request - Invalid input parameters',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example: {
        success: false,
        message: 'Validation error',
        field: 'name',
        error: 'Name is required'
      }
    },
  },
};
