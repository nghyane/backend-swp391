export const SuccessResponse = {
  description: 'Successful operation',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ApiResponse' }
    }
  }
};
