export const MajorCreate = {
  description: 'Major creation payload',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'CS' },
          name: { type: 'string', example: 'Computer Science' },
          description: { type: 'string', example: 'Study of computers and computational systems' }
        },
        required: ['code', 'name']
      }
    }
  }
};
