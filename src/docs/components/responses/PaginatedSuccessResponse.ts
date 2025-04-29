export const PaginatedSuccessResponse = {
  description: 'Successful operation with paginated results',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/PaginatedResponse' }
    }
  }
};
