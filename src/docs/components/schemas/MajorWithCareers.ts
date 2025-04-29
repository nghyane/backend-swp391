export const MajorWithCareers = {
  allOf: [
    { $ref: '#/components/schemas/Major' },
    {
      type: 'object',
      properties: {
        careers: {
          type: 'array',
          items: { $ref: '#/components/schemas/Career' }
        }
      }
    }
  ]
};
