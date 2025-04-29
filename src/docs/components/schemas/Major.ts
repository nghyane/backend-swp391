export const Major = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    code: { type: 'string', example: 'CS' },
    name: { type: 'string', example: 'Computer Science' },
    description: { type: 'string', example: 'Study of computers and computational systems' },
  },
  required: ['id', 'code', 'name']
};
